"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type Layout = "landscape" | "portrait";
type FormState = {
  name: string; handle: string; intro: string; headerColor: string; pointColor: string;
  relation: string[]; style: string[]; genres: string[]; platform: string[]; age: string[];
  notes: string; links: string;
};

const INITIAL: FormState = {
  name: "너네임", handle: "@your_id", intro: "함께 오래 즐겁게 덕질할 트친을 찾고 있어요!",
  headerColor: "#dce7ff", pointColor: "#4d7fff", relation: ["트친", "맞팔"],
  style: ["느긋하게", "교류 중심", "마음 위주"], genres: ["게임", "일상"],
  platform: ["PC", "모바일"], age: ["성인"],
  notes: "서로의 취향을 존중해요. 무례한 언행은 어려워요.",
  links: "프로필 링크 또는 좋아하는 작품을 적어주세요.",
};

const OPTIONS = {
  relation: ["트친", "맞팔", "선팔", "흔적", "무관"],
  style: ["느긋하게", "교류 중심", "마음 위주", "멘션 위주", "잡담 좋아요"],
  genres: ["게임", "일상", "그림", "글", "커미션", "2차 창작"],
  platform: ["PC", "콘솔", "모바일", "TRPG", "보드게임"],
  age: ["성인", "미성년", "나이 무관"],
} as const;

const FONT = 'Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", sans-serif';

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
}
function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath(); ctx.roundRect(x, y, width, height, radius);
}
function coverImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, size: number) {
  const ratio = Math.max(size / image.width, size / image.height);
  const width = image.width * ratio; const height = image.height * ratio;
  ctx.save(); ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(image, x + (size - width) / 2, y + (size - height) / 2, width, height); ctx.restore();
}
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = []; let current = "";
  for (const character of text) {
    const test = current + character;
    if (ctx.measureText(test).width > maxWidth && current) { lines.push(current); current = character; } else current = test;
  }
  if (current) lines.push(current); return lines;
}
function drawPills(ctx: CanvasRenderingContext2D, items: string[], x: number, y: number, maxWidth: number, point: string, scale: number) {
  ctx.font = `600 ${14 * scale}px ${FONT}`; let cursorX = x; let cursorY = y;
  const height = 30 * scale; const gap = 8 * scale;
  items.forEach((item) => {
    const width = ctx.measureText(item).width + 26 * scale;
    if (cursorX + width > x + maxWidth) { cursorX = x; cursorY += height + gap; }
    ctx.fillStyle = withAlpha(point, 0.12); roundedRect(ctx, cursorX, cursorY, width, height, 15 * scale); ctx.fill();
    ctx.fillStyle = point; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(item, cursorX + width / 2, cursorY + height / 2 + scale); cursorX += width + gap;
  });
  return cursorY + height;
}
function drawSection(ctx: CanvasRenderingContext2D, title: string, items: string[], x: number, y: number, width: number, point: string, scale: number) {
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#17243b"; ctx.font = `800 ${18 * scale}px ${FONT}`; ctx.fillText(title, x, y);
  ctx.fillStyle = point; roundedRect(ctx, x, y + 10 * scale, 36 * scale, 4 * scale, 2 * scale); ctx.fill();
  return drawPills(ctx, items, x, y + 28 * scale, width, point, scale);
}
function drawNote(ctx: CanvasRenderingContext2D, title: string, note: string, x: number, y: number, width: number, point: string, scale: number) {
  ctx.textAlign = "left"; ctx.fillStyle = "#17243b"; ctx.font = `800 ${18 * scale}px ${FONT}`; ctx.fillText(title, x, y);
  ctx.fillStyle = "#f7f9fc"; roundedRect(ctx, x, y + 16 * scale, width, 100 * scale, 14 * scale); ctx.fill();
  ctx.strokeStyle = "#e5eaf2"; ctx.lineWidth = scale; ctx.stroke(); ctx.fillStyle = "#536078"; ctx.font = `500 ${14 * scale}px ${FONT}`;
  wrapText(ctx, note, width - 30 * scale).slice(0, 4).forEach((line, index) => ctx.fillText(line, x + 15 * scale, y + (46 + index * 20) * scale));
}

