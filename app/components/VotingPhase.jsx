'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VotingPhase({ game, onSubmit }) {
  const alivePlayers = game.players.filter(p => !p.isEliminated);
  // votes: { voterId: targetId }
  const [votes, setVotes] = useState({});
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [phase, setPhase] = useState('cover'); // cover | voting

  const currentVoter = alivePlayers[currentVoterIndex];
  const isLastVoter = currentVoterIndex === alivePlayers.length - 1;
  const hasVoted = votes[currentVoter?.id] !== undefined;

  const handleVote = (targetId) => {
    if (targetId === currentVoter.id) return; // can't vote self
    setVotes(v => ({ ...v, [currentVoter.id]: targetId }));
  };

  const handleNext = () => {
    if (isLastVoter) {
      onSubmit(votes);
    } else {
      setCurrentVoterIndex(i => i + 1);
      setPhase('cover');
    }
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col px-5 pt-8 pb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <p className="text-mist text-xs tracking-widest uppercase mb-1">Ronde {game.round}</p>
        <h2 className="font-display text-3xl font-black text-paper">Voting</h2>
        <p className="text-mist text-sm mt-1">Siapa yang harus dieliminasi?</p>
      </motion.div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {alivePlayers.map((p, i) => (
          <div
            key={p.id}
            className={`h-2 rounded-full transition-all ${
              i < currentVoterIndex ? 'w-2 bg-crimson' :
              i === currentVoterIndex ? 'w-6 bg-crimson' :
              'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'cover' ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 rounded-full bg-shadow border border-crimson/20 flex items-center justify-center mb-4">
              <span className="font-display text-2xl text-crimson font-black">
                {currentVoter?.name[0].toUpperCase()}
              </span>
            </div>
            <h3 className="font-display text-2xl text-paper font-bold mb-2">{currentVoter?.name}</h3>
            <p className="text-mist text-sm mb-10">Giliran kamu untuk voting</p>
            <motion.button
              onClick={() => setPhase('voting')}
              className="w-full max-w-xs py-4 bg-crimson rounded-2xl text-white font-bold text-lg"
              whileTap={{ scale: 0.97 }}
            >
              Mulai Voting 🗳
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="voting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <p className="text-center text-mist text-sm mb-4">
              <span className="text-paper font-medium">{currentVoter?.name}</span> memilih...
            </p>

            <div className="space-y-3 flex-1">
              {alivePlayers
                .filter(p => p.id !== currentVoter?.id)
                .map((target, i) => {
                  const isSelected = votes[currentVoter?.id] === target.id;
                  return (
                    <motion.button
                      key={target.id}
                      onClick={() => handleVote(target.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-crimson/20 border-crimson text-paper'
                          : 'bg-shadow border-white/10 text-mist hover:border-white/20'
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isSelected ? 'bg-crimson border-crimson' : 'bg-white/5 border-white/10'
                      }`}>
                        <span className="font-bold text-sm text-white">
                          {target.name[0].toUpperCase()}
                        </span>
                      </div>
                      <span className={`font-medium text-lg ${isSelected ? 'text-paper' : ''}`}>
                        {target.name}
                      </span>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto text-crimson text-xl"
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
            </div>

            <motion.button
              onClick={handleNext}
              disabled={!hasVoted}
              className={`w-full py-4 rounded-2xl font-bold text-lg mt-6 transition-all ${
                hasVoted ? 'bg-crimson text-white' : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
              whileTap={hasVoted ? { scale: 0.97 } : {}}
            >
              {isLastVoter ? 'Lihat Hasil' : 'Konfirmasi Vote →'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
