<!-- src/views/Settings.vue -->
<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">系统设置</h1>
        <p class="text-slate-400 mt-1">配置平台的基础参数和功能选项</p>
      </div>
    </div>

    <!-- 设置卡片容器 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 1. 基础配置 -->
      <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings class="w-5 h-5 text-amber-400" />
          基础配置
        </h2>
        
        <div class="space-y-4">
          <!-- 平台名称 -->
          <div>
            <label class="text-sm text-slate-400 block mb-1">平台显示名称</label>
            <input 
              v-model="platformName" 
              type="text" 
              class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="邮件安全检测平台"
            />
          </div>
          
          <!-- 语言设置 -->
          <div>
            <label class="text-sm text-slate-400 block mb-1">界面语言</label>
            <select 
              v-model="language" 
              class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
          
          <!-- 主题设置 -->
          <div>
            <label class="text-sm text-slate-400 block mb-1">界面主题</label>
            <div class="flex gap-3 mt-2">
              <button 
                @click="theme = 'dark'"
                :class="[
                  'flex-1 py-2 rounded-lg border',
                  theme === 'dark' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 hover:border-slate-600'
                ]"
              >
                <span class="text-sm">深色模式</span>
              </button>
              <button 
                @click="theme = 'light'"
                :class="[
                  'flex-1 py-2 rounded-lg border',
                  theme === 'light' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 hover:border-slate-600'
                ]"
              >
                <span class="text-sm">浅色模式</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. API配置 -->
      <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <Code class="w-5 h-5 text-amber-400" />
          API配置
        </h2>
        
        <div class="space-y-4">
          <!-- DeepSeek API Key -->
          <div>
            <label class="text-sm text-slate-400 block mb-1">DeepSeek API Key</label>
            <input 
              v-model="deepseekApiKey" 
              type="password" 
              class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>
          
          <!-- API请求超时 -->
          <div>
            <label class="text-sm text-slate-400 block mb-1">API请求超时（秒）</label>
            <input 
              v-model="apiTimeout" 
              type="number" 
              min="5" 
              max="60"
              class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <!-- 3. 保存按钮 -->
      <div class="lg:col-span-2 flex justify-end">
        <button 
          @click="saveSettings"
          class="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          保存设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Settings, Code } from 'lucide-vue-next'

// 响应式数据 - 模拟配置项
const platformName = ref('邮件安全检测平台')
const language = ref('zh-CN')
const theme = ref('dark')
const deepseekApiKey = ref('')
const apiTimeout = ref(30)

// 页面加载时获取已有配置（模拟）
onMounted(() => {
  // 实际项目中可以从后端接口/本地存储读取配置
  // 示例：deepseekApiKey.value = localStorage.getItem('deepseekApiKey') || ''
})

// 保存设置
const saveSettings = () => {
  // 1. 构建配置数据
  const settingsData = {
    platformName: platformName.value,
    language: language.value,
    theme: theme.value,
    deepseekApiKey: deepseekApiKey.value,
    apiTimeout: apiTimeout.value
  }
  
  // 2. 模拟保存（实际项目中调用后端接口）
  console.log('保存系统设置:', settingsData)
  
  // 3. 提示保存成功
  alert('设置已保存！')
  
  // 4. 可选：本地存储备份
  // localStorage.setItem('systemSettings', JSON.stringify(settingsData))
}
</script>

<style scoped>
/* 自定义样式（如需） */
</style>