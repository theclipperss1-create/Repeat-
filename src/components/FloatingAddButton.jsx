'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export function FloatingAddButton({ onClick }) {
  return (
    <motion.button
      className="fixed bottom-6 right-4 sm:bottom-10 sm:right-8 z-[9000] flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-ink text-canvas rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.2)]"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.6 }}
    >
      <Plus size={28} strokeWidth={2.5} />
    </motion.button>
  );
}
