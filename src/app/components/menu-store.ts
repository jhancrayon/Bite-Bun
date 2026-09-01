import { useEffect, useSyncExternalStore } from "react";
import { apiGetMenu, apiSeedMenu } from "./backend";
import { MENU, type MenuItem } from "./menu-data";

/**
 * Thực đơn phục vụ từ Supabase. Lần đầu chạy: nếu DB trống thì tự nạp
 * (seed) từ danh sách gốc. Luôn có fallback về MENU cục bộ nếu offline.
 */
let live: MenuItem[] | null = null;
let started = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function bootstrap() {
  if (started) return;
  started = true;
  const remote = await apiGetMenu();
  if (remote.length > 0) {
    live = remote;
  } else {
    // DB trống → nạp thực đơn gốc lên Supabase một lần.
    await apiSeedMenu(MENU);
    live = MENU;
  }
  emit();
}

/** Danh sách món hiện dùng: ưu tiên bản trên DB, chưa tải xong thì dùng bản gốc. */
export function useMenu(): MenuItem[] {
  useEffect(() => {
    void bootstrap();
  }, []);
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => live ?? MENU,
    () => MENU,
  );
}
