import { useRef } from "react";
import { useMenuFilter } from "./menu-filter";
import { CATEGORY_META, MENU, countByCategory } from "./menu-data";

/** Shorter labels so the round tiles stay on one line. */
const SHORT_LABEL: Record<string, string> = { dessert: "Kem", pasta: "Mì Ý", chicken: "Gà rán", drink: "Nước uống" };

const CATEGORIES = CATEGORY_META.map((cat) => ({
  id: cat.id,
  label: SHORT_LABEL[cat.id] ?? cat.label,
  count: `${countByCategory(cat.id)} món`,
  image: cat.image,
}));

/** "Tìm theo loại" — category picker that filters the best-seller rail. */
export function FoodCategories() {
  const { category, openMenu } = useMenuFilter();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 520, behavior: "smooth" });
  };

  return (
    <div className="w-full bg-[#fefaf1] px-[221px] py-[70px]" data-name="Search by Food">
      <div className="flex items-end justify-between gap-[24px]">
        <div className="flex flex-col gap-[10px]">
          <span className="flex w-fit items-center gap-[10px] rounded-full bg-[#f6ece9] px-[18px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] tracking-[2px] text-[#d9161c] uppercase">
            <span className="size-[8px] rounded-full bg-[#fa6932]" />
            Duyệt thực đơn
          </span>
          <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[43px] leading-[1.12] text-[#212121]">Tìm theo loại</p>
          <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[20px] text-[#8a8a8a]">
            Chọn một nhóm để lọc nhanh các món bán chạy
          </p>
        </div>

        <button
          className={`flex cursor-pointer items-center gap-[10px] rounded-[14px] border-2 px-[24px] py-[14px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] transition-all duration-300 ${
            category === "all"
              ? "border-transparent bg-[#d9161c] text-white shadow-[0px_10px_22px_rgba(205,5,8,0.28)]"
              : "border-[#f0e2d2] bg-white text-[#757575] hover:border-[#f7c9a8] hover:text-[#d9161c]"
          }`}
          onClick={() => openMenu("all")}
          type="button"
        >
          Tất cả món · {MENU.length}
        </button>
      </div>

      <div className="relative mt-[42px]">
        {/* Nút lướt trái */}
        <button
          aria-label="Xem danh mục trước"
          className="absolute -left-[26px] top-[114px] z-[2] flex size-[52px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#d9161c] shadow-[0px_10px_24px_rgba(33,33,33,0.18)] ring-1 ring-[#f0e2d2] transition-all duration-300 hover:-translate-y-1/2 hover:scale-105 hover:bg-[#d9161c] hover:text-white active:scale-95"
          onClick={() => scrollBy(-1)}
          type="button"
        >
          <svg className="size-[24px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Hàng danh mục lướt ngang */}
        <div
          className="flex gap-[20px] overflow-x-auto scroll-smooth px-[4px] pt-[30px] pb-[26px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={scrollerRef}
        >
          {CATEGORIES.map((item) => {
            const active = category === item.id;
            return (
              <button
                className="group flex w-[168px] shrink-0 cursor-pointer flex-col items-center gap-[14px]"
                data-name="Category"
                key={item.id}
                onClick={() => openMenu(item.id)}
                type="button"
              >
                <span
                  className={`relative flex size-[168px] items-center justify-center overflow-hidden rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    active
                      ? "-translate-y-[6px] ring-[5px] ring-[#d9161c] shadow-[0px_18px_34px_rgba(205,5,8,0.28)]"
                      : "ring-[3px] ring-white shadow-[0px_10px_22px_rgba(33,33,33,0.12)] group-hover:-translate-y-[6px] group-hover:ring-[#f7c9a8]"
                  }`}
                >
                  <img alt={item.label} className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.1]" src={item.image} />
                  <span
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
                    style={{ backgroundImage: "linear-gradient(180deg, rgba(205,5,8,0) 40%, rgba(205,5,8,0.55) 100%)" }}
                  />
                  {active && (
                    <span className="absolute bottom-[14px] flex size-[30px] items-center justify-center rounded-full bg-[#f4de79] text-[#7f292a]">
                      <svg className="size-[16px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" viewBox="0 0 24 24">
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </span>

                <span className="flex flex-col items-center gap-[2px]">
                  <span
                    className={`font-['Source_Sans_Pro:Bold',sans-serif] text-[22px] transition-colors duration-300 ${
                      active ? "text-[#d9161c]" : "text-[#424242] group-hover:text-[#d9161c]"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#9a9a9a]">{item.count}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Nút lướt phải */}
        <button
          aria-label="Xem danh mục tiếp"
          className="absolute -right-[26px] top-[114px] z-[2] flex size-[52px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#d9161c] shadow-[0px_10px_24px_rgba(33,33,33,0.18)] ring-1 ring-[#f0e2d2] transition-all duration-300 hover:-translate-y-1/2 hover:scale-105 hover:bg-[#d9161c] hover:text-white active:scale-95"
          onClick={() => scrollBy(1)}
          type="button"
        >
          <svg className="size-[24px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
