import { useEffect } from "react";

const CURSOR_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24"><path d="M 1 1 L 15 11 L 10 11 L 8 23 L 6 23 L 8 11 L 1 11 Z" fill="#1A1614"/></svg>`
);

export function SmoothCursor() {
  useEffect(() => {
    const url = `url("data:image/svg+xml,${CURSOR_SVG}") 1 1, auto`;
    document.body.style.cursor = url;
    return () => { document.body.style.cursor = "auto"; };
  }, []);
  return null;
}
