// 测试密码验证
const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = '$2a$10$wk0XSi7rOwEqDM1fQCNnxu96nXtwlKAsIa9SzWQtmH9ccZaIg4a5m'; // 从.env.local复制

console.log('测试密码:', password);
console.log('哈希值:', hash);

bcrypt.compare(password, hash).then(result => {
  console.log('验证结果:', result ? '✅ 成功' : '❌ 失败');
  if (result) {
    console.log('\n密码哈希是正确的！如果登录还是失败，可能是：');
    console.log('1. 环境变量没有加载（需要重启服务器）');
    console.log('2. JWT_SECRET的问题');
    console.log('3. 前端请求的问题');
  } else {
    console.log('\n密码哈希不匹配！需要重新生成。');
  }
  process.exit(0);
});