function drawCanvas(canvas: HTMLCanvasElement, layout: Layout, form: FormState, profile: HTMLImageElement | null) {
  const [width, height] = layout === "landscape" ? [1200, 720] : [720, 1080];
  canvas.width = width; canvas.height = height; const ctx = canvas.getContext("2d"); if (!ctx) return;
  const scale = layout === "landscape" ? 1 : 0.9; const point = form.pointColor;
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, width, height);
  const headerHeight = layout === "landscape" ? 190 : 220; ctx.fillStyle = form.headerColor; ctx.fillRect(0, 0, width, headerHeight);
  for (let i = 0; i < 18; i += 1) { ctx.fillStyle = "rgba(255,255,255,.36)"; ctx.beginPath(); ctx.arc(40 + ((i * 89) % width), 32 + ((i * 47) % Math.max(50, headerHeight - 60)), 2 + (i % 3), 0, Math.PI * 2); ctx.fill(); }

  const cardX = layout === "landscape" ? 315 : 62; const cardY = layout === "landscape" ? 105 : 140;
  const cardW = layout === "landscape" ? 690 : 596; const cardH = layout === "landscape" ? 160 : 170;
  ctx.shadowColor = "rgba(28,46,80,.10)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; ctx.fillStyle = "#ffffff"; roundedRect(ctx, cardX, cardY, cardW, cardH, 22); ctx.fill(); ctx.shadowColor = "transparent";
  const avatarSize = layout === "landscape" ? 170 : 150; const avatarX = layout === "landscape" ? 105 : 60; const avatarY = layout === "landscape" ? 75 : 78;
  ctx.fillStyle = "#eef2fb"; ctx.beginPath(); ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 7, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 8; ctx.stroke();
  if (profile) coverImage(ctx, profile, avatarX, avatarY, avatarSize); else {
    ctx.fillStyle = withAlpha(point, 0.22); ctx.beginPath(); ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize * 0.4, avatarSize * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize * 0.92, avatarSize * 0.32, Math.PI, 0); ctx.fill();
  }
  const infoX = layout === "landscape" ? cardX + 48 : cardX + 170;
  ctx.fillStyle = point; ctx.font = `800 ${layout === "landscape" ? 27 : 23}px ${FONT}`; ctx.textAlign = "left"; ctx.fillText(form.name || "이름", infoX, cardY + 54);
  const nameWidth = ctx.measureText(form.name || "이름").width; ctx.fillStyle = "#8a94a7"; ctx.font = `500 ${layout === "landscape" ? 18 : 16}px ${FONT}`; ctx.fillText(form.handle || "@your_id", infoX + nameWidth + 16, cardY + 54);
  ctx.strokeStyle = "#e6eaf1"; ctx.beginPath(); ctx.moveTo(infoX, cardY + 72); ctx.lineTo(cardX + cardW - 42, cardY + 72); ctx.stroke();
  ctx.fillStyle = "#657085"; ctx.font = `500 ${layout === "landscape" ? 16 : 14}px ${FONT}`;
  wrapText(ctx, form.intro, cardW - (infoX - cardX) - 65).slice(0, 2).forEach((line, index) => ctx.fillText(line, infoX, cardY + 108 + index * 23));
  if (layout === "landscape") {
    drawSection(ctx, "관계 성향", form.relation, 75, 325, 260, point, 1); drawSection(ctx, "선호 & 관심사", form.genres, 390, 325, 310, point, 1); drawSection(ctx, "플랫폼", form.platform, 760, 325, 360, point, 1);
    drawSection(ctx, "교류 스타일", form.style, 75, 475, 260, point, 1); drawSection(ctx, "연령", form.age, 390, 475, 310, point, 1); drawNote(ctx, "NG / 프리", form.notes, 760, 475, 360, point, 1);
    ctx.fillStyle = "#9ba4b4"; ctx.font = `500 13px ${FONT}`; ctx.fillText(form.links, 75, 682);
  } else {
    drawSection(ctx, "관계 성향", form.relation, 58, 355, 280, point, scale); drawSection(ctx, "선호 & 관심사", form.genres, 390, 355, 270, point, scale);
    drawSection(ctx, "교류 스타일", form.style, 58, 525, 280, point, scale); drawSection(ctx, "플랫폼", form.platform, 390, 525, 270, point, scale);
    drawSection(ctx, "연령", form.age, 58, 735, 280, point, scale); drawNote(ctx, "NG / 프리", form.notes, 390, 735, 270, point, scale);
    ctx.fillStyle = "#f7f9fc"; roundedRect(ctx, 58, 940, 604, 70, 14); ctx.fill(); ctx.fillStyle = "#7e899d"; ctx.font = `500 13px ${FONT}`;
    wrapText(ctx, form.links, 564).slice(0, 2).forEach((line, index) => ctx.fillText(line, 78, 970 + index * 19));
  }
  ctx.fillStyle = point; ctx.globalAlpha = 0.72; ctx.font = `700 ${layout === "landscape" ? 13 : 12}px ${FONT}`; ctx.textAlign = "right"; ctx.fillText("#트친소", width - 34, height - 28); ctx.globalAlpha = 1;
}

