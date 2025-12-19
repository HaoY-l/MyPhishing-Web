<!-- ==================== src/views/Reports.vue ==================== -->
<template>
  <div class="space-y-6">
    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
      <div class="text-center">
        <FileText class="w-16 h-16 text-indigo-400 mx-auto mb-4" />
        <h2 class="text-2xl font-bold mb-2">报告中心</h2>
        <p class="text-slate-400 mb-6">生成和导出各类安全分析报告</p>
        
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div class="p-4 bg-slate-800/30 rounded-xl">
            <h3 class="font-semibold mb-2 flex items-center gap-2">
              <BarChart class="w-5 h-5 text-blue-400" />
              统计报告
            </h3>
            <p class="text-sm text-slate-400">邮件处理量、威胁趋势统计</p>
          </div>
          
          <div class="p-4 bg-slate-800/30 rounded-xl">
            <h3 class="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle class="w-5 h-5 text-red-400" />
              威胁报告
            </h3>
            <p class="text-sm text-slate-400">恶意邮件详细分析报告</p>
          </div>
          
          <div class="p-4 bg-slate-800/30 rounded-xl">
            <h3 class="font-semibold mb-2 flex items-center gap-2">
              <Calendar class="w-5 h-5 text-green-400" />
              定期报告
            </h3>
            <p class="text-sm text-slate-400">日报、周报、月报生成</p>
          </div>
          
          <div class="p-4 bg-slate-800/30 rounded-xl">
            <h3 class="font-semibold mb-2 flex items-center gap-2">
              <Download class="w-5 h-5 text-purple-400" />
              报告导出
            </h3>
            <p class="text-sm text-slate-400">PDF、Excel 格式导出</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FileText, BarChart, AlertCircle, Calendar, Download } from 'lucide-vue-next'
</script>