// 用户管理系统
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

interface User {
  username: string;
  passwordHash: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersData {
  [username: string]: User;
}

class UserManager {
  private usersFilePath: string;

  constructor() {
    // 用户数据文件存储在项目根目录的data文件夹中
    const dataDir = path.join(process.cwd(), 'data');
    this.usersFilePath = path.join(dataDir, 'users.json');

    // 确保data目录存在
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 如果用户文件不存在，创建默认用户
    if (!fs.existsSync(this.usersFilePath)) {
      this.initializeDefaultUsers();
    }
  }

  // 初始化默认用户
  private initializeDefaultUsers(): void {
    const defaultUsers: UsersData = {
      admin: {
        username: 'admin',
        passwordHash: '$2a$10$wk0XSi7rOwEqDM1fQCNnxu96nXtwlKAsIa9SzWQtmH9ccZaIg4a5m', // admin123
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    this.saveUsers(defaultUsers);
    console.log('✅ 默认用户已创建');
  }

  // 从文件加载用户数据
  private loadUsers(): UsersData {
    try {
      if (fs.existsSync(this.usersFilePath)) {
        const fileContent = fs.readFileSync(this.usersFilePath, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('❌ 加载用户数据失败:', error);
    }
    return {};
  }

  // 保存用户数据到文件
  private saveUsers(users: UsersData): void {
    try {
      fs.writeFileSync(
        this.usersFilePath,
        JSON.stringify(users, null, 2),
        'utf-8'
      );
      console.log('💾 用户数据已保存');
    } catch (error) {
      console.error('❌ 保存用户数据失败:', error);
      throw error;
    }
  }

  // 获取用户
  getUser(username: string): User | null {
    const users = this.loadUsers();
    return users[username] || null;
  }

  // 验证用户密码
  async verifyPassword(username: string, password: string): Promise<boolean> {
    const user = this.getUser(username);
    if (!user) {
      return false;
    }
    return bcrypt.compare(password, user.passwordHash);
  }

  // 更新用户密码
  async updatePassword(username: string, newPassword: string): Promise<boolean> {
    try {
      const users = this.loadUsers();
      const user = users[username];
      
      if (!user) {
        console.error('❌ 用户不存在:', username);
        return false;
      }

      // 生成新的密码哈希
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      
      // 更新用户信息
      user.passwordHash = newPasswordHash;
      user.updatedAt = new Date().toISOString();
      
      // 保存到文件
      this.saveUsers(users);
      
      console.log('✅ 用户密码已更新:', username);
      return true;
    } catch (error) {
      console.error('❌ 更新密码失败:', error);
      return false;
    }
  }

  // 创建新用户
  async createUser(username: string, password: string, role: string = 'user'): Promise<boolean> {
    try {
      const users = this.loadUsers();
      
      if (users[username]) {
        console.error('❌ 用户已存在:', username);
        return false;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const now = new Date().toISOString();
      
      users[username] = {
        username,
        passwordHash,
        role,
        createdAt: now,
        updatedAt: now
      };
      
      this.saveUsers(users);
      console.log('✅ 用户已创建:', username);
      return true;
    } catch (error) {
      console.error('❌ 创建用户失败:', error);
      return false;
    }
  }

  // 删除用户
  deleteUser(username: string): boolean {
    try {
      const users = this.loadUsers();
      
      if (!users[username]) {
        console.error('❌ 用户不存在:', username);
        return false;
      }

      delete users[username];
      this.saveUsers(users);
      
      console.log('✅ 用户已删除:', username);
      return true;
    } catch (error) {
      console.error('❌ 删除用户失败:', error);
      return false;
    }
  }

  // 获取所有用户（不包含密码哈希）
  getAllUsers(): Omit<User, 'passwordHash'>[] {
    const users = this.loadUsers();
    return Object.values(users).map(({ passwordHash, ...user }) => user);
  }
}

// 导出单例实例
export const userManager = new UserManager();