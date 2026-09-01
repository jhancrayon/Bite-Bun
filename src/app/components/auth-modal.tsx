import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import imgLogoMark from "../../imports/Sections/66f9623bc1d5702815f0f81cc5bd3c3a7168f6be.png";
import { DEFAULT_AVATAR, DEFAULT_EMAIL, DEFAULT_NAME, useAuth, type AuthTab } from "./auth-store";
import { Spinner } from "./spinner";

/* ---------------------------------------------------------------- icons */

function MailIcon() {
  return (
    <svg className="size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <rect height="15" rx="2.5" width="19" x="2.5" y="4.5" />
      <path d="m3 6.5 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <rect height="10" rx="2.5" width="16" x="4" y="10.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg className="size-[19px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
      {off && <path d="m4 20 16-16" />}
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-[22px]" viewBox="0 0 24 24">
      <path d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6Z" fill="#4285F4" />
      <path d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9a7 7 0 0 1-10.4-3.6H1.7v3A11.5 11.5 0 0 0 12 23.5Z" fill="#34A853" />
      <path d="M5.5 14.2a6.9 6.9 0 0 1 0-4.4v-3H1.7a11.5 11.5 0 0 0 0 10.4l3.8-3Z" fill="#FBBC05" />
      <path d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.7 6.8l3.8 3A6.9 6.9 0 0 1 12 5.4Z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="size-[22px]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.5 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.2.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8Z" />
      <path d="M14.3 5.8c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2-.5 2.7-1.3Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="size-[22px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect height="19" rx="3" width="12" x="6" y="2.5" />
      <path d="M10.5 19h3" />
    </svg>
  );
}

/* ----------------------------------------------------------------- field */

function Field({
  icon,
  label,
  onChange,
  placeholder,
  type = "text",
  value,
  trailing,
}: {
  icon: ReactNode;
  label: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  value: string;
  trailing?: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-[7px]">
      <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#4a3b33]">
        {label} <span className="text-[#d9161c]">*</span>
      </span>
      <span className="group relative flex items-center">
        <span className="pointer-events-none absolute left-[14px] text-[#c0a999] transition-colors duration-300 group-focus-within:text-[#d9161c]">{icon}</span>
        <input
          className="w-full rounded-[14px] border border-[#efe1d4] bg-[#f3f3f3] py-[13px] pl-[46px] pr-[46px] font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] text-[#2b1b14] outline-none transition-all duration-300 placeholder:text-[#c3b0a2] focus:border-[#f4de79] focus:bg-white focus:shadow-[0px_0px_0px_4px_rgba(255,179,14,0.18)]"
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          value={value}
        />
        {trailing && <span className="absolute right-[12px] flex items-center">{trailing}</span>}
      </span>
    </label>
  );
}

/* ------------------------------------------------------- one-tap buttons */

/** Nút đăng nhập nhanh 1-chạm (social / phone). */
function OneTapButton({ icon, label, onClick, accent, loading, disabled }: { icon: ReactNode; label: string; onClick: () => void; accent?: boolean; loading?: boolean; disabled?: boolean }) {
  return (
    <button
      className={`flex cursor-pointer items-center gap-[13px] rounded-[15px] border py-[14px] pl-[18px] pr-[16px] transition-all duration-300 hover:-translate-y-[2px] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${
        accent
          ? "border-transparent bg-[#1a1a1a] text-white hover:shadow-[0px_10px_22px_rgba(0,0,0,0.28)]"
          : "border-[#efe1d4] bg-white text-[#2b1b14] hover:border-[#f4de79] hover:shadow-[0px_10px_22px_rgba(205,5,8,0.12)]"
      }`}
      disabled={disabled || loading}
      onClick={onClick}
      type="button"
    >
      <span className="flex size-[26px] shrink-0 items-center justify-center">{loading ? <Spinner className="size-[22px]" /> : icon}</span>
      <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px]">{loading ? "Đang kết nối…" : label}</span>
      {!loading && (
        <svg className="ml-auto size-[18px] opacity-40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" />
        </svg>
      )}
    </button>
  );
}

/* --------------------------------------------------------------- OTP row */

const OTP_LENGTH = 6;

