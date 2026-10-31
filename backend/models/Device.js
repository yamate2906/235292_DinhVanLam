const mongoose = require('mongoose');

const VALID_STATUSES = [
  'Đang sử dụng',
  'Hư hỏng',
  'Đang sửa chữa',
  'Ngừng sử dụng'
];

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Mã thiết bị (deviceId) là bắt buộc'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Tên thiết bị (name) là bắt buộc'],
      trim: true
    },
    deviceType: {
      type: String,
      required: [true, 'Loại thiết bị (deviceType) là bắt buộc'],
      trim: true
    },
    room: {
      type: String,
      required: [true, 'Phòng học sử dụng (room) là bắt buộc'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Hãng sản xuất (brand) là bắt buộc'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Model thiết bị (model) là bắt buộc'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Số lượng (quantity) là bắt buộc'],
      min: [1, 'Số lượng tối thiểu là 1'],
      default: 1
    },
    status: {
      type: String,
      required: [true, 'Tình trạng thiết bị (status) là bắt buộc'],
      enum: {
        values: VALID_STATUSES,
        message: 'Tình trạng không hợp lệ. Phải là một trong: {VALUES}'
      },
      default: 'Đang sử dụng'
    },
    purchaseDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    description: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    collection: 'devices',
    timestamps: true
  }
);

// Tự động tạo text index phục vụ tìm kiếm nhanh nếu cần
deviceSchema.index({
  deviceId: 'text',
  name: 'text',
  deviceType: 'text',
  room: 'text',
  brand: 'text',
  model: 'text'
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = {
  Device,
  VALID_STATUSES
};
