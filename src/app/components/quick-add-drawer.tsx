import { useEffect, useMemo, useState } from "react";
import { formatVnd, useCart } from "./cart-store";
import { COMBO_UPGRADE, SEASONAL_DIPS, TOPPINGS, type MenuItem } from "./menu-data";

/**
 * Smart Pairing Engine — Quick Add drawer.
 * Xuất hiện khi khách chọn món Signature / Theo mùa, gợi ý nâng cấp Combo,
 * topping và sốt theo mùa để tối đa hóa Giá trị trung bình đơn hàng (AOV).
 */
export function QuickAddDrawer({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { add } = useCart();
  const [combo, setCombo] = useState(false);
  const [toppings, setToppings] = useState<string[]>([]);
  const [dips, setDips] = useState<string[]>([]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const toggle = (list: string[], setList: (v: string[]) => void, id: string) =>
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const extras = useMemo(() => {
    const t = TOPPINGS.filter((x) => toppings.includes(x.id));
    const d = SEASONAL_DIPS.filter((x) => dips.includes(x.id));
    const addonTotal = (combo ? COMBO_UPGRADE.price : 0) + [...t, ...d].reduce((s, x) => s + x.price, 0);
    return { t, d, addonTotal };
  }, [combo, toppings, dips]);

  const total = item.price + extras.addonTotal;

  const onAdd = () => {
    const lineId = `${item.id}::${combo ? "c" : ""}::${[...toppings].sort().join("-")}::${[...dips].sort().join("-")}`;
    const parts = [
      combo ? "Combo" : null,
      ...extras.t.map((x) => x.label.replace("Extra ", "+")),
      ...extras.d.map((x) => x.label),
    ].filter(Boolean);
    const name = parts.length ? `${item.name} · ${parts.join(", ")}` : item.name;
    add({ id: lineId, name, price: total, image: item.image, category: item.category });
    setAdded(true);
    window.setTimeout(onClose, 650);
  };

  const savedWithCombo = COMBO_UPGRADE.worth - COMBO_UPGRADE.price;

  return (
    <div className="absolute inset-0 z-[90] flex justify-end">
      <button aria-label="Đóng" className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[4px]" onClick={onClose} type="button" />

      <div className="relative flex h-full w-full max-w-[440px] flex-col bg-[#fefaf1] shadow-[-30px_0px_80px_rgba(0,0,0,0.45)] [animation:drawer-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
        <style>{`@keyframes drawer-in{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Hero photo */}
        <div className="relative h-[196px] shrink-0 overflow-hidden">
          <img alt={item.name} className="size-full object-cover" src={item.image} />
          <span className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(20,6,10,0.9) 100%)" }} />
          <button
            aria-label="Đóng"
            className="absolute right-[16px] top-[16px] flex size-[40px] cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-[4px] transition-colors hover:bg-[#d9161c]"
            onClick={onClose}
            type="button"
          >
            <svg className="size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <span
            className="absolute left-[16px] top-[16px] rounded-full px-[13px] py-[6px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] tracking-[1px] text-white uppercase shadow-[0px_6px_14px_rgba(217,22,28,0.4)]"
            style={{ backgroundImage: "linear-gradient(115deg, #f4de79 0%, #fa6932 60%, #d9161c 100%)" }}
          >
            {item.seasonal ? "✦ Món theo mùa" : "✦ Signature"}
          </span>
          <div className="absolute bottom-[14px] left-[18px] right-[18px]">
            <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[24px] leading-[1.1] text-white drop-shadow-[0px_2px_6px_rgba(0,0,0,0.6)]">{item.name}</p>
            <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#f3e3d6]">{item.desc}</p>
          </div>
        </div>

        {/* Scrollable options */}
        <div className="flex-1 overflow-y-auto px-[20px] py-[18px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Combo upsell */}
          <button
            className={`group flex w-full cursor-pointer items-center gap-[14px] rounded-[18px] border-2 p-[15px] text-left transition-all duration-300 ${
              combo ? "border-[#22a06b] bg-[#e9f6ef]" : "border-[#f0e2d2] bg-white hover:border-[#f7c9a8]"
            }`}
            onClick={() => setCombo((v) => !v)}
            type="button"
          >
            <span className="flex size-[52px] shrink-0 items-center justify-center rounded-[14px] bg-[#fff2df] text-[28px]">🍟</span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#212121]">{COMBO_UPGRADE.label}</span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#8a7a77]">{COMBO_UPGRADE.desc}</span>
              <span className="mt-[3px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#22a06b]">
                Chỉ +{formatVnd(COMBO_UPGRADE.price)} · tiết kiệm {formatVnd(savedWithCombo)}
              </span>
            </span>
            <span className={`flex size-[26px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${combo ? "border-[#22a06b] bg-[#22a06b] text-white" : "border-[#d9c8bb]"}`}>
              {combo && (
                <svg className="size-[15px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              )}
            </span>
          </button>

          {/* Toppings */}
          <p className="mb-[10px] mt-[22px] font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#7f292a]">Nâng cấp topping</p>
          <div className="flex flex-col gap-[9px]">
            {TOPPINGS.map((top) => {
              const on = toppings.includes(top.id);
              return (
                <button
                  className={`flex cursor-pointer items-center gap-[12px] rounded-[14px] border-2 px-[14px] py-[11px] text-left transition-all duration-200 ${
                    on ? "border-[#fa6932] bg-[#fff3ea]" : "border-[#f0e2d2] bg-white hover:border-[#f7c9a8]"
                  }`}
                  key={top.id}
                  onClick={() => toggle(toppings, setToppings, top.id)}
                  type="button"
                >
                  <span className="text-[22px]">{top.emoji}</span>
                  <span className="flex-1 font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#212121]">{top.label}</span>
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#d9161c]">+{formatVnd(top.price)}</span>
                  <span className={`flex size-[24px] items-center justify-center rounded-[8px] border-2 transition-colors ${on ? "border-[#fa6932] bg-[#fa6932] text-white" : "border-[#d9c8bb]"}`}>
                    {on && (
                      <svg className="size-[14px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Seasonal dips */}
          <div className="mb-[10px] mt-[22px] flex items-center gap-[8px]">
            <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#7f292a]">Sốt chấm đặc trưng theo mùa</p>
            <span className="rounded-full bg-[#fff1cf] px-[9px] py-[3px] font-['Source_Sans_Pro:Bold',sans-serif] text-[12px] text-[#a86800]">Giới hạn</span>
          </div>
          <div className="flex flex-col gap-[9px]">
            {SEASONAL_DIPS.map((dip) => {
              const on = dips.includes(dip.id);
              return (
                <button
                  className={`flex cursor-pointer items-center gap-[12px] rounded-[14px] border-2 px-[14px] py-[11px] text-left transition-all duration-200 ${
                    on ? "border-[#d9161c] bg-[#fdeeee]" : "border-[#f0e2d2] bg-white hover:border-[#f7c9a8]"
                  }`}
                  key={dip.id}
                  onClick={() => toggle(dips, setDips, dip.id)}
                  type="button"
                >
                  <span className="text-[22px]">{dip.emoji}</span>
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#212121]">{dip.label}</span>
                    {dip.note && <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] text-[#c0392b]">{dip.note}</span>}
                  </span>
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#d9161c]">+{formatVnd(dip.price)}</span>
                  <span className={`flex size-[24px] items-center justify-center rounded-[8px] border-2 transition-colors ${on ? "border-[#d9161c] bg-[#d9161c] text-white" : "border-[#d9c8bb]"}`}>
                    {on && (
                      <svg className="size-[14px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer: live total + add */}
        <div className="shrink-0 border-t border-[#f0e2d2] bg-white px-[20px] py-[16px]">
          {extras.addonTotal > 0 && (
            <div className="mb-[10px] flex items-center justify-between font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#8a7a77]">
              <span>Món gốc {formatVnd(item.price)} + tuỳ chọn {formatVnd(extras.addonTotal)}</span>
            </div>
          )}
          <button
            className="flex w-full cursor-pointer items-center justify-between gap-[10px] rounded-[16px] px-[22px] py-[15px] text-white shadow-[0px_10px_24px_rgba(217,22,28,0.34)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
            onClick={onAdd}
            style={{ backgroundImage: added ? "linear-gradient(115deg, #35c184 0%, #1c8f5d 100%)" : "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #7f292a 100%)" }}
            type="button"
          >
            <span className="flex items-center gap-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px]">
              <svg className="size-[19px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
                {added ? <path d="m5 13 4 4L19 7" /> : <path d="M12 5v14M5 12h14" />}
              </svg>
              {added ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
            </span>
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[20px]">{formatVnd(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
