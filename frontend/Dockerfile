# Stage 1: Build ứng dụng React với Node.js
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Phục vụ ứng dụng thông qua Nginx Alpine nhẹ và bảo mật
FROM nginx:alpine

# Sao chép bản build React vào thư mục tĩnh của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Sao chép file cấu hình Nginx mẫu hỗ trợ biến môi trường
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Biến môi trường mặc định (có thể ghi đè khi chạy container hoặc Render)
ENV PORT=80 BACKEND_URL=http://backend:5000
ENV NGINX_ENVSUBST_FILTER=^(PORT|BACKEND_URL)$

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
