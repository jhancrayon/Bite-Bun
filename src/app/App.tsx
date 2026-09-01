import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Sections from "../imports/Sections";
import { useScrollReveal } from "./components/use-scroll-reveal";
import { StickyTopNav } from "./components/sticky-top-nav";
import { CartProvider } from "./components/cart-store";
import { CartWidget } from "./components/cart-widget";
import { MenuFilterProvider } from "./components/menu-filter";
import { MenuModal } from "./components/menu-modal";
import { AuthProvider } from "./components/auth-store";
import { AuthModal } from "./components/auth-modal";
import { TopLoadingBar } from "./components/top-loading-bar";
import "./components/animations.css";

/** Intrinsic width of the imported Figma design. */
/* Bản web khổ 1920, thu nhỏ vừa màn qua transform scale. */
const DESIGN_WIDTH = 1920;

export default function App() {
  const stageRef = useScrollReveal<HTMLDivElement>('[data-name="Sections"] > *');
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const update = () => {
      const width = wrapperRef.current?.clientWidth ?? window.innerWidth;
      setScale(Math.min(1, width / DESIGN_WIDTH));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => setContentHeight(stage.offsetHeight));
    observer.observe(stage);
    setContentHeight(stage.offsetHeight);
    return () => observer.disconnect();
  }, [stageRef]);

  return (
    <CartProvider>
      <MenuFilterProvider>
      <AuthProvider>
      <div ref={wrapperRef} id="top" className="w-full overflow-x-hidden bg-white">
        <TopLoadingBar />
        <StickyTopNav />
        <CartWidget />
        <MenuModal />
        <AuthModal />
        <div className="mx-auto" style={{ width: DESIGN_WIDTH * scale, height: contentHeight * scale }}>
          <div
            ref={stageRef}
            className="figma-stage"
            style={{
              width: DESIGN_WIDTH,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <Sections />
          </div>
        </div>
      </div>
      </AuthProvider>
      </MenuFilterProvider>
    </CartProvider>
  );
}
