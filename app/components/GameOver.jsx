"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROLES } from "../lib/gameLogic";

export default function GameOver({
  game,
  winCondition,
  leaderboard,
  onPlayAgain,
  onNewGame,
}) {
  const [showDetails, setShowDetails] = useState(false);

  const isCivilianWin = winCondition?.winner === "civilians";
  const isMrWhiteWin = winCondition?.winner === "mrwhite";

  const emojiMap = {
    civilians: "🎉",
    undercover: "🕵️",
    mrwhite: "👻",
  };

  const titleMap = {
    civilians: "Warga Menang!",
    undercover: "Penyusup Menang!",
    mrwhite: "Mr. White Menang!",
  };

  const roleLabel = {
    [ROLES.CIVILIAN]: {
      label: "Warga",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    [ROLES.UNDERCOVER]: {
      label: "Undercover",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    [ROLES.MR_WHITE]: {
      label: "Mr. White",
      color: "text-white",
      bg: "bg-white/10",
    },
  };

  return (
    <div className="flex flex-col min-h-screen px-5 pt-8 pb-6 overflow-y-auto bg-ink">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mb-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-4 text-7xl"
        >
          {emojiMap[winCondition?.winner] || "🎮"}
        </motion.div>
        <h2 className="mb-2 text-4xl font-black font-display text-paper">
          {titleMap[winCondition?.winner] || "Game Over"}
        </h2>
        <p className="text-sm text-mist">{winCondition?.reason}</p>
      </motion.div>

      {/* Word reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-5 mb-5 border bg-shadow rounded-2xl border-white/5"
      >
        <p className="mb-3 text-xs tracking-widest uppercase text-mist">
          Kata-kata Rahasia
        </p>
        <div className="flex gap-3">
          <div className="flex-1 p-3 text-center border bg-emerald-400/5 border-emerald-400/20 rounded-xl">
            <p className="mb-1 text-xs text-emerald-400/60">Warga</p>
            <p className="text-lg font-bold font-display text-emerald-400">
              {game.wordPair.civilian}
            </p>
          </div>
          <div className="flex-1 p-3 text-center border bg-amber-400/5 border-amber-400/20 rounded-xl">
            <p className="mb-1 text-xs text-amber-400/60">Undercover</p>
            <p className="text-lg font-bold font-display text-amber-400">
              {game.wordPair.undercover}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Players reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-5 mb-5 border bg-shadow rounded-2xl border-white/5"
      >
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full"
        >
          <p className="text-xs tracking-widest uppercase text-mist">
            Semua Pemain
          </p>
          <motion.span
            animate={{ rotate: showDetails ? 180 : 0 }}
            className="text-xs text-mist"
          >
            ▼
          </motion.span>
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              {game.players.map((p, i) => {
                const ri = roleLabel[p.role];
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5">
                      <span className="text-xs font-bold text-mist">
                        {p.name[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="flex-1 text-sm text-paper">{p.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${ri.bg} ${ri.color}`}
                    >
                      {ri.label}
                    </span>
                    {p.word && (
                      <span className="text-xs text-mist/60">{p.word}</span>
                    )}
                    {p.isEliminated && (
                      <span className="text-xs text-crimson/60">out</span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Leaderboard */}
      {leaderboard && leaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 mb-5 border bg-shadow rounded-2xl border-white/5"
        >
          <p className="mb-3 text-xs tracking-widest uppercase text-mist">
            🏆 Leaderboard
          </p>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-3">
                <span
                  className={`text-lg ${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "  "}`}
                >
                  {i === 0
                    ? "🥇"
                    : i === 1
                      ? "🥈"
                      : i === 2
                        ? "🥉"
                        : `#${i + 1}`}
                </span>
                <span className="flex-1 text-sm text-paper">{entry.name}</span>
                <span className="text-sm font-bold text-gold">
                  {entry.wins}W
                </span>
                <span className="text-xs text-mist">{entry.games}G</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          onClick={onPlayAgain}
          className="flex-1 py-4 text-base font-bold text-white bg-crimson rounded-2xl"
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Main Lagi
        </motion.button>
        <motion.button
          onClick={onNewGame}
          className="flex-1 py-4 text-base font-bold border bg-shadow border-white/10 rounded-2xl text-mist"
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          Menu Utama
        </motion.button>
      </div>
    </div>
  );
}
