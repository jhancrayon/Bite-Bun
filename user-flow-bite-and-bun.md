# 🔀 USER FLOW — BITE & BUN
### Sơ đồ luồng người dùng cho các chức năng chính (tài liệu đồ án)

> **Ký hiệu dùng chung khi vẽ (Figma / draw.io):**
> - `( )` **hình bầu dục** = Điểm bắt đầu / kết thúc (Start / End)
> - `[ ]` **hình chữ nhật** = Hành động / bước thao tác (Process)
> - `< >` **hình thoi** = Điểm quyết định (Decision — có/không)
> - `▷` = hướng đi tiếp theo
> - `⤷` = nhánh rẽ (khi quyết định)
>
> **Gợi ý màu:** Start/End đỏ mận `#7f292a` · Hành động cam `#fa6932` · Quyết định vàng `#f4de79` · Overlay/cửa sổ nền kem `#fdf6e6`.

---

## 🗺️ TỔNG QUAN CÁC LUỒNG CHÍNH
1. Đặt món & Thanh toán (luồng lõi)
2. Lọc danh mục & Duyệt thực đơn
3. Khuyến mãi Mua 1 Tặng 1
4. Đặt bàn (Reservation)
5. Đăng nhập / Đăng ký
6. Đổi điểm & Dùng voucher
7. Tìm kiếm món
8. Đặt lại đơn cũ (Re-order)

---

## 1️⃣ LUỒNG ĐẶT MÓN & THANH TOÁN (luồng lõi)

```
(Bắt đầu: Vào trang chủ)
      ▷ [Chọn hình thức ở thanh đặt món: Giao hàng / Tự đến lấy]
            → Lựa chọn này ĐỒNG BỘ toàn web (thanh nav + bước thanh toán)
      ▷ [Duyệt món: bán chạy / món mới / theo loại]
      ▷ [Bấm "Thêm vào giỏ" một món]
      ▷ <Muốn thêm món khác?>
            ⤷ Có  ▷ quay lại [Duyệt món]
            ⤷ Không ▷ tiếp
      ▷ [Mở giỏ hàng] ▷ [Kiểm tra món & số lượng]
      ▷ [Bấm "Thanh toán"]
      ▷ <Giao hàng hay Đến lấy?>
            ⤷ GIAO HÀNG ▷ [Dùng địa chỉ "Giao đến" lấy từ thanh nav
                            — sửa được, đồng bộ 2 chiều; tính phí ship theo đơn]
            ⤷ ĐẾN LẤY   ▷ [Chọn chi nhánh đến lấy
                            — MIỄN PHÍ giao + GIẢM 10% tự động]
      ▷ [Nhập tên & số điện thoại người nhận]
      ▷ [Chọn món thêm (tuỳ chọn)]
      ▷ [Chọn phương thức thanh toán]
      ▷ [Áp voucher/mã giảm giá (tuỳ chọn)]
      ▷ <Phương thức có cần xác thực OTP?>
            ⤷ Có  ▷ [Nhập mã OTP 6 số] ▷ <OTP đúng?>
                        ⤷ Sai ▷ quay lại [Nhập OTP]
                        ⤷ Đúng ▷ tiếp
            ⤷ Không (tiền mặt) ▷ tiếp
      ▷ [Hệ thống xử lý đơn]
      ▷ [Cộng điểm Bun + lưu đơn vào tài khoản + voucher tự xoá khỏi ví]
      ▷ <Màn thành công hiển thị theo chế độ>
            ⤷ GIAO HÀNG ▷ "Sẽ gọi số … trước khi giao tới <địa chỉ>"
            ⤷ ĐẾN LẤY   ▷ "Sẽ gọi số … báo đơn đã sẵn sàng
                            để bạn đến lấy tại <chi nhánh>"
(Kết thúc: Đặt hàng thành công 🎉)
```

> 🔗 **Liên kết Giao/Đến lấy:** chế độ và địa chỉ dùng chung 1 nguồn dữ liệu —
> chọn ở thanh đặt món → hiện ngay trên thanh nav → tự áp vào bước thanh toán
> (Đến lấy = miễn ship + giảm 10%, đổi chi nhánh; Giao hàng = địa chỉ từ nav).

---

## 2️⃣ LUỒNG LỌC DANH MỤC & DUYỆT THỰC ĐƠN

```
(Bắt đầu: Ở mục "Tìm theo loại")
      ▷ <Chọn cách xem?>
            ⤷ Chọn 1 nhóm (Burger/Gà/Mì Ý/Kem/Nước)
                  ▷ [Mở thực đơn đã lọc theo nhóm đó]
            ⤷ Bấm "Tất cả món"
                  ▷ [Mở thực đơn đầy đủ]
      ▷ [Xem danh sách món trong overlay]
      ▷ <Tìm thấy món ưng ý?>
            ⤷ Không ▷ [Đổi nhóm khác / cuộn tiếp]
            ⤷ Có ▷ [Thêm vào giỏ]
(Kết thúc: Món đã vào giỏ → quay về luồng Đặt món)
```

---

## 3️⃣ LUỒNG KHUYẾN MÃI MUA 1 TẶNG 1

```
(Bắt đầu: Thêm burger vào giỏ)
      ▷ <Số burger trong giỏ ≥ 2?>
            ⤷ Chưa (1 burger)
                  ▷ [Hiện gợi ý: "Thêm 1 burger nữa để được tặng 1 chiếc"]
                  ▷ quay lại (Bắt đầu)
            ⤷ Đủ (≥2 burger)
                  ▷ [Tự động tặng chiếc rẻ hơn — trừ tiền vào tổng]
                  ▷ [Hiện thông báo "Bạn được tặng N burger!"]
(Kết thúc: Ưu đãi áp dụng trong giỏ & thanh toán)
```

