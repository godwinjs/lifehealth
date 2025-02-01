'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const calculateTimeLeft = (): TimeLeft => {
    const targetDate = new Date("2025-02-02T00:00:00");
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft()); // Ensures initial render is on the client only

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null; // Prevents server-side mismatches

  const timeKeys: (keyof TimeLeft)[] = ["days", "hours", "minutes", "seconds"];

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center px-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-md shadow-md`}
      >
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center"
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mb-6"
        />
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Our Website is coming soon.</h1>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {timeKeys.map((key) => (
            <motion.div
              key={key}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-900 text-white'} rounded-lg shadow-lg py-8 px-16 flex flex-col items-center`}
            >
              <motion.span
                key={timeLeft[key]}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-4xl font-bold"
              >
                {timeLeft[key]}
              </motion.span>
              <span className="mt-2 capitalize text-sm">{key}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-gray-700 max-w-md">
          We are working to deliver the best experience for our visitors.
        </p>
      </motion.div>
    </div>
  );
}
