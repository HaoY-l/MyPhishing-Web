<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold">系统配置管理</h1>
      <p class="text-slate-400 mt-1">控制可疑/恶意邮件的拦截和告警功能开关（数据来自后端配置）</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-10">
      <Loader2 class="w-8 h-8 animate-spin text-amber-400" />
      <span class="ml-3 text-slate-300">加载后端配置中...</span>
    </div>

    <!-- 配置加载失败 -->
    <div v-else-if="loadError" class="bg-red-900/20 border border-red-800/50 rounded-2xl p-6">
      <div class="flex items-center gap-2 text-red-400">
        <AlertCircle class="w-5 h-5" />
        <span class="font-medium">配置加载失败</span>
      </div>
      <p class="mt-2 text-sm text-slate-400">{{ loadError }}</p>
      <button 
        @click="fetchConfig" 
        class="mt-3 text-amber-400 text-sm hover:underline"
      >
        重试加载
      </button>
    </div>

    <!-- 配置开关卡片 -->
    <div v-else class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
      <!-- 可疑邮件配置分组 -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-6 flex items-center gap-2">
          <Settings class="w-5 h-5 text-amber-400" />
          可疑邮件（通道1）配置
        </h2>
        <div class="space-y-6 pl-4 border-l-2 border-slate-700">
          <!-- 可疑邮件拦截开关 -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">可疑邮件拦截开关</h3>
              <p class="text-sm text-slate-400 mt-1">
                {{ config.EMAIL_INTERCEPT_ENABLED_1 ? '✅ 开启：自动拦截检测到的可疑邮件' : '❌ 关闭：允许可疑邮件通过' }}
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="config.EMAIL_INTERCEPT_ENABLED_1"
                class="sr-only peer"
                :disabled="saveLoading"
              />
              <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          <!-- 可疑邮件告警开关 -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">可疑邮件告警开关</h3>
              <p class="text-sm text-slate-400 mt-1">
                {{ config.EMAIL_ALERT_ENABLED_1 ? '✅ 开启：检测到可疑邮件时触发告警通知' : '❌ 关闭：可疑邮件不触发告警' }}
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="config.EMAIL_ALERT_ENABLED_1"
                class="sr-only peer"
                :disabled="saveLoading"
              />
              <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 恶意邮件配置分组 -->
      <div>
        <h2 class="text-lg font-semibold mb-6 flex items-center gap-2">
          <Settings class="w-5 h-5 text-amber-400" />
          恶意邮件（通道2）配置
        </h2>
        <div class="space-y-6 pl-4 border-l-2 border-slate-700">
          <!-- 恶意邮件拦截开关 -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">恶意邮件拦截开关</h3>
              <p class="text-sm text-slate-400 mt-1">
                {{ config.EMAIL_INTERCEPT_ENABLED_2 ? '✅ 开启：自动拦截检测到的恶意邮件' : '❌ 关闭：允许恶意邮件通过' }}
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="config.EMAIL_INTERCEPT_ENABLED_2"
                class="sr-only peer"
                :disabled="saveLoading"
              />
              <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          <!-- 恶意邮件告警开关 -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">恶意邮件告警开关</h3>
              <p class="text-sm text-slate-400 mt-1">
                {{ config.EMAIL_ALERT_ENABLED_2 ? '✅ 开启：检测到恶意邮件时触发告警通知' : '❌ 关闭：恶意邮件不触发告警' }}
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="config.EMAIL_ALERT_ENABLED_2"
                class="sr-only peer"
                :disabled="saveLoading"
              />
              <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="mt-8 flex justify-end gap-4">
        <button
          @click="resetConfig"
          :disabled="saveLoading"
          class="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          恢复默认配置（全部开启）
        </button>
        <button
          @click="saveConfig"
          :disabled="saveLoading"
          class="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="saveLoading" class="flex items-center gap-2">
            <Loader2 class="w-4 h-4 animate-spin" />
            提交修改中...
          </span>
          <span v-else>保存配置到后端</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Settings, Loader2, AlertCircle } from 'lucide-vue-next'
import { settingApi } from '@/api'

// 响应式数据
const config = ref({})          
const loading = ref(true)       
const saveLoading = ref(false)  
const loadError = ref('')       

onMounted(() => {
  fetchConfig()
})

/**
 * 从后端获取配置（适配code格式）
 */
const fetchConfig = async () => {
  try {
    loading.value = true
    loadError.value = ''
    
    // request.js已处理code判断，直接获取配置数据
    const configData = await settingApi.getConfig()
    config.value = configData
    
  } catch (error) {
    console.error('加载后端配置失败:', error)
    loadError.value = error.message || '无法连接到后端配置服务'
  } finally {
    loading.value = false
  }
}

/**
 * 提交修改后的配置到后端
 */
const saveConfig = async () => {
  try {
    saveLoading.value = true
    
    await settingApi.saveConfig(config.value)
    await fetchConfig()
    alert('配置保存成功！所有开关状态已同步到后端。')
    
  } catch (error) {
    console.error('提交配置失败:', error)
    alert(`保存失败：${error.message}`)
  } finally {
    saveLoading.value = false
  }
}

/**
 * 恢复默认配置（全部开启）
 */
const resetConfig = async () => {
  if (!confirm('确定要恢复默认配置吗？这会将所有开关恢复为开启状态！')) {
    return
  }
  
  try {
    saveLoading.value = true
    
    await settingApi.resetConfig()
    await fetchConfig()
    alert('默认配置恢复成功！所有邮件拦截/告警开关已开启。')
    
  } catch (error) {
    console.error('恢复默认配置失败:', error)
    alert(`恢复失败：${error.message}`)
  } finally {
    saveLoading.value = false
  }
}
</script>

<style scoped>
/* 开关样式 */
.peer-checked {
  --tw-bg-opacity: 1;
  background-color: rgb(217 119 6 / var(--tw-bg-opacity)) !important;
}
.peer-focus {
  --tw-ring-color: rgb(217 119 6 / 0.5) !important;
}

/* 按钮禁用样式 */
button:disabled {
  cursor: not-allowed !important;
  opacity: 0.7 !important;
}

/* 分组边框样式优化 */
.border-l-2 {
  border-left-width: 2px;
}
</style>