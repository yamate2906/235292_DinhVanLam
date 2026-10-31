import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, XCircle, PowerOff } from 'lucide-react';

export default function StatsCards({ devices = [] }) {
  const total = devices.length;
  const activeCount = devices.filter(d => d.status === 'Đang sử dụng').length;
  const repairCount = devices.filter(d => d.status === 'Đang sửa chữa').length;
  const damagedCount = devices.filter(d => d.status === 'Hư hỏng').length;
  const retiredCount = devices.filter(d => d.status === 'Ngừng sử dụng').length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}>
          <Layers size={24} />
        </div>
        <div>
          <div className="stat-value">{total}</div>
          <div className="stat-label">Tổng số thiết bị</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#dcfce7', color: '#15803d' }}>
          <CheckCircle2 size={24} />
        </div>
        <div>
          <div className="stat-value" style={{ color: '#15803d' }}>{activeCount}</div>
          <div className="stat-label">Đang sử dụng</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <div className="stat-value" style={{ color: '#b45309' }}>{repairCount}</div>
          <div className="stat-label">Đang sửa chữa</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#fee2e2', color: '#b91c1c' }}>
          <XCircle size={24} />
        </div>
        <div>
          <div className="stat-value" style={{ color: '#b91c1c' }}>{damagedCount}</div>
          <div className="stat-label">Hư hỏng</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#f1f5f9', color: '#475569' }}>
          <PowerOff size={24} />
        </div>
        <div>
          <div className="stat-value" style={{ color: '#475569' }}>{retiredCount}</div>
          <div className="stat-label">Ngừng sử dụng</div>
        </div>
      </div>
    </div>
  );
}
