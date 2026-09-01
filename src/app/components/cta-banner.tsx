import { useEffect, useState } from "react";
import { useCart } from "./cart-store";
import { useMenuFilter } from "./menu-filter";

const heroImage = "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1600&q=80";

const STATS = [
  { value: "22′", label: "Giao trung bình" },
  { value: "32", label: "Món trong thực đơn" },
  { value: "4.8★", label: "Điểm hài lòng" },
  { value: "18k+", label: "Đơn mỗi tháng" },
];

/** Countdown to the end of today's flash deal (23:59). */
function useEndOfDay() {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      setLeft(Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000)));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return {
    h: String(Math.floor(left / 3600)).padStart(2, "0"),
    m: String(Math.floor((left % 3600) / 60)).padStart(2, "0"),
    s: String(left % 60).padStart(2, "0"),
  };
}

/** "Bạn đã sẵn sàng đặt hàng" — redesigned closing call to action. */
export function CtaBanner() {
  const { openMenu } = useMenuFilter();
  const { count, setOpen } = useCart();
  const { h, m, s } = useEndOfDay();
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="relative w-full overflow-hidden px-[221px] py-[86px]" data-name="CTA">
      <img alt="" className="absolute inset-0 size-full object-cover" src={heroImage} />
      <span className="absolute inset-0" style={{ backgroundImage: "linear-gradient(100deg, rgba(20,6,10,0.95) 8%, rgba(143,2,4,0.88) 48%, rgba(255,106,31,0.72) 118%)" }} />
      <div className="pointer-events-none absolute -left-[120px] top-[-120px] size-[420px] rounded-full bg-[#f4de79] opacity-25 blur-[130px]" />
      <div className="pointer-events-none absolute -right-[120px] bottom-[-150px] size-[420px] rounded-full bg-[#fa6932] opacity-25 blur-[130px]" />

      <div className="relative flex items-center justify-between gap-[60px]">
        {/* Copy */}
        <div className="flex max-w-[760px] flex-col gap-[20px]">
          <span className="flex w-fit items-center gap-[10px] rounded-full bg-white/12 px-[18px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] tracking-[3px] text-[#f4de79] uppercase">
            <span className="size-[8px] animate-pulse rounded-full bg-[#22a06b]" />
            Bếp đang mở · nhận đơn ngay
          </span>

          <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[62px] leading-[1.02] text-white">
            Bạn đã sẵn sàng đặt hàng với{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #f4de79 0%, #f4de79 45%, #fa6932 100%)" }}>
              ưu đãi tốt nhất
            </span>{" "}
            chưa?
          </p>

          <p className="font-['Open_Sans:Regular',sans-serif] text-[20px] leading-[1.5] text-[#e8d5c4]">
            Đặt trong hôm nay để dùng mã <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#f4de79]">BITE20</span> — giảm 20% toàn menu và miễn phí giao từ 200.000 vnd.
          </p>

          <div className="flex flex-wrap items-center gap-[14px] pt-[6px]">
            <button
              className="group flex cursor-pointer items-center gap-[12px] overflow-hidden rounded-[16px] px-[34px] py-[18px] text-white shadow-[0px_14px_30px_rgba(205,5,8,0.4)] transition-transform duration-300 hover:-translate-y-[3px] hover:scale-[1.02] active:scale-95"
              onClick={() => openMenu("all")}
              style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
              type="button"
            >
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[20px] tracking-[1px] uppercase">Tiếp tục đặt hàng</span>
              <svg className="size-[20px] transition-transform duration-300 group-hover:translate-x-[5px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" viewBox="0 0 24 24">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </button>

            <button
              className="flex cursor-pointer items-center gap-[10px] rounded-[16px] border-2 border-[#f4de79]/70 px-[28px] py-[16px] font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-[#f4de79] transition-all duration-300 hover:bg-[#f4de79] hover:text-[#7f292a]"
              onClick={() => setOpen(true)}
              type="button"
            >
              🛒 Xem giỏ hàng {count > 0 ? `(${count})` : ""}
            </button>
          </div>

          {/* Quick call-back */}
          <form
            className="mt-[8px] flex items-center gap-[10px]"
            onSubmit={(e) => {
              e.preventDefault();
              if (phone.replace(/\D/g, "").length < 9) return;
              setSent(true);
              setPhone("");
              window.setTimeout(() => setSent(false), 3000);
            }}
          >
            <input
              className="w-[300px] rounded-[14px] bg-white/12 px-[20px] py-[14px] font-['Source_Sans_Pro:Regular',sans-serif] text-[18px] text-white outline-none ring-1 ring-white/25 placeholder:text-[#e8d5c4]/60 focus:ring-[#f4de79]"
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại đặt nhanh"
              value={phone}
            />
            <button
              className={`cursor-pointer rounded-[14px] px-[24px] py-[14px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] transition-all duration-300 ${
                sent ? "bg-[#22a06b] text-white" : "bg-white/15 text-white hover:bg-white/25"
              }`}
              type="submit"
            >
              {sent ? "Sẽ gọi bạn ✓" : "Gọi lại cho tôi"}
            </button>
          </form>
        </div>

        {/* Deal card */}
        <div className="flex w-[380px] shrink-0 flex-col gap-[18px] rounded-[26px] bg-white/[0.08] p-[30px] ring-1 ring-white/15 backdrop-blur-[6px]">
          <div className="flex flex-col items-center gap-[4px]">
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] tracking-[3px] text-[#ffdcb0] uppercase">Ưu đãi kết thúc sau</span>
            <div className="flex items-center gap-[8px] pt-[4px]">
              {[h, m, s].map((unit, i) => (
                <div className="flex items-center gap-[8px]" key={i}>
                  <span className="flex min-w-[70px] justify-center rounded-[14px] bg-[#f4de79] px-[12px] py-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[34px] text-[#7f292a] tabular-nums">
                    {unit}
                  </span>
                  {i < 2 && <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[28px] text-[#f4de79]">:</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="h-[1px] w-full bg-white/15" />

          <div className="grid grid-cols-2 gap-[14px]">
            {STATS.map((stat) => (
              <div className="flex flex-col items-center gap-[2px] rounded-[16px] bg-white/[0.07] py-[14px]" key={stat.label}>
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[28px] text-[#f4de79]">{stat.value}</span>
                <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#e8d5c4]">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-[10px] rounded-[16px] border-2 border-dashed border-[#f4de79]/70 px-[18px] py-[13px]">
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[22px] tracking-[2px] text-[#f4de79]">BITE20</span>
            <button
              className="ml-auto cursor-pointer rounded-[10px] bg-[#f4de79] px-[16px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#7f292a] transition-transform duration-300 hover:scale-105 active:scale-95"
              onClick={() => navigator.clipboard?.writeText("BITE20").catch(() => undefined)}
              type="button"
            >
              Chép mã
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
