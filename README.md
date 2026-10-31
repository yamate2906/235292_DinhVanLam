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

### 4. Đóng gói và chạy Backend bằng Docker (Docker Hub)
Docker image backend đã được đẩy lên Docker Hub tại: [admin2906/backend](https://hub.docker.com/r/admin2906/backend)

#### Cách 1: Kéo image từ Docker Hub và chạy container
```bash
docker pull admin2906/backend:latest

docker run -d \
  --name classroom-backend \
  -p 5000:5000 \
  -e PORT=5000 \
  -e MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/235292_DinhVanLam?retryWrites=true&w=majority" \
  admin2906/backend:latest
```

#### Cách 2: Tự đóng gói (Build) từ mã nguồn backend
```bash
docker build -t admin2906/backend:latest ./backend
```
Kiểm tra API:
- `http://localhost:5000/health`
- `http://localhost:5000/api/devices`

### 5. Đóng gói và chạy Frontend bằng Docker (Docker Hub)
Docker image frontend đã được đẩy lên Docker Hub tại: [admin2906/frontend](https://hub.docker.com/r/admin2906/frontend)

#### Cách 1: Kéo image từ Docker Hub và chạy container
```bash
docker pull admin2906/frontend:latest

docker run -d \
  --name classroom-frontend \
  -p 4173:80 \
  -e PORT=80 \
  -e BACKEND_URL=http://<IP_hoặc_domain_backend>:5000 \
  admin2906/frontend:latest
```
Truy cập giao diện: `http://localhost:4173`

#### Cách 2: Tự đóng gói (Build) từ mã nguồn frontend
```bash
docker build -t admin2906/frontend:latest ./frontend
```

### 6. Khởi chạy đồng thời cả Frontend và Backend bằng Docker Compose
Để khởi động toàn bộ hệ thống gồm Frontend, Backend và kết nối MongoDB Atlas chỉ với một lệnh:
```bash
# Khởi chạy toàn bộ hệ thống ở chế độ nền
docker compose up -d --build

# Xem log các dịch vụ
docker compose logs -f

# Dừng hệ thống
docker compose down
```
- Frontend: `http://localhost:4173`
- Backend API: `http://localhost:5000`
- Health check: `http://localhost:5000/health`

### 7. Hướng dẫn Triển khai Frontend trên Render (Câu 7)
- **Tên dịch vụ**: `web-235292`
- **Loại dịch vụ**: Static Site (hoặc Web Service từ Docker image `admin2906/frontend:latest`)
- **URL công khai**: [https://web-235292.onrender.com](https://web-235292.onrender.com)

#### Các bước triển khai trên Render Dashboard:
1. Đăng nhập [Render Dashboard](https://dashboard.render.com).
2. Chọn **New +** -> **Static Site** (hoặc **Web Service** nếu dùng Docker).
3. Kết nối với GitHub repository: `yamate2906/235292_DinhVanLam`.
4. Điền các thông số:
   - **Name**: `web-235292`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Cấu hình biến môi trường (**Environment Variables**):
   - `VITE_API_URL`: `https://api-235292.onrender.com`
6. Trong mục **Redirects/Rewrites**:
   - Thêm quy tắc: Source: `/*` -> Destination: `/index.html` (Action: `Rewrite`) để hỗ trợ Single Page Application.
7. Nhấn **Create Static Site**.

### 8. Hướng dẫn Triển khai Backend API trên Render (Câu 8)
- **Tên dịch vụ**: `api-235292`
- **Loại dịch vụ**: Web Service (Node.js runtime hoặc Docker image `admin2906/backend:latest`)
- **URL Backend API công khai**: [https://api-235292.onrender.com](https://api-235292.onrender.com)
- **Health check URL**: [https://api-235292.onrender.com/health](https://api-235292.onrender.com/health)
- **Devices API URL**: [https://api-235292.onrender.com/api/devices](https://api-235292.onrender.com/api/devices)

#### Các bước triển khai trên Render Dashboard:
1. Đăng nhập [Render Dashboard](https://dashboard.render.com).
2. Chọn **New +** -> **Web Service**.
3. Phương án A - Từ GitHub Repository:
   - Chọn repo: `yamate2906/235292_DinhVanLam`.
   - **Name**: `api-235292`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Phương án B - Từ Docker Hub Image:
   - Chọn **Deploy an existing image from a registry**.
   - Image URL: `docker.io/admin2906/backend:latest`.
5. Cấu hình biến môi trường (**Environment Variables**):
   - `PORT`: `5000`
   - `MONGODB_URI`: `mongodb://dinhlamtq2000_db_user:1234567890@ac-4ilbgqg-shard-00-00.2cwmdx9.mongodb.net:27017,ac-4ilbgqg-shard-00-01.2cwmdx9.mongodb.net:27017,ac-4ilbgqg-shard-00-02.2cwmdx9.mongodb.net:27017/235292_DinhVanLam?tls=true&authSource=admin&replicaSet=atlas-akc5fc-shard-0&retryWrites=true&w=majority`
   - `CLIENT_URL`: `https://web-235292.onrender.com`
6. Cấu hình **Health Check Path**: `/health`.
7. Nhấn **Create Web Service**.

---

## VI. Thông tin nộp bài
| Trường thông tin | Nội dung cung cấp |
|---|---|
| **Link_GitHub** | [https://github.com/yamate2906/235292_DinhVanLam](https://github.com/yamate2906/235292_DinhVanLam) |
| **Link_Docker_Backend** | [https://hub.docker.com/r/admin2906/backend](https://hub.docker.com/r/admin2906/backend) |
| **Link_Docker_Frontend** | [https://hub.docker.com/r/admin2906/frontend](https://hub.docker.com/r/admin2906/frontend) |
| **Link_Render_App** | [https://web-235292.onrender.com](https://web-235292.onrender.com) |
| **Link_Render_API** | [https://api-235292.onrender.com](https://api-235292.onrender.com) |
| **Link_Data_MongoDB** | Database `235292_DinhVanLam`, Collection `devices` trên MongoDB Atlas |
