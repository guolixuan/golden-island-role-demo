/*
 * 风格提醒（首页）：复古棋牌厅写实拟物。
 * 目标：大厅默认保持原始皮肤，只有在玩家购买角色语音包后才切换到对应角色预览；顶部切换按钮采用更短简称，避免破坏原界面秩序。
 */
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Sparkles, Trophy, UserRound, Volume2, X } from "lucide-react";

type RoleScene = {
  id: string;
  name: string;
  badge: string;
  title: string;
  stageImage: string;
  summary: string;
  style: string;
  voiceTags: string[];
};

type PanelKey = "avatar" | "voice" | "store" | "growth" | null;

const DEFAULT_STAGE_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/hall_base_clean_3ca5e749.png";

const scenes: RoleScene[] = [
  {
    id: "baozhao",
    name: "大爷",
    badge: "火气型语音包",
    title: "购买后替换为更有压场感的长沙熟面孔版本",
    stageImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/baozhao_daye_preview_v1_86005b9d.webp",
    summary:
      "适合强调气场、爆点和高辨识度语音反馈。购买后大厅主形象会切换到更有分量的大爷版本，局内播报也更有冲击力。",
    style: "赤褐烟雾、粗粝日常、强辨识度反馈",
    voiceTags: ["开局吼场", "胡牌调侃", "催局抱怨"],
  },
  {
    id: "supu",
    name: "妹坨",
    badge: "甜辣型语音包",
    title: "购买后替换为更外显、更轻社交感的长沙角色包装",
    stageImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/supu_meituo_preview_640256ff.webp",
    summary:
      "适合承接语音包商品化与装扮化表达。购买后大厅会显示妹坨版本主形象，更适合做展示与分享。",
    style: "糖感高光、轻泡泡粒子、社交外显",
    voiceTags: ["撒娇播报", "连胡庆祝", "亲昵称呼"],
  },
  {
    id: "mange",
    name: "满哥",
    badge: "江湖型语音包",
    title: "购买后替换为更稳重仗义的地方牌桌熟面孔",
    stageImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/jiefang_mange_preview_eeabfb07.webp",
    summary:
      "适合成熟用户偏好的方言语音包形象。购买后大厅会显示更克制沉稳的满哥版本，人物气质更贴近熟人局语境。",
    style: "砖红织锦、老派气场、克制张力",
    voiceTags: ["沉稳报听", "赢牌调侃", "熟人局招呼"],
  },
];

const panelContent: Record<Exclude<PanelKey, null>, { label: string; title: string; icon: typeof UserRound; desc: string }> = {
  avatar: {
    label: "账号框",
    title: "角色化账号框",
    icon: UserRound,
    desc: "账号区仍保持原始大厅秩序。只有在购买并启用对应语音包后，才进入角色化展示，不影响默认皮肤状态下的界面完整性。",
  },
  voice: {
    label: "语音包",
    title: "长沙人设语音包",
    icon: Volume2,
    desc: "当前体验版将角色性格、方言腔调与局内播报想象绑定。未购买前只展示默认大厅；购买后才切换到对应角色视觉。",
  },
  store: {
    label: "商城购买",
    title: "购买后解锁角色展示",
    icon: ShoppingBag,
    desc: "现在默认保持原本大厅皮肤。玩家购买任意一个角色语音包后，对应角色才会在大厅中出现，并可继续切换已拥有的角色版本。",
  },
  growth: {
    label: "成长展示",
    title: "成长与身份表达",
    icon: Trophy,
    desc: "后续可接皮肤图鉴、收藏进度、角色关系与专属语音成就，强化长期留存与付费理由。",
  },
};

