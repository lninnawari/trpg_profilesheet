"use client";

import { useState } from "react";

type Rulebook = {
  name: string;
  playRole: "GM 가능" | "PL만";
  skill: "입문 희망" | "미숙" | "주력";
  note: string;
};

const activityTags = ["글", "그림", "디자인", "번역", "기타"];

const rulebooks: Rulebook[] = [
  { name: "크툴루의 부름 7판", playRole: "GM 가능", skill: "주력", note: "기본 룰북, 서플리먼트 일부 보유" },
  { name: "인세인", playRole: "GM 가능", skill: "주력", note: "기본 룰북 보유" },
  { name: "마기카로기아", playRole: "PL만", skill: "입문 희망", note: "시나리오집 보유" },
  { name: "언성 듀엣", playRole: "PL만", skill: "미숙", note: "기본 룰북 보유" },
  { name: "더블크로스 3rd", playRole: "PL만", skill: "미숙", note: "기본 룰북 보유" },
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
      <span className="avatar-credit">ⓒ커미션출처 표기</span>
      <span className="creator-credit">제작 @sonata9x</span>
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
      <div className="play-groups">
        <div className="play-group core-style">
          <h3>플레이 스타일</h3>
          <div className="play-group-content">
            <div className="button-line" aria-label="온라인 또는 오프라인"><Pill selected>온라인</Pill><Pill>오프라인</Pill></div>
            <div className="button-line" aria-label="플레이 매체"><Pill selected>텍스트</Pill><Pill>반보이스</Pill><Pill>보이스</Pill></div>
            <div className="button-line" aria-label="플레이 인원"><Pill>1:1</Pill><Pill selected>다인</Pill></div>
            <div className="button-line" aria-label="세션 길이"><Pill selected>단기탁</Pill><Pill>장기탁</Pill></div>
          </div>
        </div>
        <div className="play-group roleplay-style">
          <h3>역극</h3>
          <div className="play-group-content">
            <div className="button-line" aria-label="역극 분량"><Pill>단문</Pill><Pill selected>장문</Pill></div>
            <p className="group-note">대사(지문), 디테일 위주, 서술형 등</p>
          </div>
        </div>
        <div className="play-group chat-style">
          <h3>사담</h3>
          <div className="play-group-content">
            <div className="button-line chat-row" aria-label="사담 위치"><Pill selected>세션 탭</Pill><Pill>세션 외부</Pill><Pill>비선호</Pill></div>
          </div>
        </div>
        <div className="play-group schedule-style">
          <h3>일정</h3>
          <div className="play-group-content">
            <p className="group-note">평일 21시 이후 / 주말 협의</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FavoriteTools() {
  return (
    <section className="favorite-tools section-column">
      <SectionTitle>선호 툴</SectionTitle>
      <div className="tool-group"><h3>플랫폼</h3><div><Pill selected>롤20</Pill><Pill>코코포</Pill><Pill>기타</Pill></div></div>
      <div className="tool-group"><h3>연락</h3><div><Pill selected>디스코드</Pill><Pill>오픈카톡</Pill><Pill>짓시</Pill><Pill>기타</Pill></div></div>
      <section className="trigger-section">
        <SectionTitle>NG / 트리거</SectionTitle>
        <p>과도한 비하, 강압적 태도, 성적 묘사 강요<br />트라우마 요소(유혈, 자해 등)는 사전 고지 필수</p>
      </section>
      <section className="memo-section">
        <SectionTitle>기타 메모</SectionTitle>
        <p>고어 OK / 호러 선호 / 개그는 상황에 따라</p>
      </section>
    </section>
  );
}

function RulebookList() {
  return (
    <section className="rulebooks section-column">
      <SectionTitle>소지 룰북</SectionTitle>
      <div className="rulebook-list">
        {rulebooks.map((rulebook) => (
          <article className="rulebook-row" key={rulebook.name}>
            <div className="rulebook-name">
              <strong>{rulebook.name}</strong>
              <span className={`rulebook-level level-${rulebook.skill.replace(" ", "-")}`}>{rulebook.skill}</span>
            </div>
            <span className="rulebook-dot" aria-hidden="true">·</span>
            <span className="rulebook-role">{rulebook.playRole}</span>
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
          <div className="tendency-tools">
            <PlayStyle />
            <FavoriteTools />
          </div>
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
