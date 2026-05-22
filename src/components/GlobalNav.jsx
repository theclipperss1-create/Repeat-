'use client';

import { motion } from 'framer-motion';
import { Repeat, Settings, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function GlobalNav({ onProfileClick }) {
  const pathname = usePathname();
  const isSettings = pathname === '/settings';

  return (
    <div className="fixed top-5 left-0 right-0 z-[9000] flex justify-center px-4 pointer-events-none">
      <motion.nav 
        initial={{ y: -60, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 28, delay: 0.1 }}
        className="liquid-glass h-[52px] rounded-full px-2 flex items-center justify-between pointer-events-auto min-w-[320px] sm:min-w-[420px] transition-all duration-500 group"
      >
        {isSettings ? (
          <Link
            href="/"
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink hover:bg-black/8 dark:hover:bg-white/12 transition-all duration-200 active:scale-90"
          >
            <ArrowLeft size={17} strokeWidth={2.5} />
          </Link>
        ) : (
          <motion.div whileTap={{ scale: 0.88 }}>
            <Link
              href="/settings"
              className="w-9 h-9 rounded-full flex items-center justify-center text-ink hover:bg-black/8 dark:hover:bg-white/12 transition-all duration-200"
            >
              <Settings size={17} strokeWidth={2} />
            </Link>
          </motion.div>
        )}

        <div className="flex items-center gap-2">
          <motion.div
            className="w-[26px] h-[26px] bg-ink rounded-lg flex items-center justify-center shadow-sm"
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Repeat size={12} strokeWidth={3} className="text-canvas" />
          </motion.div>
          <span className="font-display font-bold text-[17px] tracking-tight text-ink select-none">
            Repeat
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onProfileClick}
          className="w-9 h-9 rounded-full flex items-center justify-center text-ink hover:bg-black/8 dark:hover:bg-white/12 transition-all duration-200"
        >
          <User size={17} strokeWidth={2} />
        </motion.button>
      </motion.nav>
    </div>
  );
}
