import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRPG 성향 프로필 HTML",
  description: "첨부된 가로형·세로형 레퍼런스를 반응형 HTML과 CSS로 재현한 TRPG 성향 프로필입니다.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
