#!/usr/bin/env node
// 数据迁移脚本：从旧的performer/info格式迁移到新的performers/band_name格式

const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'store.json');
const backupFile = path.join(dataDir, 'store_backup_before_migration.json');

console.log('🔄 开始数据迁移...\n');

// 检查数据文件是否存在
if (!fs.existsSync(dataFile)) {
  console.log('❌ 数据文件不存在，无需迁移');
  process.exit(0);
}

try {
  // 读取现有数据
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  
  console.log(`📊 找到 ${data.programs?.length || 0} 个节目需要检查`);
  
  // 创建备份
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
  console.log(`💾 已创建备份文件: ${backupFile}`);
  
  let migratedCount = 0;
  let skippedCount = 0;
  
  // 迁移每个节目
  if (data.programs) {
    data.programs.forEach((program, index) => {
      // 检查是否已经是新格式
      if (program.performers !== undefined || program.band_name !== undefined) {
        console.log(`⏭️  节目 "${program.title}" 已经是新格式，跳过`);
        skippedCount++;
        return;
      }
      
      // 检查是否有旧格式数据
      if (program.performer !== undefined || program.info !== undefined) {
        console.log(`🔄 迁移节目 "${program.title}"`);
        
        // 处理performer字段
        if (program.performer && program.performer.trim()) {
          // 尝试智能解析performer字段
          const performerText = program.performer.trim();
          
          // 如果包含组合/团体等关键词，作为band_name
          if (/团|组|队|社|会|合唱|乐团|舞蹈团|剧团/.test(performerText)) {
            program.band_name = performerText;
            program.performers = null;
            console.log(`  -> 设置组合名: ${performerText}`);
          } else {
            // 否则作为表演者
            program.performers = [[null, [performerText]]];
            program.band_name = null;
            console.log(`  -> 设置表演者: ${performerText}`);
          }
        } else {
          program.performers = null;
          program.band_name = null;
        }
        
        // 删除旧字段
        delete program.performer;
        delete program.info;
        
        migratedCount++;
      }
    });
  }
  
  // 写入更新后的数据
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  
  console.log('\n✅ 数据迁移完成！');
  console.log(`📈 统计信息:`);
  console.log(`   - 迁移的节目: ${migratedCount}`);
  console.log(`   - 跳过的节目: ${skippedCount}`);
  console.log(`   - 总计节目: ${data.programs?.length || 0}`);
  console.log(`\n💡 备份文件保存在: ${backupFile}`);
  
  if (migratedCount > 0) {
    console.log('\n⚠️  注意事项:');
    console.log('   1. 迁移完成后，旧的info字段（Markdown内容）已被移除');
    console.log('   2. 演职人员信息现在使用新的结构化格式');
    console.log('   3. 可以通过管理员界面重新编辑和完善演职人员信息');
  }

} catch (error) {
  console.error('❌ 迁移过程中发生错误:', error);
  process.exit(1);
}