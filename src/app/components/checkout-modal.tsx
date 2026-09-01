import image_acb08d57_b730_42ea_8202_cbc919c74ade_3 from '@/imports/acb08d57-b730-42ea-8202-cbc919c74ade-3.png'
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { formatVnd, useCart, FREE_SHIP_FROM } from "./cart-store";
import { useAuth, VOUCHERS } from "./auth-store";
import { placeOrder as saveOrder } from "./order-store";
import { useExpress } from "./express-store";
import { setAddress as setNavAddress, useAddress } from "./address-store";
import { BRANCHES, setBranch, useBranch } from "./branch-store";
import { useOrderMode } from "./order-mode-store";
import { Spinner } from "./spinner";

/** Ảnh túi tote quà tặng dịp 2/9 (đồng bộ với banner khuyến mãi). */
const TOTE_IMAGE = "https://cdn.phototourl.com/free/2026-08-22-82c031a0-c2d1-411b-ba29-4cf037874bc3.jpg";

/** Saved delivery addresses the customer can pick from. */
const ADDRESSES = [
  { id: "ad-home", tag: "Nhà", value: "98 Nguyễn Công Hoan, P. Cầu Kiệu, Q. Phú Nhuận, TP.HCM" },
  { id: "ad-work", tag: "Công ty", value: "12 Lê Duẩn, P. Bến Nghé, Q.1, TP.HCM" },
];

/** Extra items offered at checkout. */
const ADDONS = [
  { id: "ao-fries", emoji: "🍟", label: "Khoai tây chiên", price: 29000 },
  { id: "ao-sauce", emoji: "🧄", label: "Sốt phô mai thêm", price: 12000 },
  { id: "ao-coke", emoji: "🥤", label: "Coca lon", price: 18000 },
  { id: "ao-salad", emoji: "🥗", label: "Salad bắp cải", price: 25000 },
  { id: "ao-cutlery", emoji: "🍴", label: "Bộ dụng cụ ăn", price: 0 },
];

const PAYMENTS = [
  { id: "pm-cash", emoji: "💵", label: "Tiền mặt khi nhận", note: "Chuẩn bị đúng số tiền giúp shipper" },
  { id: "pm-visa", emoji: "💳", label: "Visa •••• 4821", note: "Hết hạn 08/29" },
  { id: "pm-momo", emoji: "📱", label: "Ví MoMo", note: "0901 234 567" },
  { id: "pm-bank", emoji: "🏦", label: "Chuyển khoản ngân hàng", note: "Quét QR sau khi đặt" },
];

/**
 * Voucher codes accepted at checkout. Mirrors every voucher advertised across
 * the site (feature highlights, CTA banner) so any code the customer sees is
 * actually redeemable here. `cap` limits a percent discount; `min` is the
 * minimum order value (goods) required to use the code.
 */
const CODES: Record<string, { label: string; kind: "percent" | "amount" | "ship"; value: number; cap?: number; min?: number }> = {
  BITE20: { label: "Giảm 20% toàn menu (tối đa 60k)", kind: "percent", value: 20, cap: 60000, min: 150000 },
  BUN15: { label: "Giảm 15% (tối đa 40k)", kind: "percent", value: 15, cap: 40000 },
  BUN50K: { label: "Giảm 50.000 vnd", kind: "amount", value: 50000 },
  NEWBIE: { label: "Giảm 50.000 vnd đơn đầu", kind: "amount", value: 50000 },
  COMBO2: { label: "Mua 1 tặng 1 burger (giảm 50%, tối đa 89k)", kind: "percent", value: 50, cap: 89000 },
  FREESHIP: { label: "Miễn phí giao hàng", kind: "ship", value: 0, min: 200000 },
};

function SectionCard({ children, step, title }: { children: ReactNode; step: number; title: string }) {
  return (
    <section className="flex flex-col gap-[14px] rounded-[20px] bg-white p-[20px] ring-1 ring-[#f0e8e2]">
      <div className="flex items-center gap-[10px]">
        <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#d9161c] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-white">{step}</span>
        <h3 className="font-['Source_Sans_Pro:Bold',sans-serif] text-[20px] text-[#212121]">{title}</h3>
      </div>
      {children}
    </section>
  );
}

const inputClass =
  "w-full rounded-[12px] bg-[#f3f3f3] px-[14px] py-[12px] font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] text-[#3b2a20] outline-none ring-1 ring-[#f0e2d2] transition-colors duration-300 placeholder:text-[#c3b0a2] focus:ring-2 focus:ring-[#f4de79]";

