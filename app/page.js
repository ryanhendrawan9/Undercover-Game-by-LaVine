'use client';
import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import SetupScreen from './components/SetupScreen';
import WordReveal from './components/WordReveal';
import DiscussionPhase from './components/DiscussionPhase';
import VotingPhase from './components/VotingPhase';
import EliminationReveal from './components/EliminationReveal';
import MrWhiteGuess from './components/MrWhiteGuess';
import GameOver from './components/GameOver';

import {
  createGame,
  checkWinCondition,
  calculateVotes,
  getEliminatedPlayer,
  PHASES,
  ROLES,
} from './lib/gameLogic';

export default function Home() {
  const [game, setGame] = useState(null);
  const [phase, setPhase] = useState(PHASES.SETUP);
  const [voteCounts, setVoteCounts] = useState({});
  const [eliminatedThisRound, setEliminatedThisRound] = useState(null);
  const [isTie, setIsTie] = useState(false);
  const [winCondition, setWinCondition] = useState(null);
  const [mrWhiteGuessResult, setMrWhiteGuessResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [setupConfig, setSetupConfig] = useState(null);

  const startGame = useCallback((config) => {
    setSetupConfig(config);
    const newGame = createGame(config);
    setGame(newGame);
    setPhase(PHASES.WORD_REVEAL);
    setEliminatedThisRound(null);
    setWinCondition(null);
    setVoteCounts({});
    setIsTie(false);
    setMrWhiteGuessResult(null);
  }, []);

  const handlePlayerRevealed = useCallback((isLastPlayer) => {
    if (isLastPlayer) {
      setPhase(PHASES.DISCUSSION);
    } else {
      setGame(g => ({ ...g, currentRevealIndex: g.currentRevealIndex + 1 }));
    }
  }, []);

  const handleVoteSubmit = useCallback((votes) => {
    const counts = calculateVotes(votes);
    setVoteCounts(counts);

    setGame(g => {
      const alivePlayers = g.players.filter(p => !p.isEliminated);
      const { eliminated, tie } = getEliminatedPlayer(alivePlayers, counts);

      setIsTie(tie);
      setEliminatedThisRound(eliminated);

      const updatedPlayers = g.players.map(p =>
        p.id === eliminated?.id ? { ...p, isEliminated: true } : p
      );

      if (eliminated?.role === ROLES.MR_WHITE) {
        setTimeout(() => setPhase(PHASES.MR_WHITE_GUESS), 0);
      } else {
        setTimeout(() => setPhase(PHASES.ELIMINATION), 0);
      }

      return { ...g, players: updatedPlayers };
    });
  }, []);

  const handleMrWhiteGuess = useCallback((isCorrect, guessWord) => {
    setMrWhiteGuessResult({ isCorrect, guessWord });
    if (isCorrect) {
      const condition = { winner: 'mrwhite', reason: `Mr. White berhasil menebak kata warga!` };
      setWinCondition(condition);
    }
    setPhase(PHASES.ELIMINATION);
  }, []);

  const handleEliminationContinue = useCallback(() => {
    if (mrWhiteGuessResult?.isCorrect || winCondition) {
      setPhase(PHASES.GAME_OVER);
      return;
    }

    setGame(g => {
      const win = checkWinCondition(g.players);
      if (win) {
        setWinCondition(win);
        setTimeout(() => setPhase(PHASES.GAME_OVER), 0);
      } else {
        setTimeout(() => {
          setMrWhiteGuessResult(null);
          setPhase(PHASES.DISCUSSION);
        }, 0);
      }
      return { ...g, round: g.round + 1 };
    });
  }, [mrWhiteGuessResult, winCondition]);

  const handlePlayAgain = useCallback(() => {
    if (setupConfig) startGame(setupConfig);
  }, [setupConfig, startGame]);

  const handleNewGame = useCallback(() => {
    setGame(null);
    setPhase(PHASES.SETUP);
    setWinCondition(null);
    setEliminatedThisRound(null);
    setMrWhiteGuessResult(null);
  }, []);

  return (
    <main className="max-w-md mx-auto min-h-screen relative">
      <AnimatePresence mode="wait">
        {phase === PHASES.SETUP && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }}>
            <SetupScreen onStart={startGame} />
          </motion.div>
        )}

        {phase === PHASES.WORD_REVEAL && game && (
          <motion.div key={`reveal-${game.currentRevealIndex}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <WordReveal
              game={game}
              onAllRevealed={handlePlayerRevealed}
            />
          </motion.div>
        )}

        {phase === PHASES.DISCUSSION && game && (
          <motion.div key={`discussion-${game.round}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <DiscussionPhase game={game} onVote={() => setPhase(PHASES.VOTING)} />
          </motion.div>
        )}

        {phase === PHASES.VOTING && game && (
          <motion.div key={`voting-${game.round}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <VotingPhase game={game} onSubmit={handleVoteSubmit} />
          </motion.div>
        )}

        {phase === PHASES.MR_WHITE_GUESS && eliminatedThisRound && game && (
          <motion.div key="mrwhite-guess" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <MrWhiteGuess
              mrWhitePlayer={eliminatedThisRound}
              civilianWord={game.wordPair.civilian}
              onGuess={handleMrWhiteGuess}
            />
          </motion.div>
        )}

        {phase === PHASES.ELIMINATION && (
          <motion.div key={`elim-${game?.round}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <EliminationReveal
              eliminatedPlayer={eliminatedThisRound}
              voteCounts={voteCounts}
              players={game?.players || []}
              onContinue={handleEliminationContinue}
              isTie={isTie}
              winCondition={winCondition || (mrWhiteGuessResult?.isCorrect ? { winner: 'mrwhite' } : null)}
            />
          </motion.div>
        )}

        {phase === PHASES.GAME_OVER && (
          <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <GameOver
              game={game}
              winCondition={winCondition}
              leaderboard={leaderboard}
              onPlayAgain={handlePlayAgain}
              onNewGame={handleNewGame}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
