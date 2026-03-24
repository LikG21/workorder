你是资深前端工程师，请用 **Vue3 + Vite + Ant Design Vue + ECharts + Less**，完整实现「工单管理与图表展示页面」项目，满足以下所有需求：

## 一、项目功能要求

1. 登录页（模拟权限）

- 表单：用户名、密码（任意值可提交）
- 权限规则：用户名为 admin → 管理员；其他 → 普通用户
- 登录成功跳转到主页

2. 工单列表页

- 字段：ID、Project、Overtime、Hours、Created At
- 使用提供的 5 条 mock 数据初始化
- 仅管理员显示 Delete 删除按钮
- 删除行后，图表必须同步更新

3. ECharts 柱状图

- 标题：Project Hours Distribution
- 按项目名称统计累计工时
- 表格数据变化后图表自动重绘

4. 权限控制

- 管理员：可查看、删除、看图表
- 普通用户：只能查看列表和图表，无删除按钮

## 二、技术栈规范

- 框架：Vue 3 + 组合式 API
- 构建：Vite
- UI：Ant Design Vue
- 图表：ECharts
- 样式：Less
- 路由：vue-router 4
- 状态：简单响应式即可（不用 Pinia）

## 三、模拟数据（直接使用）

[
{
"id": "001",
"project": "Road Project A",
"overtime": true,
"hours": 3.5,
"created_at": "2024-04-10 10:30"
},
{
"id": "002",
"project": "Bridge Maintenance B",
"overtime": false,
"hours": 2,
"created_at": "2024-04-09 13:00"
},
{
"id": "003",
"project": "Pipeline Fix C",
"overtime": true,
"hours": 4.5,
"created_at": "2024-04-08 08:00"
},
{
"id": "004",
"project": "Bridge Maintenance B",
"overtime": true,
"hours": 3,
"created_at": "2024-04-07 16:45"
},
{
"id": "005",
"project": "Tunnel Cleaning D",
"overtime": false,
"hours": 8.1,
"created_at": "2024-04-03 11:43"
}
]

## 四、代码输出要求

1. 给出**完整可直接运行**的项目结构与所有文件代码
2. 包括：vite 配置、main.js、路由、App.vue、Login.vue、Home.vue、图表组件、样式
3. 所有代码**可直接复制到 VS Code 运行**
4. 表格删除 → 图表联动必须实现
5. 权限控制逻辑正确
6. 代码清晰、注释完整、符合规范
7. 不要省略任何文件，确保项目能正常启动
