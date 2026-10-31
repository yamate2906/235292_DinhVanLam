const express = require('express');
const mongoose = require('mongoose');
const { Device, VALID_STATUSES } = require('../models/Device');

const router = express.Router();

// Helper kiểm tra ObjectId hợp lệ
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/devices - Lấy danh sách hoặc tìm kiếm
// Hỗ trợ ?search=... tìm theo deviceId, name, deviceType, room
// Hỗ trợ thêm ?status=... và ?room=... nếu người dùng muốn lọc chính xác
router.get('/', async (req, res, next) => {
  try {
    const { search, status, room, deviceType } = req.query;
    const query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { deviceId: regex },
        { name: regex },
        { deviceType: regex },
        { room: regex },
        { brand: regex },
        { model: regex }
      ];
    }

    if (status && status.trim()) {
      query.status = status.trim();
    }

    if (room && room.trim()) {
      query.room = new RegExp(`^${room.trim()}$`, 'i');
    }

    if (deviceType && deviceType.trim()) {
      query.deviceType = new RegExp(`^${deviceType.trim()}$`, 'i');
    }

    const devices = await Device.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/devices/:id - Xem chi tiết một thiết bị (theo _id hoặc deviceId)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let device = null;

    if (isValidObjectId(id)) {
      device = await Device.findById(id);
    }
    // Nếu không tìm thấy bằng ObjectId hoặc param là deviceId
    if (!device) {
      device = await Device.findOne({ deviceId: id });
    }

    if (!device) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy thiết bị với mã hoặc ID: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: device
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/devices - Thêm thiết bị mới
router.post('/', async (req, res, next) => {
  try {
    const {
      deviceId,
      name,
      deviceType,
      room,
      brand,
      model,
      quantity,
      status,
      purchaseDate,
      description
    } = req.body;

    // Validate các trường bắt buộc
    const missingFields = [];
    if (!deviceId || !deviceId.toString().trim()) missingFields.push('deviceId (Mã thiết bị)');
    if (!name || !name.toString().trim()) missingFields.push('name (Tên thiết bị)');
    if (!deviceType || !deviceType.toString().trim()) missingFields.push('deviceType (Loại thiết bị)');
    if (!room || !room.toString().trim()) missingFields.push('room (Phòng học sử dụng)');
    if (!brand || !brand.toString().trim()) missingFields.push('brand (Hãng sản xuất)');
    if (!model || !model.toString().trim()) missingFields.push('model (Model thiết bị)');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Vui lòng điền đầy đủ các thông tin bắt buộc: ${missingFields.join(', ')}`
      });
    }

    const cleanDeviceId = deviceId.toString().trim();

    // Kiểm tra trùng mã thiết bị deviceId
    const existing = await Device.findOne({ deviceId: cleanDeviceId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Mã thiết bị "${cleanDeviceId}" đã tồn tại trên hệ thống. Vui lòng chọn mã khác!`
      });
    }

    // Kiểm tra số lượng
    const parsedQuantity = parseInt(quantity, 10);
    if (quantity !== undefined && (isNaN(parsedQuantity) || parsedQuantity < 1)) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng thiết bị phải là số nguyên dương lớn hơn hoặc bằng 1'
      });
    }

    // Kiểm tra tình trạng nếu có truyền lên
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Tình trạng không hợp lệ. Các tình trạng cho phép: ${VALID_STATUSES.join(', ')}`
      });
    }

    const newDevice = new Device({
      deviceId: cleanDeviceId,
      name: name.toString().trim(),
      deviceType: deviceType.toString().trim(),
      room: room.toString().trim(),
      brand: brand.toString().trim(),
      model: model.toString().trim(),
      quantity: parsedQuantity || 1,
      status: status || 'Đang sử dụng',
      purchaseDate: purchaseDate ? purchaseDate.toString().trim() : new Date().toISOString().split('T')[0],
      description: description ? description.toString().trim() : ''
    });

    const savedDevice = await newDevice.save();

    res.status(201).json({
      success: true,
      message: 'Thêm thiết bị mới thành công!',
      data: savedDevice
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Mã thiết bị (deviceId) đã tồn tại. Không được phép trùng lặp!'
      });
    }
    next(error);
  }
});

// PUT /api/devices/:id - Cập nhật thông tin thiết bị
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let targetDevice = null;

    if (isValidObjectId(id)) {
      targetDevice = await Device.findById(id);
    }
    if (!targetDevice) {
      targetDevice = await Device.findOne({ deviceId: id });
    }

    if (!targetDevice) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy thiết bị với mã hoặc ID: ${id}`
      });
    }

    const {
      deviceId,
      name,
      deviceType,
      room,
      brand,
      model,
      quantity,
      status,
      purchaseDate,
      description
    } = req.body;

    // Nếu người dùng thay đổi deviceId, kiểm tra xem có bị trùng với bản ghi khác không
    if (deviceId && deviceId.toString().trim() !== targetDevice.deviceId) {
      const cleanDeviceId = deviceId.toString().trim();
      const duplicate = await Device.findOne({
        deviceId: cleanDeviceId,
        _id: { $ne: targetDevice._id }
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Mã thiết bị "${cleanDeviceId}" đã được sử dụng bởi một thiết bị khác!`
        });
      }
      targetDevice.deviceId = cleanDeviceId;
    }

    if (name !== undefined) {
      if (!name.toString().trim()) {
        return res.status(400).json({ success: false, message: 'Tên thiết bị không được để trống' });
      }
      targetDevice.name = name.toString().trim();
    }

    if (deviceType !== undefined) {
      if (!deviceType.toString().trim()) {
        return res.status(400).json({ success: false, message: 'Loại thiết bị không được để trống' });
      }
      targetDevice.deviceType = deviceType.toString().trim();
    }

    if (room !== undefined) {
      if (!room.toString().trim()) {
        return res.status(400).json({ success: false, message: 'Phòng học sử dụng không được để trống' });
      }
      targetDevice.room = room.toString().trim();
    }

    if (brand !== undefined) {
      targetDevice.brand = brand.toString().trim();
    }

    if (model !== undefined) {
      targetDevice.model = model.toString().trim();
    }

    if (quantity !== undefined) {
      const parsedQuantity = parseInt(quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng thiết bị phải là số nguyên dương lớn hơn hoặc bằng 1'
        });
      }
      targetDevice.quantity = parsedQuantity;
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Tình trạng không hợp lệ. Các tình trạng cho phép: ${VALID_STATUSES.join(', ')}`
        });
      }
      targetDevice.status = status;
    }

    if (purchaseDate !== undefined) {
      targetDevice.purchaseDate = purchaseDate.toString().trim();
    }

    if (description !== undefined) {
      targetDevice.description = description.toString().trim();
    }

    const updatedDevice = await targetDevice.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thiết bị thành công!',
      data: updatedDevice
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Mã thiết bị (deviceId) đã tồn tại. Không được phép trùng lặp!'
      });
    }
    next(error);
  }
});

// DELETE /api/devices/:id - Xóa thiết bị
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let deletedDevice = null;

    if (isValidObjectId(id)) {
      deletedDevice = await Device.findByIdAndDelete(id);
    }
    if (!deletedDevice) {
      deletedDevice = await Device.findOneAndDelete({ deviceId: id });
    }

    if (!deletedDevice) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy thiết bị để xóa với mã hoặc ID: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      message: `Đã xóa thành công thiết bị "${deletedDevice.name}" (${deletedDevice.deviceId})`,
      data: deletedDevice
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
