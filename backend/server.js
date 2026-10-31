const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const deviceRoutes = require('./routes/deviceRoutes');

const app = express();

// Middleware CORS hỗ trợ linh hoạt cả Localhost lẫn triển khai Render
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Endpoint kiểm tra sức khỏe hệ thống
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    service: 'classroom-device-management-backend',
    mssv: '235292',
    author: 'Đinh Văn Lắm'
  });
});

// Endpoint gốc
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Classroom Device Management API is running',
    version: '1.0.0',
    documentation: '/api/devices',
    healthCheck: '/health'
  });
});

// Gắn router quản lý thiết bị
app.use('/api/devices', deviceRoutes);

// Xử lý 404 cho các route không tồn tại
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Đường dẫn [${req.method}] ${req.originalUrl} không tồn tại trên hệ thống API.`
  });
});

// Xử lý lỗi tập trung (Centralized Error Handler)
app.use((err, req, res, next) => {
  console.error('🔥 [Lỗi Server]:', err.message);

  if (res.headersSent) {
    return next(err);
  }

  // Lỗi validation của Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Lỗi kiểm tra tính hợp lệ của dữ liệu',
      errors: messages
    });
  }

  // Lỗi CastError (ObjectId không đúng định dạng)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Định dạng tham số "${err.value}" không hợp lệ.`
    });
  }

  // Lỗi trùng lặp unique index
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu đã tồn tại trong cơ sở dữ liệu (trùng khóa duy nhất).'
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Đã xảy ra lỗi nội bộ trên máy chủ.'
  });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

async function startServer() {
  if (!MONGODB_URI) {
    console.error('❌ Lỗi: Chưa cung cấp MONGODB_URI trong file .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000
    });
    console.log(`✅ Kết nối thành công đến MongoDB Atlas (Database: ${mongoose.connection.name})`);

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend API đang lắng nghe trên cổng ${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
      console.log(`🔗 Devices API: http://localhost:${PORT}/api/devices`);
    });

    return server;
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB Atlas:', error.message);
    process.exit(1);
  }
}

// Khởi chạy server khi chạy trực tiếp
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
