'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Invalid passcode. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white p-8 rounded-lg shadow-xl border border-[#D4AF37]/20 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/10 -mr-8 -mt-8 rotate-45" />

          <div className="relative z-10">
            <h1 className="font-playfair text-3xl text-[#1A2B48] mb-2 text-center">Admin Archive</h1>
            <p className="text-[#333333]/60 text-center mb-8 font-serif italic">Unlock the memories</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="passcode" className="block text-sm font-medium text-[#1A2B48] mb-2">
                  Access Passcode
                </label>
                <input
                  type="password"
                  id="passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDFCF8] border border-[#1A2B48]/10 rounded focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-[#1A2B48]"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm italic">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A2B48] text-[#FDFCF8] py-3 rounded font-medium hover:bg-[#1A2B48]/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Enter Dashboard'}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-8 text-center text-[#333333]/40 text-sm font-serif">
          &copy; {new Date().getFullYear()} College Memory Archive
        </p>
      </motion.div>
    </div>
  );
}
