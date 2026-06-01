"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROLES } from "../lib/gameLogic";

export default function EliminationReveal({
  eliminatedPlayer,
  voteCounts,
  players,
  onContinue,
  isTie,
  winCondition,
}) {
  const [revealed, setRevealed] = useState(false);

  const roleLabels = {
    [ROLES.CIVILIAN]: {
      label: "Warga Biasa",
      icon: "👤",
      color: "text-emerald-400",
    },
    [ROLES.UNDERCOVER]: {
      label: "Undercover!",
      icon: "🕵️",
      color: "text-amber-400",
    },
    [ROLES.MR_WHITE]: { label: "Mr. White!", icon: "👻", color: "text-white" },
  };

  const sortedPlayers = [
    ...players.filter((p) => !p.isEliminated || p.id === eliminatedPlayer?.id),
  ].sort((a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0));

  return (
    <div className="flex flex-col min-h-screen px-5 pt-8 pb-6 bg-ink">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <p className="mb-1 text-xs tracking-widest uppercase text-mist">
          Hasil Voting
        </p>
        <h2 className="text-3xl font-black font-display text-paper">
          {isTie ? "Seri!" : "Dieliminasi!"}
        </h2>
      </motion.div>

      {/* Vote tally */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 mb-6 border bg-shadow rounded-2xl border-white/5"
      >
        <p className="mb-3 text-xs tracking-widest uppercase text-mist">
          Perolehan Suara
        </p>
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
                className={`rounded-xl p-3 ${isElim ? "bg-crimson/10 border border-crimson/30" : "bg-white/3"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${isElim ? "text-crimson" : "text-paper"}`}
                  >
                    {isElim && "⚡ "}
                    {p.name}
                    {p.isEliminated && p.id !== eliminatedPlayer?.id && (
                      <span className="ml-1 text-xs text-mist/50">
                        (sudah out)
                      </span>
                    )}
                  </span>
                  <span
                    className={`text-sm font-bold ${isElim ? "text-crimson" : "text-mist"}`}
                  >
                    {votes} suara
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${isElim ? "bg-crimson" : "bg-white/20"}`}
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
                className="w-full py-6 text-center border-2 border-dashed bg-crimson/10 border-crimson/40 rounded-2xl"
                whileTap={{ scale: 0.97 }}
              >
                <p className="mb-1 text-xl text-crimson font-display">
                  {eliminatedPlayer.name}
                </p>
                <p className="text-sm text-mist">
                  Ketuk untuk ungkap perannya!
                </p>
              </motion.button>
            ) : (
              <motion.div
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                className="w-full py-6 text-center border bg-shadow border-white/10 rounded-2xl"
              >
                <p className="mb-2 text-4xl">
                  {roleLabels[eliminatedPlayer.role]?.icon}
                </p>
                <p className="mb-1 text-2xl font-black font-display text-paper">
                  {eliminatedPlayer.name}
                </p>
                <p
                  className={`text-lg font-medium ${roleLabels[eliminatedPlayer.role]?.color}`}
                >
                  {roleLabels[eliminatedPlayer.role]?.label}
                </p>
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
          className="p-4 mb-6 text-center border bg-amber-500/10 border-amber-500/30 rounded-2xl"
        >
          <p className="font-medium text-amber-400">
            Seri! Tidak ada yang dieliminasi.
          </p>
          <p className="mt-1 text-sm text-mist">Lanjut ke ronde berikutnya.</p>
        </motion.div>
      )}

      <div className="flex-1" />

      <motion.button
        onClick={onContinue}
        className="w-full py-4 text-lg font-bold text-white bg-crimson rounded-2xl"
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {winCondition ? "Lihat Hasil Akhir" : "Lanjut Ronde Berikutnya →"}
      </motion.button>
    </div>
  );
}
