import imgLogoMark from "../../imports/Sections/66f9623bc1d5702815f0f81cc5bd3c3a7168f6be.png";
import imgWordmark from "../../imports/Sections/bite-bun-wordmark-white.png";
import { useMenuFilter } from "./menu-filter";
import { useAuth } from "./auth-store";
import { AccountChip } from "./account-chip";
import { FavoritesButton } from "./favorites-button";
import { BranchPicker } from "./branch-picker";

const LINKS = ["Trang chủ", "Thực đơn", "Đặt bàn", "Khuyến mãi", "Về chúng tôi"];

/** Redesigned top nav bar for the hero section. */
export function TopNavRedesign() {
  const { openMenu } = useMenuFilter();
  const { openAuth, user } = useAuth();

  return (
    <div className="absolute left-0 right-0 top-0 z-[2]" data-name="Top Nav">
      <div
        className="relative flex h-[176px] items-center gap-[24px] overflow-hidden px-[48px] shadow-[0px_10px_30px_rgba(160,0,3,0.25)]"
        style={{ backgroundImage: "linear-gradient(100deg, #7f292a 0%, #b31419 40%, #e5471f 78%, #fa6932 100%)" }}
      >
        <div className="pointer-events-none absolute -left-[80px] top-[-120px] size-[300px] rounded-full bg-[#fa6932] opacity-25 blur-[80px]" />
        <div className="pointer-events-none absolute right-[180px] top-[-160px] size-[320px] rounded-full bg-[#f4de79] opacity-20 blur-[90px]" />

        {/* Brand */}
        <a className="group relative flex shrink-0 items-center gap-[10px]" href="#top">
          <img
            alt="Bite & Bun"
            className="h-[256px] w-[256px] shrink-0 animate-[hero-float_5s_ease-in-out_infinite] object-contain brightness-110 contrast-[1.12] saturate-[1.15] drop-shadow-[0px_0px_44px_rgba(255,224,138,0.85)] drop-shadow-[0px_0px_18px_rgba(255,255,255,0.6)] drop-shadow-[0px_14px_26px_rgba(74,0,1,0.55)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-5deg] group-hover:scale-110 group-hover:drop-shadow-[0px_0px_60px_rgba(255,224,138,1)]"
            src={imgLogoMark}
          />
          <img
            alt="Bite & Bun"
            className="-ml-[14px] h-[112px] w-auto shrink-0 object-contain drop-shadow-[0px_6px_14px_rgba(74,0,1,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            src={imgWordmark}
            style={{
              filter:
                "brightness(0) saturate(100%) invert(89%) sepia(38%) saturate(628%) hue-rotate(332deg) brightness(101%) contrast(95%) drop-shadow(0px 6px 14px rgba(74,0,1,0.45))",
            }}
          />
        </a>

        {/* Primary links */}
        <nav className="relative flex items-center gap-[6px]">
          {LINKS.map((label, i) => (
            <a
              className={`group relative rounded-[999px] px-[16px] py-[11px] font-['Source_Sans_Pro:Bold',sans-serif] text-[20px] whitespace-nowrap transition-colors duration-300 ${
                i === 0 ? "bg-[#f4de79] text-[#7f292a] shadow-[0px_6px_16px_rgba(255,179,14,0.45)]" : "text-[#f7e7a8] hover:bg-white/12 hover:text-white"
              }`}
              href="#top"
              key={label}
              onClick={(e) => {
                /* Every link does something: menu opens the dish modal, the
                   others scroll to their section. */
                if (label === "Thực đơn") {
                  e.preventDefault();
                  openMenu("all");
                  return;
                }
                if (label === "Trang chủ") return;
                e.preventDefault();
                const selector =
                  label === "Đặt bàn"
                    ? '[data-name="Reservation"]'
                    : label === "Khuyến mãi"
                      ? '[data-name="Flash Deals"]'
                      : '[data-name="Features"]';
                document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {label}
              <span className="absolute bottom-[4px] left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#f4de79] transition-all duration-300 group-hover:w-[24px]" />
            </a>
          ))}
        </nav>

        {/* Branch */}
        <BranchPicker big />

        {/* Actions */}
        <div className="relative ml-auto flex shrink-0 items-center gap-[12px]">
          <button className="flex size-[54px] cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/12 text-[#f3f3f3] transition-all duration-300 hover:scale-105 hover:bg-white/25" type="button">
            <svg className="size-[24px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          <FavoritesButton big />

          {user ? (
            <AccountChip big />
          ) : (
            <button
              className="flex cursor-pointer items-center gap-[10px] rounded-[999px] px-[30px] py-[15px] shadow-[0px_8px_20px_rgba(255,138,0,0.45)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
              onClick={() => openAuth("login")}
              style={{ backgroundImage: "linear-gradient(135deg, #f4de79 0%, #f4de79 45%, #fa6932 100%)" }}
              type="button"
            >
              <svg className="size-[22px] text-[#7f292a]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
              </svg>
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[22px] text-[#7f292a] whitespace-nowrap">Đăng nhập</span>
            </button>
          )}
        </div>
      </div>

      <div className="h-[4px] w-full" style={{ backgroundImage: "linear-gradient(90deg, #f4de79 0%, #f4de79 35%, #fa6932 70%, #fa6932 100%)" }} />
    </div>
  );
}
