/**
 * Script để tự động cập nhật IP address vào config
 * Chạy: node scripts/update-ip.cjs
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  
  // Tìm IPv4 address không phải localhost
  for (const name of Object.keys(interfaces)) {
    const ifaces = interfaces[name];
    if (!ifaces) continue;
    
    for (const iface of ifaces) {
      // Bỏ qua internal (localhost) và IPv6
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return null;
}

function updateConfigFile(ipAddress) {
  const configPath = path.join(__dirname, '..', 'config', 'index.ts');
  let content = fs.readFileSync(configPath, 'utf8');
  
  // Thay thế IP trong API_BASE_URL
  const regex = /API_BASE_URL:\s*'http:\/\/[\d.]+:(\d+)\/api'/;
  const match = content.match(regex);
  
  if (match) {
    const port = match[1];
    const newUrl = `http://${ipAddress}:${port}/api`;
    content = content.replace(regex, `API_BASE_URL: '${newUrl}'`);
    
    fs.writeFileSync(configPath, content, 'utf8');
    console.log('✅ Đã cập nhật IP address thành công!');
    console.log(`📡 API URL mới: ${newUrl}`);
    return true;
  }
  
  return false;
}

// Main
console.log('🔍 Đang tìm IP address của máy...\n');

const ipAddress = getLocalIPAddress();

if (!ipAddress) {
  console.error('❌ Không tìm thấy IP address.');
  console.log('\n💡 Cách thủ công:');
  console.log('   - Windows: mở CMD và chạy "ipconfig"');
  console.log('   - Mac/Linux: mở Terminal và chạy "ifconfig" hoặc "ip addr"');
  console.log('   - Sau đó cập nhật thủ công trong config/index.ts');
  process.exit(1);
}

console.log(`✅ Tìm thấy IP: ${ipAddress}\n`);

const updated = updateConfigFile(ipAddress);

if (!updated) {
  console.error('❌ Không thể cập nhật config file.');
  console.log(`\n💡 Vui lòng cập nhật thủ công IP "${ipAddress}" vào config/index.ts`);
  process.exit(1);
}

console.log('\n✨ Hoàn thành! Giờ bạn có thể chạy app với IP mới.');
console.log('\n📋 Checklist trước khi chạy app:');
console.log('   1. ✓ Đã cập nhật IP address');
console.log('   2. ⏳ Backend đang chạy?');
console.log('   3. ⏳ Cùng mạng WiFi với backend?');
console.log('   4. ⏳ Firewall không chặn port 5293?');
console.log('\n🚀 Chạy app: npx expo start\n');
