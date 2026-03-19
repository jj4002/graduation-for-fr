# 🎓 Graduation Website — Hướng Dẫn Sử Dụng & Deploy

## 📁 Cấu Trúc File

```
graduation/
├── index.html        ← Trang chính
├── style.css         ← Toàn bộ CSS (theme, animation)
├── script.js         ← Logic JS + CONFIG cá nhân hóa
├── music.mp3         ← (Tùy chọn) Nhạc nền — tự thêm vào
├── README.md         ← Tài liệu này
└── photos/
    ├── photo1.jpg    ← Ảnh kỷ niệm 1
    ├── photo2.jpg    ← Ảnh kỷ niệm 2
    └── photo3.jpg    ← Ảnh kỷ niệm 3
```

---

## ✏️ Tùy Chỉnh Nội Dung

Mở file `script.js` và chỉnh phần **CONFIG** ở đầu file:

```javascript
const CONFIG = {
  recipientName:   "Nguyễn Văn A",        // 👤 Tên người nhận
  senderName:      "Người thân của bạn",   // ✍️ Tên người gửi
  typingMessage:   "...",                   // 💬 Lời chúc typing (Section 1)
  personalMessage: "...",                   // 💌 Lời nhắn cá nhân (Section 3)
  surpriseMessage: "...",                   // 🔒 Lời nhắn bí mật (Section 4)
  lockClicks:      7,                       // 🔢 Số lần bấm để mở bí mật
  giftClicks:      5,                       // 🎁 Số lần bấm hộp quà ở đầu
  autoPlayMusic:   false,                   // 🎵 Tự phát nhạc khi vào trang
};
```

### Đổi Màu Theme

Mở `style.css`, phần `:root` đầu file:

```css
:root {
  --clr-primary:   #a78bfa;   /* tím pastel */
  --clr-secondary: #f9a8d4;   /* hồng pastel */
  --clr-accent:    #fcd34d;   /* vàng nhạt */
  --gradient-bg: linear-gradient(135deg, #1e1b4b, #312e81, ...);
}
```

### Thêm Ảnh Kỷ Niệm

Đặt ảnh vào thư mục `photos/` với tên:
- `photo1.jpg` → Ảnh 1
- `photo2.jpg` → Ảnh 2
- `photo3.jpg` → Ảnh 3

> ⚠️ Nếu không có ảnh thật, website tự dùng fallback card đẹp.

### Thêm Nhạc Nền

1. Đặt file nhạc vào cùng thư mục, đặt tên `music.mp3`
2. Trong `script.js`, đổi `autoPlayMusic: true` nếu muốn tự phát
3. Người dùng có thể bật/tắt bằng nút 🎵 góc trên phải

---

## 🚀 Deploy lên GitHub Pages (Miễn phí)

### Bước 1: Tạo repo GitHub
1. Vào [github.com](https://github.com) → **New repository**
2. Đặt tên: `graduation-website`
3. Chọn **Public** → **Create repository**

### Bước 2: Push code lên
```bash
cd graduation
git init
git add .
git commit -m "🎓 Add graduation website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/graduation-website.git
git push -u origin main
```

### Bước 3: Bật GitHub Pages
1. Vào repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)`
4. Nhấn **Save**
5. Chờ ~1 phút → URL sẽ là:
   ```
   https://YOUR_USERNAME.github.io/graduation-website/
   ```

---

## 🌐 Deploy lên Netlify (Siêu đơn giản)

1. Vào [app.netlify.com](https://app.netlify.com)
2. Kéo & thả **toàn bộ thư mục `graduation/`** vào trang Netlify
3. Xong! Nhận link ngay kiểu:
   ```
   https://abc123.netlify.app
   ```

---

## 📱 Tạo QR Code (Miễn phí)

Sau khi có link deploy, tạo QR code bằng:

| Tool | Link | Ghi chú |
|------|------|---------|
| **QR Code Generator** | [qr-code-generator.com](https://www.qr-code-generator.com) | Tùy chỉnh màu, logo |
| **QRCode Monkey** | [qrcode-monkey.com](https://www.qrcode-monkey.com) | Thiết kế đẹp, miễn phí |
| **Google Charts API** | `https://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=YOUR_URL` | Nhanh, không cần đăng ký |

### Ví dụ tạo QR bằng URL trực tiếp:
```
https://chart.apis.google.com/chart?chs=400x400&cht=qr&chl=https://your-site.netlify.app
```
Dán link trên vào trình duyệt → chuột phải → lưu ảnh QR!

---

## ✨ Các Tính Năng Đặc Biệt

| Tính năng | Mô tả |
|-----------|-------|
| 🔄 Fake Loading Screen | Tạo sự hồi hộp trước khi vào trang |
| 🎁 Mini Game | Bấm hộp quà đủ số lần mới mở được |
| ⌨️ Typing Effect | Lời chúc hiện từng chữ như đang gõ |
| 📸 Slideshow | Xem ảnh kỷ niệm với hiệu ứng trượt |
| 🔒 Hidden Message | Bấm 7 lần mới mở được lời nhắn bí mật |
| 🎊 Confetti | Pháo bông nổ khi mở quà & ăn mừng |
| 🌸 Hoa rơi | Cánh hoa bay nhẹ trong suốt website |
| 🎵 Nhạc nền | Nút bật/tắt nhạc góc trên phải |
| 📱 Responsive | Đẹp trên cả mobile & desktop |

---

## 🧪 Chạy Thử Local

Không cần server — chỉ mở `index.html` bằng trình duyệt:
```bash
# Hoặc dùng VS Code Live Server extension
# Hoặc dùng Python:
python -m http.server 8080
# Sau đó mở: http://localhost:8080
```

> ⚠️ **Lưu ý**: Nhạc nền có thể không phát được khi mở file trực tiếp (file://) do chính sách trình duyệt. Hãy dùng Live Server hoặc deploy để test nhạc.
