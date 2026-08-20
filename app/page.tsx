import generatorHtml from "../index.html?raw";

export default function Home() {
  return (
    <iframe
      title="TRPG 프로필 카드 제작"
      srcDoc={generatorHtml}
      style={{ display: "block", width: "100%", height: "100dvh", border: 0 }}
    />
  );
}
