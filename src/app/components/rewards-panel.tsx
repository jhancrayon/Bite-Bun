import { useAuth, VOUCHERS, TIERS, getTierInfo, type Voucher } from "./auth-store";
import { useState } from "react";

/** Huy hiệu game hóa — mốc thành tích tạo động lực mua lặp lại. */
const BADGES: { id: string; emoji: string; label: string; need: number; metric: "tier" | "wallet" | "orders" }[] = [
  { id: "b-first", emoji: "🍔", label: "Đơn đầu tiên", need: 1, metric: "orders" },
  { id: "b-silver", emoji: "🥈", label: "Lên hạng Bạc", need: 1000, metric: "tier" },
  { id: "b-collector", emoji: "🎟️", label: "Sưu tầm 2 voucher", need: 2, metric: "wallet" },
  { id: "b-gold", emoji: "🥇", label: "Lên hạng Vàng", need: 2500, metric: "tier" },
  { id: "b-loyal", emoji: "🔥", label: "5 đơn liên tiếp", need: 5, metric: "orders" },
  { id: "b-vip", emoji: "👑", label: "Thành viên VIP", need: 4000, metric: "tier" },
];

/** Số đơn demo để tính huy hiệu (dùng khi chưa nối order thực). */
const DEMO_ORDERS = 3;

