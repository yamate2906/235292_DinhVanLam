import React from 'react';
import { X, Edit, Calendar, MapPin, Tag, Box, Layers, Info } from 'lucide-react';

export default function DeviceDetailModal({ isOpen, onClose, device, onEdit }) {
  if (!isOpen || !device) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Đang sử dụng': return 'status-active';
      case 'Đang sửa chữa': return 'status-repair';
      case 'Hư hỏng': return 'status-damaged';
      case 'Ngừng sử dụng': return 'status-retired';
      default: return 'status-active';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Chi Tiết Thiết Bị Phòng Học</h3>
            <span className="code-badge" style={{ marginTop: 4, display: 'inline-block' }}>
              {device.deviceId}
            </span>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {device.name}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className={`status-badge ${getStatusClass(device.status)}`}>
                {device.status}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Loại: <strong>{device.deviceType}</strong>
              </span>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Phòng học</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} color="var(--primary)" />
                {device.room}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Số lượng</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={16} color="var(--primary)" />
                {device.quantity} thiết bị
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Hãng sản xuất</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={16} color="var(--primary)" />
                {device.brand}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Model</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Box size={16} color="var(--primary)" />
                {device.model}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Ngày mua / tiếp nhận</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} color="var(--primary)" />
                {device.purchaseDate || 'Chưa cập nhật'}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Cập nhật lần cuối</span>
              <span className="detail-value" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {device.updatedAt ? new Date(device.updatedAt).toLocaleString('vi-VN') : 'Mới tạo'}
              </span>
            </div>

            <div className="detail-item col-span-2">
              <span className="detail-label">Mô tả / Ghi chú</span>
              <div style={{
                background: '#f8fafc',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                minHeight: '60px'
              }}>
                {device.description || 'Không có mô tả bổ sung cho thiết bị này.'}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(device);
            }}
          >
            <Edit size={16} />
            Chỉnh sửa thiết bị
          </button>
        </div>
      </div>
    </div>
  );
}
