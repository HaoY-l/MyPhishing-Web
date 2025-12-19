<template>
  <div class="space-y-6 p-6 bg-slate-950 min-h-screen">

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-if="loading" class="col-span-4 text-center py-4 text-slate-400">正在加载数据...</div>
      <template v-else>
        <div class="p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg transition duration-300 hover:border-purple-500/50">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-slate-300 font-medium">邮件总量</h4>
            <Mail class="w-6 h-6 text-blue-400" />
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.totalCount.toLocaleString() }}</p>
          <p class="text-sm text-slate-400 mt-1">所有时间累计</p>
        </div>
        <div class="p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg transition duration-300 hover:border-red-500/50">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-slate-300 font-medium">钓鱼邮件</h4>
            <AlertTriangle class="w-6 h-6 text-red-400" />
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.phishingCount.toLocaleString() }}</p>
          <p class="text-sm text-slate-400 mt-1">占比 {{ stats.totalCount > 0 ? (stats.phishingCount / stats.totalCount * 100).toFixed(1) : 0 }}%</p>
        </div>
        <div class="p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg transition duration-300 hover:border-green-500/50">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-slate-300 font-medium">正常邮件</h4>
            <CheckCircle class="w-6 h-6 text-green-400" />
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.normalCount.toLocaleString() }}</p>
          <p class="text-sm text-slate-400 mt-1">占比 {{ stats.totalCount > 0 ? (stats.normalCount / stats.totalCount * 100).toFixed(1) : 0 }}%</p>
        </div>
        <div class="p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg transition duration-300 hover:border-yellow-500/50">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-slate-300 font-medium">可疑邮件</h4>
            <HelpCircle class="w-6 h-6 text-yellow-400" />
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.suspiciousCount.toLocaleString() }}</p>
          <p class="text-sm text-slate-400 mt-1">占比 {{ stats.totalCount > 0 ? (stats.suspiciousCount / stats.totalCount * 100).toFixed(1) : 0 }}%</p>
        </div>
      </template>
    </div>

    <!-- 趋势图表 -->
    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
      <h3 class="text-xl font-semibold mb-4 text-white">邮件趋势分析 (近 30 天)</h3>
      <div class="h-80 relative">
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center text-slate-400">
          加载趋势数据...
        </div>
        <canvas ref="trendChartRef" :class="{ 'opacity-0': loading }"></canvas>
      </div>
    </div>
    
    <!-- TOP 排行 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <h3 class="text-xl font-semibold mb-4 text-white">TOP 风险收件人</h3>
        <div v-if="loading" class="text-center py-4 text-slate-400">加载中...</div>
        <div v-else class="space-y-4">
          <div v-if="topRiskRecipients.length === 0" class="text-slate-500 py-4">暂无数据</div>
          <div v-else v-for="(item, index) in topRiskRecipients" :key="index" class="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <span class="text-red-400 font-bold">{{ index + 1 }}</span>
              </div>
              <div>
                <p class="text-white font-medium">{{ item.recipient }}</p>
                <p class="text-xs text-slate-400">被钓鱼邮件攻击</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-red-400 font-bold">{{ item.count }} 封</p>
              <p class="text-xs text-slate-400">最近被攻击</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <h3 class="text-xl font-semibold mb-4 text-white">TOP 风险发件人</h3>
        <div v-if="loading" class="text-center py-4 text-slate-400">加载中...</div>
        <div v-else class="space-y-4">
          <div v-if="topRiskSenders.length === 0" class="text-slate-500 py-4">暂无数据</div>
          <div v-else v-for="(item, index) in topRiskSenders" :key="index" class="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <span class="text-red-400 font-bold">{{ index + 1 }}</span>
              </div>
              <div>
                <p class="text-white font-medium">{{ item.sender }}</p>
                <p class="text-xs text-slate-400">域名: {{ item.domain }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-red-400 font-bold">{{ item.count }} 封钓鱼邮件</p>
              <p class="text-xs text-slate-400">占比 {{ item.rate }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 邮件列表 -->
    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h3 class="text-xl font-semibold text-white">邮件记录列表</h3>
        <div class="flex gap-3 items-center">
          <select 
            v-model="filterStatus" 
            class="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            <option value="">全部状态</option>
            <option value="normal">正常邮件</option>
            <option value="phishing">钓鱼邮件</option>
            <option value="suspicious">可疑邮件</option>
          </select>
          
          <div class="relative">
            <input 
              v-model="searchKeyword" 
              type="text" 
              placeholder="搜索发件人/主题"
              @keyup.enter="handleQuery"
              class="px-3 py-2 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white w-48"
            >
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          
          <input 
            v-model.number="pageSize" 
            type="number" 
            min="1"
            max="100"
            placeholder="每页数量"
            class="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white w-28"
          >
          
          <button 
            @click="handleQuery"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            :disabled="loading"
          >
            查询
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <div v-if="loading" class="text-center py-6 text-slate-400">加载邮件列表...</div>
        <table v-else class="w-full text-left">
          <thead>
            <tr class="border-b border-slate-700">
              <th class="py-3 px-4 text-slate-400 font-medium">邮件ID</th>
              <th class="py-3 px-4 text-slate-400 font-medium">发件人</th>
              <th class="py-3 px-4 text-slate-400 font-medium">收件人</th>
              <th class="py-3 px-4 text-slate-400 font-medium">主题</th>
              <th class="py-3 px-4 text-slate-400 font-medium">状态</th>
              <th class="py-3 px-4 text-slate-400 font-medium">创建时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="emailList.length === 0" class="border-b border-slate-800">
              <td colspan="6" class="py-6 text-center text-slate-400">暂无邮件记录</td>
            </tr>
            <tr v-else v-for="email in emailList" :key="email.id" class="border-b border-slate-800 hover:bg-slate-800/30 transition-all">
              <td class="py-3 px-4 text-white text-sm truncate max-w-[80px]" :title="email.id">{{ email.id }}</td>
              <td class="py-3 px-4 text-white text-sm truncate max-w-[120px]" :title="email.sender">{{ email.sender }}</td>
              <td class="py-3 px-4 text-white text-sm truncate max-w-[120px]" :title="email.recipient">{{ email.recipient }}</td>
              <td class="py-3 px-4 text-white text-sm truncate max-w-[150px]" :title="email.subject">{{ email.subject }}</td>
              <td class="py-3 px-4">
                <span 
                  :class="[
                    email.status === 'normal' ? 'bg-green-500/20 text-green-400' : 
                    email.status === 'phishing' ? 'bg-red-500/20 text-red-400' : 
                    'bg-yellow-500/20 text-yellow-400',
                    'px-2 py-1 rounded-full text-xs'
                  ]"
                >
                  {{ email.status === 'normal' ? '正常' : email.status === 'phishing' ? '钓鱼' : '可疑' }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-300 text-sm">{{ email.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="emailList.length > 0 && !loading" class="flex justify-between items-center mt-6">
        <p class="text-slate-400 text-sm">共 {{ totalPages }} 页，当前第 {{ currentPage }} 页 (每页展示 {{ pageSize }} 条)</p>
        <div class="flex gap-2">
          <button 
            class="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1 || loading"
          >
            上一页
          </button>
          <button 
            v-for="page in pageRange" 
            :key="page"
            class="px-3 py-1 rounded transition-all"
            :class="currentPage === page ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
            @click="goToPage(page)"
            :disabled="loading"
          >
            {{ page }}
          </button>
          <button 
            class="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages || loading"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { 
  Mail, AlertTriangle, CheckCircle, HelpCircle, Search
} from 'lucide-vue-next'
import Chart from 'chart.js/auto'
import { emailApi } from '@/api/index'

// 统一的加载状态
const loading = ref(false)

// 统计数据
const stats = ref({
  totalCount: 0,
  phishingCount: 0,
  normalCount: 0,
  suspiciousCount: 0
})

// 趋势数据
const trendData = ref({
  labels: [],
  totalData: [],
  newData: []
})

// TOP 排行
const topRiskSenders = ref([])
const topRiskRecipients = ref([])

// 邮件列表
const emailList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)

// 筛选条件
const filterStatus = ref('')
const searchKeyword = ref('')

// 图表实例
const trendChartRef = ref(null)
let trendChartInstance = null

// 分页页码范围
const pageRange = computed(() => {
  const range = []
  const maxShow = 5
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + maxShow - 1)
  
  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
})

