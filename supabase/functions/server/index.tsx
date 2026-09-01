import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-bfede902/health", (c) => {
  return c.json({ status: "ok" });
});

// AI chat proxy — giữ key Gemini ở phía máy chủ, web không thấy key
const SYSTEM_PROMPT =
  "Bạn là trợ lý AI thân thiện của Bite & Bun — thương hiệu đồ ăn nhanh (burger, gà rán, mì Ý, kem, nước) tại TP.HCM. " +
  "QUAN TRỌNG: LUÔN LUÔN trả lời 100% bằng TIẾNG VIỆT, tuyệt đối không dùng tiếng Anh (trừ tên món). " +
  "Trả lời NGẮN GỌN, giọng gần gũi, có thể dùng emoji. " +
  "Thông tin quán: giao hàng nội thành TP.HCM, trung bình 22 phút, miễn phí giao cho đơn từ 150.000đ; " +
  "có giao siêu tốc; thanh toán tiền mặt/thẻ/MoMo/chuyển khoản; tích 1 Bun cho mỗi 1.000đ; " +
  "3 hạng thành viên Đồng/Bạc/Vàng; có đặt bàn theo chi nhánh; mở cửa 8:00–22:00. " +
  "Nếu câu hỏi ngoài phạm vi nhà hàng, trả lời lịch sự và hướng khách về hỗ trợ qua Zalo/Messenger.";

// Thử lần lượt các model để chắc chắn có cái key dùng được.
const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-2.5-flash",
  "gemini-flash-latest",
];

async function callGemini(apiKey: string, question: string) {
  let lastErr = "";
  for (const model of GEMINI_MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [{ text: `(Hãy trả lời bằng tiếng Việt) ${question}` }],
            },
          ],
          generationConfig: { temperature: 0.6, maxOutputTokens: 300 },
        }),
      },
    );
    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof text === "string" && text.trim()) return { text: text.trim(), model };
      lastErr = `${model}: rỗng`;
      continue;
    }
    lastErr = `${model}: ${res.status} ${await res.text()}`;
    console.log("ask-ai: model lỗi", lastErr);
  }
  return { text: "", error: lastErr };
}

app.post("/make-server-bfede902/ask-ai", async (c) => {
  const FALLBACK =
    "Mình chưa chắc ý bạn lắm 😅 Bạn thử hỏi lại rõ hơn, hoặc nhắn nhân viên qua Zalo/Messenger giúp mình nha!";
  try {
    const body = await c.req.json().catch(() => ({}));
    const question = typeof body?.question === "string" ? body.question.trim() : "";
    if (!question) return c.json({ answer: FALLBACK });

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      console.log("ask-ai: thiếu GEMINI_API_KEY");
      return c.json({ answer: FALLBACK });
    }

    const result = await callGemini(apiKey, question);
    return c.json({ answer: result.text || FALLBACK });
  } catch (err) {
    console.log("ask-ai: exception", String(err));
    return c.json({ answer: FALLBACK });
  }
});

// ───────────────────────── ĐƠN HÀNG (Orders) ─────────────────────────
// Lưu đơn thật lên Supabase qua KV store. Khoá: order:<id>. Index theo
// khách hàng (điện thoại) để tra cứu lịch sử: order-index:<phone> = [id,...].

const ORDER_PREFIX = "order:";
const ORDER_INDEX_PREFIX = "order-index:";

/** Chuẩn hoá số điện thoại làm khoá index (chỉ giữ chữ số). */
function phoneKey(phone: unknown): string {
  return typeof phone === "string" ? phone.replace(/\D/g, "") : "";
}

