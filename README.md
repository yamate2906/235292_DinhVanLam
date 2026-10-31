# HỆ THỐNG QUẢN LÝ THIẾT BỊ PHÒNG HỌC TRÊN NỀN TẢNG ĐÁM MÂY

- **Học phần**: Điện toán đám mây
- **Sinh viên thực hiện**: Đinh Văn Lắm
- **Mã số sinh viên (MSSV)**: 235292
- **GitHub Repository**: [235292_DinhVanLam](https://github.com/yamate2906/235292_DinhVanLam)

---

## I. Giới thiệu đề tài
Hệ thống quản lý thiết bị phòng học là ứng dụng web toàn diện gồm:
- **Frontend**: Xây dựng bằng React (Vite), giao diện người dùng hiện đại, trực quan, hỗ trợ xem danh sách, tìm kiếm, lọc trạng thái, thêm, sửa, xóa và xem chi tiết thiết bị.
- **Backend API**: Xây dựng bằng Node.js và Express, cung cấp RESTful API đầy đủ, kiểm tra tính hợp lệ dữ liệu, kết nối cơ sở dữ liệu đám mây MongoDB Atlas.
- **Cơ sở dữ liệu**: MongoDB Atlas lưu trữ danh sách thiết bị phòng học trong collection `devices`.
- **Đóng gói & Triển khai**: Đóng gói container hóa bằng Docker, lưu trữ trên Docker Hub và triển khai đám mây trên nền tảng Render.

---

## II. Công nghệ sử dụng
- **Frontend**: React, Vite, Axios, Lucide React / Modern CSS (Responsive, Glassmorphism, Clean UI)
- **Backend**: Node.js, Express.js, Mongoose, Dotenv, Cors
- **Database**: MongoDB Atlas (Cloud Database)
- **Version Control**: Git & GitHub
- **Containerization**: Docker & Docker Compose, Nginx (Alpine) làm reverse proxy cho frontend
- **Container Registry**: Docker Hub (`admin2906`)
- **Cloud Platform**: Render

---

## III. Quy ước đặt tên tài nguyên
| Tài nguyên | Tên quy ước |
|---|---|
| **GitHub Repository** | `235292_DinhVanLam` |
| **MongoDB Database** | `235292_DinhVanLam` |
| **MongoDB Collection** | `devices` |
| **Docker Hub Backend Image** | `admin2906/backend` |
| **Docker Hub Frontend Image** | `admin2906/frontend` |
| **Render Backend API Service** | `api-235292` (hoặc `mern-backend-235292`) |
| **Render Frontend Web Service** | `web-235292` (hoặc `mern-frontend-235292`) |

---

## IV. Cấu trúc thư mục dự án
```text
235292_DinhVanLam/
├── backend/
│   ├── models/
│   │   └── Device.js           # Schema & Model Mongoose cho thiết bị
│   ├── routes/
│   │   └── deviceRoutes.js     # Định tuyến API quản lý thiết bị
│   ├── scripts/
│   │   └── seed.js             # Dữ liệu mẫu khởi tạo vào MongoDB Atlas
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js               # Điểm khởi chạy backend Express
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         # Các thành phần giao diện (DeviceList, DeviceModal, ...)
│   │   ├── services/           # Xử lý gọi API backend (api.js)
│   │   ├── App.jsx             # Thành phần chính
│   │   ├── main.jsx            # Entry point React
│   │   └── index.css           # Thiết kế giao diện hiện đại, responsive
│   ├── nginx/
│   │   └── default.conf.template # Cấu hình Nginx reverse proxy khi chạy Docker
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml          # Chạy toàn bộ hệ thống cục bộ bằng Docker
├── .gitignore
└── README.md                   # Tài liệu hướng dẫn và báo cáo đề tài
```

---

## V. Hướng dẫn cài đặt và chạy chương trình cục bộ

### 1. Yêu cầu hệ thống
- Node.js >= 18.x
- npm >= 9.x
- Docker & Docker Compose (tùy chọn nếu chạy bằng container)

### 2. Cài đặt và chạy Backend
```bash
cd backend
npm install
cp .env.example .env
# Chỉnh sửa chuỗi kết nối MONGODB_URI trong .env
npm run dev
# Hoặc npm start
```
Backend sẽ khởi chạy tại: `http://localhost:5000`
Kiểm tra sức khỏe hệ thống: `http://localhost:5000/health`

### 3. Cài đặt và chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend sẽ khởi chạy tại: `http://localhost:5173`

---

## VI. Thông tin nộp bài
| Trường thông tin | Nội dung cung cấp |
|---|---|
| **Link_GitHub** | [https://github.com/yamate2906/235292_DinhVanLam](https://github.com/yamate2906/235292_DinhVanLam) |
| **Link_Docker_Backend** | [https://hub.docker.com/r/admin2906/backend](https://hub.docker.com/r/admin2906/backend) |
| **Link_Docker_Frontend** | [https://hub.docker.com/r/admin2906/frontend](https://hub.docker.com/r/admin2906/frontend) |
| **Link_Render_App** | Sẽ cập nhật sau khi hoàn thành triển khai |
| **Link_Render_API** | Sẽ cập nhật sau khi hoàn thành triển khai |
| **Link_Data_MongoDB** | Database `235292_DinhVanLam`, Collection `devices` trên MongoDB Atlas |
