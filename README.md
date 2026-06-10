# 校园安全管理系统 - 启动说明

## 项目结构

```
campus-guard/
├── src/              # Vue前端源码
├── server/           # Express后端源码
│   ├── config/       # 数据库配置
│   ├── routes/       # 路由（已集成到index.js）
│   ├── models/       # 数据模型
│   ├── config/       # 配置文件
│   ├── db.sql        # 数据库表结构
│   ├── package.json  # 后端依赖
│   └── index.js      # 后端入口
├── dist/             # 前端构建产物
└── package.json      # 前端依赖
```

## 环境要求

- Node.js >= 14
- MySQL >= 5.7
- MySQL用户名: root
- MySQL密码: root (可在 server/config/db.js 中修改)

## 启动步骤

### 1. 初始化数据库

首先在MySQL中执行数据库初始化脚本：

```bash
mysql -u root -p < server/db.sql
```

或者在MySQL客户端中执行 `server/db.sql` 文件的内容。

### 2. 启动后端服务

```bash
cd server
npm install
npm start
```

后端服务将运行在 http://localhost:3000

### 3. 启动前端服务

在新的终端窗口中：

```bash
npm install
npm run dev
```

前端服务将运行在 http://localhost:5173

## 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | admin | admin123 |
| 学生 | 张三 / 李四 / 王五 | 123456 |
| 教师 | 张教授 / 李教授 / 王老师 | 123456 |

## 权限说明

- **学生**: 只能查看数据看板，无法进行任何操作
- **教师**: 可以查看数据看板、通行记录、访客列表、视频监控，可以导出数据、查看详情、签离访客
- **管理员**: 拥有所有权限，可以管理所有模块

## API接口列表

### 登录接口
- POST /api/login - 用户登录

### 门禁管理
- GET /api/access/points - 获取门禁点列表
- POST /api/access/points - 添加门禁点
- PUT /api/access/points/:id - 更新门禁点
- DELETE /api/access/points/:id - 删除门禁点
- GET /api/access/records - 获取通行记录列表
- POST /api/access/records - 添加通行记录
- DELETE /api/access/records/:id - 删除通行记录

### 访客管理
- GET /api/visitors - 获取访客列表
- POST /api/visitors - 添加访客
- PUT /api/visitors/:id - 更新访客
- PUT /api/visitors/:id/checkout - 访客签离
- DELETE /api/visitors/:id - 删除访客

### 监控管理
- GET /api/cameras - 获取监控点列表
- POST /api/cameras - 添加监控点
- PUT /api/cameras/:id - 更新监控点
- DELETE /api/cameras/:id - 删除监控点

### 院系管理
- GET /api/departments - 获取院系列表
- POST /api/departments - 添加院系
- PUT /api/departments/:id - 更新院系
- DELETE /api/departments/:id - 删除院系

### 班级管理
- GET /api/classes - 获取班级列表
- POST /api/classes - 添加班级
- PUT /api/classes/:id - 更新班级
- DELETE /api/classes/:id - 删除班级

### 宿舍管理
- GET /api/dormitories - 获取宿舍列表
- POST /api/dormitories - 添加宿舍
- PUT /api/dormitories/:id - 更新宿舍
- DELETE /api/dormitories/:id - 删除宿舍

### 人员管理
- GET /api/personnel - 获取人员列表
- POST /api/personnel - 添加人员
- PUT /api/personnel/:id - 更新人员
- DELETE /api/personnel/:id - 删除人员

### 统计分析
- GET /api/stats/dashboard - 获取仪表盘统计数据
- GET /api/stats/recent-records - 获取最近通行记录
- GET /api/stats/access-trend - 获取访问趋势

## 技术栈

### 前端
- Vue 3
- Vite
- Pinia
- Vue Router
- Element Plus
- Axios
- ECharts

### 后端
- Express
- MySQL
- CORS
- Body Parser

## 功能特性

1. **角色权限控制**
   - 三种角色：管理员、教师、学生
   - 精细化的操作权限控制
   - 动态菜单渲染

2. **实时数据同步**
   - 前端操作实时同步到后端数据库
   - CRUD完整功能实现
   - 数据验证和错误处理

3. **响应式设计**
   - 支持桌面端和移动端
   - 自适应布局

4. **数据可视化**
   - 通行趋势图
   - 告警分布饼图
   - 实时统计卡片
