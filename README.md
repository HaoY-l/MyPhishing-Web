
# MyPhishing-Web 项目说明文档

| 版本 | 更新日期 | 适用人群 |
| --- | --- | --- |
| **V1.0** | 2025-12-18 | 后端开发、运维人员、安全人员 |
MyPhishing-Web 用户手册：[MyPhishing-Web 用户手册](https://www.yuque.com/weare/qqlqbo/lvufgnruaox87vh3?singleDoc#)
---

## 一、 项目概述

### 1.1 核心定位

MyPhishing-Web是AI 钓鱼邮件检测网关的前端可视化平台，支持钓鱼邮件检测结果展示、威胁情报查询、告警配置、数据统计等功能，为安全运营人员提供直观的操作界面。

**MyPhishing**（后端网关）是一款 **AI 钓鱼邮件检测网关**，通过集成多源威胁情报（如 VirusTotal、微步在线）、沙箱技术以及 AI 算法，实现对邮件来源 IP、域名、URL、附件及内容关键字的深度识别、告警与拦截，并支持通过本地知识库持续学习进化。   
![实现逻辑](picture/架构图.png)

### 1.2 技术栈

* **构建工具：** Vite（轻量快速的前端构建工具）
* **UI 框架：** Tailwind CSS（原子化 CSS 框架）
* **开发语言：** Vue 3 + TypeScript
* **依赖管理：** npm

### 1.3 项目结构

```text
MyPhishing-Web/         # 前端项目主目录
│── .vscode/             # VS Code 配置目录
│── node_modules/        # npm 依赖包目录
│── public/              # 静态资源目录（如图片、字体等）
│── src/                 # 前端核心代码目录（组件、逻辑、样式等）
│── .env                 # 前端环境变量配置文件
│── .gitignore           # Git 忽略文件配置
│── docker-compose.yml   # Docker 编排配置文件
│── Dockerfile           # Docker 构建配置文件
│── index.html           # 前端入口 HTML 文件
│── package-lock.json    # npm 依赖版本锁定文件
│── package.json         # npm 项目配置（依赖、脚本等）
│── postcss.config.js    # PostCSS 配置文件
│── README.md            # 前端项目说明文档
│── tailwind.config.js   # Tailwind CSS 配置文件
│── vite.config.js       # Vite 构建/开发配置文件
├── .gitignore               # 根目录 Git 忽略文件
├── LICENSE                  # 项目开源协议文件
└── README.md                # 项目根目录说明文档

```

---

## 二、 部署与启动

### 2.1 环境准备

* **Node.js：** 16.0+（验证：`node -v`）
* **npm：** 8.0+（验证：`npm -v`）
* **后端服务：** 需确保后端 API 已部署并可正常访问。

### 2.2 配置修改（关键步奏）

修改 `myphishing-web/.env` 文件，配置后端接口地址（必须与实际后端地址保持一致）：

```env
# 前端环境变量
VITE_API_BASE_URL=http://你的后端服务地址:后端端口

# 示例：
# VITE_API_BASE_URL=http://127.0.0.1:8000

```

### 2.3 部署方式

#### 方式 1：本地开发环境启动（调试用）

```bash
# 进入前端项目目录
cd MyPhishing-Web

# 安装依赖
npm install

# 启动开发服务（支持热更新）
npm run dev

```

> 启动成功后，通过浏览器访问终端输出的地址（如 `http://127.0.0.1:3000`）。

#### 方式 2：Docker 一键部署（推荐生产环境）

通过 Docker Compose 实现前后端联动部署：

```bash
# 进入项目目录
cd MyPhishing-Web

# 构建并启动容器
docker-compose up -d --build

```

> 部署完成后，通过 `http://服务器IP:3000` 访问。

---

## 三、 前端核心功能说明

### 3.1 数据面板
![数据面板](picture/数据面板.png)
* **实时监控：** 支持手动/自动刷新，可自定义筛选时间范围。
* **处理趋势：** 动态展示邮件总数、正常、钓鱼、可疑以及人工处理邮件的趋势图表。
* **告警统计：** 统计拦截与告警的频率趋势。
* **最近检测：** 展示最近 20 封邮件的详细记录，包含：
* 邮件 ID（唯一键）、发件人/收件人、主题、检测结果、**AI 分析内容**、处理状态。



### 3.2 邮件管理
![邮件管理](picture/邮件管理.png)
* **多维统计：** 饼图展示各类邮件（钓鱼、正常、可疑）的占比。
* **趋势分析：** 分析最近 30 天的邮件累积总量及每日新增变化。
* **风险溯源：** 提供 **TOP 风险接收人** 和 **TOP 风险发件人** 排名，定位受攻击高危人群及攻击源。
* **记录列表：** 支持全量数据查询与多条件筛选过滤。

### 3.3 AI 分析
![AI分析](picture/AI分析.png)
* **AI 分析：** 展示邮件内容的 AI 分析结果，包括：
* 邮件来源 IP、域名、URL、附件及内容关键字的识别结果。
* 威胁情报查询：支持查询邮件来源 IP、域名、URL 等信息的威胁情报。
* 告警配置：支持配置告警规则，当检测到钓鱼邮件时触发告警。

### 3.4 其他功能
🛠 待开发...
