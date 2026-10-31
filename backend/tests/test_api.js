require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const { app, startServer } = require('../server');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG CÁC API BACKEND ---');
  let server;
  try {
    server = await startServer();
    const port = process.env.PORT || 5000;

    // 1. Test GET /health
    console.log('\n[TEST 1] GET /health');
    const healthRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/health',
      method: 'GET'
    });
    console.log(`Status: ${healthRes.status}, Body:`, healthRes.data);
    if (healthRes.status !== 200 || healthRes.data.status !== 'UP') {
      throw new Error('Test 1 thất bại!');
    }
    console.log('✓ PASS Test 1');

    // 2. Test GET /api/devices
    console.log('\n[TEST 2] GET /api/devices');
    const listRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/devices',
      method: 'GET'
    });
    console.log(`Status: ${listRes.status}, Số lượng thiết bị: ${listRes.data.count}`);
    if (listRes.status !== 200 || !Array.isArray(listRes.data.data)) {
      throw new Error('Test 2 thất bại!');
    }
    console.log('✓ PASS Test 2');

    // 3. Test GET /api/devices?search=Sony
    console.log('\n[TEST 3] GET /api/devices?search=Sony');
    const searchRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/devices?search=Sony',
      method: 'GET'
    });
    console.log(`Status: ${searchRes.status}, Kết quả tìm thấy: ${searchRes.data.count}`);
    if (searchRes.status !== 200 || searchRes.data.count < 1) {
      throw new Error('Test 3 thất bại!');
    }
    console.log('✓ PASS Test 3');

    // 4. Test POST /api/devices (Thêm mới hợp lệ)
    console.log('\n[TEST 4] POST /api/devices (Thêm thiết bị mới)');
    const newDevice = {
      deviceId: 'TB-TEST-999',
      name: 'Màn hình hiển thị LED 85 inch Test',
      deviceType: 'Màn hình',
      room: 'Phòng B102',
      brand: 'LG',
      model: '85UM3E',
      quantity: 1,
      status: 'Đang sử dụng',
      purchaseDate: '2024-05-10',
      description: 'Thiết bị tạo từ test tự động'
    };
    const createRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/devices',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, newDevice);
    console.log(`Status: ${createRes.status}, Body:`, createRes.data.message);
    if (createRes.status !== 201 || createRes.data.data.deviceId !== 'TB-TEST-999') {
      throw new Error('Test 4 thất bại!');
    }
    console.log('✓ PASS Test 4');

    // 5. Test POST /api/devices trùng mã deviceId -> phải trả 400
    console.log('\n[TEST 5] POST /api/devices (Thử thêm trùng mã deviceId)');
    const dupRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/devices',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, newDevice);
    console.log(`Status: ${dupRes.status}, Body:`, dupRes.data.message);
    if (dupRes.status !== 400) {
      throw new Error(`Test 5 thất bại! Mong đợi 400 nhưng nhận: ${dupRes.status}`);
    }
    console.log('✓ PASS Test 5');

    // 6. Test GET /api/devices/:id
    console.log('\n[TEST 6] GET /api/devices/TB-TEST-999 (Xem chi tiết)');
    const detailRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/devices/TB-TEST-999',
      method: 'GET'
    });
    console.log(`Status: ${detailRes.status}, Tên thiết bị:`, detailRes.data.data.name);
    if (detailRes.status !== 200 || detailRes.data.data.deviceId !== 'TB-TEST-999') {
      throw new Error('Test 6 thất bại!');
    }
    console.log('✓ PASS Test 6');

    // 7. Test PUT /api/devices/:id (Cập nhật thông tin)
    console.log('\n[TEST 7] PUT /api/devices/TB-TEST-999 (Cập nhật tình trạng)');
    const updateRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/devices/TB-TEST-999',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, { status: 'Đang sửa chữa', description: 'Đã cập nhật tình trạng qua API' });
    console.log(`Status: ${updateRes.status}, Tình trạng mới:`, updateRes.data.data.status);
    if (updateRes.status !== 200 || updateRes.data.data.status !== 'Đang sửa chữa') {
      throw new Error('Test 7 thất bại!');
    }
    console.log('✓ PASS Test 7');

    // 8. Test DELETE /api/devices/:id (Xóa thiết bị)
    console.log('\n[TEST 8] DELETE /api/devices/TB-TEST-999 (Xóa)');
    const deleteRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/devices/TB-TEST-999',
      method: 'DELETE'
    });
    console.log(`Status: ${deleteRes.status}, Message:`, deleteRes.data.message);
    if (deleteRes.status !== 200) {
      throw new Error('Test 8 thất bại!');
    }
    console.log('✓ PASS Test 8');

    // 9. Test GET /api/devices/:id sau khi xóa -> phải trả 404
    console.log('\n[TEST 9] GET /api/devices/TB-TEST-999 sau khi xóa');
    const notFoundRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/devices/TB-TEST-999',
      method: 'GET'
    });
    console.log(`Status: ${notFoundRes.status}, Message:`, notFoundRes.data.message);
    if (notFoundRes.status !== 404) {
      throw new Error(`Test 9 thất bại! Mong đợi 404 nhưng nhận: ${notFoundRes.status}`);
    }
    console.log('✓ PASS Test 9');

    console.log('\n===============================================');
    console.log('🎉 TẤT CẢ 9 BÀI KIỂM THỬ API ĐỀU VƯỢT QUA 100%!');
    console.log('===============================================');
  } catch (err) {
    console.error('❌ Lỗi kiểm thử API:', err.message);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
  }
}

runTests();