---

## 4️⃣ LUỒNG ĐẶT BÀN (RESERVATION)

```
(Bắt đầu: Vào mục "Đặt bàn")
      ▷ [Chọn chi nhánh]
      ▷ [Chọn ngày]
      ▷ [Chọn giờ]
      ▷ [Chọn số lượng khách]
      ▷ [Chọn dịp (sinh nhật, hẹn hò…) — tuỳ chọn]
      ▷ [Nhập tên & số điện thoại]
      ▷ [Bấm "Đặt bàn"]
      ▷ <Thông tin hợp lệ?>
            ⤷ Không ▷ [Báo lỗi ô còn thiếu] ▷ quay lại
            ⤷ Có ▷ [Tạo mã đặt bàn xác nhận]
      ▷ [Lưu lịch đặt bàn vào tài khoản]
(Kết thúc: Đặt bàn thành công — xem/huỷ được trong tài khoản)
```

---

## 5️⃣ LUỒNG ĐĂNG NHẬP / ĐĂNG KÝ

```
(Bắt đầu: Bấm biểu tượng Tài khoản)
      ▷ <Đã có tài khoản?>
            ⤷ Chưa (Đăng ký)
                  ▷ [Nhập tên, email, mật khẩu]
                  ▷ [Bấm "Đăng ký"]
                  ▷ [Nhận quà chào mừng]
            ⤷ Có (Đăng nhập)
                  ▷ [Nhập email & mật khẩu]
                  ▷ [Bấm "Đăng nhập"]
      ▷ <Thông tin hợp lệ?>
            ⤷ Không ▷ [Báo lỗi] ▷ quay lại
            ⤷ Có ▷ [Vào trạng thái đã đăng nhập]
(Kết thúc: Hiện tên + điểm Bun, mở khoá ưu đãi thành viên)
```

---

## 6️⃣ LUỒNG ĐỔI ĐIỂM & DÙNG VOUCHER

```
(Bắt đầu: Menu Tài khoản → "Điểm thưởng")
      ▷ [Xem số điểm Bun & kho voucher]
      ▷ [Chọn voucher muốn đổi]
      ▷ <Đủ điểm Bun?>
            ⤷ Không ▷ [Báo "Thiếu điểm"] ▷ quay lại
            ⤷ Có ▷ [Trừ điểm + thêm voucher vào ví]
      ▷ [Đặt món & vào Thanh toán]
      ▷ [Ở khối "Voucher của bạn" → bấm "Dùng"]
      ▷ <Đơn đủ điều kiện voucher?>
            ⤷ Không ▷ [Báo đơn tối thiểu] ▷ quay lại
            ⤷ Có ▷ [Trừ tiền vào tổng đơn]
      ▷ [Đặt đơn thành công → voucher tự xoá khỏi ví]
(Kết thúc: Voucher đã dùng, tổng tiền đã giảm)
```

---

## 7️⃣ LUỒNG TÌM KIẾM MÓN

```
(Bắt đầu: Bấm ô tìm kiếm ở đầu trang)
      ▷ [Nhập tên món / từ khoá]
      ▷ [Hệ thống lọc kết quả tức thời]
      ▷ <Có kết quả?>
            ⤷ Không ▷ [Hiện "Không tìm thấy" + gợi ý] ▷ quay lại
            ⤷ Có ▷ [Hiện danh sách món khớp]
      ▷ [Bấm chọn món] ▷ [Thêm vào giỏ]
(Kết thúc: Món vào giỏ → quay về luồng Đặt món)
```

---

## 8️⃣ LUỒNG ĐẶT LẠI ĐƠN CŨ (RE-ORDER)

```
(Bắt đầu: Menu Tài khoản → "Đơn hàng của tôi")
      ▷ [Xem lịch sử đơn đã đặt]
      ▷ [Chọn 1 đơn cũ] ▷ [Bấm "Đặt lại"]
      ▷ [Tự thêm toàn bộ món của đơn đó vào giỏ]
      ▷ [Mở giỏ hàng]
(Kết thúc: Sẵn sàng thanh toán lại → luồng Đặt món)
```

---

## 🧭 SƠ ĐỒ ĐIỀU HƯỚNG TỔNG (Navigation Flow)

```
                    ┌────────────── TRANG CHỦ ──────────────┐
                    │                                        │
   [Thanh nav dính] ▷ Trang chủ · Thực đơn · Đặt bàn · Blog · Tài khoản · Giỏ hàng
                    │
   Trang chủ gồm:  [Header đặt món] ▷ [Khuyến mãi] ▷ [Bán chạy] ▷ [Món mới]
                   ▷ [Tìm theo loại] ▷ [Tính năng] ▷ [Tải app] ▷ [Đặt bàn]
                   ▷ [Blog] ▷ [CTA + Footer]

   Overlay (mở đè lên trang):  Thực đơn · Giỏ hàng · Thanh toán · Tài khoản/Đăng nhập
```

---

## 📌 GHI CHÚ KHI VẼ RA SƠ ĐỒ ĐẸP
- Mỗi luồng vẽ **theo chiều dọc từ trên xuống**, mũi tên 1 chiều.
- **Điểm quyết định (hình thoi)** luôn có đúng 2 nhánh: Có / Không.
- Nhánh "Không / Sai" thường **quay ngược** về bước trước (vòng lặp sửa lỗi).
- Tô màu điểm Start/End khác màu các bước để hội đồng nhìn ra ngay đâu là đầu–cuối.
- Có thể gom Luồng 1 (Đặt món) làm **flow chính giữa slide**, các luồng còn lại là flow phụ xung quanh.
```
