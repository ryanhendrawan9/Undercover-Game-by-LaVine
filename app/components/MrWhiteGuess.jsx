'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MrWhiteGuess({ mrWhitePlayer, civilianWord, onGuess }) {
  const [guess, setGuess] = useState('');

  const handleSubmit = () => {
    if (!guess.trim()) return;
    const isCorrect = guess.trim().toLowerCase() === civilianWord.toLowerCase();
    onGuess(isCorrect, guess.trim());
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm text-center"
      >
        {/* Dramatic header */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: 2, duration: 0.5 }}
          className="text-6xl mb-4"
        >
          👻
        </motion.div>

        <h2 className="font-display text-3xl font-black text-paper mb-2">Mr. White!</h2>
        <p className="font-display text-xl text-crimson mb-1">{mrWhitePlayer.name}</p>
        <p className="text-mist text-sm mb-8">
          Kamu dieliminasi... Tapi kamu bisa menang jika bisa menebak kata warga!
        </p>

        {/* Guess input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-shadow rounded-2xl p-5 border border-white/5 mb-6"
        >
          <p className="text-mist text-xs tracking-widest uppercase mb-3">Tebak kata warga!</p>
          <input
            type="text"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Tulis tebakan..."
            autoFocus
            className="w-full bg-ink border border-white/10 rounded-xl px-4 py-4 text-paper placeholder-white/20 text-lg text-center focus:outline-none focus:border-crimson/60 transition-colors"
          />
          <p className="text-white/20 text-xs mt-2">Tepat sekali = Mr. White menang!</p>
        </motion.div>

        <motion.button
          onClick={handleSubmit}
          disabled={!guess.trim()}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            guess.trim() ? 'bg-crimson text-white' : 'bg-white/5 text-white/20'
          }`}
          whileTap={guess.trim() ? { scale: 0.97 } : {}}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          Konfirmasi Tebakan
        </motion.button>
      </motion.div>
    </div>
  );
}
