<template>
  <div class="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 overflow-hidden flex flex-col">
    <!-- 自定义日期选择器 -->
    <div v-if="showDatePicker" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-96">
        <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          选择时间范围
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-slate-400 mb-2">开始时间</label>
            <input 
              type="datetime-local" 
              v-model="startDate"
              class="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label class="block text-sm text-slate-400 mb-2">结束时间</label>
            <input 
              type="datetime-local" 
              v-model="endDate"
              class="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button 
            @click="handleCustomTimeConfirm"
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 transition"
          >
            确认
          </button>
          <button 
            @click="handleCustomTimeCancel"
            class="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 transition"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 顶部标题和时间选择 -->
    <div class="flex justify-between items-center mb-4 flex-shrink-0">
      <h1 class="text-3xl font-bold">检测仪表盘</h1>
      
      <div class="inline-flex items-center space-x-2 p-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl">
        <span class="text-xs text-slate-400">时间范围:</span>
        <select 
          v-model="displayTimeRange"
          @change="handleTimeRangeChange"
          class="bg-slate-800/50 text-white text-xs py-1 px-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-none cursor-pointer"
        >
          <option value="12h">最近 12 小时</option>
          <option value="24h">最近 24 小时</option>
          <option value="3d">最近 3 天</option>
          <option value="7d">最近 7 天</option>
          <option value="30d">最近 30 天</option>
          <option value="custom">自定义时间</option>
        </select>
      </div>
    </div>

    <div class="flex-grow min-h-0 overflow-y-auto space-y-4 custom-scrollbar">
      <!-- 图表1 - 邮件处理趋势 -->
      <div :class="isMaximizedChart1 ? 'fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-3xl p-12' : 'bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-4'">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            邮件处理趋势
          </h3>
          <button @click="toggleMaximize(1)" class="p-1 text-slate-400 hover:text-indigo-400 transition">
            <svg v-if="isMaximizedChart1" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="4 14 10 14 10 20"></polyline>
              <polyline points="20 10 14 10 14 4"></polyline>
              <line x1="14" y1="10" x2="21" y2="3"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
        </div>
        
        <div v-if="loading" class="flex justify-center items-center" :style="{ height: isMaximizedChart1 ? 'calc(100vh - 120px)' : '300px' }">
          <svg class="w-6 h-6 animate-spin mr-2 text-slate-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-slate-400">数据加载中...</span>
        </div>
        <div v-else ref="chartContainer" :style="{ height: isMaximizedChart1 ? 'calc(100vh - 120px)' : '300px' }"></div>
      </div>

      <!-- 图表2 - 拦截与告警趋势 -->
      <div :class="isMaximizedChart2 ? 'fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-3xl p-12' : 'bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-4'">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold flex items-center gap-2">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            拦截与告警趋势
          </h3>
          <button @click="toggleMaximize(2)" class="p-1 text-slate-400 hover:text-indigo-400 transition">
            <svg v-if="isMaximizedChart2" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="4 14 10 14 10 20"></polyline>
              <polyline points="20 10 14 10 14 4"></polyline>
              <line x1="14" y1="10" x2="21" y2="3"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
        </div>
        
        <div v-if="loading" class="flex justify-center items-center" :style="{ height: isMaximizedChart2 ? 'calc(100vh - 120px)' : '200px' }">
          <svg class="w-6 h-6 animate-spin mr-2 text-slate-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-slate-400">数据加载中...</span>
        </div>
        <div v-else ref="actionChartContainer" :style="{ height: isMaximizedChart2 ? 'calc(100vh - 120px)' : '200px' }"></div>
      </div>

      <!-- 汇总卡片 -->
      <div v-if="!isMaximizedChart1 && !isMaximizedChart2" class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div v-for="card in summaryData" :key="card.title" 
             class="p-3 bg-slate-800/30 border border-slate-700 rounded-xl shadow-lg transition duration-300 hover:border-indigo-500/50">
          <div class="flex items-center justify-between">
            <p class="text-xs font-medium text-slate-400">{{ card.title }}</p>
            <span v-html="card.icon" :class="card.color"></span>
          </div>
          <p class="text-xl font-extrabold text-white mt-1.5">{{ card.value.toLocaleString() }}</p>
        </div>
      </div>

      <!-- 检测记录表格 -->
      <div v-if="!isMaximizedChart1 && !isMaximizedChart2" class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-4">
        <h3 class="text-lg font-bold mb-3 flex items-center gap-2">
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          最近检测记录
        </h3>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-700">
            <thead class="bg-slate-800/50">
              <tr class="text-left text-xs font-semibold text-slate-400 uppercase">
                <th class="py-2 px-3">时间</th>
                <th class="py-2 px-3">邮件 ID</th>
                <th class="py-2 px-3">发件人</th>
                <th class="py-2 px-3">检测结果</th>
                <th class="py-2 px-3">处理状态</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr v-for="record in detectionRecords" :key="record.id" class="hover:bg-slate-800/30 transition">
                <td class="py-2 px-3 text-xs text-slate-300">{{ record.time }}</td>
                <td class="py-2 px-3 text-xs text-indigo-300 font-mono">{{ record.id }}</td>
                <td class="py-2 px-3 text-xs text-slate-300 truncate max-w-xs">{{ record.sender }}</td>
                <td class="py-2 px-3 text-xs">
                  <span :class="getResultClass(record.result)">{{ record.result }}</span>
                </td>
                <td class="py-2 px-3 text-xs">
                  <span :class="getStatusClass(record.status)">{{ record.status }}</span>
                </td>
              </tr>
              <tr v-if="!loading && detectionRecords.length === 0">
                <td colspan="5" class="text-center py-4 text-slate-400">暂无检测记录</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'

