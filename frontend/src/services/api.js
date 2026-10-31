const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  // Mặc định gọi relative path để reverse proxy (Nginx hoặc Vite dev proxy) xử lý
  return '';
};

const BASE_URL = getBaseUrl();

async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.message || data?.errors?.join(', ') || `Lỗi HTTP: ${response.status} ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const apiService = {
  getBaseUrl() {
    return BASE_URL || window.location.origin;
  },

  async getHealth() {
    try {
      const url = `${BASE_URL}/health`;
      const res = await fetch(url);
      return await handleResponse(res);
    } catch (err) {
      return { status: 'DOWN', error: err.message };
    }
  },

  async getDevices({ search = '', status = '', room = '', deviceType = '' } = {}) {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (status.trim()) params.append('status', status.trim());
    if (room.trim()) params.append('room', room.trim());
    if (deviceType.trim()) params.append('deviceType', deviceType.trim());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const url = `${BASE_URL}/api/devices${queryString}`;
    const res = await fetch(url);
    return await handleResponse(res);
  },

  async getDeviceById(id) {
    const url = `${BASE_URL}/api/devices/${encodeURIComponent(id)}`;
    const res = await fetch(url);
    return await handleResponse(res);
  },

  async createDevice(deviceData) {
    const url = `${BASE_URL}/api/devices`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deviceData)
    });
    return await handleResponse(res);
  },

  async updateDevice(id, deviceData) {
    const url = `${BASE_URL}/api/devices/${encodeURIComponent(id)}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deviceData)
    });
    return await handleResponse(res);
  },

  async deleteDevice(id) {
    const url = `${BASE_URL}/api/devices/${encodeURIComponent(id)}`;
    const res = await fetch(url, {
      method: 'DELETE'
    });
    return await handleResponse(res);
  }
};
