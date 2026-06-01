import { getRandomWordPair } from "./wordBank";

export const ROLES = {
  CIVILIAN: "civilian",
  UNDERCOVER: "undercover",
  MR_WHITE: "mrwhite",
};

export const PHASES = {
  SETUP: "setup",
  WORD_REVEAL: "word_reveal",
  DISCUSSION: "discussion",
  VOTING: "voting",
  ELIMINATION: "elimination",
  MR_WHITE_GUESS: "mrwhite_guess",
  GAME_OVER: "game_over",
};

export function createGame({
  playerNames,
  numUndercover,
  numMrWhite,
  roundTime,
  customWords,
}) {
  const wordPair = customWords
    ? { civilian: customWords.civilian, undercover: customWords.undercover }
    : getRandomWordPair();

  const totalPlayers = playerNames.length;
  const numCivilian = totalPlayers - numUndercover - numMrWhite;

  // Build role array
  const roles = [
    ...Array(numCivilian).fill(ROLES.CIVILIAN),
    ...Array(numUndercover).fill(ROLES.UNDERCOVER),
    ...Array(numMrWhite).fill(ROLES.MR_WHITE),
  ];

  // Shuffle roles
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  const players = playerNames.map((name, i) => ({
    id: i,
    name,
    role: roles[i],
    word:
      roles[i] === ROLES.CIVILIAN
        ? wordPair.civilian
        : roles[i] === ROLES.UNDERCOVER
          ? wordPair.undercover
          : null, // Mr. White gets null
    isEliminated: false,
    votes: 0,
  }));

  return {
    players,
    wordPair,
    phase: PHASES.WORD_REVEAL,
    currentRevealIndex: 0,
    roundTime,
    round: 1,
    eliminatedThisRound: null,
    winner: null,
    history: [],
  };
}

export function checkWinCondition(players) {
  const alive = players.filter((p) => !p.isEliminated);

  const aliveCivilians = alive.filter((p) => p.role === ROLES.CIVILIAN);
  const aliveUndercover = alive.filter((p) => p.role === ROLES.UNDERCOVER);
  const aliveMrWhite = alive.filter((p) => p.role === ROLES.MR_WHITE);

  // ❗ 1. PRIORITAS: 1 vs 1 → Mr White Guess
  if (
    alive.length === 2 &&
    aliveMrWhite.length === 1 &&
    aliveCivilians.length === 1
  ) {
    return {
      winner: null,
      trigger: PHASES.MR_WHITE_GUESS,
    };
  }

  // 🟢 2. Civilian menang → semua musuh mati
  if (aliveUndercover.length === 0 && aliveMrWhite.length === 0) {
    return {
      winner: "civilians",
      reason: "Semua musuh telah dieliminasi!",
    };
  }

  // 🔴 3. Undercover vs Mr White (tidak ada civilian)
  if (aliveUndercover.length > 0 && aliveCivilians.length === 0) {
    return {
      winner: "undercover",
      reason: "Undercover mengalahkan Mr. White!",
    };
  }

  // 🔴 4. Undercover menang (dominate)
  if (
    aliveUndercover.length > 0 &&
    aliveMrWhite.length === 0 &&
    aliveUndercover.length >= aliveCivilians.length
  ) {
    return {
      winner: "undercover",
      reason: "Undercover berhasil menguasai permainan!",
    };
  }

  return null;
}

export function calculateVotes(votingMap) {
  const voteCounts = {};
  Object.values(votingMap).forEach((targetId) => {
    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
  });
  return voteCounts;
}

export function getEliminatedPlayer(players, voteCounts) {
  let maxVotes = 0;
  let eliminated = null;
  let tie = false;

  players
    .filter((p) => !p.isEliminated)
    .forEach((p) => {
      const votes = voteCounts[p.id] || 0;
      if (votes > maxVotes) {
        maxVotes = votes;
        eliminated = p;
        tie = false;
      } else if (votes === maxVotes && votes > 0) {
        tie = true;
      }
    });

  return { eliminated: tie ? null : eliminated, tie };
}
