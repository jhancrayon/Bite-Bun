import { useState } from "react";
import { formatVnd, useCart } from "./cart-store";
import { ImageWithFallback } from "./figma/ImageWithFallback";

/* Photos are matched to each dish name so the card art never contradicts the label. */
const img1 = "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img2 = "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img3 = "https://images.unsplash.com/photo-1632808664408-f8ab196b0523?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img4 = "https://images.unsplash.com/photo-1620197544618-af5f5366abb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img5 = "https://images.unsplash.com/photo-1615297928064-24977384d0da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img6 = "https://images.unsplash.com/photo-1624153064067-566cae78993d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img7 = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img8 = "https://images.unsplash.com/photo-1652952561151-97e82f26c336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img9 = "https://images.unsplash.com/photo-1679279726937-122c49626802?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img10 = "https://images.unsplash.com/photo-1612927601601-6638404737ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img11 = "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img12 = "https://images.unsplash.com/photo-1600454309261-3dc9b7597637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img13 = "https://images.unsplash.com/photo-1544025162-d76694265947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img14 = "https://images.unsplash.com/photo-1767469576675-0c02a8d66f4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img15 = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const img16 = "https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

type Dish = {
  id: string;
  name: string;
  desc: string;
  price: number;
  discount: string;
  time: string;
  image: string;
  /** Loại món — dùng cho ưu đãi Mua 1 Tặng 1 burger. */
  category?: string;
};

const DISHES: Dish[] = [
  { id: "d1", name: "Burger Bò Tắm Phô Mai", desc: "Bò Úc · phô mai cheddar tan chảy", price: 89000, discount: "15% off", time: "10 phút", image: img1, category: "burger" },
  { id: "d2", name: "Triplo Burger", desc: "3 lớp bò · sốt BBQ khói", price: 129000, discount: "10% off", time: "10 phút", image: img2, category: "burger" },
  { id: "d3", name: "Mì Ý Thịt Viên Sốt Cay", desc: "Sốt cà chua cay · phô mai bào", price: 79000, discount: "10% off", time: "5 phút", image: img3 },
  { id: "d4", name: "Kem Sữa Dừa", desc: "Dừa non · topping hạt điều", price: 39000, discount: "20% off", time: "10 phút", image: img4 },
  { id: "d5", name: "Burger Tôm Giòn", desc: "Tôm chiên xù · sốt chanh dây", price: 95000, discount: "25% off", time: "10 phút", image: img5, category: "burger" },
  { id: "d6", name: "Gà Rán Sốt Mật Ong", desc: "Giòn rụm · mật ong tỏi", price: 85000, discount: "10% off", time: "12 phút", image: img6 },
  { id: "d7", name: "Salad Ức Gà Nướng", desc: "Rau hữu cơ · sốt mè rang", price: 65000, discount: "10% off", time: "8 phút", image: img7 },
  { id: "d8", name: "Pizza Hải Sản Phô Mai", desc: "Đế mỏng · phô mai kéo sợi", price: 159000, discount: "15% off", time: "15 phút", image: img8 },
];

const MORE_DISHES: Dish[] = [
  { id: "d9", name: "Cơm Bò Sốt Tiêu Đen", desc: "Bò mềm · tiêu đen Phú Quốc", price: 75000, discount: "10% off", time: "12 phút", image: img9 },
  { id: "d10", name: "Mì Cay Kim Chi", desc: "Cấp độ 1–7 · kim chi nhà làm", price: 69000, discount: "20% off", time: "10 phút", image: img10 },
  { id: "d11", name: "Khoai Tây Lắc Phô Mai", desc: "Giòn tan · bột phô mai béo", price: 35000, discount: "15% off", time: "6 phút", image: img11 },
  { id: "d12", name: "Bánh Mì Bò Nướng Bơ", desc: "Vỏ giòn · bơ tỏi thơm lừng", price: 45000, discount: "10% off", time: "7 phút", image: img12 },
  { id: "d13", name: "Sườn Nướng BBQ", desc: "Ướp 12 giờ · sốt BBQ đậm", price: 175000, discount: "25% off", time: "18 phút", image: img13 },
  { id: "d14", name: "Gà Popcorn Giòn", desc: "Cắn một miếng · nghiện cả ngày", price: 55000, discount: "10% off", time: "8 phút", image: img14 },
  { id: "d15", name: "Burger Bò Nướng Phô Mai", desc: "Bò xay 100% · phô mai kép", price: 99000, discount: "15% off", time: "10 phút", image: img15, category: "burger" },
  { id: "d16", name: "Mì Ý Carbonara", desc: "Kem tươi · thịt xông khói", price: 89000, discount: "10% off", time: "11 phút", image: img16 },
];

