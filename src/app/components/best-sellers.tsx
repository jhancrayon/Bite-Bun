import { useRef } from "react";
import { formatVnd, useCart } from "./cart-store";
import { MENU, type MenuItem } from "./menu-data";
import { useMenuFilter } from "./menu-filter";

type Item = MenuItem & { rank: number; orders: number };

const byReviews = (a: MenuItem, b: MenuItem) => b.reviews - a.reviews;

/** House signatures always lead: burgers first, then fried chicken. */
const HERO_CATEGORIES = ["burger", "chicken"] as const;
const isHero = (item: MenuItem) => (HERO_CATEGORIES as readonly string[]).includes(item.category);

/** Burgers + fried chicken, ranked by demand — the top 3 own the podium. */
const HERO_POOL: MenuItem[] = [...MENU].filter(isHero).sort(byReviews);

const PODIUM: Item[] = HERO_POOL.slice(0, 3).map((item, i) => ({ ...item, rank: i + 1, orders: item.reviews }));

/** Remaining burgers/chicken lead the rail, then every other best-seller follows. */
const RUNNERS: Item[] = [
  ...HERO_POOL.slice(3),
  ...[...MENU].filter((item) => !isHero(item)).sort(byReviews),
].slice(0, 8).map((item, i) => ({ ...item, rank: i + 4, orders: item.reviews }));

const MEDALS = ["#ffd24a", "#e6e6ee", "#f0a35e"];

function StarIcon({ className = "size-[16px]" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
    </svg>
  );
}

