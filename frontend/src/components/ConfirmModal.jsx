import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, device, isDeleting }) {
  if (!isOpen || !device) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}>
            <AlertTriangle size={20} />
            Xác Nhận Xóa Thiết Bị
          </h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: '1rem', fontSize: '0.925rem', color: 'var(--text-main)' }}>
            Bạn có chắc chắn muốn xóa thiết bị sau khỏi cơ sở dữ liệu?
          </p>
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '0.5rem'
          }}>
            <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: '0.25rem' }}>
              {device.name}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#b91c1c' }}>
              Mã thiết bị: <strong>{device.deviceId}</strong> | Phòng: {device.room}
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Hành động này không thể hoàn tác sau khi đã thực hiện.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
            Hủy bỏ
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
            <Trash2 size={16} />
            {isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
          </button>
        </div>
      </div>
    </div>
  );
}
