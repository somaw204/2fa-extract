import { useState } from 'react';
import { authenticator } from 'otplib';
import axios from 'axios';

export default function Home() {
  const [fbLink, setFbLink] = useState('');
  const [profileId, setProfileId] = useState(null);
  const [key, setKey] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const extractProfileId = async () => {
    setError('');
    try {
      const res = await axios.get(`/api/extract?url=${encodeURIComponent(fbLink)}`);
      setProfileId(res.data.id);
    } catch (err) {
      setProfileId(null);
      setError('Failed to extract profile ID.');
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 gap-10">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-lg font-semibold mb-4">🔍 Facebook Profile ID Extractor</h1>
        <input
          type="text"
          placeholder="Paste Facebook share link"
          className="w-full p-3 border rounded-md text-sm"
          value={fbLink}
          onChange={(e) => setFbLink(e.target.value)}
        />
        <button
          onClick={extractProfileId}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-blue-700"
        >
          Extract Profile ID
        </button>
        {profileId && (
          <p className="mt-3 text-center text-sm">Profile ID: <b>{profileId}</b></p>
        )}
        {error && <p className="mt-3 text-red-500 text-sm text-center">{error}</p>}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-lg font-semibold mb-4">🔐 OTP from 2FA Key</h1>
        <input
          type="text"
          placeholder="Enter your 2FA key"
          className="w-full p-3 border rounded-md text-sm"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button
          onClick={generateOtp}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-blue-700"
        >
          Get OTP Code
        </button>
        {otp && (
          <div className="mt-4 text-center text-lg font-mono text-gray-800">
            OTP: <span className="font-bold">{otp}</span>
          </div>
        )}
      </div>
    </div>
  );
}