function PlusIcon({ className = "size-[17px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/** Big gold-rimmed number, used as the podium rank badge. */
function RankBadge({ rank, size }: { rank: number; size: "lg" | "sm" }) {
  const color = MEDALS[rank - 1] ?? "#f4de79";
  return (
    <span
      className={`flex items-center justify-center rounded-full font-['Source_Sans_Pro:Bold',sans-serif] text-[#4a1516] shadow-[0px_10px_26px_rgba(0,0,0,0.35)] ${
        size === "lg" ? "size-[76px] text-[40px]" : "size-[52px] text-[26px]"
      }`}
      style={{ backgroundImage: `linear-gradient(150deg, #fffbe8 0%, ${color} 45%, #c98a12 100%)` }}
    >
      {rank}
    </span>
  );
}

function AddButton({ item, big }: { item: Item; big?: boolean }) {
  const { add } = useCart();
  return (
    <button
      className={`flex shrink-0 cursor-pointer items-center gap-[9px] rounded-[14px] text-white shadow-[0px_10px_24px_rgba(205,5,8,0.4)] transition-transform duration-300 hover:-translate-y-[2px] hover:scale-[1.03] active:scale-95 ${
        big ? "px-[26px] py-[15px]" : "px-[18px] py-[11px]"
      }`}
      onClick={() => add({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category })}
      style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
      type="button"
    >
      <PlusIcon className={big ? "size-[20px]" : "size-[16px]"} />
      <span className={`font-['Source_Sans_Pro:Bold',sans-serif] whitespace-nowrap ${big ? "text-[19px]" : "text-[16px]"}`}>Đặt ngay</span>
    </button>
  );
}

/** Champion card — full-bleed photo with the copy floating over a dark scrim. */
function ChampionCard({ item }: { item: Item }) {
  const { items } = useCart();
  const inCart = items.find((line) => line.id === item.id)?.qty ?? 0;

  return (
    <div className="group relative flex h-[560px] flex-1 overflow-hidden rounded-[32px] shadow-[0px_24px_50px_rgba(205,5,8,0.16)] ring-2 ring-[#ffe0bd] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:ring-[#f4de79]">
      <img alt={item.name} className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.07]" loading="lazy" src={item.image} />
      <span className="absolute inset-0" style={{ backgroundImage: "linear-gradient(15deg, rgba(20,6,10,0.96) 12%, rgba(122,0,2,0.6) 52%, rgba(255,106,31,0.08) 100%)" }} />

      {/* Champion badge */}
      <span
        className="absolute right-[26px] top-[26px] flex items-center gap-[8px] rounded-full px-[20px] py-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] tracking-[3px] text-[#4a1516] uppercase shadow-[0px_8px_20px_rgba(0,0,0,0.35)]"
        style={{ backgroundImage: "linear-gradient(90deg, #f4de79 0%, #f4de79 60%, #fa6932 100%)" }}
      >
        👑 Quán quân
      </span>

      <div className="relative flex flex-1 flex-col justify-end gap-[16px] p-[36px]">
        <div className="flex items-center gap-[16px]">
          <RankBadge rank={item.rank} size="lg" />
          <div className="flex flex-col gap-[4px]">
            <span className="flex w-fit items-center gap-[8px] rounded-full bg-[#f4de79]/18 px-[14px] py-[6px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] tracking-[2.5px] text-[#f4de79] uppercase">
              🍔 Burger huyền thoại
            </span>
            <span className="flex items-center gap-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#f4de79]">
              <span className="flex items-center gap-[5px] text-[#f4de79]">
                <StarIcon /> {item.rating}
              </span>
              · {item.orders.toLocaleString("vi-VN")} lượt đặt · {item.minutes} phút
            </span>
          </div>
        </div>

        <p className="max-w-[520px] font-['Source_Sans_Pro:Bold',sans-serif] text-[52px] leading-[1.03] text-white">{item.name}</p>
        <p className="max-w-[480px] font-['Open_Sans:Regular',sans-serif] text-[19px] leading-[1.45] text-[#e8d5c4]">{item.desc}</p>

        <div className="flex items-end justify-between gap-[20px] pt-[6px]">
          <span className="flex flex-col leading-tight">
            {item.oldPrice && <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[18px] text-[#e8d5c4]/60 line-through">{formatVnd(item.oldPrice)}</span>}
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[42px] whitespace-nowrap text-[#f4de79]">{formatVnd(item.price)}</span>
          </span>
          <div className="flex items-center gap-[12px]">
            {inCart > 0 && (
              <span className="flex size-[42px] items-center justify-center rounded-full bg-[#22a06b] font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-white">{inCart}</span>
            )}
            <AddButton big item={item} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Runner-up podium card — horizontal, photo left, copy right. */
function PodiumCard({ item }: { item: Item }) {
  const { items } = useCart();
  const inCart = items.find((line) => line.id === item.id)?.qty ?? 0;

  return (
    <div className="group flex h-[268px] items-stretch gap-[18px] overflow-hidden rounded-[28px] bg-white p-[16px] shadow-[0px_8px_22px_rgba(33,33,33,0.07)] ring-1 ring-[#f0e8e2] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[6px] hover:shadow-[0px_24px_46px_rgba(205,5,8,0.16)] hover:ring-[#f7c9a8]">
      <div className="relative w-[210px] shrink-0 overflow-hidden rounded-[20px]">
        <img alt={item.name} className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.09]" loading="lazy" src={item.image} />
        <span className="absolute left-[12px] top-[12px]">
          <RankBadge rank={item.rank} size="sm" />
        </span>
        {inCart > 0 && (
          <span className="absolute bottom-[12px] right-[12px] flex size-[30px] items-center justify-center rounded-full bg-[#22a06b] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-white">{inCart}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-[8px] py-[6px] pr-[8px]">
        <span className="flex w-fit items-center gap-[5px] rounded-full bg-[#f6ece9] px-[11px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#d9161c]">
          <StarIcon className="size-[15px]" /> {item.rating}
        </span>
        <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[26px] leading-[1.15] text-[#212121]">{item.name}</p>
        <p className="line-clamp-2 font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] leading-[1.4] text-[#757575]">{item.desc}</p>
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#9a9a9a]">
          {item.orders.toLocaleString("vi-VN")} lượt đặt · {item.minutes} phút
        </p>

        <div className="mt-auto flex items-end justify-between gap-[12px]">
          <span className="flex flex-col leading-tight">
            {item.oldPrice && <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#b5b5b5] line-through">{formatVnd(item.oldPrice)}</span>}
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[26px] whitespace-nowrap text-[#d9161c]">{formatVnd(item.price)}</span>
          </span>
          <AddButton item={item} />
        </div>
      </div>
    </div>
  );
}

/** Compact card used in the runners-up rail. */
function RailCard({ item }: { item: Item }) {
  const { items } = useCart();
  const inCart = items.find((line) => line.id === item.id)?.qty ?? 0;

  return (
    <div className="group relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] bg-white shadow-[0px_6px_18px_rgba(33,33,33,0.07)] ring-1 ring-[#f0e8e2] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[8px] hover:shadow-[0px_24px_46px_rgba(205,5,8,0.16)] hover:ring-[#f7c9a8]">
      <div className="relative h-[190px] overflow-hidden">
        <img alt={item.name} className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.08]" loading="lazy" src={item.image} />
        <span className="absolute left-[14px] top-[14px] flex items-center gap-[6px] rounded-full bg-[#212121]/78 px-[12px] py-[6px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#f4de79]">
          #{item.rank}
        </span>
        <span className="absolute right-[14px] top-[14px] flex items-center gap-[5px] rounded-full bg-white/92 px-[11px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#212121]">
          <span className="text-[#f4de79]">
            <StarIcon className="size-[15px]" />
          </span>
          {item.rating}
        </span>
        {inCart > 0 && (
          <span className="absolute bottom-[14px] right-[14px] flex size-[30px] items-center justify-center rounded-full bg-[#22a06b] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-white">{inCart}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-[8px] p-[18px]">
        <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[21px] leading-[1.18] text-[#212121]">{item.name}</p>
        <p className="line-clamp-2 font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] leading-[1.4] text-[#757575]">{item.desc}</p>
        <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#9a9a9a]">{item.orders.toLocaleString("vi-VN")} lượt đặt</p>

        <div className="mt-auto flex items-end justify-between gap-[10px] pt-[4px]">
          <span className="flex flex-col leading-tight">
            {item.oldPrice && <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#b5b5b5] line-through">{formatVnd(item.oldPrice)}</span>}
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[23px] whitespace-nowrap text-[#d9161c]">{formatVnd(item.price)}</span>
          </span>
          <AddButton item={item} />
        </div>
      </div>
    </div>
  );
}

/** "Các món bán chạy" — burger podium (Top 1·2·3) + runners-up rail. */
export function BestSellers() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const { openMenu } = useMenuFilter();
  const [champion, second, third] = PODIUM;

  const scrollBy = (dir: number) => railRef.current?.scrollBy({ left: dir * 648, behavior: "smooth" });

  return (
    <div className="relative w-full overflow-hidden py-[86px]" data-name="Popular Items">
      {/* Backdrop */}
      <span className="absolute inset-0" style={{ backgroundImage: "linear-gradient(170deg, #ffffff 0%, #fffaf0 45%, #fff1e0 100%)" }} />
      <div className="pointer-events-none absolute -left-[160px] top-[60px] size-[520px] rounded-full bg-[#f4de79] opacity-20 blur-[150px]" />
      <div className="pointer-events-none absolute -right-[180px] bottom-[-120px] size-[560px] rounded-full bg-[#fa6932] opacity-[0.14] blur-[160px]" />
      <p className="pointer-events-none absolute -top-[24px] left-[180px] font-['Source_Sans_Pro:Bold',sans-serif] text-[180px] leading-none text-[#d9161c]/[0.05] uppercase">Top burger</p>

      <div className="relative flex flex-col gap-[34px]">
        {/* Header */}
        <div className="flex items-end justify-between gap-[24px] px-[221px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[10px]">
              <span className="flex w-fit items-center gap-[8px] rounded-full bg-[#7f292a] px-[15px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] tracking-[2px] text-[#f4de79] uppercase shadow-[0px_8px_18px_rgba(127,41,42,0.3)]">
                🍔 Burger
              </span>
              <span className="flex w-fit items-center gap-[8px] rounded-full bg-[#fa6932] px-[15px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] tracking-[2px] text-white uppercase shadow-[0px_8px_18px_rgba(250,105,50,0.3)]">
                🍗 Gà rán
              </span>
              <span className="flex items-center gap-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] tracking-[2px] text-[#d9161c] uppercase">
                <span className="size-[8px] animate-pulse rounded-full bg-[#fa6932]" />
                Gọi nhiều nhất tuần này
              </span>
            </div>
            <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[56px] leading-[1.02] text-[#7f292a]">
              Bảng xếp hạng{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #fa6932 0%, #d9161c 100%)" }}>
                bán chạy nhất
              </span>
            </p>
            <p className="max-w-[640px] font-['Open_Sans:Regular',sans-serif] text-[19px] leading-[1.5] text-[#7a6a67]">
              Cứ 3 đơn thì có 1 đơn gọi lại những món này. Burger bò Úc nướng than & gà ướp 12 giờ chiên giòn — thử một lần là hiểu vì sao ai cũng nghiện.
            </p>

            {/* Trust stats */}
            <div className="mt-[4px] flex items-center gap-[26px]">
              {[
                { value: "12.400+", label: "lượt đặt / tuần" },
                { value: "4.8★", label: "đánh giá trung bình" },
                { value: "68%", label: "khách gọi lại" },
              ].map((stat) => (
                <span className="flex flex-col leading-tight" key={stat.label}>
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[28px] text-[#d9161c]">{stat.value}</span>
                  <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#9a827f]">{stat.label}</span>
                </span>
              ))}
            </div>
          </div>

          <button
            className="flex shrink-0 cursor-pointer items-center gap-[10px] rounded-full px-[28px] py-[16px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-white shadow-[0px_14px_30px_rgba(217,22,28,0.32)] transition-all duration-300 hover:-translate-y-[2px] hover:scale-[1.03]"
            onClick={() => openMenu("all")}
            style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #7f292a 100%)" }}
            type="button"
          >
            Khám phá thực đơn
            <svg className="size-[19px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        {/* Podium */}
        <div className="flex items-stretch gap-[24px] px-[221px]">
          <ChampionCard item={champion} />
          <div className="flex w-[620px] shrink-0 flex-col gap-[24px]">
            <PodiumCard item={second} />
            <PodiumCard item={third} />
          </div>
        </div>

        {/* Runners-up */}
        <div className="flex items-end justify-between gap-[24px] px-[221px] pt-[14px]">
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[32px] text-[#7f292a]">Top 4–10 được săn đón</p>
            <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] text-[#9a827f]">Còn burger, gà rán và loạt món "gây thương nhớ" đang chờ bạn khám phá</p>
          </div>
          <div className="flex items-center gap-[12px]">
            {[-1, 1].map((dir) => (
              <button
                className="flex size-[56px] cursor-pointer items-center justify-center rounded-full bg-[#d9161c] text-[#f4de79] shadow-[0px_10px_24px_rgba(217,22,28,0.28)] ring-1 ring-[#fa6932] transition-all duration-300 hover:-translate-y-[2px] hover:scale-105 active:scale-95"
                key={dir}
                onClick={() => scrollBy(dir)}
                type="button"
              >
                <svg className="size-[24px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
                  <path d={dir < 0 ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div
          className="flex snap-x snap-mandatory gap-[22px] overflow-x-auto scroll-smooth px-[221px] pb-[10px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={railRef}
        >
          {RUNNERS.map((item) => (
            <RailCard item={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
