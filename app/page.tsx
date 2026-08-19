import generatorHtml from "../index.html?raw";

export default function Home() {
  return (
    <iframe
      title="TRPG 자기소개표 제작"
      srcDoc={generatorHtml}
      style={{ display: "block", width: "100%", height: "100dvh", border: 0 }}
    />
  );
}