function TagIcon() {
  return (
    <svg className="size-[16px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z" />
      <circle cx="7.5" cy="7.5" r="1.3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="size-[16px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function DishCard({ dish, index }: { dish: Dish; index: number }) {
  const { add } = useCart();

  return (
    <div
      className="group relative flex flex-col"
      data-name="Dish Card"
      style={{ animation: `dish-in 0.5s cubic-bezier(0.16,1,0.3,1) both`, animationDelay: `${(index % 8) * 60}ms` }}
    >
      {/* Gradient halo revealed on hover */}
      <div
        className="pointer-events-none absolute -inset-[2px] rounded-[32px] opacity-0 blur-[10px] transition-opacity duration-500 group-hover:opacity-70"
        style={{ backgroundImage: "linear-gradient(135deg, #f4de79 0%, #fa6932 50%, #d9161c 100%)" }}
      />

      <div className="relative flex flex-col overflow-hidden rounded-[30px] bg-white ring-1 ring-[#f0e8e2] shadow-[0px_6px_20px_rgba(33,33,33,0.06)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[10px] group-hover:shadow-[0px_30px_54px_rgba(127,41,42,0.24)]">
        {/* Photo */}
        <div className="relative h-[300px] overflow-hidden">
          <ImageWithFallback alt={dish.name} className="size-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.12]" src={dish.image} />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_38%,rgba(0,0,0,0.6)_100%)]" />

          {/* Discount ribbon */}
          <span
            className="absolute left-[16px] top-[16px] flex items-center gap-[6px] rounded-full px-[14px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-white shadow-[0px_8px_18px_rgba(217,22,28,0.4)]"
            style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 80%)" }}
          >
            <TagIcon />
            {dish.discount}
          </span>

          {/* Time chip — glass */}
          <span className="absolute right-[16px] top-[16px] flex items-center gap-[6px] rounded-full border border-white/30 bg-black/30 px-[12px] py-[6px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-white backdrop-blur-[6px]">
            <ClockIcon />
            {dish.time}
          </span>

          {/* Wishlist */}
          <button
            className="absolute right-[16px] top-[58px] flex size-[38px] translate-y-[6px] cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#d9161c] opacity-0 shadow-[0px_6px_14px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110"
            type="button"
          >
            <svg className="size-[19px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M12 20s-7-4.6-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.6C19 15.4 12 20 12 20Z" />
            </svg>
          </button>

          {/* Name over photo */}
          <p className="absolute bottom-[40px] left-[18px] right-[18px] font-['Source_Sans_Pro:Bold',sans-serif] text-[23px] leading-[1.15] text-white drop-shadow-[0px_2px_8px_rgba(0,0,0,0.55)]">
            {dish.name}
          </p>
        </div>

        {/* Floating glass info panel */}
        <div className="relative -mt-[20px] mx-[14px] mb-[14px] flex flex-col gap-[14px] rounded-[22px] border border-white/70 bg-white/80 p-[18px] shadow-[0px_10px_26px_rgba(127,41,42,0.1)] backdrop-blur-[10px]">
          <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] leading-[1.35] text-[#8a7a77]">{dish.desc}</p>

          <div className="flex items-center justify-between gap-[12px]">
            <div className="flex flex-col leading-none">
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[12px] uppercase tracking-[1.5px] text-[#c0a9a6]">Giá</span>
              <span className="mt-[4px] font-['Source_Sans_Pro:Bold',sans-serif] text-[23px] text-[#7f292a] whitespace-nowrap">{formatVnd(dish.price)}</span>
            </div>
            <button
              aria-label={`Thêm ${dish.name}`}
              className="group/btn relative flex size-[52px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white shadow-[0px_8px_18px_rgba(217,22,28,0.35)] transition-all duration-300 hover:scale-110 active:scale-95"
              onClick={() => add({ id: dish.id, name: dish.name, price: dish.price, image: dish.image, category: dish.category })}
              style={{ backgroundImage: "linear-gradient(135deg, #fa6932 0%, #d9161c 65%, #7f292a 100%)" }}
              type="button"
            >
              <svg className="size-[22px] transition-transform duration-300 group-hover/btn:rotate-90" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** "Món mới" section — 4-column grid, "Xem tất cả" reveals 8 more dishes. */
export function NewDishes() {
  const [expanded, setExpanded] = useState(false);
  const dishes = expanded ? [...DISHES, ...MORE_DISHES] : DISHES;

  return (
    <div className="flex w-full flex-col items-center gap-[48px] px-[221px] py-[80px]" data-name="Featured Restaurant">
      <div className="flex flex-col items-center gap-[12px]">
        <span className="flex items-center gap-[10px] rounded-full bg-[#f6ece9] px-[18px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] tracking-[2px] text-[#d9161c] uppercase">
          <span className="size-[8px] rounded-full bg-[#fa6932]" />
          Vừa lên bếp
        </span>
        <p className="text-center font-['Source_Sans_Pro:Bold',sans-serif] text-[46px] leading-[1.1] whitespace-nowrap">
          <span className="text-[#7f292a]">Món </span>
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 100%)" }}>mới</span>
        </p>
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[20px] text-[#8a8a8a] text-center">
          Những món vừa được thêm vào thực đơn tuần này
        </p>
      </div>

      <div className="grid w-full grid-cols-4 gap-[28px]">
        {dishes.map((dish, i) => (
          <DishCard dish={dish} index={i} key={dish.id} />
        ))}
      </div>

      <button
        className="group flex cursor-pointer items-center gap-[12px] rounded-full px-[48px] py-[19px] text-white shadow-[0px_14px_30px_rgba(217,22,28,0.32)] transition-transform duration-300 hover:-translate-y-[3px] hover:scale-[1.03] active:scale-95"
        onClick={() => setExpanded((v) => !v)}
        style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 65%, #7f292a 100%)" }}
        type="button"
      >
        <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] whitespace-nowrap">
          {expanded ? "Thu gọn" : "Xem tất cả"}
        </span>
        <svg
          className={`size-[18px] transition-transform duration-300 ${expanded ? "rotate-180" : "group-hover:translate-y-[2px]"}`}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
