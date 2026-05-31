'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DiscussionPhase({ game, onVote }) {
  const [timeLeft, setTimeLeft] = useState(game.roundTime);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    if (!timerActive || timerDone) return;
    if (timeLeft <= 0) { setTimerDone(true); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft, timerDone]);

  const alivePlayers = game.players.filter(p => !p.isEliminated);
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const progress = timeLeft / game.roundTime;
  const timerColor = timeLeft > 30 ? '#10b981' : timeLeft > 10 ? '#f59e0b' : '#C41E3A';

  const circumference = 2 * Math.PI * 45;

  return (
    <div className="min-h-screen bg-ink flex flex-col px-5 pt-8 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="text-mist text-xs tracking-widest uppercase mb-1">Ronde {game.round}</p>
        <h2 className="font-display text-3xl font-black text-paper">Diskusi</h2>
        <p className="text-mist text-sm mt-1">Deskripsikan katamu. Temukan penyusup!</p>
      </motion.div>

      {/* Timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1A1A2E" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="45" fill="none"
              stroke={timerColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {timerDone ? (
                <motion.span key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">⏰</motion.span>
              ) : (
                <motion.span
                  key={timeLeft}
                  className="font-display text-2xl font-bold"
                  style={{ color: timerColor }}
                >
                  {formatTime(timeLeft)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          {!timerActive && !timerDone && (
            <motion.button
              onClick={() => setTimerActive(true)}
              className="px-6 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-400 text-sm"
              whileTap={{ scale: 0.95 }}
            >
              ▶ Mulai Timer
            </motion.button>
          )}
          {timerActive && !timerDone && (
            <motion.button
              onClick={() => setTimerActive(false)}
              className="px-6 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-400 text-sm"
              whileTap={{ scale: 0.95 }}
            >
              ⏸ Pause
            </motion.button>
          )}
          {(timerActive || timerDone) && (
            <motion.button
              onClick={() => { setTimeLeft(game.roundTime); setTimerActive(false); setTimerDone(false); }}
              className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-mist text-sm"
              whileTap={{ scale: 0.95 }}
            >
              ↺ Reset
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {timerDone && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-crimson text-sm mt-2 font-medium"
            >
              Waktu habis! Saatnya voting.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Player list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-shadow rounded-2xl p-4 border border-white/5 mb-6"
      >
        <p className="text-mist text-xs tracking-widest uppercase mb-3">Pemain Aktif</p>
        <div className="grid grid-cols-2 gap-2">
          {alivePlayers.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center gap-2 bg-white/3 rounded-xl px-3 py-2"
            >
              <div className="w-6 h-6 rounded-full bg-crimson/20 flex items-center justify-center">
                <span className="text-crimson text-xs font-bold">{player.name[0].toUpperCase()}</span>
              </div>
              <span className="text-paper text-sm truncate">{player.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-crimson/5 border border-crimson/20 rounded-2xl p-4 mb-6"
      >
        <p className="text-mist text-xs">💬 <span className="text-paper/70">Setiap pemain harus berikan 1 petunjuk tentang kata mereka. Lalu diskusikan siapa yang mencurigakan!</span></p>
      </motion.div>

      {/* Vote button */}
      <motion.button
        onClick={onVote}
        className="w-full py-4 bg-crimson rounded-2xl text-white font-bold text-lg"
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
      >
        Lanjut ke Voting →
      </motion.button>
    </div>
  );
}
