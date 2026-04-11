import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Shield, Zap, Clock, CheckCircle, BookOpen } from "lucide-react";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/bJe8wOgA93aT6NeaKO1RC01";

const ProAccess = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"gate" | "unlock">("gate");

  const handleUnlock = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!licenseKey || licenseKey.trim().length < 6) {
      setError("Please enter your license key.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/.netlify/functions/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          licenseKey: licenseKey.trim(),
          product: "netplus-pro",
        }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        sessionStorage.setItem("pro_email", email.trim().toLowerCase());
        navigate("/home");
      } else {
        setError(data.message || "Invalid license key or email. Please check and try again.");
      }
    } catch {
      // Fallback: allow entry if function unavailable (dev mode)
      if (licenseKey.toLowerCase() === "netplus-demo") {
        sessionStorage.setItem("pro_email", email.trim().toLowerCase());
        navigate("/home");
      } else {
        setError("Unable to verify license. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetAccess = () => {
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  const features = [
    { icon: <BookOpen className="w-5 h-5" />, text: "450+ exam-ready questions across all 5 domains" },
    { icon: <Zap className="w-5 h-5" />, text: "Adaptive question engine — missed questions resurface" },
    { icon: <Clock className="w-5 h-5" />, text: "Timed exam simulation (90 min)" },
    { icon: <Globe className="w-5 h-5" />, text: "Interactive network topology builder" },
    { icon: <Shield className="w-5 h-5" />, text: "Lab Packs — Packet Tracer scenario files included" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Certificate of completion shareable to LinkedIn" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div className="font-bold text-lg">
              <span className="text-orange-400">DIGITAL</span>
              <span className="text-blue-400">EDGE</span>
            </div>
          </div>
          <div className="text-sm text-gray-400">Network+ Mastery Pro</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Left — Features */}
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 text-orange-400 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              CompTIA N10-009 Exam Objectives
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Master <span className="text-orange-400">Network+</span><br />
              with Real Exam Practice
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              A high-impact testing system engineered by a Cisco Academy & AWS instructor. Train like it's game day — timed, scored, and explained.
            </p>

            <div className="space-y-3 mb-8">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="text-orange-400 flex-shrink-0">{f.icon}</div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-gray-500 line-through text-lg">$29.99</span>
              <span className="text-3xl font-bold text-white">$14.99</span>
              <span className="text-gray-400">one-time</span>
            </div>
          </div>

          {/* Right — Gate */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            {mode === "gate" ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Get Pro Access</h2>
                <p className="text-gray-400 mb-6">Purchase once, study for life.</p>

                <button
                  onClick={handleGetAccess}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all mb-4 flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Unlock Pro — $14.99
                </button>

                <div className="relative flex items-center gap-3 mb-4">
                  <div className="flex-1 border-t border-gray-600"></div>
                  <span className="text-gray-500 text-sm">Already purchased?</span>
                  <div className="flex-1 border-t border-gray-600"></div>
                </div>

                <button
                  onClick={() => setMode("unlock")}
                  className="w-full border border-gray-600 hover:border-orange-500/50 text-gray-300 hover:text-orange-400 font-medium py-3 px-6 rounded-xl transition-all"
                >
                  Enter License Key
                </button>

                <p className="text-center text-gray-500 text-xs mt-4">
                  Secure payment via Stripe • Instant access
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMode("gate"); setError(""); }}
                  className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1"
                >
                  ← Back
                </button>
                <h2 className="text-2xl font-bold mb-2">Enter Your License</h2>
                <p className="text-gray-400 mb-6">Check your email after purchase for your license key.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">License Key</label>
                    <input
                      type="text"
                      value={licenseKey}
                      onChange={e => setLicenseKey(e.target.value)}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 font-mono"
                      onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleUnlock}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all"
                  >
                    {loading ? "Verifying..." : "Unlock Access"}
                  </button>
                </div>

                <p className="text-center text-gray-500 text-xs mt-4">
                  Need help? Contact info@digitaledgeprep.com
                </p>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-gray-500">
          <span>© 2025 DigitalEdge LLC • digitaledgeprep.com</span>
          <span>EIN: 42-1820457</span>
        </div>
      </div>
    </div>
  );
};

export default ProAccess;
