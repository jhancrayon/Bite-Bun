import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useMenuFilter, type Category } from "./menu-filter";

const photo = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

type Topic = "bep" | "uu-dai" | "hau-truong" | "meo";

const TOPICS: { id: Topic | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "Tất cả", emoji: "✦" },
  { id: "bep", label: "Bí quyết bếp", emoji: "🔥" },
  { id: "uu-dai", label: "Ưu đãi", emoji: "🎁" },
  { id: "hau-truong", label: "Hậu trường", emoji: "🎬" },
  { id: "meo", label: "Mẹo ăn ngon", emoji: "💡" },
];

type Post = {
  id: string;
  topic: Topic;
  title: string;
  highlight: string;
  excerpt: string;
  body: string[];
  image: string;
  author: string;
  date: string;
  minutes: number;
  likes: number;
  /** Menu category this article sells. */
  orders: Category;
  orderLabel: string;
};

const POSTS: Post[] = [
  {
    id: "p1",
    topic: "uu-dai",
    title: "Ưu đãi tốt nhất cho",
    highlight: "Burger",
    excerpt: "Vỏ bánh giòn rụm, hương vị ngào ngạt, cảm nhận rõ ràng ngay sau một lần cắn.",
    body: [
      "Mỗi chiếc burger ở Bite & Bun bắt đầu từ 150g bò Úc xay tươi trong ngày, không cấp đông. Bếp nướng trên vỉ than ở 240°C đúng 3 phút mỗi mặt để lớp ngoài cháy cạnh mà bên trong vẫn mọng nước.",
      "Vỏ bánh brioche được ủ qua đêm rồi áp chảo bơ trước khi kẹp — đó là lý do bạn nghe thấy tiếng giòn ở miếng cắn đầu tiên và vẫn thấy mềm ở miếng cuối cùng.",
      "Trong tháng này, tất cả burger giảm 20% khi đặt qua ứng dụng với mã BITE20, và mua 2 tặng 1 khoai tây lắc phô mai từ 14:00 đến 17:00 mỗi ngày.",
    ],
    image: photo("1619810816144-68dbc1f695e8"),
    author: "Bếp trưởng Minh",
    date: "28 Th7, 2026",
    minutes: 4,
    likes: 218,
    orders: "burger",
    orderLabel: "Đặt burger trong bài",
  },
  {
    id: "p2",
    topic: "bep",
    title: "Trọn vẹn bữa tiệc với",
    highlight: "Gà giòn",
    excerpt: "Những miếng gà rán phết lớp sốt chanh ớt hấp dẫn — công thức ướp 12 giờ của bếp.",
    body: [
      "Gà được ướp 12 giờ trong hỗn hợp buttermilk, tỏi phi và ớt bột Hàn Quốc. Đây là bước quyết định: thịt ngấm đều, mềm và không bị khô khi chiên ở nhiệt cao.",
      "Lớp bột áo trộn theo tỉ lệ 3 bột mì : 1 bột bắp, chiên ngập dầu hai lần — lần đầu 160°C cho chín, lần hai 190°C cho giòn. Vỏ gà vì thế giữ độ giòn tới 25 phút sau khi ra khỏi bếp.",
      "Sốt chanh ớt được đun riêng, phết lúc gà còn nóng để sốt bám chứ không làm ỉu lớp vỏ.",
    ],
    image: photo("1709164632728-8a943456dd0a"),
    author: "Bếp trưởng Minh",
    date: "24 Th7, 2026",
    minutes: 5,
    likes: 341,
    orders: "chicken",
    orderLabel: "Đặt gà giòn",
  },
  {
    id: "p3",
    topic: "meo",
    title: "Thử một chút hương vị",
    highlight: "Pasta?",
    excerpt: "Mì Ý thơm ngon, đậm chất Italia với nguyên liệu chọn lọc kỹ càng.",
    body: [
      "Sốt cà chua của Bite & Bun nấu chậm 6 tiếng cùng cà rốt và hành tây để lấy vị ngọt tự nhiên, gần như không cần thêm đường.",
      "Mì được luộc al dente rồi trộn trực tiếp trong chảo sốt khoảng 40 giây — cách này giúp sốt bám vào từng sợi thay vì nằm rời trên mặt đĩa.",
      "Mẹo nhỏ khi nhận hàng: trộn đều lại một lần trước khi ăn và thêm chút phô mai bào kèm theo, hương vị sẽ gần với lúc vừa ra bếp nhất.",
    ],
    image: photo("1546549032-9571cd6b27df"),
    author: "Bếp phó Lan",
    date: "20 Th7, 2026",
    minutes: 3,
    likes: 176,
    orders: "pasta",
    orderLabel: "Đặt mì Ý",
  },
  {
    id: "p4",
    topic: "hau-truong",
    title: "Một ngày trong",
    highlight: "bếp Bite & Bun",
    excerpt: "5 giờ sáng, rau về từ Đà Lạt. 23 giờ, chiếc burger cuối cùng rời bếp.",
    body: [
      "Ngày của bếp bắt đầu lúc 5 giờ sáng khi xe rau từ Đà Lạt cập cửa. Toàn bộ xà lách, cà chua và hành tây được rửa, để ráo và cắt trong vòng hai tiếng.",
      "9 giờ, tổ sốt bắt đầu nấu 4 loại sốt nền cho cả ngày. 11 giờ, bếp nóng khởi động và đơn đầu tiên bay ra.",
      "Cao điểm 18:00–20:00, bếp xử lý trung bình 140 đơn mỗi giờ với quy tắc bất di bất dịch: không món nào để quá 4 phút trước khi giao cho tài xế.",
    ],
    image: photo("1600565193348-f74bd3c7ccdf"),
    author: "Đội ngũ Bite & Bun",
    date: "16 Th7, 2026",
    minutes: 6,
    likes: 402,
    orders: "all",
    orderLabel: "Xem toàn bộ thực đơn",
  },
  {
    id: "p5",
    topic: "meo",
    title: "Giao 22 phút:",
    highlight: "chúng tôi làm thế nào?",
    excerpt: "Bản đồ nhiệt đơn hàng, tài xế trực khu vực và quy tắc không ghép đơn giờ cao điểm.",
    body: [
      "Hệ thống chia thành phố thành 18 ô, mỗi ô luôn có tài xế trực sẵn trong bán kính 2 km từ bếp vệ tinh gần nhất.",
      "Giờ cao điểm, đơn siêu tốc không bị ghép với đơn khác — tài xế chạy thẳng một điểm, đổi lại phụ phí 12.000 vnd.",
      "Túi giữ nhiệt hai lớp giúp món nóng giữ trên 60°C và đồ lạnh dưới 8°C trong khoảng 40 phút.",
    ],
    image: photo("1612006567758-1846b36dd130"),
    author: "Vận hành Bite & Bun",
    date: "11 Th7, 2026",
    minutes: 4,
    likes: 158,
    orders: "all",
    orderLabel: "Đặt món giao ngay",
  },
  {
    id: "p6",
    topic: "uu-dai",
    title: "Combo nhóm bạn:",
    highlight: "ăn nhiều, trả ít",
    excerpt: "Cách ghép combo cho 4–6 người tiết kiệm tới 35% so với gọi lẻ.",
    body: [
      "Combo 4 người gồm 2 burger, 1 pizza cỡ lớn, 2 nước và 1 phần gà popcorn — rẻ hơn khoảng 28% so với gọi từng món.",
      "Nếu nhóm 6 người, thêm một phần sườn BBQ và đổi nước sang bình 1,5 lít sẽ tối ưu nhất về giá trên đầu người.",
      "Mã COMBO2 áp dụng khung 14:00–17:00, cộng dồn được với freeship khi đơn từ 200.000 vnd.",
    ],
    image: photo("1765582870011-ff3cfdb06700"),
    author: "Bite & Bun",
    date: "6 Th7, 2026",
    minutes: 3,
    likes: 264,
    orders: "pizza",
    orderLabel: "Ghép combo ngay",
  },
];

