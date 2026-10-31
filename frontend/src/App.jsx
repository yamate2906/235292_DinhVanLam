import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, RefreshCw, Eye, Edit, Trash2,
  AlertTriangle, Filter, MonitorCheck, HelpCircle
} from 'lucide-react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import DeviceModal from './components/DeviceModal';
import DeviceDetailModal from './components/DeviceDetailModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import { apiService } from './services/api';

const STATUS_FILTERS = [
  { label: 'Tất cả tình trạng', value: '' },
  { label: 'Đang sử dụng', value: 'Đang sử dụng' },
  { label: 'Đang sửa chữa', value: 'Đang sửa chữa' },
  { label: 'Hư hỏng', value: 'Hư hỏng' },
  { label: 'Ngừng sử dụng', value: 'Ngừng sử dụng' }
];

export default function App() {
  const [devices, setDevices] = useState([]);
  const [allDevicesForStats, setAllDevicesForStats] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [detailDevice, setDetailDevice] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [deletingDevice, setDeletingDevice] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load Health
  const loadHealth = useCallback(async () => {
    setIsRefreshingHealth(true);
    try {
      const data = await apiService.getHealth();
      setHealth(data);
    } catch {
      setHealth({ status: 'DOWN' });
    } finally {
      setIsRefreshingHealth(false);
    }
  }, []);

  // Load Devices
  const loadDevices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiService.getDevices({
        search: searchTerm,
        status: statusFilter
      });
      setDevices(res.data || []);

      // Cập nhật stats nếu không lọc
      if (!searchTerm && !statusFilter) {
        setAllDevicesForStats(res.data || []);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách thiết bị từ máy chủ');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // Load all devices once for stats if needed
  const loadStatsDevices = useCallback(async () => {
    try {
      const res = await apiService.getDevices();
      setAllDevicesForStats(res.data || []);
    } catch (err) {
      console.error('Không thể nạp dữ liệu thống kê:', err);
    }
  }, []);

  useEffect(() => {
    loadHealth();
    loadStatsDevices();
  }, [loadHealth, loadStatsDevices]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDevices();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadDevices]);

  // Handle Save (Add or Edit)
  const handleSaveDevice = async (formData) => {
    setIsSaving(true);
    try {
      if (editingDevice) {
        await apiService.updateDevice(editingDevice._id || editingDevice.deviceId, formData);
        addToast(`Cập nhật thông tin thiết bị "${formData.name}" thành công!`, 'success');
      } else {
        await apiService.createDevice(formData);
        addToast(`Thêm thiết bị mới "${formData.name}" thành công!`, 'success');
      }
      setIsAddEditOpen(false);
      setEditingDevice(null);
      await loadDevices();
      await loadStatsDevices();
    } catch (err) {
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingDevice) return;
    setIsDeleting(true);
    try {
      await apiService.deleteDevice(deletingDevice._id || deletingDevice.deviceId);
      addToast(`Đã xóa thiết bị "${deletingDevice.name}" thành công!`, 'success');
      setIsDeleteOpen(false);
      setDeletingDevice(null);
      await loadDevices();
      await loadStatsDevices();
    } catch (err) {
      addToast(err.message || 'Có lỗi xảy ra khi xóa thiết bị', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper cho màu tình trạng
  const getStatusBadge = (status) => {
    let cls = 'status-active';
    if (status === 'Đang sửa chữa') cls = 'status-repair';
    else if (status === 'Hư hỏng') cls = 'status-damaged';
    else if (status === 'Ngừng sử dụng') cls = 'status-retired';

    return <span className={`status-badge ${cls}`}>{status}</span>;
  };

  return (
    <div>
      <Navbar
        health={health}
        onRefreshHealth={loadHealth}
        isRefreshing={isRefreshingHealth}
      />

      <main className="main-content">
        {/* Thống kê thiết bị */}
        <StatsCards devices={allDevicesForStats.length ? allDevicesForStats : devices} />

        {/* Thanh công cụ tìm kiếm và Thêm mới */}
        <div className="toolbar-card">
          <div className="search-filter-group">
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                className="input-field"
                placeholder="Tìm theo mã, tên, loại thiết bị hoặc phòng..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="select-field"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              {STATUS_FILTERS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>

            {(searchTerm || statusFilter) && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
              >
                Đặt lại lọc
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary"
              onClick={loadDevices}
              title="Làm mới danh sách"
            >
              <RefreshCw size={16} />
              Làm mới
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingDevice(null);
                setIsAddEditOpen(true);
              }}
            >
              <Plus size={18} />
              Thêm thiết bị mới
            </button>
          </div>
        </div>

        {/* Danh sách thiết bị dạng Bảng */}
        <div className="table-card">
          {loading ? (
            <div className="state-container">
              <div className="spinner"></div>
              <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                Đang tải dữ liệu thiết bị từ máy chủ đám mây...
              </p>
            </div>
          ) : error ? (
            <div className="state-container">
              <AlertTriangle size={48} color="#ef4444" />
              <h3 style={{ color: '#dc2626' }}>Không thể kết nối đến Backend API</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: 450 }}>{error}</p>
              <button className="btn btn-primary" onClick={loadDevices}>
                Thử kết nối lại
              </button>
            </div>
          ) : devices.length === 0 ? (
            <div className="state-container">
              <MonitorCheck size={48} color="var(--primary)" />
              <h3>Không tìm thấy thiết bị nào</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {searchTerm || statusFilter
                  ? 'Không có thiết bị phù hợp với điều kiện tìm kiếm hiện tại.'
                  : 'Hiện chưa có thiết bị nào trong cơ sở dữ liệu.'}
              </p>
              {searchTerm || statusFilter ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                  }}
                >
                  Xóa bộ lọc
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingDevice(null);
                    setIsAddEditOpen(true);
                  }}
                >
                  <Plus size={16} />
                  Thêm thiết bị đầu tiên
                </button>
              )}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="device-table">
                <thead>
                  <tr>
                    <th>Mã thiết bị</th>
                    <th>Tên thiết bị</th>
                    <th>Loại</th>
                    <th>Phòng học</th>
                    <th>Hãng & Model</th>
                    <th style={{ textAlign: 'center' }}>Số lượng</th>
                    <th>Tình trạng</th>
                    <th style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map(device => (
                    <tr key={device._id || device.deviceId}>
                      <td>
                        <span className="code-badge">{device.deviceId}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {device.name}
                        </div>
                        {device.description && (
                          <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            maxWidth: '280px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {device.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {device.deviceType}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          background: '#f1f5f9',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '0.825rem'
                        }}>
                          {device.room}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.875rem' }}>{device.brand}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                          {device.model}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>
                        {device.quantity}
                      </td>
                      <td>{getStatusBadge(device.status)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="actions-cell" style={{ justifyContent: 'center' }}>
                          <button
                            className="btn btn-secondary btn-icon"
                            title="Xem chi tiết"
                            onClick={() => {
                              setDetailDevice(device);
                              setIsDetailOpen(true);
                            }}
                          >
                            <Eye size={16} color="var(--primary)" />
                          </button>
                          <button
                            className="btn btn-secondary btn-icon"
                            title="Chỉnh sửa thông tin"
                            onClick={() => {
                              setEditingDevice(device);
                              setIsAddEditOpen(true);
                            }}
                          >
                            <Edit size={16} color="#d97706" />
                          </button>
                          <button
                            className="btn btn-secondary btn-icon"
                            title="Xóa thiết bị"
                            onClick={() => {
                              setDeletingDevice(device);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 size={16} color="#dc2626" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal Thêm / Sửa */}
      <DeviceModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingDevice(null);
        }}
        onSave={handleSaveDevice}
        editingDevice={editingDevice}
        isSaving={isSaving}
      />

      {/* Modal Xem chi tiết */}
      <DeviceDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailDevice(null);
        }}
        device={detailDevice}
        onEdit={(dev) => {
          setEditingDevice(dev);
          setIsAddEditOpen(true);
        }}
      />

      {/* Modal Xác nhận xóa */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingDevice(null);
        }}
        onConfirm={handleConfirmDelete}
        device={deletingDevice}
        isDeleting={isDeleting}
      />

      {/* Thông báo Toasts */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
