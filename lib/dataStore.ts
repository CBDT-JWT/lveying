// JSON文件持久化数据存储
import fs from 'fs';
import path from 'path';
import { Program, Danmaku, LotteryConfig, LotteryResult } from '@/types';

interface DataStoreState {
  programs: Program[];
  danmakus: Danmaku[];
  lotteryConfig: LotteryConfig;
  lotteryResults: LotteryResult[]; // 改为数组，支持多次抽奖
}

class DataStore {
  private dataFilePath: string;
  private data: DataStoreState;

  // 默认数据
  private defaultData: DataStoreState = {
    programs: [
      { id: '1', title: '开场舞', performer: '舞蹈团', order: 1, completed: false },
      { id: '2', title: '歌曲表演', performer: '歌手A', order: 2, completed: false },
      { id: '3', title: '小品', performer: '喜剧组', order: 3, completed: false },
      { id: '4', title: '魔术表演', performer: '魔术师', order: 4, completed: false },
      { id: '5', title: '抽奖环节', performer: '主持人', order: 5, completed: false },
    ],
    danmakus: [],
    lotteryConfig: {
      minNumber: 1,
      maxNumber: 100,
      count: 5,
      title: '一等奖',
    },
    lotteryResults: [],
  };

  constructor() {
    // 数据文件存储在项目根目录的data文件夹中
    const dataDir = path.join(process.cwd(), 'data');
    this.dataFilePath = path.join(dataDir, 'store.json');

    // 确保data目录存在
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 加载或初始化数据
    this.data = this.loadData();
  }

