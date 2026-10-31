import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const STATUS_OPTIONS = [
  'Đang sử dụng',
  'Hư hỏng',
  'Đang sửa chữa',
  'Ngừng sử dụng'
];

const DEVICE_TYPES = [
  'Máy chiếu',
  'Máy tính',
  'Thiết bị âm thanh',
  'Điều hòa',
  'Thiết bị trình chiếu',
  'Camera giám sát',
  'Bộ phát WiFi',
  'Khác'
];

export default function DeviceModal({ isOpen, onClose, onSave, editingDevice, isSaving }) {
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    deviceType: 'Máy chiếu',
    room: '',
    brand: '',
    model: '',
    quantity: 1,
    status: 'Đang sử dụng',
    purchaseDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (editingDevice) {
      setFormData({
        deviceId: editingDevice.deviceId || '',
        name: editingDevice.name || '',
        deviceType: editingDevice.deviceType || 'Máy chiếu',
        room: editingDevice.room || '',
        brand: editingDevice.brand || '',
        model: editingDevice.model || '',
        quantity: editingDevice.quantity || 1,
        status: editingDevice.status || 'Đang sử dụng',
        purchaseDate: editingDevice.purchaseDate || new Date().toISOString().split('T')[0],
        description: editingDevice.description || ''
      });
    } else {
      setFormData({
        deviceId: '',
        name: '',
        deviceType: 'Máy chiếu',
        room: '',
        brand: '',
        model: '',
        quantity: 1,
        status: 'Đang sử dụng',
        purchaseDate: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
    setError('');
  }, [editingDevice, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? (parseInt(value, 10) || '') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!formData.deviceId.trim()) {
      setError('Vui lòng nhập Mã thiết bị (deviceId)');
      return;
    }
    if (!formData.name.trim()) {
      setError('Vui lòng nhập Tên thiết bị (name)');
      return;
    }
    if (!formData.room.trim()) {
      setError('Vui lòng nhập Phòng học sử dụng (room)');
      return;
    }
    if (!formData.brand.trim()) {
      setError('Vui lòng nhập Hãng sản xuất (brand)');
      return;
    }
    if (!formData.model.trim()) {
      setError('Vui lòng nhập Model thiết bị (model)');
      return;
    }
    if (!formData.quantity || formData.quantity < 1) {
      setError('Số lượng thiết bị phải từ 1 trở lên');
      return;
    }

    try {
      await onSave(formData);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi lưu thiết bị');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingDevice ? 'Cập Nhật Thông Tin Thiết Bị' : 'Thêm Thiết Bị Phòng Học Mới'}</h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Mã thiết bị <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="deviceId"
                  className="form-input"
                  placeholder="VD: TB-MC-001"
                  value={formData.deviceId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Loại thiết bị <span className="required">*</span>
                </label>
                <select
                  name="deviceType"
                  className="form-select"
                  value={formData.deviceType}
                  onChange={handleChange}
                >
                  {DEVICE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">
                  Tên thiết bị <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="VD: Máy chiếu Sony VPL-EX435"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Phòng học sử dụng <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="room"
                  className="form-input"
                  placeholder="VD: Phòng A101"
                  value={formData.room}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Tình trạng thiết bị <span className="required">*</span>
                </label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Hãng sản xuất <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="brand"
                  className="form-input"
                  placeholder="VD: Sony, Dell, JBL..."
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Model thiết bị <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  className="form-input"
                  placeholder="VD: VPL-EX435, OptiPlex 7090..."
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Số lượng <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  className="form-input"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Ngày mua / tiếp nhận
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  className="form-input"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">
                  Mô tả / Ghi chú chi tiết
                </label>
                <textarea
                  name="description"
                  rows="3"
                  className="form-textarea"
                  placeholder="Ghi chú về vị trí lắp đặt, tình trạng kỹ thuật hoặc yêu cầu bảo trì..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu thông tin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
