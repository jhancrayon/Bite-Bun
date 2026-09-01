import image_acb08d57_b730_42ea_8202_cbc919c74ade_2 from '@/imports/acb08d57-b730-42ea-8202-cbc919c74ade-2.png'
import image_acb08d57_b730_42ea_8202_cbc919c74ade_1 from '@/imports/acb08d57-b730-42ea-8202-cbc919c74ade-1.png'
import image_acb08d57_b730_42ea_8202_cbc919c74ade from '@/imports/acb08d57-b730-42ea-8202-cbc919c74ade.png'
import { useState } from "react";
import { formatVnd, useCart, FREE_SHIP_FROM } from "./cart-store";
import { CheckoutModal } from "./checkout-modal";
import { SupportWidget } from "./support-widget";

/** Ảnh túi tote quà tặng dịp 2/9 (đồng bộ với banner khuyến mãi). */
const TOTE_IMAGE = "https://cdn.phototourl.com/free/2026-08-22-82c031a0-c2d1-411b-ba29-4cf037874bc3.jpg";

function IconClose() {
  return (
    <svg className="size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/** Floating support + cart buttons and the cart panel, bottom-right. */
export function CartWidget() {
  const { items, count, subtotal, shipping, total, bogoFreeCount, bogoDiscount, open, setOpen, increase, decrease, remove, clear } = useCart();
  const [checkout, setCheckout] = useState(false);

  return (
    <div className="fixed bottom-[16px] left-[16px] right-[16px] z-[60] flex flex-col items-end gap-[16px] sm:bottom-[32px] sm:left-auto sm:right-[32px]">
      {/* Cart panel */}
      {open && (
        <div className="flex max-h-[75vh] w-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0px_30px_70px_rgba(33,33,33,0.28)] ring-1 ring-[#f0e8e2] [animation:dish-in_0.35s_cubic-bezier(0.16,1,0.3,1)_both] sm:max-h-[70vh] sm:w-[420px]">
          {/* Header */}
          <div
            className="flex items-center justify-between gap-[12px] px-[22px] py-[18px] text-white"
            style={{ backgroundImage: "linear-gradient(100deg, #7f292a 0%, #b31419 45%, #fa6932 100%)" }}
          >
            <div className="flex flex-col leading-tight">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[21px]">Giỏ hàng của bạn</span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#f4de79]">{count} món đã chọn</span>
            </div>
            <button className="cursor-pointer rounded-full p-[6px] transition-colors hover:bg-white/20" onClick={() => setOpen(false)} type="button">
              <IconClose />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-[22px] py-[18px]">
            {items.length === 0 ? (
              <p className="py-[40px] text-center font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] text-[#9a9a9a]">
                Chưa có món nào. Thêm món để bắt đầu nhé!
              </p>
            ) : (
              <ul className="flex flex-col gap-[16px]">
                {items.map((item) => (
                  <li className="flex items-center gap-[12px]" key={item.id}>
                    <img alt={item.name} className="size-[62px] shrink-0 rounded-[14px] object-cover" src={item.image} />
                    <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
                      <span className="truncate font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#212121]">{item.name}</span>
                      <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#d9161c]">{formatVnd(item.price)}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-[8px] rounded-full bg-[#f6ece9] px-[8px] py-[5px]">
                      <button
                        className="flex size-[24px] cursor-pointer items-center justify-center rounded-full bg-white text-[#d9161c] transition-transform hover:scale-110"
                        onClick={() => decrease(item.id)}
                        type="button"
                      >
                        <svg className="size-[13px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M5 12h14" />
                        </svg>
                      </button>
                      <span className="min-w-[18px] text-center font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#212121]">{item.qty}</span>
                      <button
                        className="flex size-[24px] cursor-pointer items-center justify-center rounded-full bg-[#d9161c] text-white transition-transform hover:scale-110"
                        onClick={() => increase(item.id)}
                        type="button"
                      >
                        <svg className="size-[13px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    </div>
                    <button
                      className="shrink-0 cursor-pointer text-[#c9c9c9] transition-colors hover:text-[#d9161c]"
                      onClick={() => remove(item.id)}
                      type="button"
                    >
                      <svg className="size-[17px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Summary */}
          <div className="border-t border-[#f0e8e2] px-[22px] py-[18px]">
            <div className="flex flex-col gap-[8px] font-['Source_Sans_Pro:Regular',sans-serif] text-[17px]">
              <div className="flex justify-between text-[#757575]">
                <span>Tạm tính</span>
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#212121]">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#757575]">
                <span>Phí giao hàng</span>
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#212121]">
                  {shipping === 0 ? "Miễn phí" : formatVnd(shipping)}
                </span>
              </div>
              {bogoDiscount > 0 && (
                <div className="flex justify-between text-[#22a06b]">
                  <span>🍔 Mua 1 Tặng 1 ({bogoFreeCount} burger)</span>
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif]">-{formatVnd(bogoDiscount)}</span>
                </div>
              )}
              {subtotal > 0 && subtotal < FREE_SHIP_FROM && (
                <p className="rounded-[10px] bg-[#fff8ef] px-[12px] py-[8px] text-[15px] text-[#fa6932]">
                  Mua thêm {formatVnd(FREE_SHIP_FROM - subtotal)} để được miễn phí giao hàng
                </p>
              )}
              {/* Ưu đãi Mua 1 Tặng 1 burger */}
              {bogoFreeCount > 0 ? (
                <div className="flex items-center gap-[10px] rounded-[10px] bg-[#e6f4ec] px-[12px] py-[9px]">
                  <span className="text-[18px]">🍔</span>
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#22a06b]">Mua 1 Tặng 1 — bạn được tặng {bogoFreeCount} burger!</span>
                </div>
              ) : (
                items.some((item) => item.category === "burger") && (
                  <div className="flex items-center gap-[10px] rounded-[10px] bg-[#fff8ef] px-[12px] py-[9px]">
                    <span className="text-[18px]">🍔</span>
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#fa6932]">Thêm 1 burger nữa để được tặng 1 chiếc miễn phí!</span>
                  </div>
                )
              )}

              {/* Quà tặng túi tote đại lễ 2/9 */}
              {subtotal > 0 &&
                (subtotal >= FREE_SHIP_FROM ? (
                  <div className="flex items-center gap-[10px] rounded-[10px] bg-[#e6f4ec] px-[12px] py-[9px]">
                    <img alt="Túi tote quà tặng" className="size-[40px] shrink-0 rounded-[9px] object-cover" src={image_acb08d57_b730_42ea_8202_cbc919c74ade_2} />
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#22a06b]">🎁 Bạn được tặng 1 túi tote miễn phí!</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-[7px] rounded-[10px] bg-[#fff8ef] px-[12px] py-[9px]">
                    <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#fa6932]">
                      🎁 Mua thêm {formatVnd(FREE_SHIP_FROM - subtotal)} để được tặng túi tote miễn phí
                    </span>
                    <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#f3ece9]">
                      <div
                        className="h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${Math.min(100, Math.round((subtotal / FREE_SHIP_FROM) * 100))}%`, backgroundImage: "linear-gradient(90deg, #f4de79 0%, #fa6932 55%, #d9161c 100%)" }}
                      />
                    </div>
                  </div>
                ))}
              <div className="mt-[6px] flex items-center justify-between border-t border-dashed border-[#e9e0d8] pt-[12px]">
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-[#212121]">Tổng cộng</span>
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[24px] text-[#d9161c]">{formatVnd(total)}</span>
              </div>
            </div>

            <div className="mt-[16px] flex gap-[10px]">
              {items.length > 0 && (
                <button
                  className="cursor-pointer rounded-[12px] border-2 border-[#f0e8e2] px-[16px] py-[13px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#757575] transition-colors hover:border-[#f7c9a8] hover:text-[#d9161c]"
                  onClick={clear}
                  type="button"
                >
                  Xoá hết
                </button>
              )}
              <button
                className="flex flex-1 cursor-pointer items-center justify-center gap-[8px] rounded-[12px] px-[20px] py-[13px] shadow-[0px_8px_20px_rgba(205,5,8,0.3)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={items.length === 0}
                onClick={() => {
                  setOpen(false);
                  setCheckout(true);
                }}
                style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
                type="button"
              >
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-white">Thanh toán</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support widget (AI chat + social channels) */}
      <SupportWidget />

      {/* Cart button */}
      <button
        className="group relative flex size-[68px] cursor-pointer items-center justify-center rounded-full text-white shadow-[0px_14px_32px_rgba(205,5,8,0.4)] transition-transform duration-300 hover:-translate-y-[3px] hover:scale-105"
        onClick={() => setOpen(!open)}
        style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
        type="button"
      >
        <svg className="size-[30px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 6h16l-1.2 11.1a1 1 0 0 1-1 .9H6.2a1 1 0 0 1-1-.9L4 6Z" />
          <path d="M9 10a3 3 0 0 0 6 0" />
        </svg>
        {count > 0 && (
          <span
            className="absolute -right-[2px] -top-[2px] flex min-w-[28px] items-center justify-center rounded-full bg-[#f4de79] px-[7px] py-[3px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#7f292a] shadow-[0px_4px_10px_rgba(0,0,0,0.2)]"
            key={count}
            style={{ animation: "badge-pop 0.4s ease-out" }}
          >
            {count}
          </span>
        )}
      </button>

      {checkout && <CheckoutModal onClose={() => setCheckout(false)} />}
    </div>
  );
}
