/*
 * 风格提醒（首页）：复古棋牌厅写实拟物。
 * 本页采用“大厅主场景 + 美容院二级界面”的结构：大厅默认保持原始皮肤；点击右侧美容院后进入二级界面；顶部横向角色导航不挤占左侧立绘展示区。
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
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/hall_base_clean_3ca5e749.png";

const INITIAL_WISDOM = 6051238;

const roles: RoleData[] = [
  {
    id: "baozhao",
    name: "大爷",
    badge: "火气型语音包",
    title: "爆点足、存在感强，适合做赢牌和催局反馈",
    stageImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/baozhao_daye_preview_v1_86005b9d.webp",
    cutoutImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/baozhao_daye_cutout_clean_c223fa3d.png",
    summary:
      "购买后大厅主形象替换为大爷版本，整体更有压场感，适合强调长沙牌桌上的热闹氛围。",
    longDescription:
      "大爷版本更适合承担高情绪反馈节点，比如摸牌、催局、胡牌和连胜提醒。视觉上保留地方棋牌厅的熟人感，语气上偏直给，能明显拉开与默认大厅人物的辨识差异。",
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
    title: "更轻社交、更外显，适合分享感和陪伴感表达",
    stageImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/supu_meituo_preview_640256ff.webp",
    cutoutImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/supu_meituo_cutout_clean_a3df0a9b.png",
    summary:
      "购买后大厅主形象替换为妹坨版本，更适合做装扮化和语音包商品化展示，氛围更轻快。",
    longDescription:
      "妹坨版本主打甜辣与陪伴感，适合承接签到、活动、赢牌鼓励等更轻互动的内容。与默认大厅相比，这个版本更像是用户主动购买后的个性化表达。",
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
    title: "沉稳熟人局气质，更适合老牌友向的地方感表达",
    stageImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/jiefang_mange_preview_eeabfb07.webp",
    cutoutImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/jiefang_mange_cutout_clean_d5f22fa9.png",
    summary:
      "购买后大厅主形象替换为满哥版本，气质更克制稳重，贴近熟人局里的仗义牌友。",
    longDescription:
      "满哥版本更适合偏成熟用户的审美与听感。语气不炸，但很有分寸，既能体现地方口吻，也不会让大厅氛围显得过于嘈杂，适合作为长期使用型角色。",
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

  const equippedRole = useMemo(
    () => roles.find((role) => role.id === equippedRoleId) ?? null,
    [equippedRoleId],
  );
  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? roles[0],
    [selectedRoleId],
  );

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const currentStageImage = equippedRole?.stageImage ?? DEFAULT_STAGE_IMAGE;
  const currentStageLabel = equippedRole ? `${equippedRole.name}已生效` : "默认大厅皮肤";
  const selectedOwned = ownedRoleIds.includes(selectedRole.id);
  const selectedEquipped = equippedRoleId === selectedRole.id;

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
    window.setTimeout(() => {
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

            {equippedRole ? (
              <div className="hall-equipped-banner">
                <Wand2 size={14} />
                <span>当前大厅人物：{equippedRole.name}</span>
              </div>
            ) : (
              <div className="hall-equipped-banner hall-equipped-banner--default">
                <Sparkles size={14} />
                <span>默认大厅皮肤，点击美容院可购买角色皮肤</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {salonOpen ? (
          <motion.div
            className="beauty-salon-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSalon}
          >
            <motion.section
              className="beauty-salon"
              initial={{ opacity: 0, y: 36, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.985 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
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
                    >
                      <strong>{role.name}</strong>
                      <span>{owned ? (equippedRoleId === role.id ? "使用中" : "已购买") : `${role.price}悟性`}</span>
                    </button>
                  );
                })}
              </div>

              <div className="beauty-salon__content">
                <div className="beauty-salon__preview">
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

                <div className="beauty-salon__detail">
                  <div className="beauty-salon__intro-card">
                    <p className="beauty-salon__label">人物介绍</p>
                    <h3>{selectedRole.title}</h3>
                    <p>{selectedRole.summary}</p>
                    <p>{selectedRole.longDescription}</p>
                  </div>

                  <div className="beauty-salon__tags">
                    {selectedRole.voiceTags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="beauty-salon__audio-card">
                    <div className="beauty-salon__audio-head">
                      <div>
                        <p className="beauty-salon__label">语音试听</p>
                        <h4>点击台词试听角色口吻</h4>
                      </div>
                      <div className="beauty-salon__audio-pill">
                        <Headphones size={15} />
                        <span>{playingLine ? "播放中" : "待播放"}</span>
                      </div>
                    </div>

                    <div className="beauty-salon__voice-list">
                      {selectedRole.previewLines.map((line) => {
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
                      规则说明：未购买时大厅保持默认不变；购买成功后立即扣除悟性值，并把大厅人物切换为当前角色皮肤。
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
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
