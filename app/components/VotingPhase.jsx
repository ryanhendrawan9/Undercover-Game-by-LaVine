"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const S = {
  ink: "#0D0D0D",
  paper: "#F5F0E8",
  crimson: "#C41E3A",
  mist: "#8B9EB7",
  shadow: "#1A1A2E",
};

export default function VotingPhase({ game, onSubmit }) {
  const alivePlayers = game.players.filter((p) => !p.isEliminated);
  const [selected, setSelected] = useState(undefined);
  const [confirm, setConfirm] = useState(false);

  const handleSubmit = () => {
    if (selected === undefined) return;
    const votes = {};
    alivePlayers.forEach((p) => {
      if (p.id !== selected) votes[p.id] = selected;
    });
    onSubmit(votes);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: S.ink,
        display: "flex",
        flexDirection: "column",
        padding: "32px 20px 24px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        <p
          style={{
            color: S.mist,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Ronde {game.round}
        </p>
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 36,
            fontWeight: 900,
            color: S.paper,
            margin: "0 0 6px",
          }}
        >
          Voting
        </h2>
        <p style={{ color: S.mist, fontSize: 14, margin: 0 }}>
          Diskusi selesai — siapa yang dieliminasi?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "rgba(196,30,58,0.07)",
          border: "1px solid rgba(196,30,58,0.2)",
          borderRadius: 14,
          padding: "12px 16px",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        <p style={{ color: S.mist, fontSize: 13, margin: 0 }}>
          🗣 Diskusikan bersama, lalu pilih{" "}
          <span style={{ color: S.paper, fontWeight: 600 }}>satu orang</span>{" "}
          untuk dieliminasi
        </p>
      </motion.div>

      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}
      >
        {alivePlayers.map((target, i) => {
          const isSel = selected === target.id;
          return (
            <motion.button
              key={target.id}
              onClick={() => {
                setSelected(target.id);
                setConfirm(false);
              }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 18px",
                borderRadius: 18,
                cursor: "pointer",
                border: `1.5px solid ${isSel ? S.crimson : "rgba(255,255,255,0.08)"}`,
                background: isSel ? "rgba(196,30,58,0.12)" : S.shadow,
                transition: "all 0.2s",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: isSel ? S.crimson : "rgba(255,255,255,0.06)",
                  border: `2px solid ${isSel ? S.crimson : "rgba(255,255,255,0.1)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>
                  {target.name[0].toUpperCase()}
                </span>
              </div>

              <span
                style={{
                  color: isSel ? S.paper : S.mist,
                  fontSize: 20,
                  fontWeight: isSel ? 700 : 400,
                  flex: 1,
                  transition: "all 0.2s",
                }}
              >
                {target.name}
              </span>

              <AnimatePresence>
                {isSel && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: S.crimson,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}
                    >
                      ✓
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected !== undefined && !confirm && (
          <motion.div
            key="confirm-prompt"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{
              marginTop: 20,
              background: "rgba(196,30,58,0.08)",
              border: "1px solid rgba(196,30,58,0.25)",
              borderRadius: 16,
              padding: "16px 20px",
              textAlign: "center",
            }}
          >
            <p style={{ color: S.mist, fontSize: 14, marginBottom: 12 }}>
              Eliminasi{" "}
              <span style={{ color: S.crimson, fontWeight: 700, fontSize: 16 }}>
                {alivePlayers.find((p) => p.id === selected)?.name}
              </span>
              ?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setSelected(undefined)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: S.mist,
                  fontSize: 15,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Batal
              </button>
              <button
                onClick={() => setConfirm(true)}
                style={{
                  flex: 2,
                  padding: "12px",
                  background: S.crimson,
                  border: "none",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Ya, Eliminasi!
              </button>
            </div>
          </motion.div>
        )}

        {confirm && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ marginTop: 20 }}
          >
            <button
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: "18px",
                background: S.crimson,
                border: "none",
                borderRadius: 16,
                color: "#fff",
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Konfirmasi — Eliminasi{" "}
              {alivePlayers.find((p) => p.id === selected)?.name} ⚡
            </button>
          </motion.div>
        )}

        {selected === undefined && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: 20 }}
          >
            <div
              style={{
                width: "100%",
                padding: "18px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.2)",
                  fontSize: 15,
                  margin: 0,
                }}
              >
                Pilih pemain dulu...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
