# 🗺️ SITE MAP — BITE & BUN
### Sơ đồ cấu trúc website (tài liệu đồ án)

> **Ký hiệu:**
> - `▸` khu vực / section trên trang
> - `⤷` phần tử con / thành phần bên trong
> - `⧉` overlay (cửa sổ mở đè lên trang, không rời trang)
> - `🔗` liên kết dữ liệu dùng chung
>
> Website là **một trang (single-page)** cuộn dọc, các chức năng phụ mở dưới dạng **overlay**.

---

## 1. THANH ĐIỀU HƯỚNG (Nav — cố định trên cùng)
```
▸ Nav dính (sticky)
   ⤷ Logo Bite & Bun (về đầu trang)
   ⤷ Liên kết: Trang chủ · Thực đơn · Đặt bàn · Khuyến mãi · Về chúng tôi
   ⤷ Ô "Giao đến / Đến lấy tại"  🔗 (đồng bộ với thanh đặt món & thanh toán)
         · Giao hàng → hiện & sửa địa chỉ giao
         · Đến lấy   → hiện chi nhánh đến lấy
   ⤷ Tìm kiếm món
   ⤷ Giỏ hàng (số lượng)  → ⧉ Giỏ hàng
   ⤷ Tài khoản / Đăng nhập → ⧉ Tài khoản
```

---

## 2. TRANG CHỦ (cuộn dọc theo thứ tự)
```
▸ Header đặt món (Hero)
   ⤷ Thanh đặt món: [Giao hàng | Đến lấy]  🔗
         · Giao hàng → ô địa chỉ (đồng bộ nav) + thời gian giao
         · Đến lấy   → SĐT + người lấy + chi nhánh + giờ lấy (-10%)
   ⤷ Nút "Đặt món" → ⧉ Thực đơn

▸ Khuyến mãi (Flash Deals)
   ⤷ Banner ưu đãi, Mua 1 Tặng 1, mã giảm giá

▸ Món bán chạy (Best-sellers)  → Thêm vào giỏ
▸ Món mới (New)                → Thêm vào giỏ
▸ Tìm theo loại (Features/danh mục: Burger · Gà · Mì Ý · Kem · Nước)
   ⤷ Chọn nhóm → ⧉ Thực đơn (đã lọc)
▸ Tải app
▸ Đặt bàn (Reservation)        → chọn chi nhánh/ngày/giờ/khách/dịp
▸ Blog / Câu chuyện thương hiệu
▸ CTA cuối trang + Footer
```

---

## 3. OVERLAY (mở đè, không rời trang)
```
⧉ Thực đơn
   ⤷ Lọc theo nhóm · tìm kiếm · thêm vào giỏ

⧉ Giỏ hàng
   ⤷ Sửa số lượng · Mua 1 Tặng 1 · Giao siêu tốc · quà đơn lớn
   ⤷ Nút "Thanh toán" → ⧉ Thanh toán

⧉ Thanh toán  🔗 (theo chế độ Giao / Đến lấy)
   ⤷ B1: Địa chỉ giao (từ nav)  ／  Chi nhánh đến lấy (-10%, miễn ship)
   ⤷ B2: Người nhận (tên & SĐT)
   ⤷ B3: Món ăn + món thêm
   ⤷ B4: Phương thức thanh toán (tiền mặt/thẻ/MoMo/chuyển khoản)
   ⤷ B5: Voucher — mã giảm giá + "Voucher của bạn" (đổi bằng điểm)
   ⤷ Tổng tiền (ship, giảm giá, giảm 10% đến lấy…)
   ⤷ Xác thực OTP (nếu thẻ/ví) → Đặt hàng thành công
         · Giao hàng: "gọi số … trước khi giao tới địa chỉ"
         · Đến lấy:   "gọi số … báo đơn sẵn sàng để đến lấy tại chi nhánh"

⧉ Tài khoản / Đăng nhập
   ⤷ Đăng nhập / Đăng ký (Google · Apple · SĐT-OTP · email)
   ⤷ Hồ sơ: tên, SĐT, địa chỉ
   ⤷ Bite & Bun Rewards: điểm Bun · hạng thành viên · Kho voucher (đổi điểm)
   ⤷ Đơn của tôi: đơn đang giao (theo dõi) · lịch sử · đặt lại
   ⤷ Lịch đặt bàn: xem · huỷ · đổi lịch

⧉ Trợ lý hỗ trợ (Support widget — nút nổi góc màn hình)
   ⤷ Chat AI (câu thường gặp trả lời sẵn + Gemini cho câu lạ)
   ⤷ Liên hệ nhanh: Zalo · Messenger · Instagram · WeChat · WhatsApp
```

---

## 4. SƠ ĐỒ PHÂN CẤP TỔNG
```
BITE & BUN (single-page)
├── Nav (Giao đến/Đến lấy 🔗 · Tìm kiếm · Giỏ · Tài khoản)
├── Trang chủ
│    ├── Header đặt món (Giao/Đến lấy 🔗)
│    ├── Khuyến mãi · Bán chạy · Món mới
│    ├── Tìm theo loại · Tải app · Đặt bàn · Blog
│    └── CTA + Footer
└── Overlay
     ├── Thực đơn
     ├── Giỏ hàng → Thanh toán (🔗 Giao/Đến lấy) → Đặt hàng thành công
     ├── Tài khoản (Rewards · Đơn của tôi · Lịch đặt bàn)
     └── Trợ lý hỗ trợ (AI + liên hệ)
```

> 🔗 **Ba điểm dùng chung dữ liệu Giao/Đến lấy:** Thanh đặt món (trang chủ) ·
> Ô địa chỉ trên Nav · Bước Thanh toán — chọn ở đâu cũng đồng bộ khắp nơi.