// Tạo đơn mới.
app.post("/make-server-bfede902/orders", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const items = Array.isArray(body?.items) ? body.items : [];
    if (items.length === 0) return c.json({ error: "Giỏ hàng trống." }, 400);

    const id =
      typeof body?.id === "string" && body.id.trim()
        ? body.id.trim()
        : `BB-${Math.floor(10000 + Math.random() * 89999)}`;

    const order = {
      id,
      items,
      goods: Number(body?.goods) || 0,
      discount: Number(body?.discount) || 0,
      shipping: Number(body?.shipping) || 0,
      total: Number(body?.total) || 0,
      address: typeof body?.address === "string" ? body.address : "",
      name: typeof body?.name === "string" ? body.name : "",
      phone: typeof body?.phone === "string" ? body.phone : "",
      placedAt: Number(body?.placedAt) || Date.now(),
      etaMinutes: Number(body?.etaMinutes) || 22,
      status: "active" as const,
    };

    await kv.set(`${ORDER_PREFIX}${id}`, order);

    // Cập nhật index theo số điện thoại (đơn mới nhất lên đầu, giữ tối đa 30).
    const pk = phoneKey(order.phone);
    if (pk) {
      const idxKey = `${ORDER_INDEX_PREFIX}${pk}`;
      const existing = (await kv.get(idxKey)) as string[] | undefined;
      const ids = [id, ...(Array.isArray(existing) ? existing.filter((x) => x !== id) : [])].slice(0, 30);
      await kv.set(idxKey, ids);
    }

    return c.json({ order });
  } catch (err) {
    console.log("orders POST: exception", String(err));
    return c.json({ error: "Không tạo được đơn hàng." }, 500);
  }
});

// Lấy 1 đơn theo id (dùng để theo dõi đơn).
app.get("/make-server-bfede902/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const order = await kv.get(`${ORDER_PREFIX}${id}`);
    if (!order) return c.json({ error: "Không tìm thấy đơn." }, 404);
    return c.json({ order });
  } catch (err) {
    console.log("orders GET id: exception", String(err));
    return c.json({ error: "Lỗi tra cứu đơn." }, 500);
  }
});

// Cập nhật trạng thái đơn (done | cancelled | active).
app.patch("/make-server-bfede902/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const status = body?.status;
    if (!["active", "done", "cancelled"].includes(status))
      return c.json({ error: "Trạng thái không hợp lệ." }, 400);

    const key = `${ORDER_PREFIX}${id}`;
    const order = (await kv.get(key)) as Record<string, unknown> | undefined;
    if (!order) return c.json({ error: "Không tìm thấy đơn." }, 404);

    const updated = { ...order, status };
    await kv.set(key, updated);
    return c.json({ order: updated });
  } catch (err) {
    console.log("orders PATCH: exception", String(err));
    return c.json({ error: "Không cập nhật được đơn." }, 500);
  }
});

// Lịch sử đơn theo số điện thoại: /orders?phone=0901234567
app.get("/make-server-bfede902/orders", async (c) => {
  try {
    const pk = phoneKey(c.req.query("phone"));
    if (!pk) return c.json({ orders: [] });
    const ids = ((await kv.get(`${ORDER_INDEX_PREFIX}${pk}`)) as string[] | undefined) ?? [];
    if (ids.length === 0) return c.json({ orders: [] });
    const keys = ids.map((id) => `${ORDER_PREFIX}${id}`);
    const orders = (await kv.mget(keys)).filter(Boolean);
    return c.json({ orders });
  } catch (err) {
    console.log("orders GET list: exception", String(err));
    return c.json({ error: "Lỗi tải lịch sử đơn." }, 500);
  }
});

// Chẩn đoán (GET): xem key gọi được model nào & lỗi thật. Xoá sau khi fix xong.
app.get("/make-server-bfede902/ai-debug", async (c) => {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return c.json({ hasKey: false });
  try {
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=100`,
    );
    const listBody = await listRes.json().catch(() => ({}));
    const models = Array.isArray(listBody?.models)
      ? listBody.models.map((m: { name?: string }) => m?.name).filter(Boolean)
      : [];
    const probe = await callGemini(apiKey, "Xin chào");
    return c.json({
      hasKey: true,
      keyPrefix: apiKey.slice(0, 6),
      listStatus: listRes.status,
      availableModels: models,
      probeText: probe.text,
      probeModel: probe.model ?? null,
      probeError: probe.error ?? null,
    });
  } catch (err) {
    return c.json({ hasKey: true, exception: String(err) });
  }
});

Deno.serve(app.fetch);