export function RewardsPanel() {
  const { points, tierPoints, wallet, redeem } = useAuth();
  const { current, next, progress, toNext } = getTierInfo(tierPoints);
  const [failed, setFailed] = useState<string | null>(null);

  const tryRedeem = (voucher: Voucher) => {
    if (!redeem(voucher)) {
      setFailed(voucher.id);
      window.setTimeout(() => setFailed(null), 1600);
    }
  };

  const isBadgeDone = (b: (typeof BADGES)[number]) => {
    if (b.metric === "tier") return tierPoints >= b.need;
    if (b.metric === "wallet") return wallet.length >= b.need;
    return DEMO_ORDERS >= b.need;
  };

  const ownedVouchers = VOUCHERS.filter((v) => wallet.includes(v.id));

  return (
    <div className="flex flex-col gap-[22px]">
      {/* Thẻ hạng thành viên */}
      <div className="relative overflow-hidden rounded-[22px] p-[22px] text-white shadow-[0px_16px_34px_rgba(122,0,2,0.28)]" style={{ backgroundImage: current.gradient }}>
        <div className="pointer-events-none absolute -right-[30px] -top-[40px] size-[160px] rounded-full bg-white/25 blur-[50px]" />
        <div className="pointer-events-none absolute -bottom-[50px] -left-[20px] size-[150px] rounded-full bg-black/15 blur-[50px]" />

        <div className="relative flex items-start justify-between gap-[12px]">
          <div className="flex flex-col">
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] tracking-[2px] uppercase opacity-90">Bite &amp; Bun Rewards</span>
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[32px] leading-[1.05] drop-shadow-[0px_2px_6px_rgba(0,0,0,0.3)]">Hạng {current.label}</span>
          </div>
          <span className="text-[46px] drop-shadow-[0px_3px_6px_rgba(0,0,0,0.3)]">{current.emoji}</span>
        </div>

        <div className="relative mt-[16px]">
          <div className="flex items-center justify-between font-['Source_Sans_Pro:Bold',sans-serif] text-[14px]">
            <span>{tierPoints.toLocaleString("vi-VN")} Bun tích lũy</span>
            {next ? <span>{next.min.toLocaleString("vi-VN")}</span> : <span>Tối đa 🎉</span>}
          </div>
          <div className="mt-[6px] h-[10px] w-full overflow-hidden rounded-full bg-black/25">
            <div className="h-full rounded-full bg-white transition-[width] duration-700" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="mt-[8px] font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] opacity-95">
            {next ? `Còn ${toNext.toLocaleString("vi-VN")} Bun để lên hạng ${next.label} ${next.emoji}` : "Bạn đang ở hạng cao nhất — cảm ơn bạn!"}
          </p>
        </div>
      </div>

      {/* Bậc thang hạng */}
      <div>
        <p className="mb-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#3b2a20]">Quyền lợi các hạng</p>
        <div className="grid grid-cols-3 gap-[10px]">
          {TIERS.map((tier) => {
            const reached = tierPoints >= tier.min;
            const active = tier.id === current.id;
            return (
              <div
                className={`flex flex-col gap-[7px] rounded-[16px] p-[13px] ring-1 transition-all ${
                  active ? "bg-[#fff6e6] ring-[#e9b949] shadow-[0px_8px_18px_rgba(217,150,20,0.22)]" : reached ? "bg-[#f3f3f3] ring-[#e6dccf]" : "bg-[#f7f4f0] opacity-70 ring-[#ece4db]"
                }`}
                key={tier.id}
              >
                <div className="flex items-center gap-[7px]">
                  <span className="text-[20px]">{tier.emoji}</span>
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#3b2a20]">{tier.label}</span>
                  {active && <span className="ml-auto rounded-full bg-[#e9b949] px-[7px] py-[2px] font-['Source_Sans_Pro:Bold',sans-serif] text-[11px] text-white">Bạn</span>}
                </div>
                <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] text-[#a8927f]">Từ {tier.min.toLocaleString("vi-VN")} Bun</span>
                <ul className="flex flex-col gap-[4px]">
                  {tier.perks.map((perk) => (
                    <li className="flex items-start gap-[5px] font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] leading-[1.3] text-[#6b584c]" key={perk}>
                      <span className="mt-[1px] text-[#22a06b]">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Huy hiệu game hóa */}
      <div>
        <div className="mb-[10px] flex items-center gap-[8px]">
          <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#3b2a20]">Huy hiệu thành tích</p>
          <span className="rounded-full bg-[#f6ece9] px-[9px] py-[3px] font-['Source_Sans_Pro:Bold',sans-serif] text-[12px] text-[#d9161c]">
            {BADGES.filter(isBadgeDone).length}/{BADGES.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-[10px]">
          {BADGES.map((badge) => {
            const done = isBadgeDone(badge);
            return (
              <div
                className={`flex flex-col items-center gap-[6px] rounded-[16px] px-[8px] py-[13px] text-center ring-1 transition-all ${
                  done ? "bg-[#fff6e6] ring-[#e9b949]" : "bg-[#f7f4f0] ring-[#ece4db]"
                }`}
                key={badge.id}
              >
                <span className={`flex size-[48px] items-center justify-center rounded-full text-[24px] ${done ? "bg-white shadow-[0px_6px_14px_rgba(217,150,20,0.3)]" : "bg-[#ece4db] grayscale"}`}>
                  {done ? badge.emoji : "🔒"}
                </span>
                <span className={`font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] leading-[1.2] ${done ? "text-[#8a5a1a]" : "text-[#a8927f]"}`}>{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kho voucher */}
      <div>
        <div className="mb-[10px] flex items-center gap-[10px]">
          <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#3b2a20]">Kho voucher</p>
          <span className="rounded-full bg-[#e6f4ec] px-[10px] py-[3px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#22a06b]">{ownedVouchers.length} đã có</span>
          <span className="ml-auto flex items-center gap-[6px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#d9161c]">🥟 {points.toLocaleString("vi-VN")} Bun</span>
        </div>

        {ownedVouchers.length > 0 && (
          <div className="mb-[12px] flex gap-[10px] overflow-x-auto pb-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ownedVouchers.map((v) => (
              <div className="flex min-w-[168px] shrink-0 items-center gap-[10px] rounded-[14px] px-[13px] py-[11px] text-white shadow-[0px_8px_18px_rgba(205,5,8,0.22)]" key={v.id} style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 80%)" }}>
                <span className="text-[24px]">{v.emoji}</span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate font-['Source_Sans_Pro:Bold',sans-serif] text-[15px]">{v.label}</span>
                  <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] text-[#ffdcb0]">Dùng khi thanh toán</span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-[10px]">
          {VOUCHERS.map((voucher) => {
            const owned = wallet.includes(voucher.id);
            const short = failed === voucher.id;
            return (
              <div className="flex items-center gap-[13px] rounded-[16px] bg-[#f3f3f3] px-[15px] py-[12px] ring-1 ring-[#f0e2d2]" key={voucher.id}>
                <span className="flex size-[42px] shrink-0 items-center justify-center rounded-[12px] bg-white text-[20px] shadow-[0px_4px_10px_rgba(205,5,8,0.1)]">{voucher.emoji}</span>
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#3b2a20]">{voucher.label}</span>
                  <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#a8927f]">{voucher.note}</span>
                </span>
                <button
                  className={`shrink-0 cursor-pointer rounded-[11px] px-[15px] py-[9px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] whitespace-nowrap transition-all duration-300 ${
                    owned ? "bg-[#e6f4ec] text-[#22a06b]" : short ? "bg-[#ffeceb] text-[#d9161c]" : "bg-[#d9161c] text-white hover:-translate-y-[2px] active:scale-95"
                  }`}
                  disabled={owned}
                  onClick={() => tryRedeem(voucher)}
                  type="button"
                >
                  {owned ? "Đã có ✓" : short ? "Thiếu điểm" : `${voucher.cost} Bun`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
