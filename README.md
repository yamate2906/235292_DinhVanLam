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
- **Frontend**: React, Vite, Fetch API, Lucide React / Modern CSS (Responsive, Glassmorphism, Clean UI)
- **Backend**: Node.js, Express.js, Mongoose, Dotenv, Cors
- **Database**: MongoDB Atlas (Cloud Database)
- **Version Control**: Git & GitHub
- **Containerization**: Docker & Docker Compose, Nginx (Alpine) làm reverse proxy cho frontend
- **Container Registry**: Docker Hub (`admin2906` / `DinhVanLam`)
- **Cloud Platform**: Render

---

## III. Quy ước đặt tên tài nguyên
| Tài nguyên | Quy ước theo đề (`235292` - `Đinh Văn Lắm`) | Tên triển khai thực tế |
|---|---|---|
| **GitHub Repository** | `235292_DinhVanLam` | `235292_DinhVanLam` |
| **MongoDB Database** | `235292_DinhVanLam` | `235292_DinhVanLam` |
| **MongoDB Collection** | `devices` | `devices` |
| **Docker Hub Backend Image** | `<DinhVanLam>/backend` | `admin2906/backend` |
| **Docker Hub Frontend Image** | `<DinhVanLam>/frontend` | `admin2906/frontend` |
| **Render Backend API Service** | `api-235292` | `api-235292` |
| **Render Frontend Web Service** | `web-235292` | `web-235292` |

---

## IV. Cấu trúc thư mục dự án
```text
235292_DinhVanLam/
├── backend/
│   ├── models/
│   │   └── Device.js                 # Schema & Model Mongoose cho thiết bị (collection: devices)
│   ├── routes/
│   │   └── deviceRoutes.js           # Định tuyến RESTful API quản lý thiết bị
│   ├── scripts/
│   │   └── seed.js                   # Khởi tạo dữ liệu thiết bị mẫu vào MongoDB Atlas
│   ├── tests/
│   │   └── test_api.js               # Kịch bản kiểm thử tự động các endpoint API
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile                    # Đóng gói Docker image cho Backend
│   ├── package.json
│   └── server.js                     # Điểm khởi chạy Backend Express & endpoint /health
├── frontend/
│   ├── nginx/
│   │   └── default.conf.template     # Cấu hình Nginx reverse proxy khi chạy Docker
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx      # Hộp thoại xác nhận xóa thiết bị
│   │   │   ├── DeviceDetailModal.jsx # Hộp thoại xem chi tiết thông tin thiết bị
│   │   │   ├── DeviceModal.jsx       # Biểu mẫu thêm mới và cập nhật thiết bị
│   │   │   ├── Navbar.jsx            # Thanh điều hướng và hiển thị trạng thái kết nối API
│   │   │   ├── StatsCards.jsx        # Thẻ thống kê số lượng thiết bị theo tình trạng
│   │   │   └── Toast.jsx             # Thông báo kết quả thao tác
│   │   ├── services/
│   │   │   └── api.js                # Xử lý kết nối và gọi RESTful API tới Backend
│   │   ├── App.jsx                   # Màn hình chính: danh sách, tìm kiếm, lọc thiết bị
│   │   ├── index.css                 # Thiết kế giao diện hiện đại, responsive
│   │   └── main.jsx                  # Entry point ứng dụng React
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile                    # Đóng gói Multi-stage Docker image cho Frontend
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore                        # Loại trừ node_modules, .env, dist và tài liệu tạm
├── docker-compose.yml                # Khởi chạy đồng thời Backend & Frontend bằng Docker
├── render.yaml                       # Cấu hình Infrastructure as Code triển khai trên Render
└── README.md                         # Tài liệu hướng dẫn, mô tả dự án và thông tin nộp bài
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
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/235292_DinhVanLam?retryWrites=true&w=majority`
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
| **Link_Data_MongoDB** | [https://cloud.mongodb.com](https://cloud.mongodb.com) — Database: `235292_DinhVanLam`, Collection: `devices` (Xem dữ liệu trực tiếp qua API: [https://api-235292.onrender.com/api/devices](https://api-235292.onrender.com/api/devices)) |

- **Link biểu mẫu nộp bài Google Forms**: [https://docs.google.com/forms/d/e/1FAIpQLSf8zdFoKafJBrx4aL6GRq5gVN_-VBjay4NhxTU0SJPAJZm1hg/viewform?usp=header](https://docs.google.com/forms/d/e/1FAIpQLSf8zdFoKafJBrx4aL6GRq5gVN_-VBjay4NhxTU0SJPAJZm1hg/viewform?usp=header)

---

## VII. Kiểm tra tổng thể và Hoàn thiện bài nộp (Câu 9)

### 1. Bảng kiểm tra các chức năng hệ thống
| STT | Chức năng kiểm tra | Kết quả kiểm tra | Trạng thái |
|:---:|---|---|:---:|
| 1 | Endpoint kiểm tra sức khỏe `GET /health` | Trả về `{ status: 'UP', database: 'CONNECTED' }` | ✅ Đạt |
| 2 | Lấy danh sách thiết bị `GET /api/devices` | Hiển thị 5 thiết bị mẫu từ MongoDB Atlas | ✅ Đạt |
| 3 | Tìm kiếm thiết bị `GET /api/devices?search=...` | Tìm kiếm chính xác theo mã, tên, loại, phòng | ✅ Đạt |
| 4 | Xem chi tiết thiết bị `GET /api/devices/:id` | Hiển thị đầy đủ thông số kỹ thuật và tình trạng | ✅ Đạt |
| 5 | Thêm thiết bị mới `POST /api/devices` | Validate trường bắt buộc, lưu thành công | ✅ Đạt |
| 6 | Kiểm tra trùng mã `deviceId` | Báo lỗi 400 và thông báo không cho phép trùng | ✅ Đạt |
| 7 | Cập nhật thiết bị `PUT /api/devices/:id` | Cập nhật tình trạng thiết bị và lưu tức thì | ✅ Đạt |
| 8 | Xóa thiết bị `DELETE /api/devices/:id` | Xóa thành công và phản hồi 404 sau khi xóa | ✅ Đạt |
| 9 | Giao diện React hiển thị và tương tác | UI đẹp mắt, responsive, badge trực quan | ✅ Đạt |
| 10 | Đóng gói Docker Backend & Frontend | Đóng gói thành công và đẩy lên Docker Hub | ✅ Đạt |
| 11 | Triển khai đám mây Render | Có cấu hình `render.yaml` và hướng dẫn chi tiết | ✅ Đạt |

### 2. Danh sách Commit theo quy định đề thi
1. `Câu 1. Tạo repository và quản lý mã nguồn bằng GitHub`
2. `Câu 2. Tạo cơ sở dữ liệu MongoDB Atlas`
3. `Câu 3. Xây dựng backend API`
4. `Câu 4. Xây dựng frontend bằng React`
5. `Câu 5. Đóng gói backend bằng Docker và đẩy lên Docker Hub`
6. `Câu 6. Đóng gói frontend bằng Docker và đẩy lên Docker Hub`
7. `Câu 7. Triển khai frontend trên Render`
8. `Câu 8. Triển khai backend API trên Render`
9. `Câu 9. Kiểm tra tổng thể và hoàn thiện bài nộp`