/** Full checkout sheet: address, contact, items, add-ons, payment and voucher. */
export function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { items, subtotal, bogoFreeCount, bogoDiscount, increase, decrease, remove, clear } = useCart();
  const express = useExpress();
  const { user, openAuth, earn, wallet, useVoucher } = useAuth();
  const mode = useOrderMode();
  const navAddress = useAddress();
  const branch = useBranch();

  const [addresses, setAddresses] = useState(ADDRESSES);
  const [addressId, setAddressId] = useState("ad-nav");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("0901 234 567");
  const [note, setNote] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [payment, setPayment] = useState("pm-cash");
  const [code, setCode] = useState("");
  const [voucher, setVoucher] = useState<{ code: string; label: string; kind: string; value: number; cap?: number; min?: number; walletId?: string } | null>(null);
  const [codeError, setCodeError] = useState("");
  const [placed, setPlaced] = useState(false);
  const [earned, setEarned] = useState(0);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (!verifying || resendIn <= 0) return;
    const id = window.setInterval(() => setResendIn((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [verifying, resendIn]);

  const isPickup = mode === "pickup";
  const addonTotal = addons.reduce((sum, id) => sum + (ADDONS.find((a) => a.id === id)?.price ?? 0), 0);
  const goods = subtotal + addonTotal;
  const baseShipping = goods === 0 || goods >= FREE_SHIP_FROM ? 0 : 15000;
  const freeShip = voucher?.kind === "ship";
  // Đến lấy tại quán thì luôn miễn phí giao.
  const shipping = isPickup ? 0 : freeShip ? 0 : baseShipping;
  const discount =
    voucher?.kind === "percent"
      ? Math.min(Math.round((goods * voucher.value) / 100), voucher.cap ?? Infinity)
      : voucher?.kind === "amount"
        ? Math.min(voucher.value, goods)
        : 0;
  // Ưu đãi giảm 10% khi khách chọn tự đến lấy.
  const pickupDiscount = isPickup ? Math.round(goods * 0.1) : 0;
  const expressFee = express.enabled && !isPickup ? express.fee : 0;
  const total = Math.max(0, goods - discount - bogoDiscount - pickupDiscount) + shipping + expressFee;
  const dishCount = items.reduce((sum, item) => sum + item.qty, 0);
  const burgerQty = items.filter((item) => item.category === "burger").reduce((sum, item) => sum + item.qty, 0);

  const applyCode = () => {
    const key = code.trim().toUpperCase();
    const found = CODES[key];
    if (!found) {
      setVoucher(null);
      setCodeError("Mã không hợp lệ hoặc đã hết hạn.");
      return;
    }
    if (found.min && goods < found.min) {
      setVoucher(null);
      setCodeError(`Đơn tối thiểu ${formatVnd(found.min)} để dùng mã này.`);
      return;
    }
    setVoucher({ code: key, ...found });
    setCodeError("");
  };

  /** Voucher người dùng đã đổi bằng điểm Bun, sẵn sàng dùng cho đơn này. */
  const ownedVouchers = VOUCHERS.filter((v) => wallet.includes(v.id));

  /** Áp dụng một voucher trong ví (đổi bằng điểm) vào đơn hàng. */
  const applyWalletVoucher = (v: (typeof VOUCHERS)[number]) => {
    const d = v.discount;
    if (d.min && goods < d.min) {
      setCodeError(`Đơn tối thiểu ${formatVnd(d.min)} để dùng voucher này.`);
      return;
    }
    setVoucher({ code: v.id, label: v.label, kind: d.kind, value: d.value, cap: d.cap, min: d.min, walletId: v.id });
    setCode("");
    setCodeError("");
  };

  /** Phương thức cần xác thực bảo mật (3-D Secure / OTP). Tiền mặt thì không. */
  const DEMO_OTP = "246810";
  const needsVerify = payment !== "pm-cash";

  const placeOrder = () => {
    if (name.trim().length < 2) return setError("Bạn nhập giúp tên người nhận nhé.");
    if (phone.replace(/\D/g, "").length < 9) return setError("Số điện thoại chưa hợp lệ.");
    if (items.length === 0) return setError("Giỏ hàng đang trống.");
    setError("");
    if (needsVerify) {
      setOtp("");
      setOtpError("");
      setResendIn(30);
      setVerifying(true);
      return;
    }
    runFinalize();
  };

  /** Hiện hiệu ứng đang xử lý một nhịp rồi mới chốt đơn cho tự nhiên. */
  const runFinalize = () => {
    setProcessing(true);
    window.setTimeout(() => {
      finalizeOrder();
      setProcessing(false);
    }, 1200);
  };

  const finalizeOrder = () => {
    saveOrder({
      items,
      goods,
      discount: discount + bogoDiscount + pickupDiscount,
      shipping,
      total,
      address: orderAddress,
      name: name.trim(),
      phone: phone.trim(),
      etaMinutes: express.enabled ? express.eta : 22,
    });
    if (user) setEarned(earn(total));
    if (voucher?.walletId) useVoucher(voucher.walletId);
    setVerifying(false);
    setPlaced(true);
    clear();
  };

  const confirmOtp = () => {
    const code = otp.replace(/\D/g, "");
    if (code.length < 6) return setOtpError("Nhập đủ 6 số của mã xác thực nhé.");
    if (code !== DEMO_OTP) return setOtpError("Mã xác thực chưa đúng. Thử lại giúp mình.");
    setOtpError("");
    runFinalize();
  };

  // Địa chỉ "Giao đến" lấy từ thanh điều hướng (kho chung) đứng đầu danh sách.
  const deliveryAddresses = [{ id: "ad-nav", tag: "Giao đến", value: navAddress }, ...addresses];
  const address = deliveryAddresses.find((a) => a.id === addressId) ?? deliveryAddresses[0];
  // Địa chỉ ghi vào đơn: đến lấy thì ghi chi nhánh, giao hàng thì ghi địa chỉ.
  const orderAddress = isPickup ? `Đến lấy tại ${branch.name} · ${branch.district}` : address?.value ?? navAddress;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-[24px]">
      <button aria-label="Đóng" className="absolute inset-0 cursor-default bg-[#1a0507]/70 backdrop-blur-[5px]" onClick={onClose} type="button" />

      <div className="relative flex h-full max-h-full w-full flex-col overflow-hidden rounded-none bg-[#f3f3f3] shadow-[0px_40px_80px_rgba(74,0,1,0.45)] [animation:dish-in_0.3s_cubic-bezier(0.16,1,0.3,1)_both] sm:h-auto sm:max-h-[88vh] sm:max-w-[980px] sm:rounded-[26px]">
        {/* Header */}
        <div className="flex items-center gap-[12px] px-[26px] py-[20px] text-white" style={{ backgroundImage: "linear-gradient(100deg, #7f292a 0%, #b31419 45%, #fa6932 100%)" }}>
          <span className="text-[24px]">🧾</span>
          <div className="flex flex-col leading-tight">
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[23px]">Thanh toán</span>
            <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#f4de79]">{isPickup ? `🏬 Đến lấy tại ${branch.name}` : express.enabled ? `🛵 Giao siêu tốc ~${express.eta} phút` : "Giao trung bình 22 phút"} · {dishCount} món</span>
          </div>
          <button className="ml-auto cursor-pointer rounded-full p-[7px] transition-colors hover:bg-white/20" onClick={onClose} type="button">
            <svg className="size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {verifying && !placed ? (
          <div className="flex flex-col items-center gap-[16px] px-[40px] py-[46px] text-center">
            <span className="flex size-[76px] items-center justify-center rounded-full bg-[#eef7f1] text-[#22a06b] ring-1 ring-[#22a06b]/25">
              <svg className="size-[38px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24">
                <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <div className="flex flex-col gap-[6px]">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[27px] text-[#212121]">Xác thực thanh toán</span>
              <span className="max-w-[440px] font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] text-[#757575]">
                Tụi mình vừa gửi mã OTP 6 số qua tin nhắn tới {phone} để xác nhận giao dịch{" "}
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#3b2a20]">{PAYMENTS.find((p) => p.id === payment)?.label}</span>.
              </span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#a8927f]">Mã demo: {DEMO_OTP}</span>
            </div>

            <input
              autoFocus
              className="w-[260px] rounded-[14px] bg-[#f3f3f3] px-[16px] py-[15px] text-center font-['Source_Sans_Pro:Bold',sans-serif] text-[30px] tracking-[12px] text-[#3b2a20] outline-none ring-1 ring-[#f0e2d2] transition-colors duration-300 placeholder:tracking-[8px] placeholder:text-[#c3b0a2] focus:ring-2 focus:ring-[#22a06b]"
              inputMode="numeric"
              maxLength={6}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setOtpError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && confirmOtp()}
              placeholder="••••••"
              value={otp}
            />
            {otpError && <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#d9161c]">{otpError}</span>}

            <button
              className="cursor-pointer font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#d9161c] underline disabled:cursor-not-allowed disabled:text-[#c3b0a2] disabled:no-underline"
              disabled={resendIn > 0}
              onClick={() => {
                setResendIn(30);
                setOtp("");
                setOtpError("");
              }}
              type="button"
            >
              {resendIn > 0 ? `Gửi lại mã sau ${resendIn}s` : "Gửi lại mã OTP"}
            </button>

            <div className="mt-[6px] flex w-full max-w-[400px] gap-[12px]">
              <button
                className="flex-1 cursor-pointer rounded-[14px] bg-[#f5f0e8] px-[20px] py-[15px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#757575] transition-colors duration-300 hover:bg-[#ece4db]"
                onClick={() => setVerifying(false)}
                type="button"
              >
                Quay lại
              </button>
              <button
                className="flex flex-[1.4] cursor-pointer items-center justify-center gap-[9px] rounded-[14px] px-[20px] py-[15px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-white shadow-[0px_10px_24px_rgba(205,5,8,0.32)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={processing}
                onClick={confirmOtp}
                style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
                type="button"
              >
                {processing ? (
                  <>
                    <Spinner /> Đang xác thực…
                  </>
                ) : (
                  `Xác nhận · ${formatVnd(total)}`
                )}
              </button>
            </div>
          </div>
        ) : placed ? (
          <div className="flex flex-col items-center gap-[12px] px-[40px] py-[70px] text-center">
            <span className="text-[58px]">{isPickup ? "🏬" : "🎉"}</span>
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[30px] text-[#212121]">Đặt hàng thành công!</span>
            <span className="max-w-[460px] font-['Source_Sans_Pro:Regular',sans-serif] text-[18px] text-[#757575]">
              {isPickup ? (
                <>Bếp đang chuẩn bị đơn của bạn. Khi món sẵn sàng, tụi mình sẽ gọi số <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#3b2a20]">{phone}</span> để bạn tới lấy tại <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#3b2a20]">{branch.name} · {branch.district}</span>.</>
              ) : (
                <>Đơn của bạn đang được bếp xác nhận. Tụi mình sẽ gọi số <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#3b2a20]">{phone}</span> trước khi giao tới <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#3b2a20]">{address?.value}</span>.</>
              )}
            </span>
            {isPickup && (
              <div className="mt-[2px] flex items-center gap-[10px] rounded-[16px] bg-[#fff8ef] px-[16px] py-[12px] text-left ring-1 ring-[#f7c9a8]">
                <span className="text-[22px]">📞</span>
                <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#a05a1e]">
                  Nhớ nghe máy nha — tụi mình gọi báo <span className="font-['Source_Sans_Pro:Bold',sans-serif]">"đơn đã sẵn sàng"</span> rồi bạn ghé lấy trong 15 phút để món còn nóng giòn 🔥
                </span>
              </div>
            )}
            {user ? (
              earned > 0 && (
                <div
                  className="mt-[6px] flex items-center gap-[12px] rounded-[16px] px-[18px] py-[13px] text-white shadow-[0px_10px_24px_rgba(205,5,8,0.28)]"
                  style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 80%)" }}
                >
                  <span className="text-[30px]">🥟</span>
                  <span className="flex flex-col items-start leading-tight">
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[20px]">+{earned.toLocaleString("vi-VN")} Bun</span>
                    <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#ffe6c2]">Đã cộng vào tài khoản thành viên của bạn</span>
                  </span>
                </div>
              )
            ) : (
              <div className="mt-[6px] flex items-center gap-[10px] rounded-[16px] bg-[#fff8ef] px-[16px] py-[12px] ring-1 ring-[#f7c9a8]">
                <span className="text-[22px]">🥟</span>
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#fa6932]">
                  Đăng nhập lần sau để tích {Math.floor(total / 1000).toLocaleString("vi-VN")} Bun cho đơn này nhé!
                </span>
              </div>
            )}
            <button
              className="mt-[10px] cursor-pointer rounded-[14px] px-[30px] py-[14px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-white transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
              onClick={onClose}
              style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
              type="button"
            >
              Xong
            </button>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
            {/* Left: form */}
            <div className="flex min-w-0 flex-1 flex-col gap-[16px] p-[16px] sm:p-[22px] lg:overflow-y-auto">
              {!user && (
                <div
                  className="relative flex w-full shrink-0 flex-col gap-[22px] overflow-hidden rounded-[26px] p-[30px] text-white"
                  style={{ backgroundImage: "linear-gradient(115deg, #7f292a 0%, #d9161c 60%, #fa6932 110%)" }}
                >
                  <div className="pointer-events-none absolute -right-[30px] top-[-50px] size-[220px] rounded-full bg-[#f4de79] opacity-25 blur-[70px]" />
                  <div className="relative flex items-start gap-[20px]">
                    <span className="flex size-[68px] shrink-0 items-center justify-center rounded-[20px] bg-white/15 text-[40px] ring-1 ring-white/25">🎁</span>
                    <div className="flex min-w-0 flex-1 flex-col gap-[10px] leading-snug">
                      <span className="w-fit rounded-full bg-[#f4de79] px-[14px] py-[4px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] tracking-[1px] text-[#7f292a] uppercase">
                        Ưu đãi thành viên
                      </span>
                      <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[27px] leading-[1.25]">Đăng nhập để nhận ưu đãi hấp dẫn!</span>
                      <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[18px] leading-[1.55] text-[#ffe6c2]">
                        Tạo tài khoản Bite & Bun chỉ mất 30 giây — nhận ngay quà chào mừng và tích điểm cho mọi đơn hàng.
                      </span>
                    </div>
                  </div>

                  <div className="relative flex flex-col gap-[12px]">
                    {[
                      { icon: "🎟️", title: "Voucher chào mừng", desc: "Giảm ngay 50.000đ cho đơn đầu tiên" },
                      { icon: "🥟", title: "Tích điểm Bun mỗi đơn", desc: "1.000đ = 1 Bun, đổi món & quà hấp dẫn" },
                      { icon: "🚚", title: "Freeship đơn đầu tiên", desc: "Không giới hạn khoảng cách trong nội thành" },
                    ].map((perk) => (
                      <div className="flex items-center gap-[14px] rounded-[16px] bg-white/12 px-[16px] py-[13px] ring-1 ring-white/15" key={perk.title}>
                        <span className="flex size-[42px] shrink-0 items-center justify-center rounded-[13px] bg-white/20 text-[22px]">{perk.icon}</span>
                        <div className="flex min-w-0 flex-1 flex-col leading-tight">
                          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-white">{perk.title}</span>
                          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#ffe6c2]">{perk.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative flex w-full flex-wrap gap-[12px]">
                    <button
                      className="min-w-[160px] flex-1 cursor-pointer whitespace-nowrap rounded-[14px] bg-[#f4de79] px-[20px] py-[15px] font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-[#7f292a] shadow-[0px_8px_20px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
                      onClick={() => openAuth("register")}
                      type="button"
                    >
                      Đăng ký ngay
                    </button>
                    <button
                      className="min-w-[160px] flex-1 cursor-pointer whitespace-nowrap rounded-[14px] bg-white/15 px-[20px] py-[15px] font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-white ring-1 ring-white/30 transition-colors duration-300 hover:bg-white/25"
                      onClick={() => openAuth("login")}
                      type="button"
                    >
                      Đã có tài khoản? Đăng nhập
                    </button>
                  </div>
                </div>
              )}

              <SectionCard step={1} title={isPickup ? "Nhận tại cửa hàng" : "Địa chỉ giao hàng"}>
                {isPickup ? (
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex items-start gap-[12px] rounded-[16px] bg-[#f6ece9] px-[14px] py-[12px] ring-1 ring-[#d9161c]">
                      <span className="mt-[2px] text-[22px]">🏬</span>
                      <div className="flex min-w-0 flex-1 flex-col gap-[7px]">
                        <span className="w-fit rounded-full bg-[#f7e7a8] px-[10px] py-[2px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#a86800]">Chi nhánh đến lấy</span>
                        <select className={inputClass} onChange={(e) => setBranch(e.target.value)} value={branch.id}>
                          {[...BRANCHES].sort((a, b) => a.km - b.km).map((item) => (
                            <option key={item.id} value={item.id}>{item.name} · {item.district}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-[8px] rounded-[12px] bg-[#e6f4ec] px-[12px] py-[9px]">
                      <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#22a06b]">✓ Tự đến lấy — miễn phí giao & giảm 10% 🎉</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {deliveryAddresses.map((entry) => (
                      <div className="flex flex-col gap-[10px]" key={entry.id}>
                        <button
                          className={`flex w-full items-start gap-[12px] rounded-[16px] px-[14px] py-[12px] text-left ring-1 transition-colors duration-300 ${
                            addressId === entry.id ? "bg-[#f6ece9] ring-[#d9161c]" : "bg-[#f3f3f3] ring-[#f0e2d2] hover:bg-[#f3f3f3]"
                          }`}
                          onClick={() => setAddressId(entry.id)}
                          type="button"
                        >
                          <span
                            className={`mt-[3px] flex size-[20px] shrink-0 items-center justify-center rounded-full border-2 ${
                              addressId === entry.id ? "border-[#d9161c] bg-[#d9161c]" : "border-[#dcc9b8]"
                            }`}
                          >
                            {addressId === entry.id && <span className="size-[7px] rounded-full bg-white" />}
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                            <span className="w-fit rounded-full bg-[#f7e7a8] px-[10px] py-[2px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#a86800]">
                              {entry.tag}{entry.id === "ad-nav" ? " · từ thanh điều hướng" : ""}
                            </span>
                            <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] text-[#3b2a20]">{entry.value || "Nhập địa chỉ giao hàng"}</span>
                          </span>
                          <span
                            className="shrink-0 cursor-pointer font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#d9161c] underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditing(entry.id);
                              setDraft(entry.value);
                            }}
                          >
                            Đổi
                          </span>
                        </button>

                        {editing === entry.id && (
                          <div className="flex gap-[10px]">
                            <input autoFocus className={inputClass} onChange={(e) => setDraft(e.target.value)} placeholder="Nhập địa chỉ mới" value={draft} />
                            <button
                              className="shrink-0 cursor-pointer rounded-[12px] bg-[#d9161c] px-[18px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-white transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
                              onClick={() => {
                                if (draft.trim()) {
                                  if (entry.id === "ad-nav") setNavAddress(draft.trim());
                                  else setAddresses((prev) => prev.map((a) => (a.id === entry.id ? { ...a, value: draft.trim() } : a)));
                                }
                                setEditing(null);
                              }}
                              type="button"
                            >
                              Lưu
                            </button>
                            <button
                              className="shrink-0 cursor-pointer rounded-[12px] bg-[#f5f0e8] px-[18px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#757575]"
                              onClick={() => setEditing(null)}
                              type="button"
                            >
                              Huỷ
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      className="cursor-pointer rounded-[14px] border-2 border-dashed border-[#dcc9b8] py-[12px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#a8927f] transition-colors duration-300 hover:border-[#d9161c] hover:text-[#d9161c]"
                      onClick={() => {
                        const id = `ad-${Date.now()}`;
                        setAddresses((prev) => [...prev, { id, tag: "Khác", value: "Địa chỉ mới" }]);
                        setAddressId(id);
                        setEditing(id);
                        setDraft("");
                      }}
                      type="button"
                    >
                      + Thêm địa chỉ mới
                    </button>
                  </>
                )}
              </SectionCard>

              <SectionCard step={2} title="Người nhận">
                <div className="flex gap-[12px]">
                  <label className="flex min-w-0 flex-1 flex-col gap-[6px]">
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#a8927f]">Tên khách hàng</span>
                    <input className={inputClass} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" value={name} />
                  </label>
                  <label className="flex min-w-0 flex-1 flex-col gap-[6px]">
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#a8927f]">Số điện thoại</span>
                    <input className={inputClass} onChange={(e) => setPhone(e.target.value)} placeholder="09xx xxx xxx" value={phone} />
                  </label>
                </div>
                <label className="flex flex-col gap-[6px]">
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#a8927f]">Ghi chú cho quán</span>
                  <input className={inputClass} onChange={(e) => setNote(e.target.value)} placeholder="Ít cay, giao tới sảnh giúp mình…" value={note} />
                </label>
              </SectionCard>

              <SectionCard step={3} title={`Món ăn (${dishCount})`}>
                {items.length === 0 ? (
                  <p className="py-[16px] text-center font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] text-[#a8927f]">Giỏ hàng đang trống.</p>
                ) : (
                  items.map((item) => (
                    <div className="flex items-center gap-[12px]" key={item.id}>
                      <img alt={item.name} className="size-[56px] shrink-0 rounded-[13px] object-cover" src={item.image} />
                      <span className="flex min-w-0 flex-1 flex-col leading-tight">
                        <span className="truncate font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#212121]">{item.name}</span>
                        <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#d9161c]">{formatVnd(item.price)}</span>
                      </span>
                      <div className="flex shrink-0 items-center gap-[8px] rounded-full bg-[#f6ece9] px-[8px] py-[5px]">
                        <button className="flex size-[24px] cursor-pointer items-center justify-center rounded-full bg-white text-[#d9161c]" onClick={() => decrease(item.id)} type="button">
                          <svg className="size-[13px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" viewBox="0 0 24 24">
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                        <span className="min-w-[18px] text-center font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#212121] tabular-nums">{item.qty}</span>
                        <button className="flex size-[24px] cursor-pointer items-center justify-center rounded-full bg-[#d9161c] text-white" onClick={() => increase(item.id)} type="button">
                          <svg className="size-[13px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>
                      <button className="shrink-0 cursor-pointer text-[#c9c9c9] transition-colors hover:text-[#d9161c]" onClick={() => remove(item.id)} type="button">
                        <svg className="size-[17px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </SectionCard>

              <SectionCard step={4} title="Món thêm">
                <div className="flex flex-wrap gap-[10px]">
                  {ADDONS.map((addon) => {
                    const on = addons.includes(addon.id);
                    return (
                      <button
                        className={`flex items-center gap-[9px] rounded-[999px] px-[16px] py-[11px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] ring-1 transition-all duration-300 ${
                          on ? "bg-[#d9161c] text-white ring-[#d9161c]" : "bg-[#f3f3f3] text-[#4a3b33] ring-[#f0e2d2] hover:-translate-y-[2px] hover:bg-[#f3f3f3]"
                        }`}
                        key={addon.id}
                        onClick={() => setAddons((prev) => (on ? prev.filter((id) => id !== addon.id) : [...prev, addon.id]))}
                        type="button"
                      >
                        <span className="text-[18px]">{addon.emoji}</span>
                        {addon.label}
                        <span className={on ? "text-[#f4de79]" : "text-[#a8927f]"}>{addon.price === 0 ? "Miễn phí" : `+${formatVnd(addon.price)}`}</span>
                      </button>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard step={5} title="Phương thức thanh toán">
                {PAYMENTS.map((method) => (
                  <button
                    className={`flex items-center gap-[13px] rounded-[16px] px-[14px] py-[12px] text-left ring-1 transition-colors duration-300 ${
                      payment === method.id ? "bg-[#f6ece9] ring-[#d9161c]" : "bg-[#f3f3f3] ring-[#f0e2d2] hover:bg-[#f3f3f3]"
                    }`}
                    key={method.id}
                    onClick={() => setPayment(method.id)}
                    type="button"
                  >
                    <span className="flex size-[42px] shrink-0 items-center justify-center rounded-[13px] bg-white text-[20px] shadow-[0px_4px_10px_rgba(205,5,8,0.1)]">{method.emoji}</span>
                    <span className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#3b2a20]">{method.label}</span>
                      <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#a8927f]">{method.note}</span>
                    </span>
                    <span className={`flex size-[20px] shrink-0 items-center justify-center rounded-full border-2 ${payment === method.id ? "border-[#d9161c] bg-[#d9161c]" : "border-[#dcc9b8]"}`}>
                      {payment === method.id && <span className="size-[7px] rounded-full bg-white" />}
                    </span>
                  </button>
                ))}
                <div className="flex items-start gap-[11px] rounded-[14px] bg-[#eef7f1] px-[14px] py-[12px] ring-1 ring-[#22a06b]/25">
                  <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#22a06b]/12 text-[#22a06b]">
                    <svg className="size-[19px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </span>
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#1c7a52]">Thanh toán được bảo mật</span>
                    <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#4a8c6e]">
                      Mã hoá SSL 256-bit · Xác thực 3-D Secure bằng OTP · Bite &amp; Bun không lưu số thẻ của bạn.
                    </span>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Right: summary */}
            <div className="flex w-full shrink-0 flex-col gap-[16px] border-t border-[#f0e8e2] bg-white p-[16px] sm:p-[22px] lg:w-[340px] lg:overflow-y-auto lg:border-l lg:border-t-0">
              {ownedVouchers.length > 0 && (
                <div className="flex flex-col gap-[10px] rounded-[18px] bg-[#fff8ef] p-[16px] ring-1 ring-[#f7c9a8]">
                  <span className="flex items-center gap-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] tracking-[2px] text-[#d9161c] uppercase">
                    🎟️ Voucher của bạn
                  </span>
                  {ownedVouchers.map((v) => {
                    const applied = voucher?.walletId === v.id;
                    return (
                      <div className="flex items-center gap-[11px] rounded-[14px] bg-white px-[13px] py-[11px] ring-1 ring-[#f0e2d2]" key={v.id}>
                        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[11px] bg-[#f6ece9] text-[19px]">{v.emoji}</span>
                        <span className="flex min-w-0 flex-1 flex-col leading-tight">
                          <span className="truncate font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#3b2a20]">{v.label}</span>
                          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] text-[#a8927f]">{v.note}</span>
                        </span>
                        <button
                          className={`shrink-0 cursor-pointer rounded-[10px] px-[13px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] whitespace-nowrap transition-all duration-300 ${
                            applied ? "bg-[#e6f4ec] text-[#22a06b]" : "bg-[#d9161c] text-white hover:-translate-y-[2px] active:scale-95"
                          }`}
                          onClick={() => (applied ? setVoucher(null) : applyWalletVoucher(v))}
                          type="button"
                        >
                          {applied ? "Đang dùng ✓" : "Dùng"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-col gap-[10px] rounded-[18px] bg-[#f3f3f3] p-[16px] ring-1 ring-[#f0e2d2]">
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] tracking-[2px] text-[#a8927f] uppercase">Mã giảm giá</span>
                <div className="flex gap-[8px]">
                  <input
                    className={inputClass}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setCodeError("");
                    }}
                    placeholder="VD: BUN15"
                    value={code}
                  />
                  <button
                    className="shrink-0 cursor-pointer rounded-[12px] bg-[#d9161c] px-[16px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-white transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
                    onClick={applyCode}
                    type="button"
                  >
                    Áp dụng
                  </button>
                </div>
                {codeError && <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#d9161c]">{codeError}</span>}
                {voucher && (
                  <div className="flex items-center gap-[8px] rounded-[12px] bg-[#e6f4ec] px-[12px] py-[9px]">
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#22a06b]">✓ {voucher.label}</span>
                    <button className="ml-auto cursor-pointer font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#757575] underline" onClick={() => setVoucher(null)} type="button">
                      Bỏ
                    </button>
                  </div>
                )}
                <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#a8927f]">Đang chạy: BUN15 · BUN50K · FREESHIP</span>
              </div>

              <div className="flex flex-col gap-[9px] font-['Source_Sans_Pro:Regular',sans-serif] text-[17px]">
                <div className="flex justify-between text-[#757575]">
                  <span>Tiền món ({dishCount})</span>
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#212121]">{formatVnd(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#757575]">
                  <span>Món thêm ({addons.length})</span>
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#212121]">{formatVnd(addonTotal)}</span>
                </div>
                <div className="flex justify-between text-[#757575]">
                  <span>{isPickup ? "Phí giao (đến lấy)" : "Phí giao hàng"}</span>
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#212121]">{shipping === 0 ? "Miễn phí" : formatVnd(shipping)}</span>
                </div>
                {pickupDiscount > 0 && (
                  <div className="flex justify-between text-[#22a06b]">
                    <span>🏬 Ưu đãi đến lấy (-10%)</span>
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif]">-{formatVnd(pickupDiscount)}</span>
                  </div>
                )}
                {express.enabled && (
                  <div className="flex justify-between text-[#fa6932]">
                    <span>🛵 Giao siêu tốc ({express.eta}′)</span>
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif]">+{formatVnd(expressFee)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-[#22a06b]">
                    <span>Giảm giá</span>
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif]">-{formatVnd(discount)}</span>
                  </div>
                )}
                {bogoDiscount > 0 && (
                  <div className="flex justify-between text-[#22a06b]">
                    <span>🍔 Mua 1 Tặng 1 ({bogoFreeCount} burger)</span>
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif]">-{formatVnd(bogoDiscount)}</span>
                  </div>
                )}
                <div className="mt-[4px] flex items-center justify-between border-t border-dashed border-[#e9e0d8] pt-[12px]">
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-[#212121]">Tổng cộng</span>
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[26px] text-[#d9161c]">{formatVnd(total)}</span>
                </div>
              </div>

              {/* Ưu đãi Mua 1 Tặng 1 burger */}
              {burgerQty > 0 &&
                (bogoFreeCount > 0 ? (
                  <div className="flex items-center gap-[10px] rounded-[16px] bg-[#e6f4ec] p-[12px] ring-1 ring-[#22a06b]/25">
                    <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#22a06b]/12 text-[22px]">🍔</span>
                    <div className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#22a06b]">Mua 1 Tặng 1 — bạn được tặng {bogoFreeCount} burger!</span>
                      <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#4a8c6e]">Đã trừ {formatVnd(bogoDiscount)} vào tổng đơn.</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-[8px] rounded-[16px] bg-[#fff8ef] p-[12px] ring-1 ring-[#f7c9a8]">
                    <span className="text-[18px]">🍔</span>
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#fa6932]">Thêm 1 burger nữa để được tặng 1 chiếc miễn phí!</span>
                  </div>
                ))}

              {/* Quà tặng túi tote đại lễ 2/9 */}
              {goods > 0 &&
                (goods >= FREE_SHIP_FROM ? (
                  <div className="flex items-center gap-[12px] rounded-[16px] bg-[#e6f4ec] p-[12px] ring-1 ring-[#22a06b]/25">
                    <img alt="Túi tote quà tặng Bite & Bun" className="size-[54px] shrink-0 rounded-[12px] object-cover" src={image_acb08d57_b730_42ea_8202_cbc919c74ade_3} />
                    <div className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#22a06b]">🎁 Bạn được tặng 1 túi tote miễn phí!</span>
                      <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#4a8c6e]">Túi canvas đại lễ 2/9 sẽ được giao kèm đơn hàng.</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-[8px] rounded-[16px] bg-[#fff8ef] p-[12px] ring-1 ring-[#f7c9a8]">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[18px]">🎁</span>
                      <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#fa6932]">
                        Mua thêm {formatVnd(FREE_SHIP_FROM - goods)} để được tặng túi tote miễn phí
                      </span>
                    </div>
                    <div className="h-[9px] w-full overflow-hidden rounded-full bg-[#f3ece9]">
                      <div
                        className="h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${Math.min(100, Math.round((goods / FREE_SHIP_FROM) * 100))}%`, backgroundImage: "linear-gradient(90deg, #f4de79 0%, #fa6932 55%, #d9161c 100%)" }}
                      />
                    </div>
                  </div>
                ))}

              {error &&<span className="rounded-[12px] bg-[#ffeceb] px-[12px] py-[9px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#d9161c]">{error}</span>}

              <button
                className="mt-auto flex cursor-pointer items-center justify-center gap-[10px] rounded-[14px] px-[20px] py-[16px] font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-white shadow-[0px_10px_24px_rgba(205,5,8,0.32)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={items.length === 0 || processing}
                onClick={placeOrder}
                style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
                type="button"
              >
                {processing ? (
                  <>
                    <Spinner /> Đang xử lý…
                  </>
                ) : needsVerify ? (
                  `🔒 Xác thực & đặt đơn · ${formatVnd(total)}`
                ) : (
                  `Đặt đơn · ${formatVnd(total)}`
                )}
              </button>
              <span className="flex items-center justify-center gap-[6px] text-center font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#a8927f]">
                <svg className="size-[14px] shrink-0 text-[#22a06b]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <rect height="11" rx="2" width="16" x="4" y="10" />
                  <path d="M8 10V7a4 4 0 1 1 8 0v3" />
                </svg>
                {needsVerify ? "Giao dịch được mã hoá & xác thực OTP an toàn." : note ? `Ghi chú: ${note}` : "Bấm đặt đơn là bạn đồng ý với điều khoản của Bite & Bun."}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
