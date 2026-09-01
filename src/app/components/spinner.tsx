/** Vòng xoay loading dùng chung cho các trạng thái đang xử lý. */
export function Spinner({ className = "size-[20px]" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.2" />
      <path className="opacity-90" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" strokeWidth="3.2" />
    </svg>
  );
}

/**
 * Lớp phủ loading toàn màn hình (dùng khi cần chặn thao tác trong lúc xử lý).
 * Hiển thị vòng xoay + nhãn mô tả trên nền mờ.
 */
export function LoadingOverlay({ label = "Đang xử lý…" }: { label?: string }) {
  return (
    <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-[14px] bg-white/80 backdrop-blur-[3px] [animation:fade-in_0.2s_ease-out_both]">
      <span className="flex size-[62px] items-center justify-center rounded-full bg-white text-[#d9161c] shadow-[0px_10px_26px_rgba(205,5,8,0.22)]">
        <Spinner className="size-[30px]" />
      </span>
      <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#7f292a]">{label}</span>
    </div>
  );
}
