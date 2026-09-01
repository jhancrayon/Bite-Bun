import { type ReactNode, useMemo, useState } from "react";
import { BRANCHES } from "./branch-store";
import { useAuth } from "./auth-store";
import { addReservation } from "./reservation-store";
import { Spinner } from "./spinner";

const OCCASIONS = ["Ăn thường", "Sinh nhật", "Hẹn hò", "Gặp gỡ công việc", "Tụ họp nhóm", "Sự kiện gia đình"];
const OPEN_HOUR = 8;
const CLOSE_HOUR = 22;

/** Danh sách khung giờ 30 phút trong giờ mở cửa. */
function buildTimes() {
  const out: string[] = [];
  for (let h = OPEN_HOUR; h <= CLOSE_HOUR; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    if (h !== CLOSE_HOUR) out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
}

/** Ngày yyyy-mm-dd của hôm nay (theo giờ máy). */
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function PinIcon() {
  return (
    <svg className="size-[20px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg className="size-[20px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <rect height="16" rx="2" width="18" x="3" y="4" /><path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="size-[20px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg className="size-[20px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.1 2.9-5 6.5-5s6.5 1.9 6.5 5" /><path d="M16 5.2a3.2 3.2 0 0 1 0 6M21.5 20c0-2.6-1.6-4.3-4-4.8" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg className="size-[20px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg className="size-[20px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M7 3h3l1.6 4-2 1.4a11 11 0 0 0 5 5L16 11.4 20 13v3a2 2 0 0 1-2.2 2A15 15 0 0 1 5 5.2A2 2 0 0 1 7 3Z" />
    </svg>
  );
}
function GiftIcon() {
  return (
    <svg className="size-[20px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <rect height="10" rx="1" width="18" x="3" y="10" /><path d="M3 10V8h18v2M12 8v13M12 8s-1-4-4-4-2.5 4 4 4M12 8s1-4 4-4 2.5 4-4 4" />
    </svg>
  );
}
function Caret() {
  return <svg className="size-[14px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>;
}

const inputClass = "w-full bg-transparent font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#2a1815] outline-none placeholder:font-normal placeholder:text-[#9c908a]";
const selectClass = "w-full cursor-pointer appearance-none bg-transparent font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#2a1815] outline-none";

function Field({ caret, children, icon, invalid, label }: { caret?: boolean; children: ReactNode; icon: ReactNode; invalid?: boolean; label: string }) {
  return (
    <label className={`flex min-w-0 items-center gap-[10px] rounded-[12px] border px-[13px] py-[11px] text-[#d9161c] transition-colors ${invalid ? "border-[#d9161c] bg-[#fff5f3]" : "border-[#ebe1db] bg-[#fcfaf8] focus-within:border-[#f4de79]"}`}>
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block font-['Source_Sans_Pro:Bold',sans-serif] text-[11px] uppercase tracking-[0.11em] text-[#a28e83]">{label}</span>
        {children}
      </span>
      {caret && <Caret />}
    </label>
  );
}

/** Khu vực đặt bàn / ăn tại quán cho khách. */
export function Reservation() {
  const { user } = useAuth();
  const times = useMemo(buildTimes, []);
  const [branchId, setBranchId] = useState(BRANCHES[0].id);
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | { id: string; branchName: string; date: string; time: string; guests: number }>(null);

  const submit = () => {
    if (busy) return;
    if (name.trim().length < 2) {
      setError("Nhập tên người đặt bàn nhé.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 9) {
      setError("Nhập số điện thoại hợp lệ nhé.");
      return;
    }
    if (!date) {
      setError("Chọn ngày đến nhé.");
      return;
    }
    setError("");
    setBusy(true);
    const branch = BRANCHES.find((b) => b.id === branchId) ?? BRANCHES[0];
    // Giả lập gửi yêu cầu đặt bàn.
    window.setTimeout(() => {
      const res = addReservation({ branchId, branchName: branch.name, date, time, guests, name: name.trim(), phone: phone.trim(), occasion, note: note.trim() });
      setBusy(false);
      setDone({ id: res.id, branchName: branch.name, date, time, guests });
    }, 1100);
  };

  return (
    <div className="w-full bg-[#fdf6e6] px-[24px] py-[64px] sm:px-[48px] xl:px-[120px]" data-name="Reservation">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-[10px] text-center">
        <span className="mx-auto flex items-center gap-[8px] rounded-full bg-[#7f292a] px-[16px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] uppercase tracking-[0.16em] text-[#f4de79]">
          🍽️ Ăn tại quán
        </span>
        <h2 className="font-['Source_Serif_4:SemiBold',serif] text-[#7f292a]">Đặt bàn tại Bite & Bun</h2>
        <p className="mx-auto max-w-[620px] font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] text-[#7a5b52]">
          Giữ chỗ trước để khỏi phải chờ — chọn chi nhánh, ngày giờ và số khách, tụi mình chuẩn bị bàn sẵn cho bạn.
        </p>
      </div>

      <div className="mx-auto mt-[36px] max-w-[1000px] rounded-[26px] border border-[#eadfd8] bg-white p-[18px] shadow-[0_24px_60px_rgba(77,20,9,0.14)] sm:p-[26px]">
        {done ? (
          <div className="flex flex-col items-center gap-[16px] py-[28px] text-center [animation:fade-in_0.3s_ease-out_both]">
            <span className="flex size-[74px] items-center justify-center rounded-full bg-[#e9f8ee] text-[#128a45] shadow-[0_10px_26px_rgba(18,138,69,0.2)]">
              <svg className="size-[38px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24"><path d="m5 13 4 4L19 7" /></svg>
            </span>
            <h3 className="font-['Source_Serif_4:SemiBold',serif] text-[#7f292a]">Đã giữ bàn cho bạn!</h3>
            <p className="max-w-[440px] font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#7a5b52]">
              Mã đặt bàn <b className="text-[#d9161c]">{done.id}</b> · {done.branchName} · {done.date} lúc {done.time} · {done.guests} khách.
              Tụi mình sẽ gọi xác nhận trong ít phút nhé.
            </p>
            <button
              className="mt-[4px] cursor-pointer rounded-[12px] bg-[#d9161c] px-[24px] py-[12px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-white shadow-[0_7px_16px_rgba(205,5,8,0.25)] transition-transform hover:-translate-y-px active:translate-y-0"
              onClick={() => setDone(null)}
              type="button"
            >
              Đặt bàn khác
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-[10px] md:grid-cols-2">
              <Field caret icon={<PinIcon />} label="Chi nhánh">
                <select className={selectClass} onChange={(e) => setBranchId(e.target.value)} value={branchId}>
                  {[...BRANCHES].sort((a, b) => a.km - b.km).map((b) => (
                    <option key={b.id} value={b.id}>{b.name} · {b.district}</option>
                  ))}
                </select>
              </Field>
              <Field caret icon={<GiftIcon />} label="Dịp">
                <select className={selectClass} onChange={(e) => setOccasion(e.target.value)} value={occasion}>
                  {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              <Field icon={<CalIcon />} label="Ngày">
                <input className={inputClass} min={todayISO()} onChange={(e) => { setDate(e.target.value); setError(""); }} type="date" value={date} />
              </Field>
              <Field caret icon={<ClockIcon />} label="Giờ">
                <select className={selectClass} onChange={(e) => setTime(e.target.value)} value={time}>
                  {times.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field caret icon={<UsersIcon />} label="Số khách">
                <select className={selectClass} onChange={(e) => setGuests(Number(e.target.value))} value={guests}>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} khách{n >= 20 ? "+" : ""}</option>
                  ))}
                </select>
              </Field>
              <Field icon={<UserIcon />} invalid={Boolean(error) && name.trim().length < 2} label="Tên người đặt">
                <input className={inputClass} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Nhập tên của bạn" value={name} />
              </Field>
              <Field icon={<PhoneIcon />} invalid={Boolean(error) && phone.replace(/\D/g, "").length < 9} label="Số điện thoại">
                <input className={inputClass} inputMode="tel" onChange={(e) => { setPhone(e.target.value); setError(""); }} placeholder="Nhập số điện thoại" value={phone} />
              </Field>
              <label className="flex min-w-0 items-center gap-[10px] rounded-[12px] border border-[#ebe1db] bg-[#fcfaf8] px-[13px] py-[11px] text-[#d9161c] transition-colors focus-within:border-[#f4de79]">
                <svg className="size-[20px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 5h16M4 12h16M4 19h10" /></svg>
                <span className="min-w-0 flex-1">
                  <span className="block font-['Source_Sans_Pro:Bold',sans-serif] text-[11px] uppercase tracking-[0.11em] text-[#a28e83]">Ghi chú (tuỳ chọn)</span>
                  <input className={inputClass} onChange={(e) => setNote(e.target.value)} placeholder="Ghế trẻ em, gần cửa sổ…" value={note} />
                </span>
              </label>
            </div>

            {error && <p className="px-[3px] pt-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#d9161c]">{error}</p>}

            <button
              className="mt-[16px] flex w-full cursor-pointer items-center justify-center gap-[10px] rounded-[14px] bg-[#d9161c] px-[24px] py-[15px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-white shadow-[0_10px_22px_rgba(205,5,8,0.28)] transition-all hover:-translate-y-px hover:bg-[#9e1418] active:translate-y-0 disabled:opacity-70"
              disabled={busy}
              onClick={submit}
              type="button"
            >
              {busy ? <><Spinner className="size-[20px]" /> Đang giữ bàn…</> : <>🍽️ Xác nhận đặt bàn</>}
            </button>
            <p className="pt-[10px] text-center font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] text-[#a28e83]">
              Đặt bàn miễn phí · Giữ chỗ 15 phút · Hotline 1900 1234
            </p>
          </>
        )}
      </div>
    </div>
  );
}
