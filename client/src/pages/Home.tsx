/*
 * 风格提醒（首页）：复古棋牌厅写实拟物。
 * 目标：除人物与账号框外，其余大厅界面尽量保持原样；页面应以原始大厅单屏沉浸感为主，不额外制造网页侧栏结构。
 */
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Sparkles, Trophy, UserRound, Volume2, X } from "lucide-react";

type RoleScene = {
  id: string;
  name: string;
  badge: string;
  title: string;
  image: string;
  summary: string;
  style: string;
  voiceTags: string[];
};

type PanelKey = "avatar" | "voice" | "store" | "growth" | null;

const scenes: RoleScene[] = [
  {
    id: "baozhao",
    name: "爆燥大爷",
    badge: "火气型人设",
    title: "进场就有压场感的长沙狠角色",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/baozhao_daye_preview_v1_a55db313.webp",
    summary:
      "适合强调气场、爆点和高辨识度语音反馈，进入大厅时第一眼就能让用户感受到角色存在感。",
    style: "赤褐火光、粗粝日常、强情绪反馈",
    voiceTags: ["开局吼场", "胡牌嘲讽", "催局抱怨"],
  },
  {
    id: "supu",
    name: "塑普妹坨",
    badge: "甜辣型人设",
    title: "更外显、更轻社交感的长沙角色包装",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/supu_meituo_preview_bf9f3d83.webp",
    summary:
      "适合承接语音包商品化与装扮化表达，账号框和人物存在感更强，更容易做出购买与展示动机。",
    style: "糖感高光、轻泡泡粒子、社交外显",
    voiceTags: ["撒娇播报", "连胡庆祝", "亲昵称呼"],
  },
  {
    id: "jiefang",
    name: "解放满哥",
    badge: "江湖型人设",
    title: "稳重里带点狠劲的地方牌桌熟面孔",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/jiefang_mange_preview_7bed5d31.webp",
    summary:
      "适合做成熟用户偏好的方言语音包形象，整体更贴近地方棋牌语境，也更利于沉淀角色系列化。",
    style: "砖红织锦、老派气场、克制张力",
    voiceTags: ["沉稳报听", "赢牌调侃", "熟人局招呼"],
  },
];

const panelContent: Record<Exclude<PanelKey, null>, { label: string; title: string; icon: typeof UserRound; desc: string }> = {
  avatar: {
    label: "账号框",
    title: "角色化账号框",
    icon: UserRound,
    desc: "这里保留原位置与原使用逻辑，只替换为对应角色的头像框表达。后续可以继续补角色专属边框动效与身份标签。",
  },
  voice: {
    label: "语音包",
    title: "长沙人设语音包",
    icon: Volume2,
    desc: "当前体验版先把角色性格、方言腔调与局内播报想象绑定。后续可继续接试看、购买、装备和局内触发反馈。",
  },
  store: {
    label: "商城购买",
    title: "商品化入口",
    icon: ShoppingBag,
    desc: "正式版本可以从这里拉起购买弹层，完成试看、支付、装备、生效的闭环，保持路径清晰直达。",
  },
  growth: {
    label: "成长展示",
    title: "成长与身份表达",
    icon: Trophy,
    desc: "后续可接皮肤图鉴、收藏进度、角色关系与专属语音成就，强化长期留存与付费理由。",
  },
};

export default function Home() {
  const [activeSceneId, setActiveSceneId] = useState<RoleScene["id"]>(scenes[0].id);
  const [activePanel, setActivePanel] = useState<PanelKey>(null);

  const activeScene = useMemo(
    () => scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0],
    [activeSceneId],
  );

  const panel = activePanel ? panelContent[activePanel] : null;
  const PanelIcon = panel?.icon;

  return (
    <main className="hall-shell min-h-screen overflow-hidden text-stone-100">
      <div className="hall-shell__grain" aria-hidden="true" />

      <section className="hall-viewer mx-auto flex min-h-screen w-full max-w-[1720px] flex-col justify-center px-3 py-4 md:px-5 xl:px-8">
        <div className="hall-stage-wrapper hall-stage-wrapper--immersive mx-auto w-full">
          <div className="hall-stage hall-stage--immersive">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeScene.id}
                src={activeScene.image}
                alt={activeScene.name}
                className="hall-stage__image"
                initial={{ opacity: 0.2, scale: 1.008 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.16, scale: 0.995 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              />
            </AnimatePresence>

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
                const active = scene.id === activeScene.id;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    className={`hall-role-pills__item ${active ? "is-active" : ""}`}
                    onClick={() => setActiveSceneId(scene.id)}
                  >
                    <strong>{scene.name}</strong>
                    <span>{scene.badge}</span>
                  </button>
                );
              })}
            </div>

            <div className="hall-bottom-note">
              <span className="hall-bottom-note__badge">高还原体验版</span>
              <p>当前仅替换人物与账号框，其他区域尽量保持原始大厅表达。点击人物、账号框、道具店与奖杯位可查看说明。</p>
            </div>
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
                  <span className="hall-modal__tag">当前角色</span>
                  <strong>{activeScene.name}</strong>
                  <small>{activeScene.title}</small>
                </div>

                <p className="hall-modal__desc">{panel.desc}</p>
                <p className="hall-modal__desc">{activeScene.summary}</p>

                <div className="hall-modal__spark">
                  <Sparkles size={16} />
                  <span>{activeScene.style}</span>
                </div>

                <div className="hall-modal__tags">
                  {activeScene.voiceTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
