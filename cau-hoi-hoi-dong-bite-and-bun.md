# 📚 BỘ CÂU HỎI HỘI ĐỒNG — BITE & BUN
### Tài liệu dắt túi bảo vệ đồ án tốt nghiệp (UI/UX Design)

> **Mẹo dùng:** Đọc lướt phần A + phần cứu nguy trước khi vào phòng. Phần B tra theo chức năng khi bị hỏi sâu.
> **3 từ khóa phải nhớ:** User-Centered Design · Design System · High-fidelity Prototype.

---

## 🅰️ NHÓM CHUNG (mở đầu / phương pháp)

**Q1. Đề tài của em giải quyết vấn đề gì?**
> Em xây dựng website đặt đồ ăn nhanh giúp người dùng đặt món, đặt bàn và theo dõi đơn thuận tiện trên một giao diện thống nhất, tối ưu trải nghiệm ngành F&B.

**Q2. Em dùng phương pháp thiết kế nào?**
> Em theo **Thiết kế lấy người dùng làm trung tâm (User-Centered Design)** kết hợp **thiết kế theo hệ thống thành phần (Design System)**: nghiên cứu → dựng hệ thống màu/chữ/component → thiết kế màn hình theo user flow → hiện thực hóa thành bản chạy thật để test.

**Q3. Đối tượng người dùng mục tiêu?**
> Người trẻ 18–35 tuổi, quen đặt đồ ăn online, ưu tiên tốc độ và giao diện trực quan.

**Q4. Điểm khác biệt so với các web F&B khác?**
> Ngoài đặt món, em bổ sung **đặt bàn + quản lý lịch đặt bàn**, hoàn thiện hành trình khách hàng từ ăn tại chỗ tới mang về.

---

## 🅱️ THEO TỪNG CHỨC NĂNG

### 1. Thanh điều hướng (Navigation)
**Q. Vì sao chọn thanh nav dính (sticky) khi cuộn?**
> Vì web theo mô hình một trang cuộn, thanh dính giúp người dùng luôn truy cập nhanh menu, giỏ hàng, đăng nhập mà không phải cuộn ngược lên.

**Q. Bố cục thanh nav dựa trên nguyên tắc nào?**
> Em chia 3 vùng cân đối: thương hiệu bên trái, menu ở giữa, công cụ (địa chỉ, tìm kiếm, giỏ, tài khoản) bên phải — theo thói quen đọc từ trái sang phải.

### 2. Khu đặt món (Giao hàng / Tự đến lấy)
**Q. Vì sao đặt lựa chọn này ngay đầu trang?**
> Đây là quyết định đầu tiên ảnh hưởng tới toàn bộ luồng đặt, nên em đưa lên đầu để người dùng chọn ngay, giảm bước thao tác về sau.

### 3. Tìm theo loại (Lọc danh mục)
**Q. Bộ lọc giúp gì cho trải nghiệm?**
> Giảm tải nhận thức — người dùng không phải cuộn cả thực đơn dài, chỉ lọc đúng nhóm món mình cần.

### 4. Thực đơn & Chi tiết món
**Q. Vì sao thực đơn hiển thị dạng cửa sổ bật lên (overlay)?**
> Để người dùng xem menu mà không rời khỏi ngữ cảnh trang chủ, giữ mạch duyệt liền lạc.

### 5. Giỏ hàng
**Q. Giỏ hàng cập nhật thế nào?**
> Cập nhật tức thời: thêm/bớt món là số lượng và tổng tiền đổi ngay, cho người dùng phản hồi trực quan.

**Q. Vì sao giỏ hàng dạng overlay bên cạnh?**
> Để người dùng vừa xem giỏ vừa tiếp tục chọn món, không bị chuyển trang qua lại.

### 6. Khuyến mãi & Mua 1 Tặng 1
**Q. Chương trình Mua 1 Tặng 1 hoạt động ra sao?**
> Khi mua từ 2 burger trở lên, hệ thống tự tặng 1 chiếc (chiếc rẻ hơn) cho chiếc đầu tiên — người dùng thấy ưu đãi áp dụng ngay trong giỏ.

**Q. Vì sao dùng Flash sale?**
> Tạo cảm giác khẩn cấp (urgency) thúc đẩy quyết định mua nhanh — một nguyên tắc tâm lý phổ biến trong thương mại điện tử.

### 7. Món bán chạy & Món mới
**Q. Vì sao tách riêng 2 mục này?**
> Món bán chạy tạo niềm tin xã hội (nhiều người chọn), món mới kích thích tò mò — hai động lực mua khác nhau nên em trình bày riêng.

