import { useEffect, useState } from "react";

export function SmoothCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkDevice = () => {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsVisible(!isTouch);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isVisible) return;
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    document.body.style.cursor = "none";
    window.addEventListener("mousemove", handler);
    return () => {
      window.removeEventListener("mousemove", handler);
      document.body.style.cursor = "auto";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      <div
        style={{
          position: "fixed",
          top: pos.y,
          left: pos.x,
          zIndex: 999999,
          pointerEvents: "none",
          width: 10,
          height: 10,
          marginLeft: -5,
          marginTop: -5,
          borderRadius: "50%",
          background: "#1A1614",
        }}
      />
    </>
  );
}
