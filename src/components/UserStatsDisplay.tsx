import React from "react";
import {
  BarChart3,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import {
  useLocalUserStats,
  useLocalUserTestResults,
  useLocalUserDomainProgress,
} from "../hooks/useLocalTestResults";
import { useUserStore } from "../stores";

interface UserStatsDisplayProps {
  className?: string;
}

const UserStatsDisplay: React.FC<UserStatsDisplayProps> = ({
  className = "",
}) => {
  const user = useUserStore((state) => state.user);

  // React Query hooks with automatic caching and refetching
  const {
    data: userStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useLocalUserStats(user?.user_id || "", !!user?.user_id);

  const {
    data: testResults,
    isLoading: resultsLoading,
    error: resultsError,
    refetch: refetchResults,
  } = useLocalUserTestResults(user?.user_id || "", !!user?.user_id);

  const {
    data: domainProgress,
    isLoading: progressLoading,
    error: progressError,
    refetch: refetchProgress,
  } = useLocalUserDomainProgress(user?.user_id || "", !!user?.user_id);

  if (!user) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="text-center text-gray-400">
          <BarChart3 className="w-12 h-12 mx-auto mb-4" />
          <p>Please log in to view your statistics</p>
        </div>
      </div>
    );
  }

  const isLoading = statsLoading || resultsLoading || progressLoading;
  const hasError = statsError || resultsError || progressError;

  const handleRefreshAll = () => {
    refetchStats();
    refetchResults();
    refetchProgress();
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="mt-6 h-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="text-center text-red-400">
          <p className="mb-4">Failed to load statistics</p>
          <button
            onClick={handleRefreshAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const recentTests = testResults?.slice(0, 5) || [];
  const completedDomains =
    domainProgress?.filter((progress) => progress.is_passed) || [];

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Your Statistics
        </h2>
        <button
          onClick={handleRefreshAll}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {userStats?.totalTests || 0}
          </div>
          <div className="text-sm text-gray-400">Total Tests</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {userStats?.totalPassed || 0}
          </div>
          <div className="text-sm text-gray-400">Tests Passed</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {userStats?.averageScore || 0}%
          </div>
          <div className="text-sm text-gray-400">Average Score</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {completedDomains.length}/5
          </div>
          <div className="text-sm text-gray-400">Domains</div>
        </div>
      </div>

      {/* Recent Test Results */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Test Results
        </h3>

        {recentTests.length > 0 ? (
          <div className="space-y-2">
            {recentTests.map((test, index) => (
              <div
                key={test.id || index}
                className="bg-gray-700 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-white font-medium">
                    Domain {test.domain_id}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(test.completed_at).toLocaleDateString()} •
                    {Math.round((test.duration || 0) / 60)} min
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-white font-bold">
                    {test.score}/{test.total_questions}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${test.passed
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                      }`}
                  >
                    {test.passed ? "PASS" : "FAIL"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-4">
            No test results yet. Take your first test to see your progress!
          </div>
        )}
      </div>

      {/* Domain Progress */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Domain Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5].map((domainId) => {
            const progress = domainProgress?.find(
              (p) => p.domain_id === domainId
            );
            const domainNames: { [key: number]: string } = {
              1: "Networking Fundamentals",
              2: "Network Implementations",
              3: "Network Operations",
              4: "Network Security",
              5: "Network Troubleshooting",
            };

            return (
              <div
                key={domainId}
                className={`p-3 rounded-lg border-2 ${progress?.is_passed
                  ? "border-green-500 bg-green-900/20"
                  : "border-gray-600 bg-gray-700"
                  }`}
              >
                <div className="text-white font-medium text-sm">
                  Domain {domainId}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  {domainNames[domainId]}
                </div>
                {progress ? (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white">
                      Best: {progress.best_score}%
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${progress.is_passed
                        ? "bg-green-600 text-white"
                        : "bg-gray-600 text-white"
                        }`}
                    >
                      {progress.is_passed ? "COMPLETED" : "IN PROGRESS"}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">Not started</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserStatsDisplay;
