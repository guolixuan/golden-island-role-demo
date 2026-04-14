export type RoleData = {
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

export const roles: RoleData[] = [
  {
    id: "baozhao",
    name: "老先生",
    badge: "排面型语音包",
    title: "老长沙老派绅士，输赢都要有腔调，适合喜欢讲排面风格的玩家",
    stageImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/baozhao_daye_preview_v1_86005b9d.webp",
    cutoutImage: "/baozhao-cutout-new.png",
    summary: "适合想让大厅更有腔调、更有老派绅士气质的玩家。购买后立即生效。",
    longDescription:
      "老先生语音包克制有礼、赢了不嚣张、输了不失态，整体听感沉稳讲究，适合喜欢有品位、有排面角色的玩家。",
    style: "老长沙绅士风、稳中有腔调",
    price: 1888,
    voiceTags: ["赢牌有腔调", "输了不失礼", "催局有底气"],
    previewLines: ["莫急，好牌自然来。", "这局我赢得漂亮，诸位服不服？", "输了不要紧，下把再来过。", "搞快点咯，时间宝贵得很。"],
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
    cutoutImage: "/supu-cutout-local.png",
    summary: "适合想让大厅氛围更轻快、更亲切的玩家。购买后立即生效。",
    longDescription:
      "妹坨语音包更偏轻松陪伴和赢牌鼓励，适合喜欢柔和一点、社交感更强的玩家。",
    style: "甜辣长沙妹、轻松社交风",
    price: 1688,
    voiceTags: ["甜嘴上桌", "赢了要庆祝", "输了求放过"],
    previewLines: ["哎呀，真给我摸到咯，运气也太好哒吧！", "底裤都要输脱哒，老板手下留情咯。", "就差一口气咧，急死人家哒。", "你们怎么都盯着我打呀，过分咯。"],
    speechRate: 1.05,
    speechPitch: 1.15,
  },
  {
    id: "mange",
    name: "运哥",
    badge: "运筹型语音包",
    title: "年轻自信、懂局势、气场稳，适合喜欢掌控全局风格的玩家",
    stageImage:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663532081903/G2cnixsTWzfPN8YrPedaFH/jiefang_mange_preview_eeabfb07.webp",
    cutoutImage: "/mange-cutout-new.png",
    summary: "适合想让大厅更有气场、更有运筹帷幄感的玩家。购买后立即生效。",
    longDescription:
      "运哥语音包自信沉稳、上桌先看气场，赢牌不慌输牌不乱，适合喜欢掌控节奏、有点玄学气质的玩家。",
    style: "中式少壮派、运筹帷幄感",
    price: 2088,
    voiceTags: ["气场先到", "运筹帷幄", "赢了不慌"],
    previewLines: ["今天气场到位，这把我稳了。", "莫看我年轻，牌桌上我认得路。", "手气这个东西，信则有。", "搞快点，机会不等人咯。"],
    speechRate: 0.9,
    speechPitch: 0.85,
  },
];