export default function Home() {
  const [ownedRoleIds, setOwnedRoleIds] = useState<RoleScene["id"][]>([]);
  const [activeSceneId, setActiveSceneId] = useState<RoleScene["id"] | null>(null);
  const [activePanel, setActivePanel] = useState<PanelKey>(null);

  const activeScene = useMemo(
    () => scenes.find((scene) => scene.id === activeSceneId) ?? null,
    [activeSceneId],
  );

  const panel = activePanel ? panelContent[activePanel] : null;
  const PanelIcon = panel?.icon;
  const hasPurchasedAnyRole = ownedRoleIds.length > 0;

  const currentStageImage = activeScene?.stageImage ?? DEFAULT_STAGE_IMAGE;
  const currentStageLabel = activeScene?.name ?? "默认皮肤";
  const currentStageTitle =
    activeScene?.title ?? "玩家未购买角色语音包前，保持原本大厅默认皮肤，不额外展示角色包装。";
  const currentStageSummary =
    activeScene?.summary ?? "当前优先保留系统原生大厅观感，避免上方账号区和下方游戏图标被额外角色层遮挡。";
  const currentStageStyle = activeScene?.style ?? "原生大厅、默认皮肤、购买后解锁角色展示";
  const currentVoiceTags = activeScene?.voiceTags ?? ["默认皮肤", "购买后解锁", "保持原版大厅"];

  const handleRoleClick = (scene: RoleScene) => {
    if (ownedRoleIds.includes(scene.id)) {
      setActiveSceneId(scene.id);
      return;
    }

    setActivePanel("store");
  };

  const handlePurchase = (sceneId: RoleScene["id"]) => {
    setOwnedRoleIds((prev) => (prev.includes(sceneId) ? prev : [...prev, sceneId]));
    setActiveSceneId(sceneId);
    setActivePanel(null);
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
              className="hall-hotspot hall-hotspot--avatar"
              onClick={() => setActivePanel("avatar")}
              aria-label="查看账号框设定"
            />
            <button
              type="button"
              className="hall-hotspot hall-hotspot--character"
              onClick={() => setActivePanel("voice")}
              aria-label="查看人物与语音包设定"
            />
            <button
              type="button"
              className="hall-hotspot hall-hotspot--store"
              onClick={() => setActivePanel("store")}
              aria-label="查看商城链路设定"
            />
            <button
              type="button"
              className="hall-hotspot hall-hotspot--rank"
              onClick={() => setActivePanel("growth")}
              aria-label="查看成长展示设定"
            />

            <div className="hall-role-pills" aria-label="角色切换">
              {scenes.map((scene) => {
                const active = scene.id === activeScene?.id;
                const owned = ownedRoleIds.includes(scene.id);

                return (
                  <button
                    key={scene.id}
                    type="button"
                    className={`hall-role-pills__item ${active ? "is-active" : ""}`}
                    onClick={() => handleRoleClick(scene)}
                    aria-label={owned ? `切换到${scene.name}` : `购买${scene.name}后解锁`}
                  >
                    <strong>{scene.name}</strong>
                    <span>{owned ? (active ? "当前展示" : "已拥有") : "购买后解锁"}</span>
                  </button>
                );
              })}
            </div>

            {!hasPurchasedAnyRole ? (
              <div className="pointer-events-none absolute left-1/2 top-[10.5%] z-[6] -translate-x-1/2 rounded-full border border-amber-300/28 bg-stone-950/55 px-4 py-2 text-center text-[11px] font-semibold tracking-[0.24em] text-amber-100/92 shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-sm md:text-[12px]">
                默认展示原皮大厅，购买任意角色后解锁人物展示
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {panel && PanelIcon ? (
          <motion.div
            className="hall-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePanel(null)}
          >
            <motion.section
              className="hall-modal"
              initial={{ opacity: 0, y: 26, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 26, scale: 0.985 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="hall-modal__header">
                <div className="hall-modal__titlewrap">
                  <span className="hall-modal__icon">
                    <PanelIcon size={18} />
                  </span>
                  <div>
                    <p>{panel.label}</p>
                    <h2>{panel.title}</h2>
                  </div>
                </div>
                <button type="button" className="hall-modal__close" onClick={() => setActivePanel(null)} aria-label="关闭说明弹层">
                  <X size={18} />
                </button>
              </div>

              <div className="hall-modal__body">
                <div className="hall-modal__roleline">
                  <span className="hall-modal__tag">当前展示</span>
                  <strong>{currentStageLabel}</strong>
                  <small>{currentStageTitle}</small>
                </div>

                <p className="hall-modal__desc">{panel.desc}</p>
                <p className="hall-modal__desc">{currentStageSummary}</p>

                <div className="hall-modal__spark">
                  <Sparkles size={16} />
                  <span>{currentStageStyle}</span>
                </div>

                <div className="hall-modal__tags">
                  {currentVoiceTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                {activePanel === "store" ? (
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {scenes.map((scene) => {
                      const owned = ownedRoleIds.includes(scene.id);

                      return (
                        <button
                          key={scene.id}
                          type="button"
                          onClick={() => handlePurchase(scene.id)}
                          className={`rounded-[24px] border px-4 py-4 text-left transition duration-200 ${
                            owned
                              ? "border-amber-300/55 bg-amber-200/14 shadow-[0_12px_30px_rgba(255,201,92,0.12)]"
                              : "border-white/10 bg-stone-900/70 hover:border-amber-300/40 hover:bg-stone-900/88"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <strong className="block text-base font-black tracking-[0.08em] text-stone-100">{scene.name}</strong>
                              <span className="mt-1 block text-xs tracking-[0.16em] text-stone-300/78">{scene.badge}</span>
                            </div>
                            <span className="rounded-full border border-amber-300/30 bg-amber-200/10 px-2 py-1 text-[10px] font-bold tracking-[0.16em] text-amber-100/92">
                              {owned ? "已拥有" : "模拟购买"}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-stone-300/88">{scene.title}</p>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
