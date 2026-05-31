"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wordPairs } from "../lib/wordBank";

export default function SetupScreen({ onStart }) {
  const [playerNames, setPlayerNames] = useState(["", "", "", ""]);
  const [numUndercover, setNumUndercover] = useState(1);
  const [numMrWhite, setNumMrWhite] = useState(0);
  const [roundTime, setRoundTime] = useState(60);
  const [useCustomWords, setUseCustomWords] = useState(false);
  const [customCivilian, setCustomCivilian] = useState("");
  const [customUndercover, setCustomUndercover] = useState("");
  const [error, setError] = useState("");

  const totalPlayers = playerNames.filter((n) => n.trim()).length;

  const addPlayer = () => {
    if (playerNames.length < 12) setPlayerNames([...playerNames, ""]);
  };

  const removePlayer = (i) => {
    if (playerNames.length > 3) {
      const updated = playerNames.filter((_, idx) => idx !== i);
      setPlayerNames(updated);
    }
  };

  const updateName = (i, val) => {
    const updated = [...playerNames];
    updated[i] = val;
    setPlayerNames(updated);
  };

  const handleStart = () => {
    const validNames = playerNames.filter((n) => n.trim());
    if (validNames.length < 3) {
      setError("Minimal 3 pemain!");
      return;
    }
    if (numUndercover + numMrWhite >= validNames.length) {
      setError("Terlalu banyak penyusup!");
      return;
    }
    if (numUndercover + numMrWhite === 0) {
      setError("Minimal 1 Undercover atau Mr. White!");
      return;
    }
    if (
      useCustomWords &&
      (!customCivilian.trim() || !customUndercover.trim())
    ) {
      setError("Isi kedua kata custom!");
      return;
    }
    const hasDuplicate =
      new Set(validNames.map((n) => n.trim().toLowerCase())).size <
      validNames.length;
    if (hasDuplicate) {
      setError("Nama pemain tidak boleh sama!");
      return;
    }
    setError("");
    onStart({
      playerNames: validNames.map((n) => n.trim()),
      numUndercover,
      numMrWhite,
      roundTime,
      customWords: useCustomWords
        ? {
            civilian: customCivilian.trim(),
            undercover: customUndercover.trim(),
          }
        : null,
    });
  };

  const maxNonCivilian = Math.max(0, totalPlayers - 1);

  return (
    <div className="flex flex-col min-h-screen bg-ink">
      {/* Header */}
      <motion.div
        className="relative px-6 pt-12 pb-8 overflow-hidden text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-crimson/20 to-transparent" />
        <h1 className="text-5xl font-black leading-none font-display text-paper">
          UNDER<span className="text-crimson">COVER</span>
        </h1>
        <p className="mt-2 text-sm font-light text-mist">by LaVine</p>
      </motion.div>

      <div className="flex-1 px-5 pb-8 space-y-6 overflow-y-auto">
        {/* Players */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display text-paper">Pemain</h2>
            <span className="text-xs text-mist">{totalPlayers} / 12</span>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {playerNames.map((name, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 border rounded-full bg-shadow border-crimson/30">
                    <span className="text-xs font-bold text-crimson">
                      {i + 1}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateName(i, e.target.value)}
                    placeholder={`Pemain ${i + 1}`}
                    maxLength={15}
                    className="flex-1 px-4 py-3 text-sm transition-colors border bg-shadow border-white/10 rounded-xl text-paper placeholder-white/20 focus:outline-none focus:border-crimson/60"
                  />
                  {playerNames.length > 3 && (
                    <button
                      onClick={() => removePlayer(i)}
                      className="flex items-center justify-center w-8 h-8 transition-colors border rounded-full bg-crimson/10 border-crimson/20 text-crimson hover:bg-crimson/20"
                    >
                      ×
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {playerNames.length < 12 && (
            <button
              onClick={addPlayer}
              className="w-full py-3 mt-3 text-sm transition-colors border border-dashed border-white/20 rounded-xl text-mist hover:border-crimson/40 hover:text-crimson"
            >
              + Tambah Pemain
            </button>
          )}
        </motion.section>

        {/* Role Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 border bg-shadow rounded-2xl border-white/5"
        >
          <h2 className="mb-4 text-lg font-display text-paper">
            Peran Penyusup
          </h2>

          {/* Undercover count */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-paper">🕵️ Undercover</p>
                <p className="text-xs text-mist">
                  Dapat kata mirip, harus menyamar
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setNumUndercover(Math.max(0, numUndercover - 1))
                  }
                  className="flex items-center justify-center w-8 h-8 transition-colors rounded-full bg-white/10 text-paper hover:bg-crimson/30"
                >
                  −
                </button>
                <span className="w-4 font-bold text-center text-crimson">
                  {numUndercover}
                </span>
                <button
                  onClick={() =>
                    setNumUndercover(
                      Math.min(maxNonCivilian - numMrWhite, numUndercover + 1),
                    )
                  }
                  className="flex items-center justify-center w-8 h-8 transition-colors rounded-full bg-white/10 text-paper hover:bg-crimson/30"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Mr. White count */}
          <div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-paper">👻 Mr. White</p>
                <p className="text-xs text-mist">
                  Tak punya kata, harus menebak
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNumMrWhite(Math.max(0, numMrWhite - 1))}
                  className="flex items-center justify-center w-8 h-8 transition-colors rounded-full bg-white/10 text-paper hover:bg-crimson/30"
                >
                  −
                </button>
                <span className="w-4 font-bold text-center text-crimson">
                  {numMrWhite}
                </span>
                <button
                  onClick={() =>
                    setNumMrWhite(
                      Math.min(maxNonCivilian - numUndercover, numMrWhite + 1),
                    )
                  }
                  className="flex items-center justify-center w-8 h-8 transition-colors rounded-full bg-white/10 text-paper hover:bg-crimson/30"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Timer */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-5 border bg-shadow rounded-2xl border-white/5"
        >
          <h2 className="mb-1 text-lg font-display text-paper">
            ⏱ Timer Diskusi
          </h2>
          <p className="mb-4 text-xs text-mist">Waktu diskusi per ronde</p>
          <div className="flex gap-2">
            {[30, 60, 90, 120].map((t) => (
              <button
                key={t}
                onClick={() => setRoundTime(t)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  roundTime === t
                    ? "bg-crimson text-white"
                    : "bg-white/5 text-mist hover:bg-white/10"
                }`}
              >
                {t < 60 ? `${t}d` : `${t / 60}m`}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Custom Words */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 border bg-shadow rounded-2xl border-white/5"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-display text-paper">Kata Custom</h2>
              <p className="text-xs text-mist">Atau gunakan bank kata bawaan</p>
            </div>
            <button
              onClick={() => setUseCustomWords(!useCustomWords)}
              className={`w-12 h-6 rounded-full transition-all relative ${useCustomWords ? "bg-crimson" : "bg-white/10"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useCustomWords ? "left-7" : "left-1"}`}
              />
            </button>
          </div>

          <AnimatePresence>
            {useCustomWords && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                <div>
                  <label className="block mb-1 text-xs text-mist">
                    Kata Warga (Civilian)
                  </label>
                  <input
                    type="text"
                    value={customCivilian}
                    onChange={(e) => setCustomCivilian(e.target.value)}
                    placeholder="Contoh: Kucing"
                    className="w-full px-4 py-3 text-sm transition-colors border bg-ink border-white/10 rounded-xl text-paper placeholder-white/20 focus:outline-none focus:border-crimson/60"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-mist">
                    Kata Undercover
                  </label>
                  <input
                    type="text"
                    value={customUndercover}
                    onChange={(e) => setCustomUndercover(e.target.value)}
                    placeholder="Contoh: Anjing"
                    className="w-full px-4 py-3 text-sm transition-colors border bg-ink border-white/10 rounded-xl text-paper placeholder-white/20 focus:outline-none focus:border-crimson/60"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-center text-crimson"
            >
              ⚠ {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Start Button */}
        <motion.button
          onClick={handleStart}
          className="relative w-full py-4 overflow-hidden text-xl font-bold tracking-wide text-white bg-crimson rounded-2xl font-display"
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="relative z-10">Mulai Permainan</span>
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.4 }}
          />
        </motion.button>
      </div>
    </div>
  );
}
