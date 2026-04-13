/*
 * 风格提醒（首页）：复古棋牌厅写实拟物。
 * 本页采用“完整大厅底图 + 右侧美容院二级界面”的结构：一级界面保留默认人物与账号信息；二级界面不遮挡整个大厅，并坚持顶部纯名称导航、左侧人物预览、右侧说明试听的布局原则。
 */
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Headphones, Heart, Play, Sparkles, Wand2, X } from "lucide-react";

type RoleData = {
  id: string;
  name: string;
  badge: string;
  title: string;
  stageImage: string;
  cutoutImage: string;
  summary: string;
  longDescription: string;
  style: string;
  price: number;
  voiceTags: string[];
  previewLines: string[];
  speechRate: number;
  speechPitch: number;
};

type DeductionState = {
  key: number;
  amount: number;
  roleName: string;
};

const DEFAULT_STAGE_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/%E6%88%AA%E5%B1%8F2026-04-1321.57.18_f4a3022c.png";

const INITIAL_WISDOM = 6051238;

const roles: RoleData[] = [
  {
    id: "baozhao",
    name: "大爷",
    badge: "火气型语音包",
    title: "火气足、上桌就有存在感，适合喜欢热闹牌桌氛围的玩家",
    stageImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/baozhao_daye_preview_v1_86005b9d.webp",
    cutoutImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/baozhao_daye_cutout_clean_c223fa3d.png",
    summary:
      "适合想把大厅换成更有火气、更有牌桌熟人感风格的玩家。购买后，大厅人物会直接切换成和预览一致的大爷形象。",
    longDescription:
      "大爷语音包突出催局、赢牌和起势时的热闹感，整体听感更直接，适合喜欢高存在感角色的玩家。",
    style: "赤褐烟雾、粗粝日常、局上存在感强",
    price: 1888,
    voiceTags: ["催局抱怨", "胡牌得意", "火气上头"],
    previewLines: ["搞快点咯，这把我手气正旺。", "又给我摸顺了，等哈你们莫后悔。", "胡了就要喊出来，这才有味。"],
    speechRate: 0.95,
    speechPitch: 0.82,
  },
  {
    id: "supu",
    name: "妹坨",
    badge: "甜辣型语音包",
    title: "轻快甜辣、陪伴感更强，适合喜欢热闹互动的玩家",
    stageImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/supu_meituo_preview_640256ff.webp",
    cutoutImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/supu_meituo_cutout_clean_a3df0a9b.png",
    summary:
      "适合想让大厅氛围更轻快、更亲切的玩家。购买后，大厅人物会直接切换成和预览一致的妹坨形象。",
    longDescription:
      "妹坨语音包更偏轻松陪伴和赢牌鼓励，适合喜欢柔和一点、社交感更强的玩家。",
    style: "糖感高光、轻泡泡粒子、社交外显",
    price: 1688,
    voiceTags: ["撒娇播报", "连胡庆祝", "亲昵称呼"],
    previewLines: ["你今天手气可以哦，我都想跟着你坐一桌。", "这把胡得漂亮，继续冲呀。", "别急嘛，慢慢来，这局还有戏。"],
    speechRate: 1.05,
    speechPitch: 1.15,
  },
  {
    id: "mange",
    name: "满哥",
    badge: "江湖型语音包",
    title: "稳重熟人局气质，适合喜欢老牌友风格的玩家",
    stageImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/jiefang_mange_preview_eeabfb07.webp",
    cutoutImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/jiefang_mange_cutout_clean_d5f22fa9.png",
    summary:
      "适合想让大厅更稳、更有老牌友气质的玩家。购买后，大厅人物会直接切换成和预览一致的满哥形象。",
    longDescription:
      "满哥语音包更克制沉稳，适合喜欢熟人局味道和长期使用感的玩家。",
    style: "砖红织锦、老派气场、克制张力",
    price: 2088,
    voiceTags: ["沉稳报听", "赢牌调侃", "熟人局招呼"],
    previewLines: ["这牌要稳着打，莫急着下结论。", "熟人局讲究个味道，赢了也要留三分。", "这一手下来，局面差不多明了了。"],
    speechRate: 0.9,
    speechPitch: 0.78,
  },
];

