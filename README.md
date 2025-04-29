# Quackzzle - Ứng dụng Trò chơi Câu đố Việt Nam

Quackzzle là một ứng dụng trò chơi câu đố trực tuyến đa người chơi, tập trung vào các chủ đề về Việt Nam. Người dùng có thể tạo phòng, mời bạn bè tham gia và cùng nhau trả lời các câu hỏi trong nhiều lĩnh vực khác nhau.

## Tính năng chính

- 🎮 Tạo phòng chơi và chia sẻ mã phòng với bạn bè
- 🧠 Nhiều bộ câu hỏi đa dạng:
  - Lịch sử Việt Nam (1945 - nay)
  - Địa lý
  - Văn hóa
  - Khoa học và Công nghệ
  - Nghệ thuật và Giải trí
  - Thể thao
  - Đời sống và Sức khỏe
  - Câu hỏi có video
- ⏱️ Tính điểm dựa trên thời gian trả lời
- 📊 Bảng xếp hạng thời gian thực
- 🏆 Hiển thị kết quả cuối cùng và người chiến thắng

## Công nghệ sử dụng

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB với Prisma ORM
- **Deployment**: Vercel

## Cài đặt và chạy

### Yêu cầu

- Node.js 16.x trở lên
- MongoDB (local hoặc Atlas)

### Cài đặt

1. Clone repository:
   ```bash
   git clone https://github.com/your-username/quackzzle.git
   cd quackzzle
   ```

2. Cài đặt dependencies:
   ```bash
   npm install
   ```

3. Tạo file `.env` với nội dung:
   ```
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/quackzzle?retryWrites=true&w=majority"
   ```

4. Khởi tạo database và sinh dữ liệu:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

### Chạy dự án

1. Chạy trong môi trường development:
   ```bash
   npm run dev
   ```

2. Build và chạy production:
   ```bash
   npm run build
   npm start
   ```

## Cách chơi

1. Người chơi đầu tiên (host) tạo phòng và nhận mã phòng
2. Host chia sẻ mã phòng cho những người chơi khác
3. Người chơi nhập mã phòng để tham gia
4. Khi tất cả người chơi đã tham gia, host bắt đầu trò chơi
5. Mỗi người chơi trả lời các câu hỏi dựa trên thời gian - càng nhanh càng được nhiều điểm
6. Kết quả được hiển thị sau khi tất cả người chơi hoàn thành

## Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp! Nếu bạn muốn đóng góp vào dự án:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## Giấy phép

Dự án này được phân phối dưới Giấy phép MIT. Xem thêm tại `LICENSE`.