function ChoiceGroup({ label, values, selected, point, onChange }: { label: string; values: readonly string[]; selected: string[]; point: string; onChange: (next: string[]) => void }) {
  return <fieldset className="choice-group"><legend>{label}</legend><div className="choice-list">{values.map((value) => {
    const checked = selected.includes(value);
    return <label className={checked ? "choice checked" : "choice"} key={value} style={checked ? ({ "--choice-color": point } as React.CSSProperties) : undefined}>
      <input type="checkbox" checked={checked} onChange={() => onChange(checked ? selected.filter((item) => item !== value) : [...selected, value])} /><span>{value}</span>
    </label>;
  })}</div></fieldset>;
}

export default function Home() {
  const [layout, setLayout] = useState<Layout>("landscape"); const [form, setForm] = useState<FormState>(INITIAL);
  const [profile, setProfile] = useState<HTMLImageElement | null>(null); const [fileName, setFileName] = useState(""); const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (canvasRef.current) drawCanvas(canvasRef.current, layout, form, profile); }, [layout, form, profile]);
  const dimensions = useMemo(() => layout === "landscape" ? "1200 × 720" : "720 × 1080", [layout]);
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));
  const handleProfile = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { const image = new Image(); image.onload = () => setProfile(image); image.src = String(reader.result); }; reader.readAsDataURL(file); setFileName(file.name); };
  const download = () => { const canvas = canvasRef.current; if (!canvas) return; const link = document.createElement("a"); link.download = `트친소-자기소개표-${layout === "landscape" ? "가로" : "세로"}.png`; link.href = canvas.toDataURL("image/png", 1); link.click(); };

  return <main>
    <header className="site-header"><a className="brand" href="#top" aria-label="처음으로"><span className="brand-mark" aria-hidden="true">✦</span><span>트친소 메이커</span></a><p>나만의 자기소개표를 만들고 바로 저장하세요</p></header>
    <section className="hero" id="top"><span className="eyebrow">TWITTER PROFILE CARD MAKER</span><h1>취향은 또렷하게,<br />소개는 예쁘고 간단하게.</h1><p>색상과 항목을 고르고 프로필 사진을 올리면<br className="mobile-hide" /> 트친소용 이미지가 바로 완성돼요.</p></section>
    <section className="workspace" aria-label="자기소개표 만들기">
      <div className="editor-card">
        <div className="section-heading"><span>01</span><div><h2>기본 정보</h2><p>소개표에 들어갈 내용을 적어주세요.</p></div></div>
        <div className="field-grid"><label className="field"><span>이름</span><input value={form.name} maxLength={12} onChange={(e) => update("name", e.target.value)} /></label><label className="field"><span>아이디</span><input value={form.handle} maxLength={20} onChange={(e) => update("handle", e.target.value)} /></label><label className="field field-full"><span>한 줄 소개</span><input value={form.intro} maxLength={55} onChange={(e) => update("intro", e.target.value)} /></label></div>
        <div className="divider" /><div className="section-heading"><span>02</span><div><h2>컬러 & 사진</h2><p>원하는 분위기로 꾸며보세요.</p></div></div>
        <div className="custom-row"><label className="color-field"><span>헤더 단색</span><span className="color-input"><input type="color" value={form.headerColor} onChange={(e) => update("headerColor", e.target.value)} /><b>{form.headerColor.toUpperCase()}</b></span></label><label className="color-field"><span>포인트색</span><span className="color-input"><input type="color" value={form.pointColor} onChange={(e) => update("pointColor", e.target.value)} /><b>{form.pointColor.toUpperCase()}</b></span></label><label className="upload"><input type="file" accept="image/*" onChange={handleProfile} /><span>프로필 사진 업로드</span><small>{fileName || "JPG, PNG"}</small></label></div>
        <div className="divider" /><div className="section-heading"><span>03</span><div><h2>나의 취향</h2><p>해당하는 항목을 모두 선택하세요.</p></div></div>
        <div className="choices-grid"><ChoiceGroup label="관계 성향" values={OPTIONS.relation} selected={form.relation} point={form.pointColor} onChange={(next) => update("relation", next)} /><ChoiceGroup label="선호 & 관심사" values={OPTIONS.genres} selected={form.genres} point={form.pointColor} onChange={(next) => update("genres", next)} /><ChoiceGroup label="교류 스타일" values={OPTIONS.style} selected={form.style} point={form.pointColor} onChange={(next) => update("style", next)} /><ChoiceGroup label="플랫폼" values={OPTIONS.platform} selected={form.platform} point={form.pointColor} onChange={(next) => update("platform", next)} /><ChoiceGroup label="연령" values={OPTIONS.age} selected={form.age} point={form.pointColor} onChange={(next) => update("age", next)} /></div>
        <div className="text-grid"><label className="field"><span>NG / 프리</span><textarea value={form.notes} maxLength={90} onChange={(e) => update("notes", e.target.value)} /></label><label className="field"><span>링크 / 기타</span><textarea value={form.links} maxLength={90} onChange={(e) => update("links", e.target.value)} /></label></div>
      </div>
      <aside className="preview-panel"><div className="preview-toolbar"><div><span className="live-dot" /> 실시간 미리보기 <small>{dimensions}px</small></div><div className="layout-switch" role="group" aria-label="이미지 방향"><button className={layout === "landscape" ? "active" : ""} onClick={() => setLayout("landscape")} aria-pressed={layout === "landscape"}>가로형</button><button className={layout === "portrait" ? "active" : ""} onClick={() => setLayout("portrait")} aria-pressed={layout === "portrait"}>세로형</button></div></div><div className={`canvas-frame ${layout}`}><canvas ref={canvasRef} aria-label="완성된 자기소개표 미리보기" /></div><button className="download" onClick={download} style={{ backgroundColor: form.pointColor }}><span>↓</span> PNG 이미지로 저장하기</button><p className="privacy">사진과 입력 내용은 서버에 저장되지 않아요.</p></aside>
    </section>
    <footer><span>✦</span> 트친소 메이커 <small>© 2026 · Made for your timeline</small></footer>
  </main>;
}
