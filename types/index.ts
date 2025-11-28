// 类型定义

export interface Program {
  id: string;
  title: string;
  performer: string; // 表演者，可以为空字符串
  order: number;
  completed: boolean;
  info?: string; // 节目详情，支持 Markdown 格式
  parentId?: string; // 父节目ID，如果为空则是主节目
  subOrder?: number; // 子节目排序（在同一个父节目下的顺序）
}

export interface Danmaku {
  id: string;
  content: string;
  timestamp: number;
  censor: boolean; // 审核状态，true 表示已审核通过
  censoredAt?: number; // 审核通过的时间戳
}

export interface LotteryConfig {
  minNumber: number;
  maxNumber: number;
  count: number;
  title?: string; // 奖项名称，如"一等奖"、"二等奖"
}

export interface LotteryResult {
  id: string;
  title: string; // 奖项名称，如"一等奖"、"二等奖"
  numbers: number[];
  timestamp: number;
}
