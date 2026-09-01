import { type ReactNode, useEffect, useState } from "react";
import { setAddress, useAddress } from "./address-store";
import { BRANCHES, setBranch, useBranch } from "./branch-store";
import { useMenuFilter } from "./menu-filter";
import { type OrderMode as Mode, setOrderMode, useOrderMode } from "./order-mode-store";

const OPEN_HOUR = 8;
const CLOSE_HOUR = 23;

function buildSlots(now: Date) {
  const slots: string[] = [];
  const cursor = new Date(now.getTime() + 45 * 60000);
  cursor.setMinutes(cursor.getMinutes() > 30 ? 60 : 30, 0, 0);
  if (cursor.getHours() < OPEN_HOUR) cursor.setHours(OPEN_HOUR, 0, 0, 0);
  while (cursor.getHours() < CLOSE_HOUR && slots.length < 8) {
    slots.push(`${String(cursor.getHours()).padStart(2, "0")}:${String(cursor.getMinutes()).padStart(2, "0")}`);
    cursor.setMinutes(cursor.getMinutes() + 30);
  }
  return slots;
}

function PinIcon() {
  return (
    <svg className="size-[20px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg className="size-[20px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4 7h16l-1.3 13.1a1 1 0 0 1-1 .9H6.3a1 1 0 0 1-1-.9L4 7Z" />
      <path d="M8.5 7a3.5 3.5 0 0 1 7 0" />
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

function UserIcon() {
  return (
    <svg className="size-[20px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="size-[20px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function Caret() {
  return (
    <svg className="size-[14px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
  );
}

const inputClass = "w-full bg-transparent font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#2a1815] outline-none placeholder:font-normal placeholder:text-[#9c908a]";
const selectClass = "w-full cursor-pointer appearance-none bg-transparent font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#2a1815] outline-none";

function Field({ caret, children, icon, invalid, label }: { caret?: boolean; children: ReactNode; icon: ReactNode; invalid?: boolean; label: string }) {
  return (
    <label className={`flex min-w-0 items-center gap-[10px] rounded-[12px] border px-[12px] py-[10px] text-[#d9161c] transition-colors ${invalid ? "border-[#d9161c] bg-[#fff5f3]" : "border-[#ebe1db] bg-[#fcfaf8] focus-within:border-[#f4de79]"}`}>
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block font-['Source_Sans_Pro:Bold',sans-serif] text-[11px] uppercase tracking-[0.11em] text-[#a28e83]">{label}</span>
        {children}
      </span>
      {caret && <Caret />}
    </label>
  );
}

/** Compact hero order control for delivery or collection. */
export function OrderModeBar() {
  const branch = useBranch();
  const { openMenu } = useMenuFilter();
  const mode = useOrderMode();
  const address = useAddress();
  const [now, setNow] = useState(() => new Date());
  const [slot, setSlot] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupName, setPickupName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const slots = buildSlots(now);
  const eta = mode === "delivery" ? Math.round(18 + branch.km * 2) : Math.max(10, Math.round(8 + branch.km));
  const timeLabel = slot || (mode === "delivery" ? `Giao ngay · ${eta} phút` : `Lấy ngay · ${eta} phút`);

  const changeMode = (nextMode: Mode) => {
    if (nextMode === mode) return;
    setOrderMode(nextMode);
    setSlot("");
    setError("");
  };

  const startOrder = () => {
    if (mode === "delivery") {
      if (address.trim().length < 6) {
        setError("Nhập địa chỉ giao hàng trước nhé.");
        return;
      }
    } else {
      if (phone.replace(/\D/g, "").length < 9) {
        setError("Nhập số điện thoại người lấy hàng nhé.");
        return;
      }
      if (pickupName.trim().length < 2) {
        setError("Nhập tên người đến lấy nhé.");
        return;
      }
    }
    setError("");
    openMenu("all");
  };

  return (
    <div className="relative w-full rounded-[20px] border border-[#eadfd8] bg-white p-[10px] shadow-[0_15px_36px_rgba(77,20,9,0.12)]">
      <div className="grid grid-cols-2 rounded-[13px] bg-[#f6f1ed] p-[4px]">
        {(["delivery", "pickup"] as Mode[]).map((item) => {
          const active = mode === item;
          return (
            <button
              aria-pressed={active}
              className={`relative z-[2] flex cursor-pointer items-center justify-center gap-[8px] rounded-[10px] py-[10px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] transition-all duration-300 select-none pointer-events-auto ${
                active ? "bg-[#d9161c] text-white shadow-[0_5px_13px_rgba(151,4,7,0.22)]" : "text-[#746762] hover:text-[#7f292a]"
              }`}
              key={item}
              onClick={() => changeMode(item)}
              type="button"
            >
              {item === "delivery" ? <PinIcon /> : <BagIcon />}
              {item === "delivery" ? "Giao hàng" : "Đến lấy"}
              {item === "pickup" && <span className={`rounded-full px-[7px] py-[1px] text-[12px] ${active ? "bg-[#f4de79] text-[#7f292a]" : "bg-white text-[#d9161c]"}`}>-10%</span>}
            </button>
          );
        })}
      </div>

      <div key={mode} className={`mt-[10px] grid gap-[8px] ${mode === "delivery" ? "md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)_auto]" : "md:grid-cols-2 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,0.85fr)_minmax(0,1.1fr)_auto]"}`}>
        {mode === "delivery" ? (
          <Field icon={<PinIcon />} invalid={Boolean(error)} label="Giao đến">
            <input
              className={inputClass}
              onChange={(e) => {
                setAddress(e.target.value);
                setError("");
              }}
              placeholder="Nhập địa chỉ của bạn"
              value={address}
            />
          </Field>
        ) : (
          <>
            <Field icon={<PhoneIcon />} label="Số điện thoại">
              <input
                className={inputClass}
                inputMode="tel"
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
                placeholder="Nhập số điện thoại"
                value={phone}
              />
            </Field>
            <Field icon={<UserIcon />} label="Người đến lấy">
              <input
                className={inputClass}
                onChange={(e) => {
                  setPickupName(e.target.value);
                  setError("");
                }}
                placeholder="Nhập tên người lấy"
                value={pickupName}
              />
            </Field>
            <Field caret icon={<BagIcon />} label="Chi nhánh đến lấy">
              <select className={selectClass} onChange={(e) => setBranch(e.target.value)} value={branch.id}>
                {[...BRANCHES].sort((a, b) => a.km - b.km).map((item) => (
                  <option key={item.id} value={item.id}>{item.name} · {item.district}</option>
                ))}
              </select>
            </Field>
          </>
        )}

        {mode === "delivery" && (
          <Field caret icon={<ClockIcon />} label="Thời gian giao">
            <select className={selectClass} onChange={(e) => setSlot(e.target.value)} value={slot}>
              <option value="">{timeLabel}</option>
              {slots.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>
        )}

        <button className="group flex cursor-pointer items-center justify-center gap-[8px] rounded-[12px] bg-[#d9161c] px-[19px] py-[12px] font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-white shadow-[0_7px_16px_rgba(205,5,8,0.25)] transition-all hover:-translate-y-px hover:bg-[#9e1418] active:translate-y-0" onClick={startOrder} type="button">
          Đặt món
          <svg className="size-[18px] text-[#f4de79] transition-transform group-hover:translate-x-[2px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
        </button>
      </div>

      {mode === "pickup" && (
        <label className="mt-[8px] flex min-w-0 items-center gap-[10px] rounded-[12px] border border-[#ebe1db] bg-[#fcfaf8] px-[12px] py-[10px] text-[#d9161c] focus-within:border-[#f4de79]">
          <ClockIcon />
          <span className="min-w-0 flex-1">
            <span className="block font-['Source_Sans_Pro:Bold',sans-serif] text-[11px] uppercase tracking-[0.11em] text-[#a28e83]">Giờ lấy</span>
            <select className={selectClass} onChange={(e) => setSlot(e.target.value)} value={slot}>
              <option value="">{timeLabel}</option>
              {slots.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </span>
          <Caret />
        </label>
      )}
      {error && <p className="px-[3px] pt-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#d9161c]">{error}</p>}
    </div>
  );
}
