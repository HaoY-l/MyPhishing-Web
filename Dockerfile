# 构建阶段：编译前端代码
FROM node:18-alpine AS build
WORKDIR /app

# 复制前端依赖文件
COPY package.json package-lock.json ./
# 国内源加速（可选）
RUN npm install --registry=https://registry.npmmirror.com

# 复制前端源码并构建
COPY . .
RUN npm run build

# 运行阶段：用Node.js静态服务启动
FROM node:18-alpine
WORKDIR /app

# 安装静态服务包（支持Vue路由history模式）
RUN npm install -g serve

# 从构建阶段复制dist文件夹
COPY --from=build /app/dist /app/dist

# 暴露端口
EXPOSE 3000

# 启动前端（-s支持history路由）
CMD ["serve", "-s", "dist", "-l", "3000"]