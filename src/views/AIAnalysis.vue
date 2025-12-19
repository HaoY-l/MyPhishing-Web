<!-- ==================== src/views/AIAnalysis.vue ==================== -->
<template>
  <div class="space-y-6">
    <!-- 核心模块容器 -->
    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
      <div class="text-center">
        <Brain class="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h2 class="text-2xl font-bold mb-2">AI 分析模块</h2>
        <p class="text-slate-400 mb-6">基于 DeepSeek 的钓鱼邮件智能分析</p>
        
        <!-- 1. 基础交互：输入区 -->
        <div class="mt-8 text-left space-y-4">
          <div class="p-4 bg-slate-800/30 rounded-xl">
            <h3 class="font-semibold mb-3 flex items-center gap-2">
              <Search class="w-5 h-5 text-cyan-400" />
              输入分析目标
            </h3>
            <div class="flex flex-col gap-3">
              <!-- 邮件ID输入框 -->
              <div>
                <label class="text-xs text-slate-400 mb-1 block">邮件ID</label>
                <input 
                  v-model="emailId" 
                  type="text" 
                  class="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="例如：eb9fbcfd-ccea-4797-b65c-616720848c1c"
                  value="eb9fbcfd-ccea-4797-b65c-616720848c1c"
                />
              </div>
              <!-- 邮件文本输入框 -->
              <div>
                <label class="text-xs text-slate-400 mb-1 block">或 邮件文本内容</label>
                <textarea 
                  v-model="emailText" 
                  class="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm h-24 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                  placeholder="粘贴完整邮件内容，支持纯文本/HTML"
                ></textarea>
              </div>
              <!-- 分析按钮 -->
              <button 
                @click="submitAnalysis"
                class="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg text-sm font-medium transition disabled:bg-slate-700 disabled:cursor-not-allowed"
                :disabled="loading || (!emailId && !emailText)"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <Loader2 class="w-4 h-4 animate-spin inline mr-2" />
                  分析中...
                </span>
                <span v-else>开始AI智能分析</span>
              </button>
            </div>
          </div>
          
          <!-- 2. AI钓鱼分析说明 -->
          <div class="p-4 bg-slate-800/30 rounded-xl">
            <h3 class="font-semibold mb-2 flex items-center gap-2">
              <Sparkles class="w-5 h-5 text-yellow-400" />
              AI 钓鱼分析
            </h3>
            <p class="text-sm text-slate-400">POST /api/web/aidata</p>
            <p class="text-xs text-slate-500 mt-2">综合分析邮件内容、发件人信誉和威胁情报</p>
          </div>
          
          <!-- 3. 分析维度（带实时状态） -->
          <div class="p-4 bg-slate-800/30 rounded-xl">
            <h3 class="font-semibold mb-2">📊 分析维度（实时状态）</h3>
            <div class="grid grid-cols-2 gap-3 mt-3">
              <div class="text-sm flex items-center gap-2">
                <span class="text-slate-400">• 邮件内容分析</span>
                <Check v-if="analysisStatus.content" class="w-3 h-3 text-green-400" />
                <Loader2 v-else-if="loading" class="w-3 h-3 animate-spin text-slate-500" />
              </div>
              <div class="text-sm flex items-center gap-2">
                <span class="text-slate-400">• 发件人信誉</span>
                <Check v-if="analysisStatus.sender" class="w-3 h-3 text-green-400" />
                <Loader2 v-else-if="loading" class="w-3 h-3 animate-spin text-slate-500" />
              </div>
              <div class="text-sm flex items-center gap-2">
                <span class="text-slate-400">• URL/附件检测</span>
                <Check v-if="analysisStatus.url" class="w-3 h-3 text-green-400" />
                <Loader2 v-else-if="loading" class="w-3 h-3 animate-spin text-slate-500" />
              </div>
              <div class="text-sm flex items-center gap-2">
                <span class="text-slate-400">• 威胁情报匹配</span>
                <Check v-if="analysisStatus.threat" class="w-3 h-3 text-green-400" />
                <Loader2 v-else-if="loading" class="w-3 h-3 animate-spin text-slate-500" />
              </div>
              <div class="text-sm flex items-center gap-2">
                <span class="text-slate-400">• 钓鱼特征识别</span>
                <Check v-if="analysisStatus.feature" class="w-3 h-3 text-green-400" />
                <Loader2 v-else-if="loading" class="w-3 h-3 animate-spin text-slate-500" />
              </div>
              <div class="text-sm flex items-center gap-2">
                <span class="text-slate-400">• 风险等级评估</span>
                <Check v-if="analysisStatus.risk" class="w-3 h-3 text-green-400" />
                <Loader2 v-else-if="loading" class="w-3 h-3 animate-spin text-slate-500" />
              </div>
            </div>
          </div>
          
          <!-- 4. 输出结果（分析后显示） -->
          <div v-if="analysisResult" class="p-4 bg-slate-800/30 rounded-xl mt-4">
            <h3 class="font-semibold mb-3 flex items-center gap-2">
              <ShieldAlert class="w-5 h-5 text-red-400" />
              AI分析结果
            </h3>
            
            <!-- 风险等级 + 置信度 + 钓鱼类型 -->
            <div class="flex flex-wrap gap-4 mb-4">
              <div class="flex-1 min-w-[150px] p-3 bg-slate-700/50 rounded-lg">
                <p class="text-xs text-slate-400">风险等级</p>
                <p class="text-xl font-bold" :class="getRiskClass(analysisResult.riskLevel)">
                  {{ getRiskText(analysisResult.riskLevel) }}
                </p>
              </div>
              <div class="flex-1 min-w-[150px] p-3 bg-slate-700/50 rounded-lg">
                <p class="text-xs text-slate-400">置信度评分</p>
                <p class="text-xl font-bold text-yellow-400">
                  {{ analysisResult.confidence ? (analysisResult.confidence * 100).toFixed(1) : '0.0' }}%
                </p>
              </div>
              <div class="flex-1 min-w-[150px] p-3 bg-slate-700/50 rounded-lg">
                <p class="text-xs text-slate-400">钓鱼类型</p>
                <p class="text-xl font-bold text-purple-400">
                  {{ analysisResult.phishType || "未识别" }}
                </p>
              </div>
            </div>
            
            <!-- 详细分析理由 -->
            <div class="mt-3">
              <p class="text-xs text-slate-400 mb-2">详细分析理由</p>
              <div class="bg-slate-700/30 rounded-lg p-3 text-sm text-slate-300 whitespace-pre-line">
                {{ analysisResult.reason || "暂无分析结果" }}
              </div>
            </div>
          </div>
          
          <!-- 5. 异常提示 -->
          <div v-if="errorMsg" class="p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-400 text-sm">
            <p class="flex items-center gap-2">
              <AlertCircle class="w-4 h-4" />
              {{ errorMsg }}
            </p>
          </div>
          
          <!-- 6. 空结果提示 -->
          <div v-if="showEmptyTip" class="p-4 bg-slate-800/20 rounded-xl text-slate-400 text-sm">
            <p class="flex items-center gap-2">
              <Info class="w-4 h-4" />
              暂无AI分析结果，请检查输入的邮件ID/文本是否有效
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { 
  Brain, Sparkles, Search, Loader2, ShieldAlert, Check, AlertCircle, Info
} from 'lucide-vue-next'
import { aiApi } from '@/api/index'

