import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("TRPG 자기소개표 편집기를 루트에서 렌더링한다", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /TRPG 자기소개표 만들기/);
  assert.match(html, /<iframe/);
});

test("편집기 원본에 핵심 입력·미리보기·저장 기능이 포함된다", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /id="nicknameInput"/);
  assert.match(html, /id="avatarInput"/);
  assert.match(html, /id="themePresets"/);
  assert.match(html, /NG \/ 트리거/);
  assert.match(html, /id="rulebookEditorList"/);
  assert.match(html, /html2canvas/);
  assert.match(html, /@media \(max-width: 1024px\)/);
  assert.match(html, /제작 @sonata9x/);
});
