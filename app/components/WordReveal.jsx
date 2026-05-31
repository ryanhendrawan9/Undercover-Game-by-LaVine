'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLES } from '../lib/gameLogic';

export default function WordReveal({ game, onAllRevealed }) {
  const [revealed, setRevealed] = useState(false);
  const [ready, setReady] = useState(false);

  const currentPlayer = game.players[game.currentRevealIndex];
  const isLast = game.currentRevealIndex === game.players.length - 1;

  const handleReveal = () => setRevealed(true);

  const handleNext = () => {
    setRevealed(false);
    setReady(false);
    onAllRevealed(isLast);
  };

  const roleInfo = {
    [ROLES.CIVILIAN]: {
      label: 'Warga',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/30',
      icon: '👤',
      hint: 'Deskripsi katamu tanpa menyebutnya langsung!',
    },
    [ROLES.UNDERCOVER]: {
      label: 'Undercover',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/30',
      icon: '🕵️',
      hint: 'Hati-hati! Kamu dapat kata berbeda. Jangan ketahuan!',
    },
    [ROLES.MR_WHITE]: {
      label: 'Mr. White',
      color: 'text-white',
      bg: 'bg-white/10 border-white/30',
      icon: '👻',
      hint: 'Kamu tidak punya kata. Curi informasi dari diskusi!',
    },
  };

  const info = roleInfo[currentPlayer.role];

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center w-full max-w-sm"
          >
            {/* Turn indicator */}
            <div className="mb-2">
              <span className="text-mist text-xs tracking-widest uppercase">
                Giliran {game.currentRevealIndex + 1} dari {game.players.length}
              </span>
            </div>

            <h2 className="font-display text-3xl font-black text-paper mb-8">
              {currentPlayer.name}
            </h2>

            {/* Tap to reveal card */}
            <motion.button
              onClick={handleReveal}
              className="w-full aspect-[3/2] rounded-3xl bg-gradient-to-br from-crimson/30 via-shadow to-shadow border border-crimson/20 flex flex-col items-center justify-center gap-4 relative overflow-hidden"
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-5xl"
              >
                🔒
              </motion.div>
              <p className="text-mist text-sm">Ketuk untuk lihat kartumu</p>
              <p className="text-white/20 text-xs">Pastikan hanya kamu yang melihat!</p>

              {/* Decorative lines */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />
            </motion.button>

            <p className="text-white/20 text-xs mt-6">Jangan perlihatkan ke pemain lain</p>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center w-full max-w-sm"
          >
            {/* Role badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${info.bg} mb-6`}
            >
              <span>{info.icon}</span>
              <span className={`text-sm font-medium ${info.color}`}>{info.label}</span>
            </motion.div>

            {/* Word card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-full aspect-[3/2] rounded-3xl bg-shadow border border-white/10 flex flex-col items-center justify-center mb-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent" />

              {currentPlayer.role === ROLES.MR_WHITE ? (
                <div className="text-center px-6">
                  <p className="text-6xl mb-3">🤫</p>
                  <p className="text-paper font-display text-xl">Kamu Mr. White!</p>
                  <p className="text-mist text-xs mt-2">Kamu tidak punya kata rahasia</p>
                </div>
              ) : (
                <div className="text-center px-6">
                  <p className="text-mist text-xs tracking-widest uppercase mb-2">Kata Rahasiamu</p>
                  <p className="font-display text-4xl font-black text-paper">{currentPlayer.word}</p>
                </div>
              )}
            </motion.div>

            {/* Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-shadow rounded-2xl p-4 mb-8 border border-white/5"
            >
              <p className="text-mist text-sm leading-relaxed">💡 {info.hint}</p>
            </motion.div>

            <motion.button
              onClick={handleNext}
              className="w-full py-4 bg-crimson rounded-2xl text-white font-bold text-lg"
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            >
              {isLast ? 'Mulai Diskusi →' : 'Selesai, Ganti Pemain →'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
