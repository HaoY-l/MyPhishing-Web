<template>
  <div class="space-y-6">
    <!-- 向量库统计信息 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="group bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-green-500/30 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm font-medium mb-2">向量总数</p>
            <p class="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {{ formatNumber(stats.total_vectors) }}
            </p>
          </div>
          <div class="p-4 bg-green-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
            <Database class="w-10 h-10 text-green-400" />
          </div>
        </div>
      </div>

      <div class="group bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-yellow-500/30 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm font-medium mb-2">向量维度</p>
            <p class="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {{ formatNumber(stats.vector_dimension) }}
            </p>
          </div>
          <div class="p-4 bg-yellow-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
            <Zap class="w-10 h-10 text-yellow-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- 相似邮件检索 -->
    <div class="bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
      <div class="flex items-center gap-3 mb-8">
        <div class="p-3 bg-purple-500/10 rounded-xl">
          <Search class="w-7 h-7 text-purple-400" />
        </div>
        <h2 class="text-2xl font-bold">相似邮件检索</h2>
      </div>

      <div class="space-y-6">
        <!-- 检索方式选择 -->
        <div class="inline-flex p-1 bg-slate-800/50 rounded-xl">
          <button
            @click="searchMode = 'email_id'"
            :class="[
              'px-6 py-2.5 rounded-lg font-medium transition-all duration-200',
              searchMode === 'email_id'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white'
            ]"
          >
            按邮件ID检索
          </button>
          <button
            @click="searchMode = 'text'"
            :class="[
              'px-6 py-2.5 rounded-lg font-medium transition-all duration-200',
              searchMode === 'text'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white'
            ]"
          >
            按文本内容检索
          </button>
        </div>

        <!-- 输入框 -->
        <div class="relative">
          <input
            v-if="searchMode === 'email_id'"
            v-model="searchInput"
            type="text"
            placeholder="输入邮件ID（例如：abc123-def456）"
            class="w-full px-5 py-4 bg-slate-800/30 border border-slate-700/50 rounded-xl focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/50 transition-all placeholder:text-slate-500"
            @keyup.enter="handleSearch"
          />
          <textarea
            v-else
            v-model="searchInput"
            placeholder="输入邮件内容或关键词进行检索..."
            rows="4"
            class="w-full px-5 py-4 bg-slate-800/30 border border-slate-700/50 rounded-xl focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/50 transition-all resize-none placeholder:text-slate-500"
          />
        </div>

        <!-- 相似度阈值调节 -->
        <div class="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
          <label class="text-sm font-medium text-slate-300 whitespace-nowrap">相似度阈值</label>
          <input
            v-model.number="similarityThreshold"
            type="range"
            min="0"
            max="1"
            step="0.05"
            class="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span class="text-lg font-bold font-mono text-purple-400 min-w-[3rem] text-right">
            {{ similarityThreshold.toFixed(2) }}
          </span>
        </div>

        <!-- 检索按钮 -->
        <button
          @click="handleSearch"
          :disabled="!searchInput.trim() || isSearching"
          class="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
        >
          <Search class="w-5 h-5" :class="{ 'animate-pulse': isSearching }" />
          <span>{{ isSearching ? '检索中...' : '开始检索' }}</span>
        </button>
      </div>

      <!-- 检索结果 -->
      <div v-if="searchResults.length > 0" class="mt-8 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">检索结果</h3>
          <span class="text-sm text-slate-400">共找到 <span class="text-purple-400 font-semibold">{{ searchResults.length }}</span> 条相似邮件</span>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="(result, index) in searchResults"
            :key="index"
            class="group bg-slate-800/30 border border-slate-700/30 rounded-xl p-5 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all cursor-pointer"
            @click="viewEmailDetail(result.email_id)"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-2">
                <div
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-bold',
                    result.label === 2
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : result.label === 1
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  ]"
                >
                  {{ result.label === 2 ? '🚨 恶意' : result.label === 1 ? '⚠️ 可疑' : '✅ 正常' }}
                </div>
                <div class="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-mono font-bold border border-purple-500/20">
                  相似度 {{ (result.similarity * 100).toFixed(1) }}%
                </div>
              </div>
              <span class="text-xs text-slate-500">{{ result.send_time }}</span>
            </div>

            <div class="space-y-3">
              <div class="flex items-start gap-2">
                <Mail class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <span class="text-xs text-slate-400 block mb-1">发件人</span>
                  <span class="text-sm font-medium block truncate">{{ result.sender }}</span>
                </div>
              </div>
              
              <div class="flex items-start gap-2">
                <FileText class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <span class="text-xs text-slate-400 block mb-1">主题</span>
                  <span class="text-sm font-medium block truncate">{{ result.subject }}</span>
                </div>
              </div>
              
              <div class="text-xs text-slate-500 bg-slate-900/30 rounded-lg p-3 line-clamp-2">
                {{ result.content_preview }}
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <span class="text-xs text-purple-400 group-hover:text-purple-300 flex items-center gap-1 font-medium">
                查看详情
                <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 无结果提示 -->
      <div v-else-if="hasSearched && !isSearching" class="mt-12 text-center py-16">
        <div class="inline-flex p-6 bg-slate-800/30 rounded-2xl mb-4">
          <AlertCircle class="w-16 h-16 text-slate-600" />
        </div>
        <p class="text-slate-400 text-lg">未找到相似邮件</p>
        <p class="text-slate-500 text-sm mt-2">尝试调整相似度阈值或更换检索内容</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  Database, Zap, Search,
  Mail, FileText, ChevronRight, AlertCircle
} from 'lucide-vue-next'
import { vectorApi } from '@/api'

// 统计数据
const stats = ref({
  total_vectors: null,
  vector_dimension: null
})

// 检索相关
const searchMode = ref('email_id')
const searchInput = ref('')
const similarityThreshold = ref(0.7)
const isSearching = ref(false)
const hasSearched = ref(false)
const searchResults = ref([])

// 格式化数字
const formatNumber = (num) => {
  if (num === null || num === undefined) return '-'
  return num.toLocaleString()
}

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await vectorApi.getVectorStats()
    // request.js 已经解包，直接使用 response.stats
    if (response?.stats) {
      stats.value = response.stats
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 执行检索
const handleSearch = async () => {
  if (!searchInput.value.trim()) return
  
  isSearching.value = true
  hasSearched.value = true
  searchResults.value = []
  
  try {
    const payload = searchMode.value === 'email_id'
      ? { 
          email_id: searchInput.value.trim(), 
          top_k: 10,
          threshold: similarityThreshold.value
        }
      : { 
          query_text: searchInput.value.trim(), 
          top_k: 10, 
          threshold: similarityThreshold.value 
        }
    
    const response = await vectorApi.searchSimilarEmails(payload)
    // request.js 已经解包，直接使用 response.results
    if (response?.results) {
      searchResults.value = response.results
    }
  } catch (error) {
    console.error('检索失败:', error)
    alert('检索失败，请稍后重试')
  } finally {
    isSearching.value = false
  }
}

// 查看邮件详情
const viewEmailDetail = (emailId) => {
  window.open(`/email-detail/${emailId}`, '_blank')
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}
</style>