export default function Home() {
  const [ownedRoleIds, setOwnedRoleIds] = useState<RoleData["id"][]>([]);
  const [equippedRoleId, setEquippedRoleId] = useState<RoleData["id"] | null>(null);
  const [salonOpen, setSalonOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<RoleData["id"]>(roles[0].id);
  const [wisdomBalance, setWisdomBalance] = useState(INITIAL_WISDOM);
  const [deduction, setDeduction] = useState<DeductionState | null>(null);
  const [playingLine, setPlayingLine] = useState<string | null>(null);

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

  const currentStageImage = equippedRole?.stageImage ?? DEFAULT_STAGE_IMAGE;
  const currentStageLabel = equippedRole ? `${equippedRole.name}大厅形象已生效` : "默认大厅人物与账号信息";
  const selectedOwned = ownedRoleIds.includes(selectedRole.id);
  const selectedEquipped = equippedRoleId === selectedRole.id;
  const featuredPreviewLines = selectedRole.previewLines.slice(0, 2);

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
              src={currentStageImage}
              alt={currentStageLabel}
              aria-hidden="true"
              className="hall-stage__image hall-stage__image--base hall-stage__image--clean"
              draggable={false}
            />

            <button
              type="button"
              className="hall-hotspot hall-hotspot--beauty"
              onClick={openSalon}
              aria-label="打开美容院角色购买界面"
            />

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
              <div>
                <p className="beauty-salon__eyebrow">美容院</p>
                <h2>角色皮肤与语音包</h2>
              </div>
              <div className="beauty-salon__header-actions">
                <div className="beauty-salon__balance" aria-label={`当前悟性值${wisdomBalance}`}>
                  <Heart size={16} className="fill-current text-[#ff5b6a]" />
                  <span>{wisdomBalance.toLocaleString()}</span>
                </div>
                <button type="button" className="beauty-salon__close" onClick={closeSalon} aria-label="关闭美容院">
                  <X size={18} />
                </button>
              </div>
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
                    <span className="beauty-salon__badge">{selectedRole.badge}</span>
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

                  <div className="beauty-salon__preview-footer">
                    <strong>{selectedRole.name}</strong>
                    <small>{selectedRole.style}</small>
                  </div>
                </div>
              </div>

              <div className="beauty-salon__detail beauty-salon__detail--side">
                <div className="beauty-salon__intro-card">
                  <p className="beauty-salon__label">角色说明</p>
                  <h3>{selectedRole.title}</h3>
                  <p className="beauty-salon__intro-copy">{selectedRole.summary}</p>

                  <div className="beauty-salon__tags beauty-salon__tags--compact">
                    {selectedRole.voiceTags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="beauty-salon__audio-card beauty-salon__audio-card--compact">
                  <div className="beauty-salon__audio-head">
                    <div>
                      <p className="beauty-salon__label">语音试听</p>
                      <h4>点击两句代表台词试听</h4>
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
                      <h4>{selectedOwned ? (selectedEquipped ? "当前已在大厅生效" : "可立即更换大厅人物") : "购买后替换大厅人物"}</h4>
                    </div>
                    {!selectedOwned ? (
                      <div className="beauty-salon__price-chip">
                        <Heart size={15} className="fill-current text-[#ff5b6a]" />
                        <strong>{selectedRole.price}</strong>
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    className={`beauty-salon__purchase-btn ${selectedOwned ? "is-owned" : ""}`}
                    onClick={handlePurchaseOrEquip}
                    disabled={!selectedOwned && wisdomBalance < selectedRole.price}
                  >
                    {!selectedOwned ? (
                      <>
                        <span>消耗</span>
                        <Heart size={16} className="fill-current text-[#ff5b6a]" />
                        <strong>{selectedRole.price}</strong>
                        <span>购买并使用</span>
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

                  <p className="beauty-salon__purchase-note">
                    未购买不会改大厅；购买成功后立即扣除悟性，并直接切换当前大厅人物。
                  </p>
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