### 8. Đặt bàn (Reservation)
**Q. Luồng đặt bàn gồm những bước nào?**
> Người dùng chọn chi nhánh, ngày, giờ, số khách, dịp → điền tên/số điện thoại → gửi → nhận mã đặt bàn xác nhận.

**Q. Em xử lý trạng thái sau khi đặt thế nào?**
> Lịch đặt bàn được lưu vào tài khoản, người dùng xem lại và huỷ được — em xử lý cả vòng đời sau đặt, không chỉ dừng ở lúc đặt.

### 9. Tài khoản (Đăng nhập / Quản lý)
**Q. Tài khoản có những gì?**
> Đơn hàng của tôi, lịch đặt bàn, điểm thưởng, món yêu thích, địa chỉ giao hàng — gom mọi thông tin cá nhân vào một nơi.

**Q. Vì sao cần đăng nhập?**
> Để lưu lịch sử đơn, lịch đặt bàn và ưu đãi cá nhân hóa cho từng người dùng.

### 10. Blog / Cẩm nang
**Q. Blog phục vụ mục đích gì?**
> Tăng gắn kết thương hiệu và giá trị nội dung — chia sẻ công thức, câu chuyện bếp, đồng thời hỗ trợ SEO thu hút khách.

### 11. Chân trang (Footer)
**Q. Footer chứa gì và vì sao?**
> Thông tin liên hệ, chi nhánh, liên kết nhanh và đăng ký nhận tin — đáp ứng người dùng cuộn tới cuối trang tìm thông tin.

---

## 🅲️ NHÓM THIẾT KẾ & KỸ THUẬT

### Màu sắc & Typography
**Q. Vì sao chọn tông đỏ – cam – vàng?**
> Nhóm màu nóng kích thích vị giác, thường thấy trong ngành ẩm thực, tạo cảm giác ngon và năng động.

**Q. Vì sao phối 2 font?**
> Font có chân cho tiêu đề tạo sự chỉn chu, font không chân cho nội dung để dễ đọc trên màn hình — nguyên tắc tương phản trong typography.

### Hệ thống thành phần (Design System)
**Q. Design System giúp gì?**
> Đảm bảo nhất quán toàn bộ giao diện và tái sử dụng nhanh — nút, thẻ món, màu, khoảng cách đều theo một chuẩn.

### Responsive
**Q. Web có chạy được trên điện thoại không?**
> Có, giao diện co giãn theo màn hình để hiển thị phù hợp trên cả máy tính và điện thoại.

### Prototype
**Q. Prototype tương tác cao em làm bằng cách nào?**
> Em hiện thực hóa thiết kế Figma thành bản chạy thật — người dùng bấm được và nhận phản hồi thật, đây là mức prototype trung thực cao nhất.

---

## 🅳️ NHÓM CÂU HỎI KHÓ / PHẢN BIỆN

**Q. Nếu người dùng bỏ giỏ hàng giữa chừng thì sao?**
> Giỏ hàng được giữ lại, người dùng quay lại vẫn còn món đã chọn — giảm tỷ lệ bỏ đơn.

**Q. Hạn chế của đề tài?**
> Hiện em tập trung phần trải nghiệm giao diện; phần cổng thanh toán thật và cơ sở dữ liệu quy mô lớn là hướng phát triển tiếp theo.

**Q. Hướng phát triển tương lai?**
> Tích hợp thanh toán online, theo dõi tài xế thời gian thực, và cá nhân hóa gợi ý món theo lịch sử đặt.

**Q. Vì sao chọn single-page thay vì nhiều trang?**
> Phù hợp hành vi đặt đồ ăn nhanh — ít chuyển trang, thao tác liền mạch, tốc độ cao.

---

## 🎤 CÂU CỨU NGUY (khi bí / quên)

> "Dạ đây là một góc nhìn hay, em xin trình bày theo hướng em đã thực hiện trong dự án ạ." *(rồi kéo về phần mình nắm chắc)*

- **Máy/web lỗi khi demo:** "Dạ để em mở bản dự phòng ạ." *(mở video đã quay sẵn)*
- **Bị chê thiếu tính năng:** "Dạ đúng ạ, đây là hướng em dự kiến phát triển tiếp trong giai đoạn sau."

---

## ✅ CHECKLIST TRƯỚC NGÀY BẢO VỆ

- [ ] Chạy thử demo theo kịch bản 2–3 lần cho mượt tay
- [ ] Quay 1 video dự phòng toàn bộ luồng
- [ ] Thuộc 3 từ khóa: User-Centered Design · Design System · High-fidelity Prototype
- [ ] Chuẩn bị site map (sơ đồ trang) để trình chiếu
- [ ] Mở sẵn file dự án + link demo trước khi vào phòng
