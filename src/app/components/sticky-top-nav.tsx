import { useEffect, useState } from "react";
import imgLogoMark from "../../imports/Sections/66f9623bc1d5702815f0f81cc5bd3c3a7168f6be.png";
import imgWordmark from "../../imports/Sections/bite-bun-wordmark-white.png";
import { useMenuFilter } from "./menu-filter";
import { useAuth } from "./auth-store";
import { AccountChip } from "./account-chip";
import { useCart } from "./cart-store";
import { setAddress, useAddress } from "./address-store";
import { useBranch } from "./branch-store";
import { useOrderMode } from "./order-mode-store";

const LINKS = ["Trang chủ", "Thực đơn", "Đặt bàn", "Khuyến mãi", "Về chúng tôi"];

/**
 * Compact, fixed twin of the hero top nav. Same brand language (deep red →
 * ember gradient, cream text, gold accents) so the two bars read as one system.
 */
export function StickyTopNav() {
  const [shown, setShown] = useState(false);
  const { openMenu } = useMenuFilter();
  const { openAuth, user } = useAuth();
  const { count, setOpen } = useCart();
  const [editingAddress, setEditingAddress] = useState(false);
  const address = useAddress();
  const mode = useOrderMode();
  const branch = useBranch();

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className="relative flex h-[68px] items-center gap-[12px] overflow-hidden px-[14px] shadow-[0px_10px_30px_rgba(160,0,3,0.3)] sm:h-[104px] sm:gap-[28px] sm:px-[32px] xl:px-[64px]"
        style={{ backgroundImage: "linear-gradient(100deg, #7f292a 0%, #b31419 40%, #e5471f 78%, #fa6932 100%)" }}
      >
        <div className="pointer-events-none absolute -left-[60px] top-[-90px] size-[240px] rounded-full bg-[#fa6932] opacity-25 blur-[70px]" />
        <div className="pointer-events-none absolute right-[160px] top-[-120px] size-[260px] rounded-full bg-[#f4de79] opacity-20 blur-[80px]" />

        {/* Brand */}
        <a className="group relative flex shrink-0 items-center gap-[10px]" href="#top">
          <img
            alt="Bite & Bun"
            className="size-[52px] shrink-0 object-contain brightness-110 contrast-[1.12] saturate-[1.15] drop-shadow-[0px_0px_26px_rgba(255,224,138,0.8)] drop-shadow-[0px_0px_12px_rgba(255,255,255,0.55)] drop-shadow-[0px_8px_18px_rgba(74,0,1,0.5)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-4deg] group-hover:scale-110 group-hover:drop-shadow-[0px_0px_38px_rgba(255,224,138,1)] sm:size-[168px]"
            src={imgLogoMark}
          />
          <img
            alt="Bite & Bun"
            className="-ml-[14px] hidden h-[92px] w-auto shrink-0 object-contain drop-shadow-[0px_4px_10px_rgba(74,0,1,0.45)] sm:block"
            src={imgWordmark}
            style={{
              filter:
                "brightness(0) saturate(100%) invert(89%) sepia(38%) saturate(628%) hue-rotate(332deg) brightness(101%) contrast(95%) drop-shadow(0px 4px 10px rgba(74,0,1,0.45))",
            }}
          />
        </a>

        {/* Primary links */}
        <nav className="relative hidden items-center gap-[4px] xl:flex xl:mx-auto">
          {LINKS.map((label, i) => (
            <a
              className={`group relative rounded-[999px] px-[16px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] whitespace-nowrap transition-colors duration-300 ${
                i === 0
                  ? "bg-[#f4de79] text-[#7f292a] shadow-[0px_5px_14px_rgba(255,179,14,0.45)]"
                  : "text-[#f7e7a8] hover:bg-white/12 hover:text-white"
              }`}
              href="#top"
              key={label}
              onClick={
                label === "Thực đơn"
                  ? (e) => {
                      e.preventDefault();
                      openMenu("all");
                    }
                  : label === "Đặt bàn" || label === "Khuyến mãi" || label === "Về chúng tôi"
                    ? (e) => {
                        e.preventDefault();
                        const selector =
                          label === "Đặt bàn"
                            ? '[data-name="Reservation"]'
                            : label === "Khuyến mãi"
                              ? '[data-name="Flash Deals"]'
                              : '[data-name="Features"]';
                        document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    : undefined
              }
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Address */}
        <div
          className={`relative ml-auto hidden min-w-[240px] max-w-[360px] shrink-0 items-center gap-[8px] rounded-[999px] border px-[16px] py-[8px] transition-colors duration-300 lg:flex xl:ml-0 ${
            editingAddress ? "border-[#f4de79] bg-white/20" : `border-white/20 bg-white/12 hover:bg-white/20 ${mode === "delivery" ? "cursor-text" : "cursor-default"}`
          }`}
          onClick={() => {
            if (mode === "delivery") setEditingAddress(true);
          }}
        >
          {mode === "pickup" ? (
            <svg className="size-[18px] shrink-0 text-[#f4de79]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 7h16l-1.3 13.1a1 1 0 0 1-1 .9H6.3a1 1 0 0 1-1-.9L4 7Z" />
              <path d="M8.5 7a3.5 3.5 0 0 1 7 0" />
            </svg>
          ) : (
            <svg className="size-[18px] shrink-0 text-[#f4de79]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          )}
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[12px] whitespace-nowrap text-[#f4de79]">{mode === "pickup" ? "Đến lấy tại" : "Giao đến"}</span>
            {mode === "pickup" ? (
              <span className="truncate font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#f3f3f3]">
                {branch.name} · {branch.district}
              </span>
            ) : editingAddress ? (
              <input
                autoFocus
                className="w-[240px] bg-transparent font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#f3f3f3] outline-none placeholder:font-normal placeholder:text-[#f4de79]/70"
                onBlur={() => setEditingAddress(false)}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") setEditingAddress(false);
                }}
                placeholder="Nhập địa chỉ giao hàng"
                value={address}
              />
            ) : (
              <span className={`truncate font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] ${address ? "text-[#f3f3f3]" : "text-[#f4de79]"}`}>
                {address || "Nhập địa chỉ giao hàng"}
              </span>
            )}
          </div>
          {mode === "delivery" && !editingAddress && (
            <svg className="size-[15px] shrink-0 text-[#f4de79]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 20h4l10-10-4-4L4 16v4Z" />
              <path d="m14.5 5.5 4 4" />
            </svg>
          )}
        </div>

        {/* Actions */}
        <div className="relative ml-auto flex shrink-0 items-center gap-[10px] lg:ml-0">
          <button className="flex size-[42px] cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/12 text-[#f3f3f3] transition-all duration-300 hover:scale-105 hover:bg-white/25" type="button">
            <svg className="size-[19px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          <button
            aria-label="Giỏ hàng"
            className="relative flex size-[42px] cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/12 text-[#f3f3f3] transition-all duration-300 hover:scale-105 hover:bg-white/25"
            onClick={() => setOpen(true)}
            type="button"
          >
            <svg className="size-[19px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M4 6h16l-1.2 11.1a1 1 0 0 1-1 .9H6.2a1 1 0 0 1-1-.9L4 6Z" />
              <path d="M9 10a3 3 0 0 0 6 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-[2px] -top-[2px] flex size-[20px] items-center justify-center rounded-full bg-[#f4de79] font-['Source_Sans_Pro:Bold',sans-serif] text-[12px] text-[#7f292a] tabular-nums">
                {count}
              </span>
            )}
          </button>

          {user ? (
            <AccountChip />
          ) : (
            <button
              className="flex cursor-pointer items-center gap-[8px] rounded-[999px] px-[22px] py-[11px] shadow-[0px_8px_20px_rgba(255,138,0,0.45)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
              onClick={() => openAuth("login")}
              style={{ backgroundImage: "linear-gradient(135deg, #f4de79 0%, #f4de79 45%, #fa6932 100%)" }}
              type="button"
            >
              <svg className="size-[18px] text-[#7f292a]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
              </svg>
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#7f292a] whitespace-nowrap">Đăng nhập</span>
            </button>
          )}
        </div>
      </div>

      <div className="h-[3px] w-full" style={{ backgroundImage: "linear-gradient(90deg, #f4de79 0%, #f4de79 35%, #fa6932 70%, #fa6932 100%)" }} />
    </div>
  );
}