// ==================== 响应式数据 ====================
const emailId = ref('eb9fbcfd-ccea-4797-b65c-616720848c1c')
const emailText = ref('')
const loading = ref(false)
const errorMsg = ref('')
const showEmptyTip = ref(false)
const analysisResult = ref(null)
const analysisStatus = ref({
  content: false,
  sender: false,
  url: false,
  threat: false,
  feature: false,
  risk: false
})

// ==================== 工具函数 ====================
const getRiskText = (level) => {
  if (level === undefined || level === null) return '未知';
  switch(level) {
    case 0: return '安全';
    case 1: return '可疑';
    case 2: return '恶意';
    default: return '未知';
  }
}

const getRiskClass = (level) => {
  if (level === undefined || level === null) return 'text-slate-400';
  switch(level) {
    case 0: return 'text-green-400';
    case 1: return 'text-yellow-400';
    case 2: return 'text-red-400';
    default: return 'text-slate-400';
  }
}

const resetState = () => {
  analysisResult.value = null
  errorMsg.value = ''
  showEmptyTip.value = false
  analysisStatus.value = {
    content: false,
    sender: false,
    url: false,
    threat: false,
    feature: false,
    risk: false
  }
}

// ==================== 核心方法 ====================
const submitAnalysis = async () => {
  resetState()
  loading.value = true
  
  try {
    const requestData = {
      email_id: emailId.value.trim(),
      email_text: emailText.value.trim()
    }

    // 直接调用接口，不依赖request封装的额外处理
    const response = await fetch('/api/web/aidata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    })

    const result = await response.json()
    console.log('后端原始返回数据:', result) // 调试用，可删除

    // 匹配后端实际返回格式（code=200且success=true）
    if (result.code === 200 && result.success) {
      if (result.data) {
        analysisResult.value = result.data
        // 模拟分析进度
        setTimeout(() => { analysisStatus.value.content = true }, 300)
        setTimeout(() => { analysisStatus.value.sender = true }, 600)
        setTimeout(() => { analysisStatus.value.url = true }, 900)
        setTimeout(() => { analysisStatus.value.threat = true }, 1200)
        setTimeout(() => { analysisStatus.value.feature = true }, 1500)
        setTimeout(() => { analysisStatus.value.risk = true }, 1800)
      } else {
        showEmptyTip.value = true
      }
    } else {
      errorMsg.value = result.message || '分析失败，请稍后重试'
    }
  } catch (error) {
    errorMsg.value = `分析失败：${error.message || '服务器连接异常'}`
    console.error('调用失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听输入变化
watch([emailId, emailText], () => {
  errorMsg.value = ''
  showEmptyTip.value = false
})
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(100, 116, 139, 0.1);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.3);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.5);
}
</style>