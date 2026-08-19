"use client";

import { useEffect, useState } from "react";
import { ProfileResult } from "../page";

const FALLBACK_HEADER = "#78b5ee";
const FALLBACK_POINT = "#0051fe";

function validHex(value: string | null, fallback: string) {
  return value && /^[0-9a-f]{6}$/i.test(value) ? `#${value}` : fallback;
}

function readablePointText(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.68 ? "#15171c" : "#ffffff";
}

export default function SheetPage() {
  const [theme, setTheme] = useState({ header: FALLBACK_HEADER, point: FALLBACK_POINT });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTheme({
      header: validHex(params.get("header"), FALLBACK_HEADER),
      point: validHex(params.get("point"), FALLBACK_POINT),
    });
  }, []);

  return (
    <div
      className="theme-root"
      style={{
        "--theme-header": theme.header,
        "--theme-point": theme.point,
        "--on-point": readablePointText(theme.point),
      } as React.CSSProperties}
    >
      <ProfileResult />
    </div>
  );
}
