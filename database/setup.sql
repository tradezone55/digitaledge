-- SQL script to create tables for storing test results in Supabase
-- Run this in your Supabase SQL Editor

-- Create subscriptions table for admin panel
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    transaction_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    admin_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_results table (simplified)
CREATE TABLE IF NOT EXISTS test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    domain_id INTEGER NOT NULL CHECK (domain_id >= 1 AND domain_id <= 5),
    score INTEGER NOT NULL CHECK (score >= 0),
    duration INTEGER NOT NULL CHECK (duration >= 0), -- in seconds
    attempt_number INTEGER NOT NULL DEFAULT 1 CHECK (attempt_number >= 1),
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create domain_progress table
CREATE TABLE IF NOT EXISTS domain_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    domain_id INTEGER NOT NULL CHECK (domain_id >= 1 AND domain_id <= 5),
    is_passed BOOLEAN NOT NULL DEFAULT FALSE,
    best_score NUMERIC(5,2) NOT NULL CHECK (best_score >= 0 AND best_score <= 100),
    total_attempts INTEGER NOT NULL DEFAULT 1 CHECK (total_attempts >= 1),
    last_attempt_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, domain_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);

CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_domain_id ON test_results(domain_id);
CREATE INDEX IF NOT EXISTS idx_test_results_completed_at ON test_results(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_user_domain ON test_results(user_id, domain_id);

CREATE INDEX IF NOT EXISTS idx_domain_progress_user_id ON domain_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_domain_progress_domain_id ON domain_progress(domain_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_progress ENABLE ROW LEVEL SECURITY;

-- Subscription policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies for subscriptions (for admin dashboard)
CREATE POLICY "Admins can view all subscriptions" ON subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can update all subscriptions" ON subscriptions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy: Users can only see their own test results
CREATE POLICY "Users can view own test results" ON test_results
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own test results
CREATE POLICY "Users can insert own test results" ON test_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own domain progress
CREATE POLICY "Users can view own domain progress" ON domain_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert/update their own domain progress
CREATE POLICY "Users can insert own domain progress" ON domain_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own domain progress" ON domain_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (optional - for admin dashboard)
-- Note: You'll need to implement proper admin role checking
-- This is a simplified example - adjust based on your auth setup

-- Policy: Admins can view all test results (uncomment and modify as needed)
-- CREATE POLICY "Admins can view all test results" ON test_results
--     FOR SELECT USING (
--         EXISTS (
--             SELECT 1 FROM auth.users 
--             WHERE id = auth.uid() 
--             AND raw_user_meta_data->>'role' = 'admin'
--         )
--     );

-- Policy: Admins can view all domain progress (uncomment and modify as needed)
-- CREATE POLICY "Admins can view all domain progress" ON domain_progress
--     FOR SELECT USING (
--         EXISTS (
--             SELECT 1 FROM auth.users 
--             WHERE id = auth.uid() 
--             AND raw_user_meta_data->>'role' = 'admin'
--         )
--     );

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for domain_progress table
CREATE TRIGGER update_domain_progress_updated_at 
    BEFORE UPDATE ON domain_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for subscriptions table
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for easier querying of test results with user information
CREATE OR REPLACE VIEW test_results_with_users AS
SELECT 
    tr.*,
    u.email as user_email,
    u.raw_user_meta_data->>'name' as user_name
FROM test_results tr
LEFT JOIN auth.users u ON tr.user_id = u.id;

-- Optional: Create a view for domain statistics
CREATE OR REPLACE VIEW domain_statistics AS
SELECT 
    domain_id,
    COUNT(*) as total_attempts,
    COUNT(CASE WHEN passed THEN 1 END) as passed_attempts,
    ROUND(AVG(score::NUMERIC / total_questions::NUMERIC * 100), 2) as average_score,
    ROUND(AVG(duration::NUMERIC / 60), 2) as average_duration_minutes
FROM test_results 
GROUP BY domain_id
ORDER BY domain_id;

-- Optional: Create a view for subscription statistics
CREATE OR REPLACE VIEW subscription_statistics AS
SELECT 
    plan,
    status,
    COUNT(*) as total_subscriptions,
    SUM(amount) as total_revenue,
    AVG(amount) as average_amount,
    MIN(created_at) as first_subscription,
    MAX(created_at) as latest_subscription
FROM subscriptions 
GROUP BY plan, status
ORDER BY plan, status;

-- Grant necessary permissions (adjust based on your setup)
-- GRANT SELECT, INSERT, UPDATE ON subscriptions TO authenticated;
-- GRANT SELECT, INSERT, UPDATE ON test_results TO authenticated;
-- GRANT SELECT, INSERT, UPDATE ON domain_progress TO authenticated;
-- GRANT SELECT ON test_results_with_users TO authenticated;
-- GRANT SELECT ON domain_statistics TO authenticated;
-- GRANT SELECT ON subscription_statistics TO authenticated;
