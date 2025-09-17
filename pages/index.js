import { useState } from 'react';
import { authenticator } from 'otplib';
import axios from 'axios';

export default function Home() {
  const [fbLink, setFbLink] = useState('');
  const [profileId, setProfileId] = useState(null);
  const [key, setKey] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const extractProfileId = async () => {
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/extract?url=${encodeURIComponent(fbLink)}`);
      setProfileId(res.data.id);
    } catch (err) {
      setProfileId(null);
      setError('Failed to extract profile ID. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateOtp = () => {
    try {
      const token = authenticator.generate(key);
      setOtp(token);
    } catch {
      setOtp('Invalid key');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Profile Tools
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Extract Facebook profile IDs and generate OTP codes from your 2FA keys
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Facebook Profile ID Extractor */}
          <div className="card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Profile ID Extractor</h2>
                <p className="text-slate-600 text-sm">Extract Facebook profile IDs from share links</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Facebook Share Link
                </label>
                <input
                  type="url"
                  placeholder="https://www.facebook.com/sharer/sharer.php?u=..."
                  className="input-field"
                  value={fbLink}
                  onChange={(e) => setFbLink(e.target.value)}
                />
              </div>

              <button
                onClick={extractProfileId}
                disabled={!fbLink || isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Extracting...
                  </div>
                ) : (
                  'Extract Profile ID'
                )}
              </button>

              {profileId && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Profile ID Found!</p>
                      <p className="text-lg font-mono text-green-900 mt-1">{profileId}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(profileId)}
                      className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* OTP Generator */}
          <div className="card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">OTP Generator</h2>
                <p className="text-slate-600 text-sm">Generate OTP codes from your 2FA secret key</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  2FA Secret Key
                </label>
                <input
                  type="text"
                  placeholder="Enter your 2FA secret key"
                  className="input-field"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
              </div>

              <button
                onClick={generateOtp}
                disabled={!key}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate OTP Code
              </button>

              {otp && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700 mb-2">Your OTP Code</p>
                    <div className="bg-white/80 rounded-xl p-4 mb-4">
                      <p className="text-3xl font-mono font-bold text-slate-900 tracking-wider">
                        {otp}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(otp)}
                      className="btn-secondary"
                    >
                      {copied ? 'Copied to Clipboard!' : 'Copy OTP Code'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-slate-500 text-sm">
            Built with Next.js • Secure and private
          </p>
        </div>
      </div>
    </div>
  );
}