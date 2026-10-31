require('dotenv').config();
const mongoose = require('mongoose');
const { Device } = require('../models/Device');

const sampleDevices = [
  {
    deviceId: 'TB-MC-001',
    name: 'Máy chiếu Sony VPL-EX435',
    deviceType: 'Máy chiếu',
    room: 'Phòng A101',
    brand: 'Sony',
    model: 'VPL-EX435',
    quantity: 1,
    status: 'Đang sử dụng',
    purchaseDate: '2024-02-15',
    description: 'Máy chiếu độ sáng cao 3200 lumens trang bị cho phòng học lý thuyết'
  },
  {
    deviceId: 'TB-MT-002',
    name: 'Máy tính để bàn Dell OptiPlex 7090',
    deviceType: 'Máy tính',
    room: 'Phòng Lab 01',
    brand: 'Dell',
    model: 'OptiPlex 7090',
    quantity: 30,
    status: 'Đang sử dụng',
    purchaseDate: '2023-10-20',
    description: 'Bộ máy tính cấu hình Core i7, 16GB RAM phục vụ thực hành phần mềm'
  },
  {
    deviceId: 'TB-AT-003',
    name: 'Hệ thống âm thanh trợ giảng JBL & Micro Shure',
    deviceType: 'Thiết bị âm thanh',
    room: 'Phòng B204',
    brand: 'JBL / Shure',
    model: 'EON ONE / SVX288',
    quantity: 2,
    status: 'Đang sửa chữa',
    purchaseDate: '2024-01-10',
    description: 'Loa trợ giảng và micro không dây cho giảng đường lớn, đang bảo hành mic'
  },
  {
    deviceId: 'TB-DH-004',
    name: 'Điều hòa không khí Inverter Panasonic 2HP',
    deviceType: 'Điều hòa',
    room: 'Phòng A101',
    brand: 'Panasonic',
    model: 'CU/CS-XPU18XKH-8',
    quantity: 2,
    status: 'Hư hỏng',
    purchaseDate: '2022-08-05',
    description: 'Máy báo lỗi quạt dàn lạnh, chờ đội bảo trì thay linh kiện'
  },
  {
    deviceId: 'TB-TC-005',
    name: 'Bảng tương tác thông minh ViewSonic 65 inch',
    deviceType: 'Thiết bị trình chiếu',
    room: 'Phòng C302',
    brand: 'ViewSonic',
    model: 'IFP6550',
    quantity: 1,
    status: 'Ngừng sử dụng',
    purchaseDate: '2021-03-12',
    description: 'Bảng tương tác thế hệ cũ bị hỏng màn cảm ứng, chờ làm thủ tục thanh lý'
  }
];

async function seedData() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Lỗi: Chưa cấu hình MONGODB_URI trong .env');
    process.exit(1);
  }

  try {
    console.log('Đang kết nối MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log(`Kết nối thành công đến database: ${mongoose.connection.name}`);

    // Xóa dữ liệu cũ nếu có và nạp dữ liệu mới
    await Device.deleteMany({});
    console.log('Đã làm sạch collection "devices".');

    const inserted = await Device.insertMany(sampleDevices);
    console.log(`Đã nạp thành công ${inserted.length} thiết bị mẫu vào collection "devices":`);
    inserted.forEach(d => {
      console.log(` - [${d.deviceId}] ${d.name} (${d.deviceType}) - ${d.status}`);
    });

    console.log('\nSeed dữ liệu hoàn tất!');
  } catch (error) {
    console.error('Lỗi khi nạp dữ liệu vào MongoDB Atlas:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Đã đóng kết nối MongoDB.');
  }
}

seedData();
