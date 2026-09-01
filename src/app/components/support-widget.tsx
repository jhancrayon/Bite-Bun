import { useEffect, useRef, useState } from "react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

/* ------------------------------ social links ----------------------------- */

type Channel = {
  id: string;
  label: string;
  hint: string;
  href: string;
  bg: string;
  icon: React.ReactNode;
};

/* Replace the sample hrefs with Bite & Bun's real accounts / numbers. */
const CHANNELS: Channel[] = [
  {
    id: "zalo",
    label: "Zalo",
    hint: "Chat qua Zalo OA",
    href: "https://zalo.me/",
    bg: "#0068ff",
    icon: <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] leading-none">Zalo</span>,
  },
  {
    id: "messenger",
    label: "Messenger",
    hint: "Nhắn tin Facebook",
    href: "https://m.me/",
    bg: "linear-gradient(135deg, #00b2ff 0%, #006aff 40%, #a033ff 75%, #ff5280 100%)",
    icon: (
      <svg className="size-[24px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.3 2 2 6.2 2 11.7c0 2.9 1.2 5.4 3.1 7.1.2.1.3.4.3.6l.1 1.8c0 .6.6 1 1.1.7l2-.9c.2-.1.4-.1.6-.1 1 .3 2 .4 3 .4 5.7 0 10-4.2 10-9.7S17.7 2 12 2Zm6 7.5-2.9 4.6c-.5.7-1.5.9-2.2.4l-2.3-1.7c-.2-.2-.5-.2-.7 0l-3.1 2.4c-.4.3-1-.2-.7-.6l2.9-4.6c.5-.7 1.5-.9 2.2-.4l2.3 1.7c.2.2.5.2.7 0l3.1-2.4c.4-.3 1 .2.7.6Z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    hint: "DM trên Instagram",
    href: "https://instagram.com/",
    bg: "linear-gradient(135deg, #feda75 0%, #fa7e1e 30%, #d62976 60%, #962fbf 90%)",
    icon: (
      <svg className="size-[23px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect height="18" rx="5" width="18" x="3" y="3" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" fill="currentColor" r="1.2" stroke="none" />
      </svg>
    ),
  },
  {
    id: "wechat",
    label: "WeChat",
    hint: "Quét mã kết bạn",
    href: "https://www.wechat.com/",
    bg: "#07c160",
    icon: (
      <svg className="size-[24px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.7 3C4.6 3 1.3 5.8 1.3 9.3c0 2 1.1 3.7 2.8 4.9l-.7 2.1 2.4-1.2c.8.2 1.6.4 2.5.4h.5a5.3 5.3 0 0 1-.2-1.5c0-3.3 3.2-6 7-6h.4C15.6 4.7 12.5 3 8.7 3ZM6.2 8.1a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
        <path d="M22.7 14.5c0-2.9-2.8-5.2-6.2-5.2s-6.2 2.3-6.2 5.2 2.8 5.2 6.2 5.2c.7 0 1.4-.1 2.1-.3l2 1-.6-1.7c1.6-1 2.7-2.5 2.7-4.2Zm-8.2-.9a.9.9 0 1 1 0-1.7.9.9 0 0 1 0 1.7Zm4 0a.9.9 0 1 1 0-1.7.9.9 0 0 1 0 1.7Z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    hint: "Gọi & nhắn WhatsApp",
    href: "https://wa.me/",
    bg: "#25d366",
    icon: (
      <svg className="size-[24px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.8 14.1c-.2.7-1.4 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.6-.6-2.9-1.3-4.8-4.2-4.9-4.4-.1-.2-1.2-1.5-1.2-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.3 0 .5l-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.6-.8c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.1 1.2Z" />
      </svg>
    ),
  },
];

/* -------------------------------- AI chat --------------------------------- */

type Msg = { id: number; from: "bot" | "user"; text: string };

/** Câu hỏi gợi ý được nhóm theo chủ đề để khách bấm nhanh. */
const TOPICS: { id: string; emoji: string; label: string; questions: string[] }[] = [
  {
    id: "food",
    emoji: "🍔",
    label: "Món ăn",
    questions: [
      "Món nào bán chạy nhất?",
      "Gợi ý món cho người mới?",
      "Có món chay / healthy không?",
      "Gợi ý combo tiết kiệm?",
      "Bớt cay / không cay được không?",
      "Món này bao nhiêu calo?",
      "Nguyên liệu có tươi & rõ nguồn gốc không?",
      "Có suất cho trẻ em không?",
      "Tôi bị dị ứng, nên chọn món nào?",
    ],
  },
  {
    id: "delivery",
    emoji: "🛵",
    label: "Giao hàng",
    questions: [
      "Phí giao hàng bao nhiêu?",
      "Bao lâu thì đơn tới nơi?",
      "Có giao tới khu vực của tôi không?",
      "Có giao siêu tốc không?",
      "Theo dõi đơn hàng ở đâu?",
      "Đổi địa chỉ giao được không?",
      "Huỷ đơn thế nào?",
      "Đơn tối thiểu bao nhiêu?",
    ],
  },
  {
    id: "promo",
    emoji: "🎁",
    label: "Khuyến mãi",
    questions: [
      "Đang có khuyến mãi gì?",
      "Mua 1 Tặng 1 áp dụng thế nào?",
      "Áp dụng mã ưu đãi ở đâu?",
      "Có quà cho đơn lớn không?",
      "Ưu đãi cho thành viên mới?",
    ],
  },
  {
    id: "reservation",
    emoji: "📅",
    label: "Đặt bàn",
    questions: [
      "Đặt bàn như thế nào?",
      "Đặt bàn có mất phí không?",
      "Huỷ / đổi lịch đặt bàn được không?",
      "Đặt bàn cho nhóm đông / tiệc?",
      "Xem lại lịch đặt bàn ở đâu?",
    ],
  },
  {
    id: "account",
    emoji: "👤",
    label: "Tài khoản",
    questions: [
      "Đăng nhập bằng cách nào?",
      "Không nhận được mã OTP thì sao?",
      "Điểm Bun tích & dùng thế nào?",
      "Các hạng thành viên có gì?",
      "Đổi & dùng voucher ở đâu?",
      "Quên mật khẩu phải làm sao?",
      "Cập nhật số điện thoại / địa chỉ?",
    ],
  },
  {
    id: "policy",
    emoji: "📋",
    label: "Chính sách",
    questions: [
      "Có những cách thanh toán nào?",
      "Thanh toán có an toàn không?",
      "Chính sách hoàn tiền / đổi trả?",
      "Giao sai / thiếu món báo ai?",
      "Thông tin của tôi có được bảo mật?",
      "Xuất hoá đơn VAT được không?",
      "Quán mở cửa mấy giờ?",
      "Có hợp tác / nhượng quyền không?",
    ],
  },
];

/** Rule-based trả lời tức thì cho câu thường gặp. Trả về null nếu không khớp
 *  → khi đó widget sẽ hỏi Gemini (AI thật) để trả lời câu "lạ". */
function smartReply(input: string): string | null {
  const q = input.toLowerCase();

  /* ------------------------------------------------------------- Đặt bàn */
  if (/((huỷ|hủy|đổi).*(bàn|lịch)|đổi lịch|dời bàn)/.test(q))
    return "Bạn có thể huỷ hoặc đổi lịch đặt bàn trong Tài khoản → Lịch đặt bàn, miễn phí nếu báo trước giờ hẹn 🗓️ Sát giờ thì nhắn nhân viên qua hotline/Zalo giúp bạn nhé!";
  if (/(nhóm đông|đông người|bàn lớn|tiệc|liên hoan|đãi tiệc|sự kiện|nhiều khách)/.test(q))
    return "Nhóm đông hoặc đặt tiệc đều được nha! Khi đặt bàn bạn chọn số khách và dịp (sinh nhật, họp mặt…) 🎉 Nhóm trên 10 người nên nhắn trước qua hotline/Zalo để quán sắp bàn chu đáo.";
  if (/(xem.*(lịch|bàn)|lịch đặt bàn|bàn đã đặt|kiểm tra.*bàn)/.test(q))
    return "Bạn xem lại toàn bộ lịch đặt bàn (kèm mã xác nhận) trong Tài khoản → Lịch đặt bàn 📅 Ở đó cũng huỷ/đổi lịch được luôn.";
  if (/(đặt bàn|reservation|giữ bàn|đặt chỗ|book.*table|ăn tại (quán|chỗ))/.test(q))
    return "Đặt bàn siêu nhanh: mở mục 'Đặt bàn', chọn chi nhánh → ngày → giờ → số khách → dịp, rồi điền tên & SĐT là xong 🍽️ Bạn nhận ngay mã xác nhận và không mất phí đặt bàn nha!";

  /* -------------------------------------------------- Khuyến mãi chi tiết */
  if (/(mua 1 tặng 1|mua 1 tang 1|bogo|tặng 1 burger|tặng burger|mua.*tặng)/.test(q))
    return "Ưu đãi Mua 1 Tặng 1 burger 🍔 — cứ có 2 burger trong giỏ, chiếc rẻ hơn được tặng miễn phí, hệ thống tự trừ tiền ngay trong giỏ & thanh toán. Càng nhiều cặp càng được tặng nhiều!";
  if (/(áp.*mã|nhập mã|mã ưu đãi|dùng mã|ô mã|mã ở đâu)/.test(q))
    return "Ở bước Thanh toán, nhìn cột bên phải có ô 'Mã giảm giá' — nhập mã rồi bấm Áp dụng 🎟️ Voucher bạn đã đổi bằng điểm cũng hiện sẵn ở khối 'Voucher của bạn', bấm 'Dùng' là được.";
  if (/(quà.*(đơn|lớn)|túi tote|tote|đơn lớn.*(quà|tặng)|quà tặng)/.test(q))
    return "Có nha! Đơn từ 200.000đ được tặng túi tote canvas đại lễ 2/9 miễn phí 🎁 Thanh progress trong giỏ hàng cho biết bạn còn thiếu bao nhiêu để nhận quà.";
  if (/(thành viên mới|đơn đầu|mới đăng ký|newbie|khách mới|đăng ký.*ưu đãi)/.test(q))
    return "Chào mừng thành viên mới! Đăng ký là có ngay voucher giảm 50.000đ cho đơn đầu + freeship 🎉 Sau đó mỗi đơn còn tích điểm Bun đổi thêm quà nữa.";

  /* -------------------------------------------------------------- Món ăn */
  if (/(bán chạy|best.?seller|nổi tiếng|ngon nhất|món nào.*ngon|gợi ý|recommend|nên (ăn|gọi))/.test(q))
    return "Best-seller tuần này là Cheese Burger 🍔, Triplo Burger và Gà Rán Sốt Mật Ong 🍗 — được gọi nhiều nhất đó! Bạn mở mục Thực đơn để xem thêm nha.";
  if (/(chay|healthy|salad|ăn kiêng|eat clean|thuần chay|vegetarian|vegan)/.test(q))
    return "Có ngay! Thử Special Salad hoặc Salad Ức Gà Nướng — rau hữu cơ Đà Lạt, ít calo mà vẫn ngon 🥗 Bạn cũng có thể lọc nhóm món trong Thực đơn nhé.";
  if (/(cay|spicy|ớt|bớt cay|không cay)/.test(q))
    return "Các món cay đều có ký hiệu 🌶️ trong thực đơn. Bạn ghi chú 'ít cay' hoặc 'không cay' ở bước thanh toán, bếp sẽ điều chỉnh theo khẩu vị nha!";
  if (/(combo|tiết kiệm|\bset\b|phần ăn)/.test(q))
    return "Tụi mình có 5 combo nằm ở mục đầu tiên của Thực đơn 🍱 — ăn no đã đời mà rẻ hơn gọi lẻ. Ngoài ra khi chọn món Signature còn có gợi ý nâng cấp combo +29.000đ nữa!";
  if (/(nguyên liệu|tươi|nguồn gốc|xuất xứ|chất lượng|nhập khẩu)/.test(q))
    return "Bò 100% nhập khẩu, bánh mì nướng bơ tươi mỗi ngày, rau hữu cơ Đà Lạt và sốt thủ công độc quyền 🧑‍🍳 Các món Signature đều có huy hiệu bảo chứng nguyên liệu.";
  if (/(calo|calories|dinh dưỡng|bao nhiêu năng lượng)/.test(q))
    return "Thông tin calo & dinh dưỡng có trong phần 'Xem chi tiết' của từng món nha. Nếu cần bảng chi tiết hơn, nhân viên có thể gửi giúp bạn qua Zalo/Messenger 💬";
  if (/(trẻ em|em bé|kid|cho bé)/.test(q))
    return "Có phần cho bé với vị nhẹ, ít cay và khẩu phần nhỏ 🧒 Bạn thử combo gà rán + nước ngọt, hoặc nhắn mình để gợi ý thêm nhé!";
  if (/(dị ứng|allergy|gluten|đậu phộng|hải sản|thành phần)/.test(q))
    return "Một số món có chứa trứng, sữa, gluten hoặc hải sản 🦐 Bạn cho mình biết bị dị ứng với gì, mình sẽ gợi ý món phù hợp và ghi chú cho bếp nha.";
  if (/(halal|đạo hồi)/.test(q))
    return "Hiện tụi mình chưa có chứng nhận Halal. Bạn có thể nhắn nhân viên để được tư vấn các món phù hợp nhất nha 🙏";

  /* ------------------------------------------------------------ Giao hàng */
  if (/(phí (ship|giao)|ship bao nhiêu|phí vận chuyển|freeship|miễn phí giao)/.test(q))
    return "Phí giao tính theo khoảng cách, MIỄN PHÍ cho đơn từ 150.000đ 🛵 Thành viên hạng Bạc/Vàng còn được freeship thêm nữa đó!";
  if (/(bao lâu|mất bao lâu|thời gian giao|khi nào (tới|nhận)|giao nhanh)/.test(q))
    return "Trung bình 22 phút là tới nơi ⏱️ Nếu vội, bạn bật 'Giao siêu tốc' ở giỏ hàng để được ưu tiên bếp & shipper nhé!";
  if (/(khu vực|vùng giao|địa bàn|chỗ tôi|bán kính|có giao (tới|đến))/.test(q))
    return "Tụi mình giao trong nội thành TP.HCM và các quận lân cận 📍 Bạn nhập địa chỉ ở thanh 'Giao đến' để kiểm tra chính xác có phục vụ khu bạn không nha.";
  if (/(tối thiểu|đơn tối thiểu|đặt tối thiểu|min order)/.test(q))
    return "Không có mức tối thiểu bắt buộc nha! Nhưng đơn từ 150.000đ sẽ được miễn phí giao hàng 😉";
  if (/(theo dõi|tracking|đơn (của tôi|hàng).*(đâu|nào)|đến đâu|trạng thái đơn)/.test(q))
    return "Bạn vào Tài khoản → Đơn của tôi để xem bản đồ hành trình theo thời gian thực 🗺️ Cần mình kiểm tra giúp mã đơn nào không?";
  if (/(đổi địa chỉ|sai địa chỉ|thay địa chỉ giao)/.test(q))
    return "Nếu đơn chưa được bếp xác nhận, bạn có thể đổi địa chỉ ngay trong chi tiết đơn. Đơn đã đi giao thì nhắn nhân viên gấp qua hotline/Zalo để hỗ trợ nha 📍";
  if (/(huỷ|hủy|cancel).*(đơn|order)|huỷ đơn|hủy đơn/.test(q))
    return "Bạn có thể huỷ miễn phí khi đơn chưa được bếp xác nhận. Sau khi bếp bắt đầu nấu thì không huỷ được — cho mình xin mã đơn để hỗ trợ nhé 🙏";
  if (/(siêu tốc|hoả tốc|express|nhanh nhất)/.test(q))
    return "Có 'Giao siêu tốc' 🛵💨 — cộng thêm một khoản nhỏ để đơn của bạn được ưu tiên nấu & giao trước. Bật ngay trong giỏ hàng nha!";

  /* ------------------------------------------------------------ Tài khoản */
  if (/(đăng nhập|đăng ký|login|sign in|tạo tài khoản)/.test(q))
    return "Đăng nhập chỉ trong 5 giây! Bấm 'Đăng nhập' rồi chọn Google, Apple hoặc số điện thoại (nhận mã OTP) 📱 Không cần nhớ mật khẩu luôn.";
  if (/(otp|mã xác thực|không nhận.*mã|mã không tới)/.test(q))
    return "Nếu chưa nhận được OTP, bạn đợi hết đồng hồ đếm ngược rồi bấm 'Gửi lại mã', kiểm tra sóng/điện thoại đúng số chưa. Vẫn lỗi thì nhắn nhân viên hỗ trợ nha 💬";
  if (/(điểm|bun|tích điểm|point|loyalty)/.test(q))
    return "Cứ 1.000đ chi tiêu = 1 Bun 🥟 Điểm tự cộng sau mỗi đơn thành công, dùng để đổi voucher & quà trong mục Bite & Bun Rewards!";
  if (/(hạng|tier|thành viên|đồng|bạc|vàng|vip)/.test(q))
    return "Có 3 hạng: Đồng 🥉, Bạc 🥈 (từ 1.000 Bun), Vàng 🥇 (từ 2.500 Bun). Hạng cao hơn được nhân điểm, freeship và ưu tiên bếp. Xem thanh tiến trình trong mục Rewards nha!";
  if (/(voucher|đổi quà|mã giảm|kho voucher)/.test(q))
    return "Vào Tài khoản → Bite & Bun Rewards → Kho voucher để đổi bằng điểm Bun 🎟️ Voucher đã đổi sẽ tự áp dụng được ở bước thanh toán.";
  if (/(quên mật khẩu|reset|đặt lại mật khẩu)/.test(q))
    return "Bạn có thể đăng nhập nhanh bằng số điện thoại/OTP mà không cần mật khẩu 📱 Hoặc bấm 'Quên mật khẩu?' ở màn đăng nhập email để đặt lại nha.";
  if (/(cập nhật|thay đổi|đổi).*(số điện thoại|thông tin|hồ sơ|profile)/.test(q))
    return "Bạn vào Tài khoản để cập nhật tên, số điện thoại và địa chỉ giao hàng bất cứ lúc nào nha ✏️";

  /* ------------------------------------------------------------ Chính sách */
  if (/(thanh toán.*(cách|nào|gì)|phương thức thanh toán|trả tiền|payment)/.test(q))
    return "Bạn có thể trả tiền mặt khi nhận 💵, thẻ Visa/Mastercard 💳, ví MoMo 📱 hoặc chuyển khoản ngân hàng 🏦 — chọn ở bước thanh toán nha.";
  if (/(an toàn|bảo mật.*thanh toán|3d secure|mã hoá|lộ thẻ)/.test(q))
    return "Rất an toàn! Giao dịch được mã hoá SSL 256-bit và xác thực 3-D Secure bằng OTP 🔒 Bite & Bun không lưu số thẻ của bạn.";
  if (/(hoàn tiền|refund|đổi trả|trả hàng|hoàn lại)/.test(q))
    return "Nếu món có vấn đề về chất lượng, tụi mình hoàn tiền hoặc đổi món mới miễn phí 💯 Bạn báo trong vòng 2 giờ kèm hình ảnh qua hotline/Zalo để được xử lý nhanh nha.";
  if (/(sai|thiếu|nhầm|thiếu món|giao sai|sai món)/.test(q))
    return "Tụi mình xin lỗi vì sự bất tiện 🙏 Bạn chụp lại đơn và nhắn ngay qua Zalo/Messenger hoặc hotline, nhân viên sẽ bù món hoặc hoàn tiền phần thiếu liền.";
  if (/(bảo mật|thông tin cá nhân|dữ liệu|privacy|riêng tư)/.test(q))
    return "Thông tin của bạn được bảo mật tuyệt đối 🔐 Tụi mình chỉ dùng để xử lý đơn & chăm sóc khách, không chia sẻ cho bên thứ ba. Xem thêm ở Chính sách bảo mật nha.";
  if (/(hoá đơn|hóa đơn|vat|xuất hoá đơn|invoice)/.test(q))
    return "Có xuất hoá đơn VAT nha! Bạn ghi chú thông tin công ty (tên, MST) ở phần ghi chú đơn, hoặc nhắn nhân viên để được gửi hoá đơn điện tử 🧾";
  if (/(giờ|mở cửa|đóng cửa|mấy giờ|hoạt động)/.test(q))
    return "Bếp Bite & Bun mở cửa mỗi ngày từ 8:00 sáng đến 22:00 tối nha bạn! 🕗";
  if (/(nhượng quyền|hợp tác|franchise|đối tác|mở chi nhánh|tuyển)/.test(q))
    return "Tuyệt vời! Về hợp tác/nhượng quyền, bạn để lại thông tin qua Messenger hoặc hotline, bộ phận đối tác sẽ liên hệ lại với bạn sớm nha 🤝";
  if (/(khuyến mãi|giảm giá|deal|ưu đãi|sale)/.test(q))
    return "Đang có Flash Deal giảm tới 35% 🔥 Bạn kéo lên mục Khuyến mãi để chốt deal, và nhập mã voucher ở đó luôn nha!";

  /* ------------------------------------------------------------- Xã giao */
  // Chỉ nhận là lời chào / cảm ơn khi câu NGẮN (≤ 4 từ) để không nuốt mất câu hỏi thật.
  const wordCount = q.trim().split(/\s+/).length;
  if (wordCount <= 4) {
    if (/(cảm ơn|cám ơn|\bthanks?\b|\bthank you\b|\bok\b|\boke\b|\bokay\b)/.test(q))
      return "Dạ không có gì, chúc bạn ăn ngon miệng! 🥟";
    if (/(xin chào|\bchào\b|\bhello\b|\bhi\b|\bhey\b|\balo\b)/.test(q))
      return "Chào bạn! 👋 Mình có thể giúp gì về món ăn, giao hàng, tài khoản hay chính sách nè?";
  }

  return null; // không khớp câu mẫu → để Gemini trả lời
}

/* ------------------------------------------------------------ Gemini (AI) */

/**
 * 👉 DÁN API KEY GEMINI CỦA BẠN VÀO ĐÂY (free tại https://aistudio.google.com/app/apikey).
 * Để trống thì widget vẫn chạy bình thường với các câu trả lời sẵn có.
 * Lưu ý: key đặt ở trình duyệt sẽ lộ công khai — dùng cho demo đồ án là được,
 * bản chạy thật nên chuyển key sang máy chủ (backend) để giấu.
 */
/** Gọi trợ lý AI qua máy chủ Supabase (edge function) — key Gemini được giấu
 *  hoàn toàn ở phía máy chủ, web không bao giờ lộ key. Lỗi thì trả câu dự phòng. */
async function askGemini(question: string): Promise<string> {
  const FALLBACK =
    "Mình chưa chắc ý bạn lắm 😅 Bạn thử chọn một chủ đề gợi ý bên dưới, hoặc chat trực tiếp với nhân viên qua Zalo, Messenger, Instagram, WeChat, WhatsApp nha 💬";
  try {
    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-bfede902/ask-ai`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ question }),
      },
    );
    if (!res.ok) return FALLBACK;
    const data = await res.json();
    const text = data?.answer;
    return typeof text === "string" && text.trim() ? text.trim() : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

/** Floating customer-support widget: opens a panel with an AI assistant and
 *  quick-contact buttons for the messaging apps. */
export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 0, from: "bot", text: "Xin chào! Mình là trợ lý AI của Bite & Bun 🥟 Mình có thể giúp gì cho bạn hôm nay?" },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const [showFaq, setShowFaq] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  const reply = (text: string) => setMessages((prev) => [...prev, { id: Date.now() + Math.random(), from: "bot", text }]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    const userMsg: Msg = { id: Date.now(), from: "user", text: value };
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setShowFaq(false);
    setTyping(true);

    const canned = smartReply(value);
    if (canned) {
      // Câu thường gặp → trả lời tức thì, không cần gọi AI.
      window.setTimeout(() => {
        reply(canned);
        setTyping(false);
      }, 700);
    } else {
      // Câu lạ → hỏi Gemini (AI thật).
      askGemini(value).then((answer) => {
        reply(answer);
        setTyping(false);
      });
    }
  };

  const activeTopic = TOPICS.find((t) => t.id === topic);

  return (
    <div className="flex flex-col items-end gap-[16px]">
      {/* Support panel */}
      {open && (
        <div className="flex h-[70vh] max-h-[500px] w-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0px_30px_70px_rgba(33,33,33,0.28)] ring-1 ring-[#f0e8e2] [animation:dish-in_0.35s_cubic-bezier(0.16,1,0.3,1)_both] sm:h-[500px] sm:w-[340px]">
          {/* Header */}
          <div
            className="relative flex items-center gap-[10px] overflow-hidden px-[16px] py-[13px] text-white"
            style={{ backgroundImage: "linear-gradient(100deg, #7f292a 0%, #b31419 45%, #fa6932 100%)" }}
          >
            <div className="pointer-events-none absolute -right-[30px] top-[-50px] size-[150px] rounded-full bg-[#f4de79] opacity-25 blur-[50px]" />
            <span className="relative flex size-[40px] shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
              <svg className="size-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 3a7 7 0 0 0-7 7v3a3 3 0 0 0 3 3h1v-6H7v-0a5 5 0 0 1 10 0v0h-2v6h1a3 3 0 0 0 3-3v-3a7 7 0 0 0-7-7Z" />
              </svg>
            </span>
            <div className="relative flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate font-['Source_Sans_Pro:Bold',sans-serif] text-[17px]">Trợ lý AI · Bite & Bun</span>
              <span className="flex items-center gap-[6px] font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] text-[#f4de79]">
                <span className="size-[8px] rounded-full bg-[#4ade80] shadow-[0px_0px_6px_#4ade80]" />
                Trực tuyến · trả lời tức thì
              </span>
            </div>
            <button
              aria-label="Đóng"
              className="relative cursor-pointer rounded-full p-[6px] transition-colors hover:bg-white/20"
              onClick={() => setOpen(false)}
              type="button"
            >
              <svg className="size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-[9px] overflow-y-auto bg-[#faf6f3] px-[13px] py-[13px]" ref={scrollRef}>
            {messages.map((msg) => (
              <div className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`} key={msg.id}>
                <span
                  className={`max-w-[82%] rounded-[14px] px-[12px] py-[8px] font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] leading-[1.45] ${
                    msg.from === "user"
                      ? "rounded-br-[4px] bg-[#d9161c] text-white"
                      : "rounded-bl-[4px] bg-white text-[#212121] ring-1 ring-[#f0e8e2]"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <span className="flex items-center gap-[4px] rounded-[14px] rounded-bl-[4px] bg-white px-[13px] py-[10px] ring-1 ring-[#f0e8e2]">
                  {[0, 1, 2].map((i) => (
                    <span
                      className="size-[7px] rounded-full bg-[#c9c9c9]"
                      key={i}
                      style={{ animation: `badge-pop 0.9s ${i * 0.15}s ease-in-out infinite` }}
                    />
                  ))}
                </span>
              </div>
            )}

            {/* Câu hỏi gợi ý theo chủ đề */}
            {showFaq && !typing && (
              <div className="mt-[4px] flex flex-col gap-[8px] rounded-[16px] bg-white p-[11px] ring-1 ring-[#f0e8e2]">
                <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#9a9a9a]">
                  {activeTopic ? "Chọn câu hỏi:" : "Bạn muốn hỏi về điều gì?"}
                </p>

                {!activeTopic ? (
                  <div className="grid grid-cols-2 gap-[7px]">
                    {TOPICS.map((t) => (
                      <button
                        className="flex items-center gap-[7px] rounded-[12px] bg-[#faf6f3] px-[10px] py-[9px] text-left font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#4a3b33] ring-1 ring-[#f0e8e2] transition-colors hover:bg-[#fff1e8] hover:ring-[#f7c9a8]"
                        key={t.id}
                        onClick={() => setTopic(t.id)}
                        type="button"
                      >
                        <span className="text-[17px]">{t.emoji}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    <button
                      className="flex w-fit cursor-pointer items-center gap-[4px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#d9161c] hover:underline"
                      onClick={() => setTopic(null)}
                      type="button"
                    >
                      <svg className="size-[13px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
                        <path d="M15 6l-6 6 6 6" />
                      </svg>
                      {activeTopic.emoji} {activeTopic.label}
                    </button>
                    <div className="flex flex-col gap-[6px]">
                      {activeTopic.questions.map((q) => (
                        <button
                          className="cursor-pointer rounded-[11px] bg-[#faf6f3] px-[11px] py-[8px] text-left font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] leading-[1.35] text-[#4a3b33] ring-1 ring-[#f0e8e2] transition-colors hover:bg-[#fff1e8] hover:ring-[#f7c9a8]"
                          key={q}
                          onClick={() => send(q)}
                          type="button"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mở lại bộ câu hỏi gợi ý sau khi đã chat */}
            {!showFaq && !typing && (
              <button
                className="mt-[2px] flex w-fit cursor-pointer items-center gap-[6px] self-start rounded-full bg-white px-[12px] py-[6px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#d9161c] ring-1 ring-[#f7c9a8] transition-colors hover:bg-[#fff1e8]"
                onClick={() => {
                  setTopic(null);
                  setShowFaq(true);
                }}
                type="button"
              >
                💡 Câu hỏi thường gặp
              </button>
            )}
          </div>

          {/* Social channels */}
          <div className="border-t border-[#f0e8e2] px-[16px] py-[12px]">
            <p className="mb-[9px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] uppercase tracking-[1px] text-[#9a9a9a]">
              Chat trực tiếp qua
            </p>
            <div className="flex items-center gap-[10px]">
              {CHANNELS.map((c) => (
                <a
                  aria-label={c.label}
                  className="group relative flex size-[42px] shrink-0 items-center justify-center rounded-full text-white shadow-[0px_6px_14px_rgba(33,33,33,0.18)] transition-transform duration-300 hover:-translate-y-[3px] hover:scale-110"
                  href={c.href}
                  key={c.id}
                  rel="noopener noreferrer"
                  style={{ background: c.bg }}
                  target="_blank"
                >
                  {c.icon}
                  <span className="pointer-events-none absolute bottom-[52px] whitespace-nowrap rounded-[8px] bg-[#212121] px-[10px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {c.hint}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Composer */}
          <form
            className="flex items-center gap-[10px] border-t border-[#f0e8e2] px-[16px] py-[12px]"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <input
              className="flex-1 rounded-full bg-[#f6ece9] px-[16px] py-[11px] font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#212121] outline-none placeholder:text-[#a8927f] focus:ring-2 focus:ring-[#fa6932]"
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Nhập câu hỏi của bạn…"
              value={draft}
            />
            <button
              aria-label="Gửi"
              className="flex size-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-transform duration-300 hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!draft.trim()}
              style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
              type="submit"
            >
              <svg className="size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Support button */}
      <button
        className="group relative flex size-[62px] cursor-pointer items-center justify-center rounded-full bg-white text-[#d9161c] shadow-[0px_12px_28px_rgba(33,33,33,0.18)] ring-1 ring-[#f0e8e2] transition-transform duration-300 hover:-translate-y-[3px] hover:scale-105"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {open ? (
          <svg className="size-[26px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg className="size-[28px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
            <path d="M4 14a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2ZM20 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2Z" />
            <path d="M20 18v1a3 3 0 0 1-3 3h-3" />
          </svg>
        )}
        {!open && (
          <>
            <span className="pointer-events-none absolute right-[74px] whitespace-nowrap rounded-[10px] bg-[#212121] px-[12px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Hỗ trợ khách hàng
            </span>
            <span className="absolute -right-[1px] -top-[1px] size-[14px] rounded-full bg-[#4ade80] ring-2 ring-white" />
          </>
        )}
      </button>
    </div>
  );
}
