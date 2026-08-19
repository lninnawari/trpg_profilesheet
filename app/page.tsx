"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type Layout = "landscape" | "portrait";
type RuleRow = { name: string; gm: boolean; books: string; note: string };
type FormState = {
  name: string; handle: string; intro: string; headerColor: string; pointColor: string;
  tags: string[]; online: string[]; medium: string[]; party: string[]; length: string[];
  session: string[]; roleplay: string[]; chat: string[]; platforms: string[]; rules: string[];
  notes: string; owned: RuleRow[];
};

const OPTIONS = {
  tags: ["글", "그림", "디자인", "번역", "게임"],
  online: ["온라인", "오프라인"], medium: ["텍스트", "보이스", "화상"],
  party: ["1:1", "다인"], length: ["단기탁", "장기탁"], session: ["다회", "단편"],
  roleplay: ["룰 중심", "서사 중심", "캐릭터 중심"], chat: ["낯가림", "사담 좋아함", "바쁜 편"],
  platforms: ["온라인", "오프라인", "기타"], rules: ["CoC 7판", "인세인", "피아스코", "기타"],
} as const;

const INITIAL: FormState = {
  name: "닉네임", handle: "@아이디", intro: "한 줄 자기소개가 들어가는 영역입니다!",
  headerColor: "#dce7ff", pointColor: "#4d7fff", tags: ["글", "그림", "디자인", "번역", "게임"],
  online: ["온라인"], medium: ["텍스트", "보이스"], party: ["다인"], length: ["단기탁"],
  session: ["다회"], roleplay: ["서사 중심"], chat: ["낯가림"],
  platforms: ["온라인"], rules: ["CoC 7판"], notes: "한 줄 이상 프리와 NG를 작성해주세요!",
  owned: [
    { name: "", gm: true, books: "룰북 보유", note: "" },
    { name: "", gm: true, books: "룰북 보유", note: "" },
    { name: "", gm: false, books: "룰북 보유", note: "" },
  ],
};

const FONT = 'Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", sans-serif';
const PLAY_GROUPS = [
  ["온라인 / 오프라인", "online", OPTIONS.online], ["텍스트 / 보이스 / 화상", "medium", OPTIONS.medium],
  ["1:1 / 다인", "party", OPTIONS.party], ["단기탁 / 장기탁", "length", OPTIONS.length],
  ["다회 / 단편", "session", OPTIONS.session], ["롤플 방식", "roleplay", OPTIONS.roleplay],
  ["사담", "chat", OPTIONS.chat],
] as const;

function hexAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", ""); const r = parseInt(value.slice(0, 2), 16); const g = parseInt(value.slice(2, 4), 16); const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
function round(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = []; let line = "";
  for (const char of text) { const next = line + char; if (ctx.measureText(next).width > max && line) { lines.push(line); line = char; } else line = next; }
  if (line) lines.push(line); return lines;
}
function avatar(ctx: CanvasRenderingContext2D, image: HTMLImageElement | null, x: number, y: number, size: number, point: string) {
  ctx.fillStyle = "#edf1fa"; ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2, size / 2 + 7, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "white"; ctx.lineWidth = 8; ctx.stroke();
  if (image) { const ratio = Math.max(size / image.width, size / image.height); const w = image.width * ratio; const h = image.height * ratio; ctx.save(); ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(image, x + (size - w) / 2, y + (size - h) / 2, w, h); ctx.restore(); }
  else { ctx.fillStyle = hexAlpha(point, .2); ctx.beginPath(); ctx.arc(x + size / 2, y + size * .39, size * .17, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(x + size / 2, y + size * .91, size * .31, Math.PI, 0); ctx.fill(); }
}
function pills(ctx: CanvasRenderingContext2D, items: string[], x: number, y: number, max: number, point: string, font = 13) {
  ctx.font = `700 ${font}px ${FONT}`; let cx = x; let cy = y;
  items.forEach((item) => { const w = ctx.measureText(item).width + 22; if (cx + w > x + max) { cx = x; cy += 28; } ctx.fillStyle = hexAlpha(point, .12); round(ctx, cx, cy, w, 23, 12); ctx.fill(); ctx.fillStyle = point; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(item, cx + w / 2, cy + 12); cx += w + 6; });
  return cy + 23;
}
function heading(ctx: CanvasRenderingContext2D, title: string, x: number, y: number, point: string, size = 17) {
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = point; ctx.font = `800 ${size}px ${FONT}`; ctx.fillText(title, x, y); ctx.fillStyle = point; round(ctx, x, y + 9, 34, 3, 2); ctx.fill();
}
function playList(ctx: CanvasRenderingContext2D, form: FormState, x: number, y: number, width: number, point: string, compact = false) {
  heading(ctx, "플레이 성향", x, y, point); let cy = y + 33;
  PLAY_GROUPS.forEach(([label, key]) => { ctx.textAlign = "left"; ctx.fillStyle = "#566176"; ctx.font = `650 ${compact ? 11 : 12}px ${FONT}`; ctx.fillText(label, x, cy + 15); pills(ctx, form[key], x + (compact ? 122 : 134), cy, width - (compact ? 122 : 134), point, compact ? 10 : 11); cy += compact ? 36 : 39; });
}
function ruleTable(ctx: CanvasRenderingContext2D, rows: RuleRow[], x: number, y: number, width: number, point: string, compact = false) {
  heading(ctx, "소지 룰북 / GM 가능 여부", x, y, point, compact ? 15 : 17); const rowH = compact ? 45 : 50; const gap = compact ? 6 : 8; const start = y + 34;
  rows.slice(0, compact ? 4 : 5).forEach((row, i) => { const ry = start + i * (rowH + gap); ctx.fillStyle = "#f8f9fc"; round(ctx, x, ry, width, rowH, 9); ctx.fill(); ctx.strokeStyle = "#e7eaf0"; ctx.stroke(); ctx.fillStyle = "#667287"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.font = `600 ${compact ? 10 : 11}px ${FONT}`; ctx.fillText(row.name || "룰 이름", x + 12, ry + rowH / 2); const badgeX = x + width * .35; ctx.fillStyle = row.gm ? point : "#e6e9ef"; round(ctx, badgeX, ry + 10, compact ? 54 : 62, rowH - 20, 7); ctx.fill(); ctx.fillStyle = row.gm ? "#fff" : "#9099a8"; ctx.textAlign = "center"; ctx.fillText(row.gm ? "GM 가능" : "GM 불가", badgeX + (compact ? 27 : 31), ry + rowH / 2); ctx.fillStyle = "#657185"; ctx.textAlign = "left"; ctx.fillText(row.books, x + width * .58, ry + rowH / 2); });
}

function draw(canvas: HTMLCanvasElement, layout: Layout, form: FormState, profile: HTMLImageElement | null) {
  const [w, h] = layout === "landscape" ? [1200, 720] : [720, 1080]; canvas.width = w; canvas.height = h; const ctx = canvas.getContext("2d"); if (!ctx) return;
  ctx.fillStyle = "white"; ctx.fillRect(0, 0, w, h); const headerH = layout === "landscape" ? 190 : 220; ctx.fillStyle = form.headerColor; ctx.fillRect(0, 0, w, headerH);
  for (let i = 0; i < 20; i++) { ctx.fillStyle = "rgba(255,255,255,.38)"; ctx.beginPath(); ctx.arc(24 + (i * 91) % w, 24 + (i * 43) % (headerH - 35), 2 + i % 3, 0, Math.PI * 2); ctx.fill(); }
  const landscape = layout === "landscape"; const cardX = landscape ? 300 : 56; const cardY = landscape ? 100 : 138; const cardW = landscape ? 720 : 610; const cardH = landscape ? 165 : 175;
  ctx.shadowColor = "rgba(30,50,80,.11)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; ctx.fillStyle = "white"; round(ctx, cardX, cardY, cardW, cardH, 21); ctx.fill(); ctx.shadowColor = "transparent";
  avatar(ctx, profile, landscape ? 92 : 54, landscape ? 68 : 72, landscape ? 175 : 150, form.pointColor);
  const ix = landscape ? cardX + 46 : cardX + 166; ctx.fillStyle = form.pointColor; ctx.font = `800 ${landscape ? 27 : 23}px ${FONT}`; ctx.textAlign = "left"; ctx.fillText(form.name || "닉네임", ix, cardY + 54); const nw = ctx.measureText(form.name || "닉네임").width; ctx.fillStyle = "#9099a9"; ctx.font = `500 ${landscape ? 17 : 15}px ${FONT}`; ctx.fillText(form.handle || "@아이디", ix + nw + 15, cardY + 54);
  ctx.strokeStyle = "#e6e9ef"; ctx.beginPath(); ctx.moveTo(ix, cardY + 72); ctx.lineTo(cardX + cardW - 38, cardY + 72); ctx.stroke(); ctx.fillStyle = "#68748a"; ctx.font = `500 ${landscape ? 14 : 13}px ${FONT}`; ctx.fillText(form.intro, ix, cardY + 105); pills(ctx, form.tags, ix, cardY + 122, cardW - (ix - cardX) - 38, form.pointColor, landscape ? 11 : 10);
  if (landscape) {
    playList(ctx, form, 58, 322, 310, form.pointColor, true);
    heading(ctx, "선호 룰", 405, 322, form.pointColor); ctx.fillStyle = "#566176"; ctx.font = `650 12px ${FONT}`; ctx.fillText("플랫폼", 405, 362); pills(ctx, form.platforms, 470, 345, 215, form.pointColor, 11); ctx.fillText("룰", 405, 410); pills(ctx, form.rules, 470, 393, 215, form.pointColor, 11);
    heading(ctx, "NG / 프리", 405, 482, form.pointColor); ctx.fillStyle = "#f8f9fc"; round(ctx, 405, 503, 285, 125, 12); ctx.fill(); ctx.strokeStyle = "#e6eaf0"; ctx.stroke(); ctx.fillStyle = "#697489"; ctx.font = `500 12px ${FONT}`; wrap(ctx, form.notes, 255).slice(0, 5).forEach((line, i) => ctx.fillText(line, 420, 532 + i * 19));
    ruleTable(ctx, form.owned, 735, 322, 410, form.pointColor);
  } else {
    playList(ctx, form, 45, 350, 310, form.pointColor, true);
    heading(ctx, "선호 룰", 382, 350, form.pointColor); ctx.fillStyle = "#566176"; ctx.font = `650 11px ${FONT}`; ctx.fillText("플랫폼", 382, 392); pills(ctx, form.platforms, 442, 375, 225, form.pointColor, 10); ctx.fillText("룰", 382, 442); pills(ctx, form.rules, 442, 425, 225, form.pointColor, 10);
    heading(ctx, "NG / 프리", 382, 520, form.pointColor); ctx.fillStyle = "#f8f9fc"; round(ctx, 382, 541, 285, 130, 12); ctx.fill(); ctx.strokeStyle = "#e6eaf0"; ctx.stroke(); ctx.fillStyle = "#697489"; ctx.font = `500 11px ${FONT}`; wrap(ctx, form.notes, 255).slice(0, 5).forEach((line, i) => ctx.fillText(line, 397, 570 + i * 18));
    ruleTable(ctx, form.owned, 45, 744, 622, form.pointColor, true);
  }
  ctx.fillStyle = form.pointColor; ctx.globalAlpha = .7; ctx.textAlign = "right"; ctx.font = `700 12px ${FONT}`; ctx.fillText("#트친소", w - 28, h - 24); ctx.globalAlpha = 1;
}

function ChoiceGroup({ label, values, selected, point, onChange }: { label: string; values: readonly string[]; selected: string[]; point: string; onChange: (next: string[]) => void }) {
  return <fieldset className="choice-group"><legend>{label}</legend><div className="choice-list">{values.map((value) => { const checked = selected.includes(value); return <label className={checked ? "choice checked" : "choice"} key={value} style={checked ? ({ "--choice-color": point } as React.CSSProperties) : undefined}><input type="checkbox" checked={checked} onChange={() => onChange(checked ? selected.filter((item) => item !== value) : [...selected, value])} /><span>{value}</span></label>; })}</div></fieldset>;
}

export default function Home() {
  const [layout, setLayout] = useState<Layout>("landscape"); const [form, setForm] = useState<FormState>(INITIAL); const [profile, setProfile] = useState<HTMLImageElement | null>(null); const [fileName, setFileName] = useState(""); const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (canvasRef.current) draw(canvasRef.current, layout, form, profile); }, [layout, form, profile]);
  const dimensions = useMemo(() => layout === "landscape" ? "1200 × 720" : "720 × 1080", [layout]);
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));
  const upload = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { const image = new Image(); image.onload = () => setProfile(image); image.src = String(reader.result); }; reader.readAsDataURL(file); setFileName(file.name); };
  const editRow = (index: number, patch: Partial<RuleRow>) => update("owned", form.owned.map((row, i) => i === index ? { ...row, ...patch } : row));
  const download = () => { if (!canvasRef.current) return; const link = document.createElement("a"); link.download = `트친소-자기소개표-${layout === "landscape" ? "가로" : "세로"}.png`; link.href = canvasRef.current.toDataURL("image/png", 1); link.click(); };
  return <main>
    <header className="site-header"><a className="brand" href="#top"><span className="brand-mark">✦</span><span>트친소 메이커</span></a><p>나만의 자기소개표를 만들고 바로 저장하세요</p></header>
    <section className="hero" id="top"><span className="eyebrow">TWITTER PROFILE CARD MAKER</span><h1>취향은 또렷하게,<br />소개는 예쁘고 간단하게.</h1><p>색상과 항목을 고르고 프로필 사진을 올리면<br className="mobile-hide" /> 트친소용 이미지가 바로 완성돼요.</p></section>
    <section className="workspace" aria-label="자기소개표 만들기">
      <div className="editor-card">
        <div className="section-heading"><span>01</span><div><h2>기본 정보</h2><p>소개표에 들어갈 내용을 적어주세요.</p></div></div>
        <div className="field-grid"><label className="field"><span>닉네임</span><input value={form.name} maxLength={12} onChange={(e) => update("name", e.target.value)} /></label><label className="field"><span>아이디</span><input value={form.handle} maxLength={20} onChange={(e) => update("handle", e.target.value)} /></label><label className="field field-full"><span>한 줄 자기소개</span><input value={form.intro} maxLength={55} onChange={(e) => update("intro", e.target.value)} /></label></div>
        <div className="divider" /><div className="section-heading"><span>02</span><div><h2>컬러 & 사진</h2><p>헤더는 단색으로, 포인트는 원하는 색으로 꾸며보세요.</p></div></div>
        <div className="custom-row"><label className="color-field"><span>헤더 단색</span><span className="color-input"><input type="color" value={form.headerColor} onChange={(e) => update("headerColor", e.target.value)} /><b>{form.headerColor.toUpperCase()}</b></span></label><label className="color-field"><span>포인트색</span><span className="color-input"><input type="color" value={form.pointColor} onChange={(e) => update("pointColor", e.target.value)} /><b>{form.pointColor.toUpperCase()}</b></span></label><label className="upload"><input type="file" accept="image/*" onChange={upload} /><span>프로필 사진 업로드</span><small>{fileName || "JPG, PNG"}</small></label></div>
        <div className="divider" /><div className="section-heading"><span>03</span><div><h2>프로필 태그</h2><p>닉네임 카드 아래에 표시할 태그를 선택하세요.</p></div></div><ChoiceGroup label="관심 분야" values={OPTIONS.tags} selected={form.tags} point={form.pointColor} onChange={(next) => update("tags", next)} />
        <div className="divider" /><div className="section-heading"><span>04</span><div><h2>플레이 성향</h2><p>해당하는 항목을 모두 선택하세요.</p></div></div>
        <div className="choices-grid play-choices">{PLAY_GROUPS.map(([label, key, values]) => <ChoiceGroup key={key} label={label} values={values} selected={form[key]} point={form.pointColor} onChange={(next) => update(key, next)} />)}</div>
        <div className="divider" /><div className="section-heading"><span>05</span><div><h2>선호 룰</h2><p>주로 이용하는 플랫폼과 룰을 선택하세요.</p></div></div>
        <div className="choices-grid"><ChoiceGroup label="플랫폼" values={OPTIONS.platforms} selected={form.platforms} point={form.pointColor} onChange={(next) => update("platforms", next)} /><ChoiceGroup label="룰" values={OPTIONS.rules} selected={form.rules} point={form.pointColor} onChange={(next) => update("rules", next)} /></div>
        <label className="field notes-field"><span>NG / 프리</span><textarea value={form.notes} maxLength={140} onChange={(e) => update("notes", e.target.value)} /></label>
        <div className="divider" /><div className="section-heading"><span>06</span><div><h2>소지 룰북 / GM 가능 여부</h2><p>보유한 룰과 마스터링 가능 여부를 적어주세요.</p></div></div>
        <div className="rule-editor">{form.owned.map((row, index) => <div className="rule-editor-row" key={index}><input aria-label={`${index + 1}번째 룰 이름`} placeholder="룰 이름" value={row.name} onChange={(e) => editRow(index, { name: e.target.value })} /><button type="button" className={row.gm ? "gm active" : "gm"} style={row.gm ? { background: form.pointColor } : undefined} onClick={() => editRow(index, { gm: !row.gm })}>{row.gm ? "GM 가능" : "GM 불가"}</button><select aria-label={`${index + 1}번째 룰북 보유 상태`} value={row.books} onChange={(e) => editRow(index, { books: e.target.value })}><option>룰북 보유</option><option>기본 룰북</option><option>전부 보유</option><option>미보유</option></select><input aria-label={`${index + 1}번째 비고`} placeholder="비고 (세션 예정 등)" value={row.note} onChange={(e) => editRow(index, { note: e.target.value })} /><button type="button" className="remove-row" aria-label="행 삭제" onClick={() => update("owned", form.owned.filter((_, i) => i !== index))}>×</button></div>)}</div>
        <button type="button" className="add-row" onClick={() => update("owned", [...form.owned, { name: "", gm: false, books: "룰북 보유", note: "" }])}>＋ 항목 추가</button>
      </div>
      <aside className="preview-panel"><div className="preview-toolbar"><div><span className="live-dot" /> 실시간 미리보기 <small>{dimensions}px</small></div><div className="layout-switch"><button className={layout === "landscape" ? "active" : ""} onClick={() => setLayout("landscape")}>가로형</button><button className={layout === "portrait" ? "active" : ""} onClick={() => setLayout("portrait")}>세로형</button></div></div><div className={`canvas-frame ${layout}`}><canvas ref={canvasRef} aria-label="완성된 자기소개표 미리보기" /></div><button className="download" onClick={download} style={{ backgroundColor: form.pointColor }}>↓ PNG 이미지로 저장하기</button><p className="privacy">사진과 입력 내용은 서버에 저장되지 않아요.</p></aside>
    </section><footer><span>✦</span> 트친소 메이커 <small>© 2026 · Made for your timeline</small></footer>
  </main>;
}
