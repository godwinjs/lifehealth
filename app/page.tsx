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
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  const timeKeys: (keyof TimeLeft)[] = ["days", "hours", "minutes", "seconds"];

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center px-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 text-sm sm:text-xs lg:text-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-md shadow-md`}
      >
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center"
      >
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Logo"
          width={80}
          height={80}
          className="mb-4 sm:mb-2"
        />

        {/* Heading */}
        <h1 className="text-2xl lg:text-3xl sm:text-lg font-bold mb-4 text-blue-900 text-center">
          Our Website is coming soon.
        </h1>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 lg:grid-cols-4 sm:grid-cols-2 gap-4 sm:gap-2 mb-4">
          {timeKeys.map((key) => (
            <motion.div
              key={key}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-900 text-white'} rounded-lg shadow-lg py-6 px-10 lg:py-8 lg:px-16 sm:py-4 sm:px-6 flex flex-col items-center`}
            >
              <motion.span
                key={timeLeft[key]}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="lg:text-3xl sm:text-xl font-bold"
              >
                {timeLeft[key]}
              </motion.span>
              <span className="mt-1 capitalize text-xs">{key}</span>
            </motion.div>
          ))}
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-700 max-w-xs text-sm sm:text-xs lg:max-w-full lg:text-2xl">
          We are working to deliver the best experience for our visitors.
        </p>
      </motion.div>
    </div>
  );
}
