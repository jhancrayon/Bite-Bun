import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Thanh loading toàn cục chạy ngang trên cùng màn hình (kiểu YouTube/NProgress).
 *
 * Tự động kích hoạt mỗi khi người dùng bấm vào BẤT KỲ nút hoặc liên kết nào
 * trên giao diện — nhờ một listener 'click' ở cấp document — nên mọi chức năng
 * đều có phản hồi "đang tải" mà không cần sửa từng handler riêng lẻ.
 */
export function TopLoadingBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };

    const trigger = () => {
      clear();
      setVisible(true);
      setProgress(8);
      // Tăng dần để tạo cảm giác đang xử lý.
      timers.current.push(window.setTimeout(() => setProgress(35), 60));
      timers.current.push(window.setTimeout(() => setProgress(62), 200));
      timers.current.push(window.setTimeout(() => setProgress(84), 420));
      // Hoàn tất & ẩn đi.
      timers.current.push(window.setTimeout(() => setProgress(100), 620));
      timers.current.push(
        window.setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 900),
      );
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest("button, a, [role='button'], input[type='submit'], label");
      if (!el) return;
      // Bỏ qua nút đang bị vô hiệu hoá.
      if (el instanceof HTMLButtonElement && el.disabled) return;
      if (el.getAttribute("aria-disabled") === "true") return;
      trigger();
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clear();
    };
  }, []);

  if (!visible) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px]">
      <div
        className="h-full rounded-r-full shadow-[0px_0px_10px_rgba(250,105,50,0.7)] transition-[width] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress >= 100 ? 0 : 1,
          backgroundImage: "linear-gradient(90deg, #f4de79 0%, #fa6932 55%, #d9161c 100%)",
        }}
      />
    </div>,
    document.body,
  );
}
