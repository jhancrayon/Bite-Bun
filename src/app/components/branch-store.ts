import { useSyncExternalStore } from "react";

export type Branch = {
  id: string;
  name: string;
  district: string;
  address: string;
  hours: string;
  /** Straight-line distance from the customer, in km. */
  km: number;
  note: string;
};

/** Six Bite & Bun kitchens spread across easy-to-reach districts of HCMC. */
export const BRANCHES: Branch[] = [
  { id: "br-q1", name: "Bite & Bun Bến Thành", district: "Quận 1", address: "24 Lê Lợi, P. Bến Nghé", hours: "08:00 – 23:00", km: 1.2, note: "Ngay chợ Bến Thành, có chỗ ngồi" },
  { id: "br-q3", name: "Bite & Bun Võ Văn Tần", district: "Quận 3", address: "168 Võ Văn Tần, P. Võ Thị Sáu", hours: "08:00 – 23:00", km: 2.4, note: "Gần hồ Con Rùa" },
  { id: "br-pn", name: "Bite & Bun Phan Xích Long", district: "Phú Nhuận", address: "98 Nguyễn Công Hoan, P. Cầu Kiệu", hours: "07:30 – 23:30", km: 0.6, note: "Bếp trung tâm, giao nhanh nhất" },
  { id: "br-bt", name: "Bite & Bun Điện Biên Phủ", district: "Bình Thạnh", address: "412 Điện Biên Phủ, P. 11", hours: "08:00 – 24:00", km: 3.1, note: "Mở tới nửa đêm" },
  { id: "br-q7", name: "Bite & Bun Phú Mỹ Hưng", district: "Quận 7", address: "36 Nguyễn Đức Cảnh, P. Tân Phong", hours: "09:00 – 23:00", km: 7.8, note: "Bãi xe rộng, có drive-thru" },
  { id: "br-td", name: "Bite & Bun Thảo Điền", district: "TP. Thủ Đức", address: "21 Xuân Thuỷ, P. Thảo Điền", hours: "08:00 – 23:00", km: 6.4, note: "Sát Metro Thảo Điền" },
];

let current = BRANCHES[2].id;
const listeners = new Set<() => void>();

export function setBranch(id: string) {
  current = id;
  listeners.forEach((listener) => listener());
}

/** Currently selected branch. Module-level so any section can read it. */
export function useBranch() {
  const id = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => current,
  );
  return BRANCHES.find((branch) => branch.id === id) ?? BRANCHES[0];
}
