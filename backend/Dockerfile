# Sử dụng Node.js 20 Alpine làm Base Image nhẹ và bảo mật
FROM node:20-alpine

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies cho production
RUN npm ci --only=production

# Sao chép toàn bộ mã nguồn backend vào container
COPY . .

# Khai báo port backend sử dụng
EXPOSE 5000

# Lệnh khởi chạy server
CMD ["node", "server.js"]
