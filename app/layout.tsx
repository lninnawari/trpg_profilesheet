import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRPG 자기소개표 제작",
  description: "색상과 내용을 자유롭게 편집하고 PNG로 저장하는 TRPG 자기소개표 제작 도구입니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
