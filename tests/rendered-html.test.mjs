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

test("가로형 자기소개표 고정 HTML을 렌더링한다", async () => {
  const response = await render("/sheet");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /플레이 성향/);
  assert.match(html, /선호 툴/);
  assert.match(html, /소지 룰북 \/ GM 가능 여부/);
  assert.match(html, /NG \/ 트리거/);
});

test("결과 시트는 입력 요소 없이 정적 구조로 구성한다", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const profileResult = page.slice(page.indexOf("export function ProfileResult"), page.indexOf("export default function Home"));
  assert.doesNotMatch(profileResult, /<input|<textarea|<select/);
  assert.match(page, /className="profile-sheet"/);
  assert.match(page, /className="profile-content"/);
  assert.match(page, /rulebooks\.map/);
  assert.match(page, /type="color"/);
});
