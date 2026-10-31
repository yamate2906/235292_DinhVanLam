import React from 'react';
import { Monitor, RefreshCw, Server, User } from 'lucide-react';

export default function Navbar({ health, onRefreshHealth, isRefreshing }) {
  const isUp = health?.status === 'UP';

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <Monitor size={24} />
          </div>
          <div>
            <h1 className="brand-title">Hệ Thống Quản Lý Thiết Bị Phòng Học</h1>
            <div className="brand-subtitle">
              <span className="user-badge">
                <User size={13} style={{ display: 'inline', marginRight: 4 }} />
                Đinh Văn Lắm - MSSV: 235292
              </span>
              <span>•</span>
              <span>Học phần: Điện toán đám mây</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="health-badge" title={`Trạng thái DB: ${health?.database || 'Unknown'}`}>
            <span className={`health-dot ${isUp ? 'up' : 'down'}`}></span>
            <span>API {isUp ? 'Sẵn sàng' : 'Mất kết nối'}</span>
            {health?.database && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ({health.database})
              </span>
            )}
          </div>

          <button
            className="btn btn-secondary btn-icon"
            onClick={onRefreshHealth}
            disabled={isRefreshing}
            title="Kiểm tra lại kết nối API"
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin-icon' : ''} />
          </button>
        </div>
      </div>
    </header>
  );
}
