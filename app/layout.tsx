import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "트친소 메이커 | 나만의 자기소개표",
  description: "색상과 취향을 골라 가로형·세로형 트친소 자기소개표를 만들고 PNG로 저장하세요.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
