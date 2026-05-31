'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLES } from '../lib/gameLogic';

export default function EliminationReveal({ eliminatedPlayer, voteCounts, players, onContinue, isTie, winCondition }) {
  const [revealed, setRevealed] = useState(false);

  const roleLabels = {
    [ROLES.CIVILIAN]: { label: 'Warga Biasa', icon: '👤', color: 'text-emerald-400' },
    [ROLES.UNDERCOVER]: { label: 'Undercover!', icon: '🕵️', color: 'text-amber-400' },
    [ROLES.MR_WHITE]: { label: 'Mr. White!', icon: '👻', color: 'text-white' },
  };

  const sortedPlayers = [...players.filter(p => !p.isEliminated || p.id === eliminatedPlayer?.id)]
    .sort((a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0));

  return (
    <div className="min-h-screen bg-ink flex flex-col px-5 pt-8 pb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="text-mist text-xs tracking-widest uppercase mb-1">Hasil Voting</p>
        <h2 className="font-display text-3xl font-black text-paper">
          {isTie ? 'Seri!' : 'Dieliminasi!'}
        </h2>
      </motion.div>

      {/* Vote tally */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-shadow rounded-2xl p-4 border border-white/5 mb-6"
      >
        <p className="text-mist text-xs tracking-widest uppercase mb-3">Perolehan Suara</p>
        <div className="space-y-2">
          {sortedPlayers.map((p, i) => {
            const votes = voteCounts[p.id] || 0;
            const maxVotes = Math.max(...Object.values(voteCounts));
            const pct = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
            const isElim = eliminatedPlayer?.id === p.id;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`rounded-xl p-3 ${isElim ? 'bg-crimson/10 border border-crimson/30' : 'bg-white/3'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-medium ${isElim ? 'text-crimson' : 'text-paper'}`}>
                    {isElim && '⚡ '}{p.name}
                    {p.isEliminated && p.id !== eliminatedPlayer?.id && <span className="text-mist/50 text-xs ml-1">(sudah out)</span>}
                  </span>
                  <span className={`text-sm font-bold ${isElim ? 'text-crimson' : 'text-mist'}`}>
                    {votes} suara
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${isElim ? 'bg-crimson' : 'bg-white/20'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3 + 0.05 * i, duration: 0.5 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Elimination reveal */}
      <AnimatePresence>
        {!isTie && eliminatedPlayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            {!revealed ? (
              <motion.button
                onClick={() => setRevealed(true)}
                className="w-full py-6 bg-crimson/10 border-2 border-dashed border-crimson/40 rounded-2xl text-center"
                whileTap={{ scale: 0.97 }}
              >
                <p className="text-crimson font-display text-xl mb-1">{eliminatedPlayer.name}</p>
                <p className="text-mist text-sm">Ketuk untuk ungkap perannya!</p>
              </motion.button>
            ) : (
              <motion.div
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                className="w-full py-6 bg-shadow border border-white/10 rounded-2xl text-center"
              >
                <p className="text-4xl mb-2">{roleLabels[eliminatedPlayer.role]?.icon}</p>
                <p className="font-display text-2xl font-black text-paper mb-1">
                  {eliminatedPlayer.name}
                </p>
                <p className={`text-lg font-medium ${roleLabels[eliminatedPlayer.role]?.color}`}>
                  {roleLabels[eliminatedPlayer.role]?.label}
                </p>
                {eliminatedPlayer.word && (
                  <p className="text-mist text-sm mt-2">Kata: <span className="text-paper font-medium">{eliminatedPlayer.word}</span></p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isTie && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 text-center"
        >
          <p className="text-amber-400 font-medium">Seri! Tidak ada yang dieliminasi.</p>
          <p className="text-mist text-sm mt-1">Lanjut ke ronde berikutnya.</p>
        </motion.div>
      )}

      <div className="flex-1" />

      <motion.button
        onClick={onContinue}
        className="w-full py-4 bg-crimson rounded-2xl text-white font-bold text-lg"
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
      >
        {winCondition ? 'Lihat Hasil Akhir' : 'Lanjut Ronde Berikutnya →'}
      </motion.button>
    </div>
  );
}