/* ------------------------------ Article modal ----------------------------- */

function ArticleModal({
  post,
  liked,
  saved,
  onLike,
  onSave,
  onClose,
}: {
  post: Post;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const { openMenu } = useMenuFilter();
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const share = () => {
    navigator.clipboard?.writeText(`https://bite-and-bun.com/blog/${post.id}`).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-[24px]">
      <button aria-label="Đóng" className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[4px]" onClick={onClose} type="button" />

      <article className="relative flex max-h-[90vh] w-full max-w-[900px] flex-col overflow-hidden rounded-[26px] bg-white shadow-[0px_40px_90px_rgba(0,0,0,0.5)] [animation:dish-in_0.32s_cubic-bezier(0.16,1,0.3,1)_both]">
        {/* Reading progress */}
        <div className="absolute inset-x-0 top-0 z-[3] h-[4px] bg-black/10">
          <div className="h-full transition-[width] duration-150" style={{ width: `${progress}%`, backgroundImage: "linear-gradient(90deg, #f4de79, #fa6932, #d9161c)" }} />
        </div>

        <div className="relative h-[280px] shrink-0 overflow-hidden">
          <img alt="" className="size-full object-cover" src={post.image} />
          <span className="absolute inset-0" style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(122,0,2,0.85) 100%)" }} />
          <button
            className="absolute right-[18px] top-[18px] flex size-[44px] cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-[2px] transition-colors hover:bg-[#d9161c]"
            onClick={onClose}
            type="button"
          >
            <svg className="size-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-[22px] left-[28px] right-[28px] flex flex-col gap-[8px] text-white">
            <span className="w-fit rounded-full bg-[#f4de79] px-[14px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] tracking-[1.5px] text-[#7f292a] uppercase">
              {TOPICS.find((t) => t.id === post.topic)?.label}
            </span>
            <h3 className="font-['Source_Sans_Pro:Bold',sans-serif] text-[40px] leading-[1.08]">
              {post.title} <span className="text-[#d9161c]">{post.highlight}</span>
            </h3>
            <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#ffdcb0]">
              {post.author} · {post.date} · {post.minutes} phút đọc
            </span>
          </div>
        </div>

        <div
          className="flex flex-col gap-[16px] overflow-y-auto px-[36px] py-[28px]"
          onScroll={(e) => {
            const el = e.currentTarget;
            const max = el.scrollHeight - el.clientHeight;
            setProgress(max > 0 ? (el.scrollTop / max) * 100 : 100);
          }}
        >
          <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[21px] leading-[1.45] text-[#7f292a]">{post.excerpt}</p>
          {post.body.map((paragraph) => (
            <p className="font-['Open_Sans:Regular',sans-serif] text-[18px] leading-[1.7] text-[#4a4a4a]" key={paragraph.slice(0, 24)}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex items-center gap-[10px] border-t border-[#f0e2d2] px-[36px] py-[18px]">
          <button
            className={`flex cursor-pointer items-center gap-[8px] rounded-[12px] px-[16px] py-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] transition-all duration-300 ${
              liked ? "bg-[#ffe4e4] text-[#d9161c]" : "bg-[#f5f5f5] text-[#757575] hover:bg-[#ffe4e4] hover:text-[#d9161c]"
            }`}
            onClick={onLike}
            type="button"
          >
            <span className={liked ? "[animation:badge-pop_0.4s_ease]" : ""}>{liked ? "❤️" : "🤍"}</span>
            {post.likes + (liked ? 1 : 0)}
          </button>

          <button
            className={`flex cursor-pointer items-center gap-[8px] rounded-[12px] px-[16px] py-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] transition-all duration-300 ${
              saved ? "bg-[#fff1cf] text-[#a86800]" : "bg-[#f5f5f5] text-[#757575] hover:bg-[#fff1cf] hover:text-[#a86800]"
            }`}
            onClick={onSave}
            type="button"
          >
            {saved ? "🔖 Đã lưu" : "🔖 Lưu bài"}
          </button>

          <button
            className="flex cursor-pointer items-center gap-[8px] rounded-[12px] bg-[#f5f5f5] px-[16px] py-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#757575] transition-all duration-300 hover:bg-[#e6f4ec] hover:text-[#22a06b]"
            onClick={share}
            type="button"
          >
            {copied ? "✓ Đã chép link" : "🔗 Chia sẻ"}
          </button>

          <button
            className="ml-auto flex cursor-pointer items-center gap-[8px] rounded-[12px] px-[22px] py-[12px] text-white shadow-[0px_8px_18px_rgba(205,5,8,0.28)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
            onClick={() => {
              onClose();
              openMenu(post.orders);
            }}
            style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
            type="button"
          >
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px]">{post.orderLabel}</span>
            <svg className="size-[17px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </article>
    </div>,
    document.body,
  );
}

/* -------------------------------- Section -------------------------------- */

/** "Bite Journal" — editorial blog band replacing the old Details cards. */
export function BlogSection() {
  const { openMenu } = useMenuFilter();
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [open, setOpen] = useState<Post | null>(null);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const posts = useMemo(() => (topic === "all" ? POSTS : POSTS.filter((p) => p.topic === topic)), [topic]);
  const [featured, ...rest] = posts;
  const list = showAll ? rest : rest.slice(0, 4);

  const toggle = (setter: typeof setLiked, id: string) => setter((prev) => ({ ...prev, [id]: !prev[id] }));

  const savedCount = Object.values(saved).filter(Boolean).length;

  return (
    <div className="relative w-full overflow-hidden px-[221px] py-[100px]" data-name="Details">
      {/* Ambient */}
      <span className="absolute inset-0" style={{ backgroundImage: "linear-gradient(170deg, #ffffff 0%, #fffaf0 45%, #fff1e0 100%)" }} />
      <div className="pointer-events-none absolute -left-[160px] top-[80px] size-[520px] rounded-full bg-[#f4de79] opacity-20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-[140px] bottom-[60px] size-[520px] rounded-full bg-[#fa6932] opacity-[0.14] blur-[150px]" />
      <p className="pointer-events-none absolute -right-[40px] top-[40px] font-['Source_Sans_Pro:Bold',sans-serif] text-[190px] leading-none text-[#d9161c]/[0.05] select-none">JOURNAL</p>

      {/* Header */}
      <div className="relative flex items-end justify-between gap-[40px] pb-[36px]">
        <div className="flex flex-col gap-[12px]">
          <span className="flex w-fit items-center gap-[10px] rounded-full bg-[#f6ece9] px-[18px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] tracking-[3px] text-[#d9161c] uppercase">
            <span className="size-[8px] animate-pulse rounded-full bg-[#fa6932]" />
            Bite journal
          </span>
          <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[58px] leading-[1.02] text-[#212121]">
            Chuyện của bếp,
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(95deg, #fa6932 0%, #d9161c 60%, #7f292a 100%)" }}
            >
              kể bằng vị ngon
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-[12px]">
          {savedCount > 0 && (
            <span className="rounded-full bg-[#f4de79] px-[16px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#7f292a] [animation:badge-pop_0.4s_ease]">
              🔖 Đã lưu {savedCount} bài
            </span>
          )}
          <div className="flex flex-wrap justify-end gap-[8px]">
            {TOPICS.map((item) => (
              <button
                className={`cursor-pointer rounded-full px-[18px] py-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] whitespace-nowrap transition-all duration-300 ${
                  topic === item.id
                    ? "bg-[#d9161c] text-white shadow-[0px_8px_18px_rgba(205,5,8,0.26)]"
                    : "bg-[#f5f0e8] text-[#757575] hover:-translate-y-[2px] hover:bg-[#f7e7a8] hover:text-[#d9161c]"
                }`}
                key={item.id}
                onClick={() => {
                  setTopic(item.id);
                  setShowAll(false);
                }}
                type="button"
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured */}
      {featured && (
        <button
          className="group relative flex h-[440px] w-full cursor-pointer items-end overflow-hidden rounded-[30px] text-left shadow-[0px_20px_44px_rgba(205,5,8,0.14)] ring-1 ring-[#ffe0bd] transition-shadow duration-500 hover:shadow-[0px_30px_60px_rgba(205,5,8,0.22)]"
          onClick={() => setOpen(featured)}
          type="button"
        >
          <img alt="" className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]" src={featured.image} />
          <span className="absolute inset-0" style={{ backgroundImage: "linear-gradient(100deg, rgba(20,6,10,0.92) 12%, rgba(20,6,10,0.35) 62%, rgba(255,106,31,0.25) 100%)" }} />

          <div className="relative flex max-w-[720px] flex-col gap-[16px] p-[52px]">
            <span className="flex w-fit items-center gap-[10px] rounded-full bg-[#d9161c] px-[16px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] tracking-[2px] text-white uppercase">
              Bài nổi bật
            </span>
            <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[52px] leading-[1.05] text-white">
              {featured.title} <span className="text-[#f4de79]">{featured.highlight}</span>
            </p>
            <p className="font-['Open_Sans:Regular',sans-serif] text-[20px] leading-[1.5] text-[#e6d7c8]">{featured.excerpt}</p>
            <div className="flex items-center gap-[16px] pt-[6px] font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#f4de79]">
              <span>{featured.author}</span>
              <span className="size-[5px] rounded-full bg-[#f4de79]/60" />
              <span>{featured.date}</span>
              <span className="size-[5px] rounded-full bg-[#f4de79]/60" />
              <span>{featured.minutes} phút đọc</span>
            </div>
            <span className="mt-[10px] flex w-fit items-center gap-[10px] rounded-[14px] bg-[#f4de79] px-[26px] py-[14px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#7f292a] transition-transform duration-300 group-hover:translate-x-[6px]">
              Đọc bài viết
              <svg className="size-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" viewBox="0 0 24 24">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </button>
      )}

      {/* Grid */}
      <div className="relative mt-[26px] grid grid-cols-2 gap-[24px]">
        {list.map((post, i) => (
          <div
            className="group relative flex cursor-pointer gap-[20px] overflow-hidden rounded-[24px] bg-white p-[18px] shadow-[0px_6px_18px_rgba(33,33,33,0.07)] ring-1 ring-[#f0e8e2] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[8px] hover:shadow-[0px_26px_50px_rgba(205,5,8,0.16)] hover:ring-[#f7c9a8]"
            key={post.id}
            onClick={() => setOpen(post)}
            style={{ animation: "dish-in 0.45s cubic-bezier(0.16,1,0.3,1) both", animationDelay: `${i * 70}ms` }}
          >
            <div className="relative size-[168px] shrink-0 overflow-hidden rounded-[18px]">
              <img alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.1]" loading="lazy" src={post.image} />
              <span className="absolute left-[10px] top-[10px] rounded-full bg-[#212121]/72 px-[10px] py-[4px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#f4de79] backdrop-blur-[2px]">
                {post.minutes}′
              </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] tracking-[2px] text-[#fa6932] uppercase">
                {TOPICS.find((t) => t.id === post.topic)?.label}
              </span>
              <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[25px] leading-[1.15] text-[#212121]">
                {post.title} <span className="text-[#d9161c]">{post.highlight}</span>
              </p>
              <p className="line-clamp-2 font-['Open_Sans:Regular',sans-serif] text-[16px] leading-[1.5] text-[#757575]">{post.excerpt}</p>

              <div className="mt-auto flex items-center gap-[8px]">
                <button
                  className={`flex cursor-pointer items-center gap-[6px] rounded-[10px] px-[12px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] transition-all duration-300 ${
                    liked[post.id] ? "bg-[#d9161c] text-white" : "bg-[#f5f0e8] text-[#757575] hover:bg-[#ffe4e4] hover:text-[#d9161c]"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(setLiked, post.id);
                  }}
                  type="button"
                >
                  {liked[post.id] ? "❤️" : "🤍"} {post.likes + (liked[post.id] ? 1 : 0)}
                </button>

                <button
                  className={`cursor-pointer rounded-[10px] px-[12px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] transition-all duration-300 ${
                    saved[post.id] ? "bg-[#f4de79] text-[#7f292a]" : "bg-[#f5f0e8] text-[#757575] hover:bg-[#fff1cf] hover:text-[#a86800]"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(setSaved, post.id);
                  }}
                  type="button"
                >
                  {saved[post.id] ? "🔖 Đã lưu" : "🔖"}
                </button>

                <button
                  className="ml-auto flex cursor-pointer items-center gap-[6px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#d9161c]"
                  onClick={(e) => {
                    e.stopPropagation();
                    openMenu(post.orders);
                  }}
                  type="button"
                >
                  Đặt món
                  <svg className="size-[16px] transition-transform duration-300 group-hover:translate-x-[4px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" viewBox="0 0 24 24">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rest.length > 4 && !showAll && (
        <div className="relative mt-[26px] flex justify-center">
          <button
            className="cursor-pointer rounded-[14px] border-2 border-[#d9161c] px-[30px] py-[13px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#d9161c] transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#d9161c] hover:text-white"
            onClick={() => setShowAll(true)}
            type="button"
          >
            Xem thêm {rest.length - 4} bài viết
          </button>
        </div>
      )}

      {posts.length === 0 && (
        <p className="relative py-[60px] text-center font-['Source_Sans_Pro:Regular',sans-serif] text-[20px] text-[#9a9a9a]">
          Chưa có bài viết trong chủ đề này.
        </p>
      )}

      {/* Newsletter */}
      <div
        className="relative mt-[40px] flex items-center justify-between gap-[32px] overflow-hidden rounded-[26px] px-[44px] py-[34px]"
        style={{ backgroundImage: "linear-gradient(110deg, #7f292a 0%, #b31419 48%, #fa6932 120%)" }}
      >
        <div className="pointer-events-none absolute -left-[60px] top-[-90px] size-[280px] rounded-full bg-[#f4de79] opacity-25 blur-[90px]" />
        <div className="relative flex flex-col gap-[4px]">
          <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[32px] leading-[1.15] text-white">Nhận công thức &amp; mã giảm mỗi tuần</p>
          <p className="font-['Open_Sans:Regular',sans-serif] text-[18px] text-[#ffdcb0]">Một email mỗi thứ Sáu. Không spam, huỷ bất cứ lúc nào.</p>
        </div>

        <form
          className="relative flex shrink-0 items-center gap-[10px]"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@")) return;
            setSubscribed(true);
            setEmail("");
            window.setTimeout(() => setSubscribed(false), 3000);
          }}
        >
          <input
            className="w-[320px] rounded-[14px] bg-white/95 px-[20px] py-[15px] font-['Source_Sans_Pro:Regular',sans-serif] text-[18px] text-[#212121] outline-none placeholder:text-[#9e9e9e]"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@cuaban.com"
            type="email"
            value={email}
          />
          <button
            className={`cursor-pointer rounded-[14px] px-[28px] py-[15px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] transition-all duration-300 hover:-translate-y-[2px] active:scale-95 ${
              subscribed ? "bg-[#22a06b] text-white" : "bg-[#f4de79] text-[#7f292a]"
            }`}
            type="submit"
          >
            {subscribed ? "Đã đăng ký ✓" : "Đăng ký"}
          </button>
        </form>
      </div>

      {open && (
        <ArticleModal
          liked={!!liked[open.id]}
          onClose={() => setOpen(null)}
          onLike={() => toggle(setLiked, open.id)}
          onSave={() => toggle(setSaved, open.id)}
          post={open}
          saved={!!saved[open.id]}
        />
      )}
    </div>
  );
}