  // 从JSON文件加载数据
  private loadData(): DataStoreState {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const fileContent = fs.readFileSync(this.dataFilePath, 'utf-8');
        const loadedData = JSON.parse(fileContent);
        
        // 数据迁移：处理旧版本的 lotteryResult (单数) -> lotteryResults (复数)
        if ('lotteryResult' in loadedData && !('lotteryResults' in loadedData)) {
          console.log('🔄 检测到旧数据格式，正在迁移...');
          loadedData.lotteryResults = loadedData.lotteryResult ? [loadedData.lotteryResult] : [];
          delete loadedData.lotteryResult;
          // 立即保存迁移后的数据
          fs.writeFileSync(this.dataFilePath, JSON.stringify(loadedData, null, 2), 'utf-8');
          console.log('✅ 数据迁移完成');
        }
        
        // 确保 lotteryResults 存在
        if (!loadedData.lotteryResults) {
          loadedData.lotteryResults = [];
        }
        
        console.log('✅ 从文件加载数据成功');
        return loadedData;
      }
    } catch (error) {
      console.error('❌ 加载数据文件失败:', error);
    }
    
    // 如果文件不存在或加载失败，使用默认数据并保存
    console.log('📝 使用默认数据并创建新文件');
    this.saveData(this.defaultData);
    return { ...this.defaultData };
  }

  // 保存数据到JSON文件（同步写入，确保数据持久化）
  private saveData(data?: DataStoreState): void {
    try {
      const dataToSave = data || this.data;
      // 使用同步写入确保数据立即持久化
      fs.writeFileSync(
        this.dataFilePath,
        JSON.stringify(dataToSave, null, 2),
        'utf-8'
      );
      console.log('💾 数据已保存到文件');
    } catch (error) {
      console.error('❌ 保存数据文件失败:', error);
      // 如果保存失败，抛出错误以便上层处理
      throw error;
    }
  }

  // 重新加载数据（从文件读取最新数据）
  private reloadData(): void {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const fileContent = fs.readFileSync(this.dataFilePath, 'utf-8');
        this.data = JSON.parse(fileContent);
        console.log('🔄 数据已重新加载');
      }
    } catch (error) {
      console.error('❌ 重新加载数据失败:', error);
    }
  }

  // 节目单相关方法
  getPrograms(): Program[] {
    // 从文件重新加载以确保数据最新
    this.reloadData();
    return [...this.data.programs].sort((a, b) => a.order - b.order);
  }

  updatePrograms(programs: Program[]): void {
    this.data.programs = programs;
    this.saveData();
  }

  updateProgramStatus(id: string, completed: boolean): void {
    const program = this.data.programs.find((p) => p.id === id);
    if (program) {
      program.completed = completed;
      this.saveData();
    }
  }

  updateProgramInfo(id: string, info: string): void {
    const program = this.data.programs.find((p) => p.id === id);
    if (program) {
      program.info = info;
      this.saveData();
      console.log(`📝 节目详情已更新: ${program.title}`);
    }
  }

  // 添加新节目
  addProgram(title: string, performer: string, order: number): Program {
    const newProgram: Program = {
      id: Date.now().toString(),
      title,
      performer,
      order,
      completed: false,
      info: '',
    };
    this.data.programs.push(newProgram);
    this.saveData();
    console.log(`➕ 新节目已添加: ${title}`);
    return newProgram;
  }

  // 删除节目
  deleteProgram(id: string): void {
    const index = this.data.programs.findIndex((p) => p.id === id);
    if (index !== -1) {
      const program = this.data.programs[index];
      this.data.programs.splice(index, 1);
      this.saveData();
      console.log(`🗑️ 节目已删除: ${program.title}`);
    }
  }

  // 更新节目基本信息（标题、表演者、顺序）
  updateProgramDetails(id: string, title: string, performer: string, order: number): void {
    const program = this.data.programs.find((p) => p.id === id);
    if (program) {
      program.title = title;
      program.performer = performer;
      program.order = order;
      this.saveData();
      console.log(`✏️ 节目信息已更新: ${title}`);
    }
  }

  // 弹幕相关方法
  getDanmakus(): Danmaku[] {
    // 从文件重新加载以确保数据最新
    this.reloadData();
    return [...this.data.danmakus].sort((a, b) => b.timestamp - a.timestamp);
  }

  // 获取已审核的弹幕
  getCensoredDanmakus(): Danmaku[] {
    // 从文件重新加载以确保数据最新
    this.reloadData();
    return [...this.data.danmakus]
      .filter((d) => d.censor === true)
      .sort((a, b) => {
        // 按审核通过时间排序，如果没有 censoredAt 则使用 timestamp
        const timeA = a.censoredAt || a.timestamp;
        const timeB = b.censoredAt || b.timestamp;
        return timeA - timeB; // 正序，最新审核的在后面
      });
  }

  addDanmaku(content: string): Danmaku {
    // 在添加前重新加载数据，确保基于最新状态
    this.reloadData();
    
    const danmaku: Danmaku = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now(),
      censor: false, // 默认未审核
    };
    this.data.danmakus.push(danmaku);
    this.saveData();
    return danmaku;
  }

  // 更新弹幕审核状态
  updateDanmakuCensor(id: string, censor: boolean): boolean {
    // 在修改前重新加载数据，确保基于最新状态进行修改
    this.reloadData();
    
    const danmaku = this.data.danmakus.find((d) => d.id === id);
    if (danmaku) {
      danmaku.censor = censor;
      // 如果是审核通过，记录审核时间；如果是取消审核，清除审核时间
      if (censor) {
        danmaku.censoredAt = Date.now();
      } else {
        delete danmaku.censoredAt;
      }
      this.saveData();
      console.log(`✅ 弹幕审核状态已更新: ${censor ? '通过' : '未通过'}`);
      return true;
    }
    return false;
  }

  clearDanmakus(): void {
    this.data.danmakus = [];
    this.saveData();
  }

  // 抽奖相关方法
  getLotteryConfig(): LotteryConfig {
    // 从文件重新加载以确保数据最新
    this.reloadData();
    return { ...this.data.lotteryConfig };
  }

  updateLotteryConfig(config: Partial<LotteryConfig>): LotteryConfig {
    this.data.lotteryConfig = { ...this.data.lotteryConfig, ...config };
    this.saveData();
    return this.data.lotteryConfig;
  }

  // 添加新的抽奖结果
  addLotteryResult(title: string, numbers: number[]): LotteryResult {
    const result: LotteryResult = {
      id: Date.now().toString(),
      title,
      numbers,
      timestamp: Date.now(),
    };
    this.data.lotteryResults.push(result);
    this.saveData();
    console.log(`🎁 新抽奖结果已保存: ${title}`);
    return result;
  }

  // 获取所有抽奖结果（按时间倒序）
  getAllLotteryResults(): LotteryResult[] {
    // 从文件重新加载以确保数据最新
    this.reloadData();
    return [...this.data.lotteryResults].sort((a, b) => b.timestamp - a.timestamp);
  }

  // 获取最新的抽奖结果
  getLatestLotteryResult(): LotteryResult | null {
    // 从文件重新加载以确保数据最新
    this.reloadData();
    if (this.data.lotteryResults.length === 0) {
      return null;
    }
    return { ...this.data.lotteryResults[this.data.lotteryResults.length - 1] };
  }

  // 删除指定的抽奖结果
  deleteLotteryResult(id: string): boolean {
    const index = this.data.lotteryResults.findIndex(r => r.id === id);
    if (index !== -1) {
      this.data.lotteryResults.splice(index, 1);
      this.saveData();
      console.log(`🗑️ 已删除抽奖结果: ${id}`);
      return true;
    }
    return false;
  }

  // 清空所有抽奖结果
  clearAllLotteryResults(): void {
    this.data.lotteryResults = [];
    this.saveData();
    console.log('🗑️ 已清空所有抽奖结果');
  }

  // 重置所有数据到默认值
  resetAllData(): void {
    this.data = { ...this.defaultData };
    this.saveData();
    console.log('🔄 所有数据已重置为默认值');
  }

  // 获取完整数据（用于备份）
  getAllData(): DataStoreState {
    return { ...this.data };
  }
}

// 单例模式
export const dataStore = new DataStore();
