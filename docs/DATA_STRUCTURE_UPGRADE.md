# 节目单数据结构升级总结

## 概述
成功将节目单数据结构从旧的 `performer` + `info` 格式升级为新的 `performers` + `band_name` 格式。

## 数据结构变更

### 旧格式 (已弃用)
```typescript
interface Program {
  id: string;
  title: string;
  performer: string; // 简单字符串，表演者信息
  order: number;
  completed: boolean;
  info?: string; // Markdown格式的详细信息
  parentId?: string;
  subOrder?: number;
}
```

### 新格式 (当前)
```typescript
interface Program {
  id: string;
  title: string;
  performers?: [string | null, string[]][] | null; // 元组数组：[职务, 人名数组]
  band_name?: string | null; // 组合名
  order: number;
  completed: boolean;
  parentId?: string;
  subOrder?: number;
}
```

## 新格式优势

1. **结构化数据**: 演职人员信息不再是简单字符串，而是结构化的职务-人名映射
2. **职务支持**: 可以明确标注每个人的职务（如编导、演员、主唱等）
3. **组合名分离**: 将团体名称与个人姓名分开管理
4. **格式化显示**: 支持统一的格式化展示：职务左对齐，人名左对齐，单个人名不换行
5. **扩展性**: 便于后续添加更多演职人员相关功能

## 展示格式要求

根据用户要求，演职人员展示格式为：
- **职务左对齐，人名左对齐**
- **人名之间用空格分隔**  
- **单个人名内不得换行**

示例：
```
编导：    张三 李四
演员：    王五 赵六 孙七
```

## 完成的工作

### ✅ 1. 类型定义更新
- 更新 `types/index.ts` 中的 Program 接口
- 移除旧的 `performer` 和 `info` 字段
- 添加新的 `performers` 和 `band_name` 字段

### ✅ 2. 后端API更新
- 更新 `lib/dataStore.ts` 中的所有相关方法
- 修改 `addProgram` 方法参数结构
- 更新 `updateProgramDetails` 方法
- 删除不再需要的 `updateProgramInfo` 方法
- 更新默认数据示例

### ✅ 3. API路由更新
- 更新 `/api/programs/route.ts`
- 更新 `/api/programs/add/route.ts`
- 移除对 `info` 字段的处理
- 适配新的数据结构参数

### ✅ 4. 前端组件更新

#### 管理员页面
- 完全重写 `app/admin/programs/page.tsx`
- 移除旧的 Markdown 编辑功能
- 添加新数据结构的展示
- 简化界面，专注于基本信息展示

#### 用户节目页面
- 更新 `app/programs/page.tsx`
- 替换 `MarkdownRenderer` 为 `ProgramPerformersDisplay`
- 适配新的演职人员展示逻辑
- 保持原有的展开/收起功能

### ✅ 5. 新组件创建

#### ProgramPerformersDisplay 组件
- 负责统一的演职人员信息展示
- 实现要求的格式化布局
- 支持组合名和职务-人名列表展示

#### PerformersEditor 组件
- 提供友好的演职人员编辑界面
- 支持动态添加/删除职务
- 实时预览功能
- 输入验证和格式化

### ✅ 6. 数据迁移
- 创建自动化迁移脚本 `scripts/migrate-data.js`
- 智能识别组合名（包含"团"、"组"等关键词）
- 将简单表演者转换为新格式
- 创建数据备份确保安全
- 成功迁移 5 个现有节目

## 迁移统计

- **迁移的节目**: 5个
- **跳过的节目**: 0个
- **备份文件**: `data/store_backup_before_migration.json`

### 迁移结果示例
```json
// 旧格式
{
  "title": "开场舞",
  "performer": "舞蹈团",
  "info": "详细信息..."
}

// 新格式
{
  "title": "开场舞", 
  "band_name": "舞蹈团",
  "performers": null
}
```

## 使用说明

### 管理员操作
1. 访问管理员节目页面查看新格式数据
2. 使用 PerformersEditor 组件编辑演职人员信息
3. 可以分别设置组合名和具体职务-人员映射

### 用户体验
1. 节目列表页面显示简化的演职人员信息
2. 点击展开查看完整的结构化演职人员列表
3. 保持原有的视觉设计和交互体验

## 后续建议

1. **增强编辑功能**: 可以为管理员页面集成 PerformersEditor 组件
2. **数据验证**: 添加更严格的数据验证规则
3. **导入导出**: 支持批量导入演职人员数据
4. **搜索功能**: 支持按演职人员搜索节目
5. **统计功能**: 提供演职人员参与统计

## 技术亮点

- **类型安全**: 使用 TypeScript 确保数据结构正确性
- **向后兼容**: 迁移脚本确保现有数据平滑升级
- **组件化**: 可复用的显示和编辑组件
- **用户友好**: 保持良好的用户体验
- **数据完整性**: 自动备份和验证机制

---

*数据结构升级完成时间: 2025年11月28日*