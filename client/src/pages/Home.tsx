/*
 * 风格提醒（首页）：复古棋牌厅写实拟物。
 * 本页采用“完整大厅底图 + 右侧美容院二级界面”的结构：一级界面保留默认人物与账号信息；二级界面不遮挡整个大厅，并坚持顶部纯名称导航、左侧人物预览、右侧说明试听的布局原则。
 */
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Headphones, Heart, Play, Wand2, X } from "lucide-react";
import { roles, type RoleData } from "@/data/roles";

type DeductionState = {
  key: number;
  amount: number;
  roleName: string;
};

const DEFAULT_STAGE_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/%E6%88%AA%E5%B1%8F2026-04-1321.57.18_f4a3022c.png";

const CLEAN_STAGE_IMAGE = "/hall-bg-clean.png";

const INITIAL_WISDOM = 6051238;

export default function Home() {
  const [, navigate] = useLocation();
  const [ownedRoleIds, setOwnedRoleIds] = useState<RoleData["id"][]>([]);
  const [equippedRoleId, setEquippedRoleId] = useState<RoleData["id"] | null>(null);
  const [salonOpen, setSalonOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<RoleData["id"]>(roles[0].id);
  const [wisdomBalance, setWisdomBalance] = useState(INITIAL_WISDOM);
  const [deduction, setDeduction] = useState<DeductionState | null>(null);
  const [playingLine, setPlayingLine] = useState<string | null>(null);
  const [characterBubble, setCharacterBubble] = useState(false);

  const equippedRole = useMemo(() => roles.find((role) => role.id === equippedRoleId) ?? null, [equippedRoleId]);
  const selectedRole = useMemo(() => roles.find((role) => role.id === selectedRoleId) ?? roles[0], [selectedRoleId]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    setPlayingLine(null);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [selectedRoleId]);

  const currentStageLabel = equippedRole ? `${equippedRole.name}大厅形象已生效` : "默认大厅";
  const selectedOwned = ownedRoleIds.includes(selectedRole.id);
  const selectedEquipped = equippedRoleId === selectedRole.id;
  const featuredPreviewLines = selectedRole.previewLines.slice(0, 4);

  const openSalon = () => {
    setSelectedRoleId(equippedRoleId ?? roles[0].id);
    setSalonOpen(true);
  };

  const closeSalon = () => {
    setSalonOpen(false);
    setPlayingLine(null);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleVoicePreview = (line: string) => {
    setPlayingLine(line);

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTimeout(() => setPlayingLine((current) => (current === line ? null : current)), 1400);
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = "zh-CN";
    utterance.rate = selectedRole.speechRate;
    utterance.pitch = selectedRole.speechPitch;
    utterance.volume = 1;

    const voices = synth.getVoices();
    const chineseVoice = voices.find((voice) => voice.lang.toLowerCase().includes("zh"));
    if (chineseVoice) {
      utterance.voice = chineseVoice;
    }

    utterance.onend = () => setPlayingLine((current) => (current === line ? null : current));
    utterance.onerror = () => setPlayingLine(null);
    synth.speak(utterance);
  };

  const triggerDeduction = (role: RoleData) => {
    setDeduction({
      key: Date.now(),
      amount: role.price,
      roleName: role.name,
    });

    setTimeout(() => {
      setDeduction((current) => (current?.roleName === role.name ? null : current));
    }, 1800);
  };

  const handlePurchaseOrEquip = () => {
    if (selectedOwned) {
      setEquippedRoleId(selectedRole.id);
      return;
    }

    if (wisdomBalance < selectedRole.price) {
      return;
    }

    setWisdomBalance((prev) => prev - selectedRole.price);
    setOwnedRoleIds((prev) => (prev.includes(selectedRole.id) ? prev : [...prev, selectedRole.id]));
    setEquippedRoleId(selectedRole.id);
    triggerDeduction(selectedRole);
  };

  return (
    <main className="hall-shell w-full overflow-hidden text-stone-100">
      <div className="hall-shell__grain" aria-hidden="true" />

      <section className="hall-viewer mx-auto flex w-full max-w-[1720px] flex-col justify-start px-0 py-0 md:px-0 xl:px-0">
        <div className="hall-stage-wrapper hall-stage-wrapper--immersive mx-auto w-full">
          <div className="hall-stage hall-stage--immersive">
            <img
              src={equippedRole ? CLEAN_STAGE_IMAGE : DEFAULT_STAGE_IMAGE}
              alt={currentStageLabel}
              aria-hidden="true"
              className="hall-stage__image hall-stage__image--base hall-stage__image--clean"
              draggable={false}
            />

            {equippedRole ? (
              <img
                key={equippedRole.id}
                src={equippedRole.cutoutImage}
                alt={equippedRole.name}
                className={`hall-character-layer hall-character-layer--${equippedRole.id}`}
                draggable={false}
              />
            ) : null}

            {equippedRole ? (
              <div
                key={`frame-${equippedRole.id}`}
                className={`hall-avatar-frame hall-avatar-frame--${equippedRole.id}`}
                aria-hidden="true"
              />
            ) : null}

            <button
              type="button"
              className="hall-hotspot hall-hotspot--character"
              onClick={() => setCharacterBubble((v) => !v)}
              aria-label="点击人物查看角色换装"
            />

            <button
              type="button"
              className="hall-hotspot hall-hotspot--beauty"
              onClick={openSalon}
              aria-label="打开美容院角色购买界面"
            />

            <AnimatePresence>
              {characterBubble ? (
                <motion.div
                  className="hall-character-bubble"
                  initial={{ opacity: 0, y: 6, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <span className="hall-character-bubble__text">换个角色声音？</span>
                  <button
                    type="button"
                    className="hall-character-bubble__btn"
                    onClick={() => {
                      setCharacterBubble(false);
                      openSalon();
                    }}
                  >
                    去美容院 →
                  </button>
                  <button
                    type="button"
                    className="hall-character-bubble__dismiss"
                    onClick={() => setCharacterBubble(false)}
                    aria-label="关闭提示"
                  >
                    ×
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <button
              type="button"
              className="hall-enter-game-btn"
              onClick={() => navigate(`/game${equippedRoleId ? `?role=${equippedRoleId}` : ""}`)}
              aria-label="进入对局"
            >
              <span className="hall-enter-game-btn__label">进入对局</span>
              {equippedRole ? (
                <span className="hall-enter-game-btn__role">{equippedRole.name} 已就位</span>
              ) : null}
            </button>

          </div>
        </div>
      </section>

      <AnimatePresence>
        {salonOpen ? (
          <motion.aside
            className="beauty-salon beauty-salon--side"
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="beauty-salon__header">
              <h2 className="beauty-salon__title-main">美容院</h2>
              <button type="button" className="beauty-salon__close" onClick={closeSalon} aria-label="关闭美容院">
                <X size={18} />
              </button>
            </div>

            <div className="beauty-salon__content beauty-salon__content--side">
              <div className="beauty-salon__left">
                <div className="beauty-salon__nav" aria-label="美容院角色导航">
                  {roles.map((role) => {
                    const owned = ownedRoleIds.includes(role.id);
                    const active = role.id === selectedRole.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        className={`beauty-salon__nav-item ${active ? "is-active" : ""}`}
                        onClick={() => setSelectedRoleId(role.id)}
                        aria-label={`切换到${role.name}`}
                      >
                        <strong>{role.name}</strong>
                      </button>
                    );
                  })}
                </div>

                <div className="beauty-salon__preview-stage">
                  <div className="beauty-salon__preview-topline">
                    <span className="beauty-salon__badge">{selectedRole.name}</span>
                    <span className={`beauty-salon__ownership ${selectedOwned ? "is-owned" : "is-locked"}`}>
                      {selectedOwned ? "已购买" : "未购买"}
                    </span>
                  </div>

                  <div className="beauty-salon__figure-wrap">
                    <img
                      src={selectedRole.cutoutImage}
                      alt={selectedRole.name}
                      className={`beauty-salon__figure beauty-salon__figure--${selectedRole.id}`}
                      draggable={false}
                    />
                  </div>

                </div>

                <div className="beauty-salon__intro-card">
                  <p className="beauty-salon__label">角色说明</p>
                  <h3>{selectedRole.title}</h3>

                  <div className="beauty-salon__tags beauty-salon__tags--compact">
                    {selectedRole.voiceTags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="beauty-salon__detail beauty-salon__detail--side">
                <div className="beauty-salon__audio-card beauty-salon__audio-card--compact">
                  <div className="beauty-salon__audio-head">
                    <div>
                      <p className="beauty-salon__label">语音试听</p>
                      <h4>点击试听</h4>
                    </div>
                    <div className="beauty-salon__audio-pill">
                      <Headphones size={15} />
                      <span>{playingLine ? "播放中" : "待播放"}</span>
                    </div>
                  </div>

                  <div className="beauty-salon__voice-list">
                    {featuredPreviewLines.map((line) => {
                      const active = playingLine === line;

                      return (
                        <button
                          key={line}
                          type="button"
                          className={`beauty-salon__voice-item ${active ? "is-playing" : ""}`}
                          onClick={() => handleVoicePreview(line)}
                        >
                          <span className="beauty-salon__voice-icon">
                            <Play size={14} className={active ? "fill-current" : ""} />
                          </span>
                          <span className="beauty-salon__voice-text">{line}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="beauty-salon__purchase-card">
                  <div className="beauty-salon__purchase-meta">
                    <div>
                      <p className="beauty-salon__label">购买与应用</p>
                      <h4>{selectedOwned ? (selectedEquipped ? "当前已在大厅生效" : "可立即更换大厅人物") : "购买后立即生效"}</h4>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`beauty-salon__purchase-btn ${selectedOwned ? "is-owned" : ""}`}
                    onClick={handlePurchaseOrEquip}
                    disabled={!selectedOwned && wisdomBalance < selectedRole.price}
                  >
                    {!selectedOwned ? (
                      <>
                        <Heart size={16} className="fill-current text-[#ff5b6a]" />
                        <strong>{selectedRole.price} 悟性</strong>
                        <span>·</span>
                        <span>立即购买</span>
                      </>
                    ) : selectedEquipped ? (
                      <>
                        <CheckCircle2 size={17} />
                        <strong>当前使用中</strong>
                      </>
                    ) : (
                      <>
                        <Wand2 size={16} />
                        <strong>更换大厅人物</strong>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {deduction ? (
                <motion.div
                  key={deduction.key}
                  className="beauty-salon__deduction"
                  initial={{ opacity: 0, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <Heart size={16} className="fill-current text-[#ff5b6a]" />
                  <span>-{deduction.amount} 悟性</span>
                  <strong>{deduction.roleName} 已替换大厅人物</strong>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
