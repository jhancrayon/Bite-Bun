import { useState, type FormEvent } from "react";
import imgLogoMark from "../../imports/Sections/66f9623bc1d5702815f0f81cc5bd3c3a7168f6be.png";
import { useMenuFilter } from "./menu-filter";

const COLUMNS: { title: string; links: string[] }[] = [
  { title: "Khám phá", links: ["Thực đơn", "Món mới", "Khuyến mãi", "Combo nhóm", "Thẻ quà tặng"] },
  { title: "Về Bite & Bun", links: ["Câu chuyện", "Nhà bếp của tụi mình", "Tuyển dụng", "Nhượng quyền", "Báo chí"] },
  { title: "Hỗ trợ", links: ["Theo dõi đơn", "Đổi trả & hoàn tiền", "Câu hỏi thường gặp", "Liên hệ", "Điều khoản"] },
];

const CITIES = ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Nha Trang", "Huế", "Đà Lạt", "Vũng Tàu", "Biên Hoà"];

const SOCIALS: { id: string; label: string; path: string }[] = [
  { id: "fb", label: "Facebook", path: "M14 8h2.5V4.8h-2.9c-2.6 0-4.1 1.6-4.1 4.1V11H7v3.2h2.5V21h3.3v-6.8h2.6l.4-3.2h-3v-1.6c0-.9.4-1.4 1.2-1.4Z" },
  { id: "ig", label: "Instagram", path: "M7.6 3h8.8A4.6 4.6 0 0 1 21 7.6v8.8a4.6 4.6 0 0 1-4.6 4.6H7.6A4.6 4.6 0 0 1 3 16.4V7.6A4.6 4.6 0 0 1 7.6 3Zm4.4 5.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm5-1.6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" },
  { id: "tt", label: "TikTok", path: "M14 3h3a5 5 0 0 0 4 4.3v3A8 8 0 0 1 17 9v5.6A6.4 6.4 0 1 1 11.6 8v3.2a3.2 3.2 0 1 0 2.4 3.1V3Z" },
  { id: "yt", label: "YouTube", path: "M21.2 8.2a2.6 2.6 0 0 0-1.8-1.8C17.8 6 12 6 12 6s-5.8 0-7.4.4A2.6 2.6 0 0 0 2.8 8.2 27 27 0 0 0 2.4 12c0 1.3.1 2.6.4 3.8a2.6 2.6 0 0 0 1.8 1.8c1.6.4 7.4.4 7.4.4s5.8 0 7.4-.4a2.6 2.6 0 0 0 1.8-1.8c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8ZM10.2 15V9l5.2 3-5.2 3Z" },
];

const CONTACTS = [
  { id: "phone", emoji: "📞", label: "1900 6868", note: "8:00 – 23:00 mỗi ngày" },
  { id: "mail", emoji: "✉️", label: "xinchao@bitebun.vn", note: "Phản hồi trong 2 giờ" },
  { id: "addr", emoji: "📍", label: "98 Nguyễn Công Hoan", note: "P. Cầu Kiệu, TP.HCM" },
];

