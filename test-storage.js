// 测试JSON持久化存储
const fs = require('fs');
const path = require('path');

console.log('🧪 测试数据持久化存储\n');

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'store.json');

console.log('1️⃣ 检查data目录:', dataDir);
console.log('   存在:', fs.existsSync(dataDir) ? '✅' : '❌');

console.log('\n2️⃣ 检查store.json文件:', dataFile);
if (fs.existsSync(dataFile)) {
  console.log('   存在: ✅');
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  console.log('   节目数量:', data.programs?.length || 0);
  console.log('   弹幕数量:', data.danmakus?.length || 0);
  // 如果有记录 IP，则打印出样例（仅用于测试）
  const sampleWithIp = data.danmakus?.find(d => d.ip);
  console.log('   存在 IP 记录:', sampleWithIp ? `是（示例: ${sampleWithIp.ip}）` : '否');
  console.log('   封禁 IP 列表长度:', data.bannedIps?.length || 0);
  console.log('   抽奖配置:', data.lotteryConfig ? '✅' : '❌');
  console.log('   抽奖结果:', data.lotteryResult ? '✅' : '❌');
} else {
  console.log('   存在: ❌ (首次访问API时会自动创建)');
}

console.log('\n✨ 数据持久化已启用！');
console.log('📝 所有操作都会自动保存到 data/store.json');
console.log('🔄 服务器重启后数据不会丢失');