/** 6 ô nhập OTP độc lập, tự nhảy con trỏ, hỗ trợ dán & xoá lùi. */
function OtpInput({ value, onChange, onComplete }: { value: string; onChange: (v: string) => void; onComplete: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const setDigit = (index: number, digit: string) => {
    const clean = digit.replace(/\D/g, "");
    if (!clean) return;
    const chars = value.split("");
    // Dán nhiều số cùng lúc → điền lần lượt từ ô hiện tại.
    for (let i = 0; i < clean.length && index + i < OTP_LENGTH; i++) {
      chars[index + i] = clean[i];
    }
    const next = chars.join("").slice(0, OTP_LENGTH);
    onChange(next);
    const focusAt = Math.min(index + clean.length, OTP_LENGTH - 1);
    refs.current[focusAt]?.focus();
    if (next.length === OTP_LENGTH) onComplete(next);
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const chars = value.split("");
      if (chars[index]) {
        chars[index] = "";
        onChange(chars.join(""));
      } else if (index > 0) {
        chars[index - 1] = "";
        onChange(chars.join(""));
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-[10px]">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          className={`size-[52px] rounded-[14px] border-2 bg-[#f3f3f3] text-center font-['Source_Sans_Pro:Bold',sans-serif] text-[26px] text-[#2b1b14] outline-none transition-all duration-200 ${
            value[i] ? "border-[#d9161c] bg-white shadow-[0px_6px_14px_rgba(205,5,8,0.14)]" : "border-[#efe1d4] focus:border-[#f4de79] focus:bg-white focus:shadow-[0px_0px_0px_4px_rgba(255,179,14,0.18)]"
          }`}
          inputMode="numeric"
          key={i}
          maxLength={1}
          onChange={(e) => setDigit(i, e.target.value)}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={(e) => {
            e.preventDefault();
            setDigit(i, e.clipboardData.getData("text"));
          }}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={value[i] ?? ""}
        />
      ))}
    </div>
  );
}

function SubmitButton({ children, type = "submit", onClick, loading, loadingLabel = "Đang xử lý…" }: { children: ReactNode; type?: "submit" | "button"; onClick?: () => void; loading?: boolean; loadingLabel?: string }) {
  return (
    <button
      className="group mt-[2px] flex w-full cursor-pointer items-center justify-center gap-[10px] rounded-[14px] py-[15px] text-white shadow-[0px_12px_26px_rgba(205,5,8,0.32)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      disabled={loading}
      onClick={onClick}
      style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
      type={type}
    >
      {loading ? (
        <>
          <Spinner />
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] tracking-[1.5px] uppercase">{loadingLabel}</span>
        </>
      ) : (
        <>
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] tracking-[1.5px] uppercase">{children}</span>
          <svg className="size-[19px] transition-transform duration-300 group-hover:translate-x-[4px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ tabs */

const TABS: { id: AuthTab; label: string }[] = [
  { id: "login", label: "Đăng nhập" },
  { id: "register", label: "Đăng Ký" },
];

/** Demo OTP mọi số điện thoại đều dùng chung để thử nghiệm. */
const DEMO_OTP = "135790";

/* ----------------------------------------------------------------- modal */

/** Login / register dialog. Mounted outside the scaled Figma stage. */
export function AuthModal() {
  const { open, tab, setTab, closeAuth, signIn } = useAuth();

  /** Chế độ hiển thị: chọn nhanh → nhập SĐT → nhập OTP → email truyền thống. */
  const [mode, setMode] = useState<"quick" | "phone" | "otp" | "email">("quick");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resendIn, setResendIn] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  /** Nhãn hành động đang xử lý (null = không loading). */
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAuth();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeAuth]);

  // Reset về màn chọn nhanh mỗi lần mở modal.
  useEffect(() => {
    if (open) {
      setMode("quick");
      setError("");
      setOtp("");
      setPhone("");
      setBusy(null);
    }
  }, [open]);

  useEffect(() => setError(""), [tab, mode]);

  useEffect(() => {
    if (mode !== "otp" || resendIn <= 0) return;
    const id = window.setInterval(() => setResendIn((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [mode, resendIn]);

  if (!open) return null;

  const finishSocial = (provider: string) => {
    if (busy) return;
    setBusy(provider);
    window.setTimeout(() => signIn({ name: DEFAULT_NAME, email: DEFAULT_EMAIL, avatar: DEFAULT_AVATAR }), 1100);
  };

  const sendOtp = () => {
    if (busy) return;
    if (phone.replace(/\D/g, "").length < 9) return setError("Số điện thoại chưa hợp lệ.");
    setError("");
    setOtp("");
    setBusy("otp-send");
    window.setTimeout(() => {
      setResendIn(30);
      setMode("otp");
      setBusy(null);
    }, 1000);
  };

  const verifyOtp = (code: string) => {
    if (busy) return;
    if (code.length < OTP_LENGTH) return setError("Nhập đủ 6 số của mã xác thực nhé.");
    if (code !== DEMO_OTP) {
      setError("Mã OTP chưa đúng. Thử lại giúp mình.");
      setOtp("");
      return;
    }
    setError("");
    setBusy("otp-verify");
    window.setTimeout(() => signIn({ name: DEFAULT_NAME, email: DEFAULT_EMAIL, avatar: DEFAULT_AVATAR }), 1100);
  };

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!email.includes("@")) return setError("Email chưa hợp lệ.");
    if (password.length < 6) return setError("Mật khẩu cần ít nhất 6 ký tự.");
    if (tab === "register") {
      if (name.trim().length < 2) return setError("Nhập họ tên của bạn.");
      if (confirm !== password) return setError("Mật khẩu xác nhận không khớp.");
    }
    setError("");
    setBusy("email");
    window.setTimeout(() => signIn({ name: tab === "register" && name.trim() ? name.trim() : DEFAULT_NAME, email, avatar: DEFAULT_AVATAR }), 1100);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-[20px]">
      <button aria-label="Đóng" className="absolute inset-0 cursor-default bg-[#1a0507]/70 backdrop-blur-[5px]" onClick={closeAuth} type="button" />

      <div className="relative flex max-h-[92vh] w-full max-w-[470px] flex-col overflow-hidden rounded-[26px] bg-white shadow-[0px_40px_90px_rgba(122,0,2,0.45)]">
        {/* Header */}
        <div className="relative flex shrink-0 items-center justify-between overflow-hidden px-[22px] py-[14px]" style={{ backgroundImage: "linear-gradient(100deg, #7f292a 0%, #b31419 45%, #e5471f 82%, #fa6932 100%)" }}>
          <div className="pointer-events-none absolute -left-[40px] top-[-70px] size-[190px] rounded-full bg-[#f4de79] opacity-25 blur-[60px]" />
          <div className="relative flex items-center gap-[10px]">
            <img alt="Bite & Bun" className="size-[58px] object-contain drop-shadow-[0px_5px_12px_rgba(0,0,0,0.35)]" src={imgLogoMark} />
            <span className="flex flex-col leading-none">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[24px] text-[#f3f3f3]">Bite & Bun</span>
              <span className="mt-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[11px] tracking-[2.5px] text-[#f4de79] uppercase">Ngon từng miếng</span>
            </span>
          </div>
          <button
            className="relative flex size-[34px] cursor-pointer items-center justify-center rounded-full bg-white/15 text-[#f3f3f3] transition-all duration-300 hover:rotate-90 hover:bg-white/30"
            onClick={closeAuth}
            type="button"
          >
            <svg className="size-[16px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24">
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
        </div>

        {/* ------------------------------------------------ QUICK / one-tap */}
        {mode === "quick" && (
          <div className="flex flex-col gap-[16px] overflow-y-auto px-[26px] py-[26px] [scrollbar-width:thin]">
            <div className="flex flex-col gap-[4px] text-center">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[26px] text-[#2b1b14]">Đăng nhập chỉ trong 5 giây</span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#8d7a6c]">Chọn một cách bên dưới — không cần nhớ mật khẩu.</span>
            </div>

            <div className="flex flex-col gap-[11px]">
              <OneTapButton disabled={!!busy} icon={<GoogleIcon />} label="Tiếp tục với Google" loading={busy === "Google"} onClick={() => finishSocial("Google")} />
              <OneTapButton accent disabled={!!busy} icon={<AppleIcon />} label="Tiếp tục với Apple" loading={busy === "Apple"} onClick={() => finishSocial("Apple")} />
              <OneTapButton
                disabled={!!busy}
                icon={<span className="text-[#d9161c]"><PhoneIcon /></span>}
                label="Tiếp tục với số điện thoại"
                onClick={() => {
                  setError("");
                  setMode("phone");
                }}
              />
            </div>

            <div className="flex items-center gap-[12px]">
              <span className="h-px flex-1 bg-[#efe1d4]" />
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#a8927f]">hoặc</span>
              <span className="h-px flex-1 bg-[#efe1d4]" />
            </div>

            <button
              className="cursor-pointer rounded-[14px] border border-[#efe1d4] bg-[#f3f3f3] py-[13px] text-center font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#6b584c] transition-colors duration-300 hover:bg-[#ece4db]"
              onClick={() => {
                setError("");
                setMode("email");
              }}
              type="button"
            >
              Dùng email &amp; mật khẩu
            </button>

            <p className="text-center font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] leading-[1.5] text-[#a8927f]">
              Bằng việc tiếp tục, bạn đồng ý với <span className="text-[#d9161c]">Điều khoản</span> &amp; <span className="text-[#d9161c]">Chính sách bảo mật</span> của Bite &amp; Bun.
            </p>
          </div>
        )}

        {/* --------------------------------------------------- PHONE entry */}
        {mode === "phone" && (
          <div className="flex flex-col gap-[16px] overflow-y-auto px-[26px] py-[26px] [scrollbar-width:thin]">
            <button className="flex w-fit cursor-pointer items-center gap-[6px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#8d7a6c] hover:text-[#d9161c]" onClick={() => setMode("quick")} type="button">
              <svg className="size-[16px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
                <path d="M15 6l-6 6 6 6" />
              </svg>
              Quay lại
            </button>

            <div className="flex flex-col gap-[4px]">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[24px] text-[#2b1b14]">Nhập số điện thoại</span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#8d7a6c]">Tụi mình sẽ gửi mã OTP 6 số để xác thực.</span>
            </div>

            <div className="group relative flex items-center">
              <span className="pointer-events-none absolute left-[14px] flex items-center gap-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#6b584c]">
                🇻🇳 +84
                <span className="h-[22px] w-px bg-[#e2d3c4]" />
              </span>
              <input
                autoFocus
                className="w-full rounded-[14px] border border-[#efe1d4] bg-[#f3f3f3] py-[14px] pl-[92px] pr-[16px] font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] tracking-[1px] text-[#2b1b14] outline-none transition-all duration-300 placeholder:font-normal placeholder:tracking-normal placeholder:text-[#c3b0a2] focus:border-[#f4de79] focus:bg-white focus:shadow-[0px_0px_0px_4px_rgba(255,179,14,0.18)]"
                inputMode="numeric"
                onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                placeholder="901 234 567"
                value={phone}
              />
            </div>

            {error && <p className="rounded-[12px] bg-[#ffeceb] px-[14px] py-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#d9161c]">⚠ {error}</p>}

            <SubmitButton loading={busy === "otp-send"} loadingLabel="Đang gửi…" onClick={sendOtp} type="button">
              Gửi mã OTP
            </SubmitButton>
          </div>
        )}

        {/* ----------------------------------------------------- OTP entry */}
        {mode === "otp" && (
          <div className="flex flex-col gap-[18px] overflow-y-auto px-[26px] py-[26px] [scrollbar-width:thin]">
            <button className="flex w-fit cursor-pointer items-center gap-[6px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#8d7a6c] hover:text-[#d9161c]" onClick={() => setMode("phone")} type="button">
              <svg className="size-[16px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
                <path d="M15 6l-6 6 6 6" />
              </svg>
              Đổi số điện thoại
            </button>

            <div className="flex flex-col gap-[4px] text-center">
              <span className="mx-auto mb-[6px] flex size-[58px] items-center justify-center rounded-full bg-[#fff2e6] text-[28px]">💬</span>
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[24px] text-[#2b1b14]">Nhập mã xác thực</span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#8d7a6c]">
                Mã 6 số đã gửi tới <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#3b2a20]">+84 {phone}</span>
              </span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] text-[#a8927f]">Mã demo: {DEMO_OTP}</span>
            </div>

            <OtpInput onChange={setOtp} onComplete={verifyOtp} value={otp} />

            {error && <p className="text-center font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#d9161c]">⚠ {error}</p>}

            <div className="text-center font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#8d7a6c]">
              Chưa nhận được mã?{" "}
              <button
                className="cursor-pointer font-['Source_Sans_Pro:Bold',sans-serif] text-[#d9161c] hover:underline disabled:cursor-not-allowed disabled:text-[#c3b0a2] disabled:no-underline"
                disabled={resendIn > 0}
                onClick={() => {
                  setResendIn(30);
                  setOtp("");
                  setError("");
                }}
                type="button"
              >
                {resendIn > 0 ? `Gửi lại sau ${resendIn}s` : "Gửi lại mã"}
              </button>
            </div>

            <SubmitButton loading={busy === "otp-verify"} loadingLabel="Đang xác thực…" onClick={() => verifyOtp(otp)} type="button">
              Xác nhận
            </SubmitButton>
          </div>
        )}

        {/* ------------------------------------------------ EMAIL (classic) */}
        {mode === "email" && (
          <>
            <div className="relative flex shrink-0 bg-[#f3f3f3]">
              {TABS.map((item) => (
                <button
                  className={`relative flex-1 cursor-pointer py-[15px] font-['Source_Sans_Pro:Bold',sans-serif] text-[20px] transition-colors duration-300 ${
                    tab === item.id ? "text-[#d9161c]" : "text-[#a8927f] hover:text-[#7f292a]"
                  }`}
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
              <span
                className="absolute bottom-0 h-[4px] w-1/2 rounded-t-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  backgroundImage: "linear-gradient(90deg, #f4de79 0%, #fa6932 55%, #d9161c 100%)",
                  transform: `translateX(${tab === "login" ? 0 : 100}%)`,
                }}
              />
            </div>

            <form className="flex flex-col gap-[15px] overflow-y-auto px-[26px] py-[22px] [scrollbar-width:thin]" onSubmit={submitEmail}>
              {tab === "register" && <Field icon={<UserIcon />} label="Họ và Tên" onChange={setName} placeholder="Nguyễn Văn A" value={name} />}

              <Field icon={<MailIcon />} label="Email" onChange={setEmail} placeholder="example@gmail.com" type="email" value={email} />

              <Field
                icon={<LockIcon />}
                label="Mật khẩu"
                onChange={setPassword}
                placeholder="••••••••"
                trailing={
                  <button className="cursor-pointer text-[#c0a999] transition-colors hover:text-[#d9161c]" onClick={() => setShow((v) => !v)} type="button">
                    <EyeIcon off={show} />
                  </button>
                }
                type={show ? "text" : "password"}
                value={password}
              />

              {tab === "register" && <Field icon={<LockIcon />} label="Xác nhận mật khẩu" onChange={setConfirm} placeholder="••••••••" type={show ? "text" : "password"} value={confirm} />}

              {tab === "login" && (
                <div className="flex items-center justify-between">
                  <button className="flex cursor-pointer items-center gap-[9px]" onClick={() => setRemember((v) => !v)} type="button">
                    <span className={`flex size-[19px] items-center justify-center rounded-[6px] border-2 transition-all duration-300 ${remember ? "border-[#d9161c] bg-[#d9161c]" : "border-[#dcc9b8] bg-white"}`}>
                      {remember && (
                        <svg className="size-[12px] text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="m5 13 4.5 4.5L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#6b584c]">Ghi nhớ đăng nhập</span>
                  </button>
                  <button className="cursor-pointer font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#d9161c] hover:underline" type="button">
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              {error && <p className="rounded-[12px] bg-[#ffeceb] px-[14px] py-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#d9161c]">⚠ {error}</p>}

              <SubmitButton loading={busy === "email"} loadingLabel={tab === "login" ? "Đang đăng nhập…" : "Đang đăng ký…"}>
                {tab === "login" ? "Đăng nhập" : "Đăng ký"}
              </SubmitButton>

              <button
                className="cursor-pointer text-center font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#8d7a6c] hover:text-[#d9161c]"
                onClick={() => setMode("quick")}
                type="button"
              >
                ← Đăng nhập nhanh 1-chạm
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