function Socials() {
  return (
    <div className="flex items-center gap-[10px]">
      {SOCIALS.map((social) => (
        <a
          aria-label={social.label}
          className="group flex size-[44px] items-center justify-center rounded-[14px] border border-white/12 bg-white/[0.06] text-[#ffdcb0] transition-all duration-300 hover:-translate-y-[3px] hover:border-transparent hover:bg-[#f4de79] hover:text-[#4a1516] hover:shadow-[0px_10px_22px_rgba(255,179,14,0.35)]"
          href="#top"
          key={social.id}
        >
          <svg className="size-[21px] fill-current" viewBox="0 0 24 24">
            <path d={social.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
    setEmail("");
    window.setTimeout(() => setDone(false), 2600);
  };

  return (
    <form className="flex w-full max-w-[520px] flex-col gap-[12px]" onSubmit={submit}>
      <div className="flex items-center gap-[10px] rounded-[999px] border border-white/14 bg-white/[0.07] p-[7px] pl-[22px] backdrop-blur-[6px] transition-colors duration-300 focus-within:border-[#f4de79]">
        <input
          className="min-w-0 flex-1 bg-transparent font-['Source_Sans_Pro:Regular',sans-serif] text-[18px] text-white outline-none placeholder:text-[#b79a8c]"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email của bạn"
          type="email"
          value={email}
        />
        <button
          className="shrink-0 cursor-pointer rounded-[999px] px-[26px] py-[13px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] whitespace-nowrap text-[#4a1516] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
          style={{ backgroundImage: "linear-gradient(135deg, #f4de79 0%, #f4de79 45%, #fa6932 100%)" }}
          type="submit"
        >
          Nhận ưu đãi
        </button>
      </div>
      <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#b79a8c]">
        {done ? "🎉 Xong! Mã giảm 50k đang bay tới hộp thư của bạn." : "Đăng ký để nhận mã giảm 50k cho đơn đầu tiên."}
      </span>
    </form>
  );
}

/** Bold, off-grid footer: giant wordmark, glass panels and a scrolling city marquee. */
export function SiteFooter() {
  const { openMenu } = useMenuFilter();

  return (
    <footer className="relative w-full overflow-hidden" data-name="Footer" style={{ backgroundColor: "#1a0507" }}>
      {/* atmosphere */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(900px 520px at 8% -10%, rgba(205, 5, 8, 0.55) 0%, rgba(205, 5, 8, 0) 70%)",
            "radial-gradient(760px 480px at 92% 0%, rgba(255, 138, 0, 0.35) 0%, rgba(255, 138, 0, 0) 72%)",
            "radial-gradient(900px 600px at 60% 120%, rgba(255, 179, 14, 0.16) 0%, rgba(255, 179, 14, 0) 70%)",
          ].join(", "),
        }}
      />
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0px, rgba(255,255,255,0.09) 1px, transparent 1px, transparent 148px)",
        }}
      />

      {/* gold hairline on top */}
      <span className="absolute left-0 right-0 top-0 h-[4px]" style={{ backgroundImage: "linear-gradient(90deg, #f4de79 0%, #f4de79 35%, #fa6932 70%, #fa6932 100%)" }} />

      <div className="relative flex flex-col px-[221px] pb-[40px] pt-[92px]">
        {/* top: brand + newsletter */}
        <div className="flex items-end gap-[80px] border-b border-white/10 pb-[56px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[20px]">
            <div className="flex items-center gap-[14px]">
              <img
                alt="Bite & Bun"
                className="size-[92px] shrink-0 animate-[hero-float_5s_ease-in-out_infinite] object-contain drop-shadow-[0px_0px_26px_rgba(255,179,14,0.5)]"
                src={imgLogoMark}
              />
              <span className="flex flex-col leading-none">
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[42px] tracking-[-0.5px] whitespace-nowrap">
                  <span className="text-[#f3f3f3]">Bite</span>
                  <span className="bg-clip-text px-[6px] text-transparent" style={{ backgroundImage: "linear-gradient(180deg, #f4de79 0%, #f4de79 55%, #fa6932 100%)" }}>
                    &
                  </span>
                  <span className="text-[#f3f3f3]">Bun</span>
                </span>
                <span className="mt-[8px] flex items-center gap-[8px]">
                  <span className="h-[2px] w-[26px] rounded-full bg-[#f4de79]" />
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] tracking-[3px] text-[#f4de79] uppercase">Ngon từng miếng</span>
                </span>
              </span>
            </div>
            <p className="max-w-[520px] font-['Source_Sans_Pro:Regular',sans-serif] text-[19px] leading-[1.6] text-[#c9b3a6]">
              Bếp mở lửa từ 8 giờ sáng, burger nướng theo đơn, giao trung bình 22 phút. Ăn ngon là chuyện nghiêm túc.
            </p>
            <Socials />
          </div>

          <div className="flex shrink-0 flex-col gap-[16px]">
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[26px] text-white">Ưu đãi ngon, gửi thẳng hộp thư</span>
            <Newsletter />
          </div>
        </div>

        {/* middle: link columns + contact card */}
        <div className="flex gap-[64px] border-b border-white/10 py-[52px]">
          {COLUMNS.map((column) => (
            <div className="flex min-w-[190px] flex-col gap-[16px]" key={column.title}>
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] tracking-[3px] text-[#f4de79] uppercase">{column.title}</span>
              {column.links.map((link) => (
                <a
                  className="group flex w-fit items-center gap-[8px] font-['Source_Sans_Pro:Regular',sans-serif] text-[18px] text-[#c9b3a6] transition-colors duration-300 hover:text-white"
                  href="#top"
                  key={link}
                  onClick={
                    link === "Thực đơn"
                      ? (e) => {
                          e.preventDefault();
                          openMenu("all");
                        }
                      : undefined
                  }
                >
                  <span className="h-[2px] w-0 rounded-full bg-[#f4de79] transition-all duration-300 group-hover:w-[14px]" />
                  {link}
                </a>
              ))}
            </div>
          ))}

          <div className="ml-auto flex w-[360px] shrink-0 flex-col gap-[14px] rounded-[24px] border border-white/12 bg-white/[0.05] p-[24px] backdrop-blur-[6px]">
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] tracking-[3px] text-[#f4de79] uppercase">Liên hệ</span>
            {CONTACTS.map((contact) => (
              <div className="flex items-center gap-[13px]" key={contact.id}>
                <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[14px] bg-white/[0.08] text-[20px]">{contact.emoji}</span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-white">{contact.label}</span>
                  <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#b79a8c]">{contact.note}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* cities marquee */}
        <div className="relative flex items-center gap-[24px] overflow-hidden py-[30px]">
          <span className="shrink-0 font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] tracking-[3px] text-[#f4de79] uppercase">Đang giao tại</span>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
            <div className="flex w-max items-center gap-[14px] animate-[marquee_26s_linear_infinite]">
              {[...CITIES, ...CITIES].map((city, i) => (
                <span
                  className="shrink-0 rounded-[999px] border border-white/12 bg-white/[0.06] px-[20px] py-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] whitespace-nowrap text-[#f7e7a8]"
                  key={`${city}-${i}`}
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* giant wordmark */}
        <span
          className="pointer-events-none select-none bg-clip-text text-center font-['Source_Sans_Pro:Bold',sans-serif] text-[210px] leading-[0.85] tracking-[-6px] text-transparent"
          style={{ backgroundImage: "linear-gradient(180deg, rgba(255,179,14,0.22) 0%, rgba(255,138,0,0.05) 65%, rgba(255,138,0,0) 100%)" }}
        >
          BITE &amp; BUN
        </span>

        {/* bottom bar */}
        <div className="flex items-center gap-[24px] border-t border-white/10 pt-[26px]">
          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#9d8579]">© 2026 Bite &amp; Bun. Nướng bằng cả trái tim tại Sài Gòn.</span>
          <div className="ml-auto flex items-center gap-[22px]">
            {["Bảo mật", "Điều khoản", "Cookie"].map((link) => (
              <a className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#9d8579] transition-colors duration-300 hover:text-[#f4de79]" href="#top" key={link}>
                {link}
              </a>
            ))}
            <a
              className="flex items-center gap-[9px] rounded-[999px] border border-white/14 bg-white/[0.06] px-[18px] py-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#f7e7a8] transition-all duration-300 hover:-translate-y-[2px] hover:border-[#f4de79] hover:text-[#f4de79]"
              href="#top"
            >
              Lên đầu trang
              <svg className="size-[16px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="m6 15 6-6 6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
