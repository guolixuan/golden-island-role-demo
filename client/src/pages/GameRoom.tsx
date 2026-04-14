/*
 * 风格提醒（对局页）：复古棋牌厅写实拟物。
 * 展示玩家装备角色在对局中的语音效果——点击事件按钮，角色即时开口说话。
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Mic2 } from "lucide-react";
import { roles } from "@/data/roles";

const VOICE_EVENTS = [
  { label: "摸好牌", lineIndex: 0, emoji: "🎴" },
  { label: "赢了！", lineIndex: 1, emoji: "🏆" },
  { label: "输了…", lineIndex: 2, emoji: "😓" },
  { label: "催局", lineIndex: 3, emoji: "⏰" },
] as const;

const PLAYER_HAND = ["🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀙", "🀚", "🀛", "🀜", "🀝", "🀞"];
const DISCARD_TILES = ["🀏", "🀗", "🀡", "🀀", "🀄", "🀆"];
const OPP_TOP = 13;
const OPP_SIDE = 8;

export default function GameRoom() {
  const [, navigate] = useLocation();
  const [equippedRoleId, setEquippedRoleId] = useState<string | null>(null);
  const [bubble, setBubble] = useState<{ text: string; id: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleId = params.get("role");
    if (roleId && roles.some((r) => r.id === roleId)) {
      setEquippedRoleId(roleId);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const equippedRole = roles.find((r) => r.id === equippedRoleId) ?? null;

  const speak = useCallback(
    (lineIndex: number) => {
      if (!equippedRole) return;
      const line = equippedRole.previewLines[lineIndex] ?? equippedRole.previewLines[0];

      setBubble({ text: line, id: Date.now() });
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setBubble(null), 3600);

      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const synth = window.speechSynthesis;
        synth.cancel();
        const u = new SpeechSynthesisUtterance(line);
        u.lang = "zh-CN";
        u.rate = equippedRole.speechRate;
        u.pitch = equippedRole.speechPitch;
        const voices = synth.getVoices();
        const zh = voices.find((v) => v.lang.toLowerCase().includes("zh"));
        if (zh) u.voice = zh;
        synth.speak(u);
      }
    },
    [equippedRole],
  );

  return (
    <div className="gr-shell">
      {/* 顶部导航栏 */}
      <div className="gr-header">
        <button className="gr-back-btn" type="button" onClick={() => navigate("/")}>
          <ArrowLeft size={15} />
          <span>返回大厅</span>
        </button>

        <div className="gr-round-info">
          <span className="gr-round-badge">第 3 局</span>
          <span className="gr-score">积分 1,200</span>
        </div>

        {equippedRole ? (
          <div className={`gr-role-tag gr-role-tag--${equippedRole.id}`}>
            <span>{equippedRole.name}</span>
            <span className="gr-role-tag__sub">{equippedRole.badge}</span>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* 牌桌主区 */}
      <div className="gr-table">
        {/* 对家（正上方） */}
        <div className="gr-opp gr-opp--top">
          <span className="gr-opp-name">玩家B · 880分</span>
          <div className="gr-tiles-row">
            {Array.from({ length: OPP_TOP }).map((_, i) => (
              <div key={i} className="gr-tile-back" />
            ))}
          </div>
        </div>

        {/* 中间三列：上家 / 中央 / 下家 */}
        <div className="gr-middle">
          {/* 上家（左边） */}
          <div className="gr-opp gr-opp--left">
            <div className="gr-tiles-col">
              {Array.from({ length: OPP_SIDE }).map((_, i) => (
                <div key={i} className="gr-tile-back gr-tile-back--side" />
              ))}
            </div>
            <span className="gr-opp-name gr-opp-name--vert">玩家C</span>
          </div>

          {/* 中央牌堆 + 弃牌区 */}
          <div className="gr-center">
            <div className="gr-pile-wrap">
              <div className="gr-pile-stack">
                {[4, 3, 2, 1, 0].map((i) => (
                  <div
                    key={i}
                    className="gr-tile-back gr-tile-back--pile"
                    style={{ transform: `translateY(${-i * 2}px)` }}
                  />
                ))}
              </div>
              <span className="gr-pile-label">牌堆 ×42</span>
            </div>
            <div className="gr-discard-wrap">
              <span className="gr-discard-label">弃牌区</span>
              <div className="gr-discard-tiles">
                {DISCARD_TILES.map((t, i) => (
                  <span key={i} className="gr-tile-discard">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 下家（右边） */}
          <div className="gr-opp gr-opp--right">
            <span className="gr-opp-name gr-opp-name--vert">玩家D</span>
            <div className="gr-tiles-col">
              {Array.from({ length: OPP_SIDE }).map((_, i) => (
                <div key={i} className="gr-tile-back gr-tile-back--side" />
              ))}
            </div>
          </div>
        </div>

        {/* 玩家区（底部） */}
        <div className="gr-player">
          {/* 角色立绘 HUD */}
          {equippedRole ? (
            <motion.div
              className="gr-char-hud"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.42, ease: "easeOut" }}
            >
              <AnimatePresence>
                {bubble ? (
                  <motion.div
                    key={bubble.id}
                    className="gr-voice-bubble"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Mic2 size={12} className="gr-voice-bubble__icon" />
                    <span>{bubble.text}</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className={`gr-char-frame gr-char-frame--${equippedRole.id}`}>
                <img
                  src={equippedRole.cutoutImage}
                  alt={equippedRole.name}
                  className="gr-char-img"
                  draggable={false}
                />
              </div>
              <span className="gr-char-name">{equippedRole.name}</span>
            </motion.div>
          ) : (
            <div className="gr-no-role">
              <span>默认角色</span>
            </div>
          )}

          {/* 手牌 + 语音触发按钮 */}
          <div className="gr-player-main">
            <div className="gr-player-meta">
              <span className="gr-player-name">
                我{equippedRole ? ` · ${equippedRole.name}` : ""}
              </span>
              <span className="gr-player-score">1,200 分</span>
            </div>

            <div className="gr-hand">
              {PLAYER_HAND.map((t, i) => (
                <span key={i} className="gr-tile-face">
                  {t}
                </span>
              ))}
            </div>

            {equippedRole ? (
              <div className="gr-voice-btns">
                <span className="gr-voice-btns__hint">点击触发语音 →</span>
                {VOICE_EVENTS.map((evt) => (
                  <button
                    key={evt.label}
                    type="button"
                    className="gr-voice-btn"
                    onClick={() => speak(evt.lineIndex)}
                  >
                    <span className="gr-voice-btn__emoji">{evt.emoji}</span>
                    <span>{evt.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="gr-no-role-hint">
                <span>返回大厅装备角色，即可在对局中听到专属语音</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