export default {
  name: 'Dashboard',
  setup() {
    // SVG 图标定义
    const icons = {
      mail: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>',
      check: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
      alert: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      help: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      user: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
    }

    // 状态
    const timeRange = ref('12h')
    const displayTimeRange = ref('12h')
    const showDatePicker = ref(false)
    const startDate = ref('')
    const endDate = ref('')
    const loading = ref(true)
    const summaryData = ref([])
    const detectionRecords = ref([])
    const isMaximizedChart1 = ref(false)
    const isMaximizedChart2 = ref(false)

    // 图表容器
    const chartContainer = ref(null)
    const actionChartContainer = ref(null)
    let chartInstance = null
    let actionChartInstance = null

    // 获取 echarts（从全局或导入）
    const getEcharts = () => {
      if (window.echarts) {
        return window.echarts
      }
      console.error('ECharts not loaded! Please add CDN to index.html')
      return null
    }

    // 数据获取
    const fetchData = async (customTimeRange) => {
      loading.value = true
      
      try {
        const range = customTimeRange || timeRange.value
        const response = await fetch(`/api/web/dashboard?timeRange=${range}`)
        const result = await response.json()

        if (result.success) {
          const data = result.data
          
          // 更新总览数据
          summaryData.value = [
            { title: '邮件总数', value: data.summary.totalCount, icon: icons.mail, color: 'text-indigo-400' },
            { title: '正常总数', value: data.summary.normalCount, icon: icons.check, color: 'text-green-400' },
            { title: '钓鱼邮件', value: data.summary.phishingCount, icon: icons.alert, color: 'text-red-400' },
            { title: '可疑总数', value: data.summary.suspiciousCount, icon: icons.help, color: 'text-yellow-400' },
            { title: '人工确认', value: data.summary.manualCount, icon: icons.user, color: 'text-purple-400' }
          ]
          
          // 更新图表
          await nextTick()
          initChart(data.trendData)
          initActionChart(data.actionTrendData)
          
          // 更新表格
          detectionRecords.value = data.records
        }
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 初始化趋势图
    const initChart = (trendData) => {
      const echarts = getEcharts()
      if (!chartContainer.value || !echarts) {
        console.error('Chart container or echarts not available')
        return
      }
      
      if (!chartInstance) {
        chartInstance = echarts.init(chartContainer.value, 'dark')
      }

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderColor: '#334155',
          textStyle: { color: '#e2e8f0' }
        },
        legend: {
          data: ['邮件总数', '正常', '钓鱼', '可疑', '人工'],
          textStyle: { color: '#cbd5e1' },
          top: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: trendData.timestamps,
          axisLine: { lineStyle: { color: '#475569' } },
          axisLabel: { color: '#94a3b8', rotate: 30 }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#475569' } },
          axisLabel: { color: '#94a3b8' },
          splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
        },
        series: [
          {
            name: '邮件总数',
            type: 'line',
            data: trendData.total,
            smooth: true,
            lineStyle: { color: '#818cf8', width: 3 },
            itemStyle: { color: '#818cf8' },
            areaStyle: { color: 'rgba(129, 140, 248, 0.1)' }
          },
          {
            name: '正常',
            type: 'line',
            data: trendData.normal,
            smooth: true,
            lineStyle: { color: '#34d399' },
            itemStyle: { color: '#34d399' }
          },
          {
            name: '钓鱼',
            type: 'line',
            data: trendData.phishing,
            smooth: true,
            lineStyle: { color: '#f87171' },
            itemStyle: { color: '#f87171' }
          },
          {
            name: '可疑',
            type: 'line',
            data: trendData.suspicious,
            smooth: true,
            lineStyle: { color: '#fbbf24' },
            itemStyle: { color: '#fbbf24' }
          },
          {
            name: '人工',
            type: 'line',
            data: trendData.manual,
            smooth: true,
            lineStyle: { color: '#a78bfa' },
            itemStyle: { color: '#a78bfa' }
          }
        ]
      }

      chartInstance.setOption(option)
    }

    // 初始化动作图
    const initActionChart = (actionData) => {
      const echarts = getEcharts()
      if (!actionChartContainer.value || !echarts) {
        console.error('Action chart container or echarts not available')
        return
      }
      
      if (!actionChartInstance) {
        actionChartInstance = echarts.init(actionChartContainer.value, 'dark')
      }

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderColor: '#334155',
          textStyle: { color: '#e2e8f0' }
        },
        legend: {
          data: ['拦截', '告警'],
          textStyle: { color: '#cbd5e1' },
          top: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: actionData.timestamps,
          axisLine: { lineStyle: { color: '#475569' } },
          axisLabel: { color: '#94a3b8', rotate: 30 }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#475569' } },
          axisLabel: { color: '#94a3b8' },
          splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
        },
        series: [
          {
            name: '拦截',
            type: 'bar',
            data: actionData.block,
            itemStyle: { color: '#ef4444' }
          },
          {
            name: '告警',
            type: 'bar',
            data: actionData.alert,
            itemStyle: { color: '#f59e0b' }
          }
        ]
      }

      actionChartInstance.setOption(option)
    }

    // 事件处理
    const handleTimeRangeChange = () => {
      if (displayTimeRange.value === 'custom') {
        showDatePicker.value = true
      } else {
        timeRange.value = displayTimeRange.value
        fetchData()
      }
    }

    const handleCustomTimeConfirm = () => {
      if (startDate.value && endDate.value) {
        const start = new Date(startDate.value).getTime()
        const end = new Date(endDate.value).getTime()
        timeRange.value = `${start}-${end}`
        showDatePicker.value = false
        fetchData()
      }
    }

    const handleCustomTimeCancel = () => {
      showDatePicker.value = false
      displayTimeRange.value = '12h'
    }

    const toggleMaximize = (chartIndex) => {
      if (chartIndex === 1) {
        isMaximizedChart1.value = !isMaximizedChart1.value
        if (isMaximizedChart1.value) isMaximizedChart2.value = false
      } else {
        isMaximizedChart2.value = !isMaximizedChart2.value
        if (isMaximizedChart2.value) isMaximizedChart1.value = false
      }

      nextTick(() => {
        if (chartInstance) chartInstance.resize()
        if (actionChartInstance) actionChartInstance.resize()
      })
    }

    const getResultClass = (result) => {
      const classes = {
        '钓鱼邮件': 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-800 text-red-300',
        '正常邮件': 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-800 text-green-300',
        '可疑邮件': 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-800 text-yellow-300',
        '人工确认': 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-800 text-purple-300'
      }
      return classes[result] || 'text-slate-300'
    }

    const getStatusClass = (status) => {
      const classes = {
        '已拦截': 'text-red-400',
        '已放行': 'text-green-400',
        '已告警': 'text-yellow-400',
        '待人工确认': 'text-purple-400'
      }
      return classes[status] || 'text-slate-400'
    }

    // 生命周期
    onMounted(() => {
      fetchData()
      
      window.addEventListener('resize', () => {
        if (chartInstance) chartInstance.resize()
        if (actionChartInstance) actionChartInstance.resize()
      })
    })

    return {
      timeRange,
      displayTimeRange,
      showDatePicker,
      startDate,
      endDate,
      loading,
      summaryData,
      detectionRecords,
      isMaximizedChart1,
      isMaximizedChart2,
      chartContainer,
      actionChartContainer,
      handleTimeRangeChange,
      handleCustomTimeConfirm,
      handleCustomTimeCancel,
      toggleMaximize,
      getResultClass,
      getStatusClass
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #1e293b;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>