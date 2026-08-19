import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("트친소 메이커 페이지를 렌더링한다", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>트친소 메이커 \| 나만의 자기소개표<\/title>/i);
  assert.match(html, /트친소 메이커/);
  assert.match(html, /실시간 미리보기/);
  assert.match(html, /PNG 이미지로 저장하기/);
});

test("가로형과 세로형 이미지 생성 기능을 포함한다", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /1200, 720/);
  assert.match(page, /720, 1080/);
  assert.match(page, /type="color"/);
  assert.match(page, /type="file"/);
  assert.match(page, /toDataURL\("image\/png"/);
  assert.match(page, /type="checkbox"/);
});