// 获取所有数据
const fetchAllData = async () => {
  if (pageSize.value < 1) {
    alert('每页数量必须大于 0')
    return
  }

  loading.value = true
  
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      status: filterStatus.value || undefined,
      keyword: searchKeyword.value || undefined
    }
    
    const data = await emailApi.getEmailList(params)
    
    // 更新统计数据
    if (data.stats) {
      stats.value = data.stats
    }
    
    // 更新趋势数据
    if (data.trend) {
      trendData.value = data.trend
    }
    
    // 更新 TOP 排行
    if (data.topRiskSenders) {
      topRiskSenders.value = data.topRiskSenders
    }
    if (data.topRiskRecipients) {
      topRiskRecipients.value = data.topRiskRecipients
    }
    
    // 更新邮件列表
    if (data.emails) {
      emailList.value = data.emails.list || []
      totalPages.value = data.emails.totalPages || 0
    }
    
  } catch (error) {
    console.error('获取数据失败:', error)
    emailList.value = []
    totalPages.value = 0
  } finally {
    loading.value = false
    // 等待加载状态更新后再渲染图表
    await nextTick()
    renderChart()
  }
}

// 渲染图表
const renderChart = async () => {
  // 等待 DOM 更新
  await nextTick()
  
  if (trendChartInstance) {
    trendChartInstance.destroy()
  }
  
  if (!trendChartRef.value) {
    console.error('Canvas element not found')
    return
  }
  
  if (!trendData.value.labels || trendData.value.labels.length === 0) {
    console.warn('No trend data to render')
    return
  }
  
  console.log('Rendering chart with data:', trendData.value)
  
  const ctx = trendChartRef.value.getContext('2d')
  
  trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: trendData.value.labels,
      datasets: [
        {
          label: '邮件累积总量',
          data: trendData.value.totalData,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: '新增邮件数量',
          data: trendData.value.newData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { 
          labels: { color: '#e2e8f0' } 
        } 
      },
      scales: {
        x: { 
          grid: { color: 'rgba(100, 116, 139, 0.1)' }, 
          ticks: { color: '#94a3b8' } 
        },
        y: { 
          grid: { color: 'rgba(100, 116, 139, 0.1)' }, 
          ticks: { color: '#94a3b8' },
          beginAtZero: true
        }
      }
    }
  })
}

// 查询按钮处理
const handleQuery = () => {
  currentPage.value = 1
  fetchAllData()
}

// 翻页处理
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchAllData()
}

// 初始化
onMounted(() => {
  fetchAllData()
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #1e293b;
}
::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>