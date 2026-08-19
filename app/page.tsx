"use client";

import { useState } from "react";

type Rulebook = {
  name: string;
  canGM: boolean;
  skill: "입문 희망" | "미숙" | "보통" | "능숙" | "주력";
  note: string;
};

const activityTags = ["글", "그림", "디자인", "번역", "기타"];

const rulebooks: Rulebook[] = [
  { name: "크툴루의 부름 7판", canGM: true, skill: "주력", note: "기본 룰북 · 서플리먼트 일부 보유" },
  { name: "인세인", canGM: true, skill: "능숙", note: "기본 룰북 보유" },
  { name: "마기카로기아", canGM: false, skill: "입문 희망", note: "시나리오집 보유" },
  { name: "언성 듀엣", canGM: false, skill: "보통", note: "기본 룰북 보유" },
  { name: "더블크로스 3rd", canGM: false, skill: "미숙", note: "기본 룰북 보유" },
];

function Pill({ children, selected = false }: { children: React.ReactNode; selected?: boolean }) {
  return <span className={selected ? "pill selected" : "pill"}>{children}</span>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="section-title"><h2>{children}</h2></div>;
}

function ProfileHeader() {
  return (
    <header className="profile-header">
      <div className="solid-banner" />
      <div className="avatar" aria-label="프로필 사진 자리"><div className="avatar-placeholder"><span /><i /></div></div>
      <section className="speech-card">
        <div className="identity-row"><strong><span className="landscape-copy">닉네임</span><span className="portrait-copy">닉</span></strong><span>@아이디</span></div>
        <div className="identity-divider" />
        <div className="intro-copy">
          <b>한 줄 소개</b>
          <p className="landscape-intro">한 줄 자기소개가 들어가는 영역입니다!</p>
          <p className="portrait-intro">안녕하세요! 저는 TRPG를 좋아하는 탐사자입니다.<br />짧고 간단한 소개를 적어주세요.</p>
        </div>
        <div className="activity-pills">{activityTags.map((tag) => <Pill selected key={tag}>{tag}</Pill>)}</div>
      </section>
    </header>
  );
}

function PlayStyle() {
  return (
    <section className="play-style section-column">
      <SectionTitle>플레이 성향</SectionTitle>
      <div className="preference-list">
        <div className="preference-row"><b>온라인 / 오프라인</b><div><Pill selected>온라인</Pill><Pill>오프라인</Pill></div></div>
        <div className="preference-row"><b>텍스트 / 반텍스트 / 보이스</b><div><Pill selected>텍스트</Pill><Pill>반텍스트</Pill><Pill>보이스</Pill></div></div>
        <div className="preference-row"><b>1:1 / 다인</b><div><Pill>1:1</Pill><Pill selected>다인</Pill></div></div>
        <div className="preference-row"><b>단기탁 / 장기탁</b><div><Pill selected>단기탁</Pill><Pill>장기탁</Pill></div></div>
        <div className="preference-row"><b><span className="landscape-copy">다른 / 정통</span><span className="portrait-copy">단문 / 장문</span></b><div><Pill><span className="landscape-copy">다른</span><span className="portrait-copy">단문</span></Pill><Pill selected><span className="landscape-copy">정통</span><span className="portrait-copy">장문</span></Pill></div></div>
        <div className="result-row"><b><span className="landscape-copy">플롯 방식</span><span className="portrait-copy">롤플 방식</span></b><p>대사(지문), 디테일 위주, 서술형 등</p></div>
        <div className="preference-row chat-row"><b>사담</b><div><Pill selected>탭 내</Pill><Pill>세션 외부</Pill><Pill>비선호</Pill></div></div>
        <div className="result-row"><b>기타</b><p>고어 OK / 호러 선호 / 개그는 상황에 따라</p></div>
        <div className="result-row"><b>일정</b><p>평일 21시 이후 / 주말 협의</p></div>
      </div>
    </section>
  );
}

function FavoriteTools() {
  return (
    <section className="favorite-tools section-column">
      <SectionTitle>선호 툴</SectionTitle>
      <div className="tool-group"><b>플랫폼</b><div><Pill selected>롤20</Pill><Pill>코코포</Pill><Pill>기타</Pill></div></div>
      <div className="tool-group"><b>연락</b><div><Pill selected>디스코드</Pill><Pill>오픈카톡</Pill><Pill>짓시</Pill><Pill>기타</Pill></div></div>
      <section className="trigger-section">
        <SectionTitle>NG / 트리거</SectionTitle>
        <p>과도한 비하, 강압적 태도, 성적 묘사 강요<br />트라우마 요소(유혈, 자해 등)는 사전 고지 필수</p>
      </section>
    </section>
  );
}

function RulebookList() {
  return (
    <section className="rulebooks section-column">
      <SectionTitle><span className="landscape-copy">소지 룰북 / GM 가능 여부</span><span className="portrait-copy">소지 룰북</span></SectionTitle>
      <div className="rulebook-list">
        {rulebooks.map((rulebook) => (
          <article className="rulebook-row" key={rulebook.name}>
            <strong>{rulebook.name}</strong>
            <span className={rulebook.canGM ? "status gm-yes" : "status gm-no"}>{rulebook.canGM ? "GM 가능" : "GM 불가"}</span>
            <span className={`status skill skill-${rulebook.skill.replace(" ", "-")}`}>{rulebook.skill}</span>
            <p>{rulebook.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProfileResult() {
  return (
    <main className="profile-page">
      <div className="profile-sheet">
        <ProfileHeader />
        <div className="profile-content">
          <PlayStyle />
          <FavoriteTools />
          <RulebookList />
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  const [layout, setLayout] = useState<"landscape" | "portrait">("landscape");
  const [headerColor, setHeaderColor] = useState("#78b5ee");
  const [pointColor, setPointColor] = useState("#0051fe");
  const iframeSrc = `/sheet?header=${headerColor.slice(1)}&point=${pointColor.slice(1)}`;

  return (
    <main className="preview-page">
      <div className="preview-toolbar">
        <nav className="preview-switch" aria-label="미리보기 방향 선택">
          <button className={layout === "landscape" ? "active" : ""} onClick={() => setLayout("landscape")}>가로형</button>
          <button className={layout === "portrait" ? "active" : ""} onClick={() => setLayout("portrait")}>세로형</button>
        </nav>
        <div className="color-controls" aria-label="두 가지 테마 색상">
          <label><span>헤더색</span><input type="color" value={headerColor} onChange={(event) => setHeaderColor(event.target.value)} /></label>
          <label><span>포인트색</span><input type="color" value={pointColor} onChange={(event) => setPointColor(event.target.value)} /></label>
        </div>
      </div>
      <div className={`sheet-stage ${layout}`}>
        <iframe title={`${layout === "landscape" ? "가로형" : "세로형"} TRPG 프로필 결과`} src={iframeSrc} />
      </div>
    </main>
  );
}
