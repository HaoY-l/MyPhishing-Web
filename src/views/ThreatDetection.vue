<!-- ==================== src/views/ThreatDetection.vue ==================== -->
<template>
  <div class="space-y-6">
    <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
      <div class="text-center">
        <Shield class="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 class="text-2xl font-bold mb-2">威胁检测模块</h2>
        <p class="text-slate-400 mb-6">集成 VirusTotal 和微步沙箱进行威胁分析</p>
        
        <div class="mt-8 text-left space-y-4">
          <div class="p-4 bg-slate-800/30 rounded-xl">
            <h3 class="font-semibold mb-2 flex items-center gap-2">
              <Globe class="w-5 h-5 text-blue-400" />
              VirusTotal 威胁查询
            </h3>
            <p class="text-sm text-slate-400">POST /api/threat/threat_query</p>
            <p class="text-xs text-slate-500 mt-2">支持 URL / IP / Hash 查询</p>
          </div>
          
          <div class="p-4 bg-slate-800/30 rounded-xl">
            <h3 class="font-semibold mb-2 flex items-center gap-2">
              <FileWarning class="w-5 h-5 text-orange-400" />
              微步沙箱检测
            </h3>
            <p class="text-sm text-slate-400">POST /api/sandbox/sandbox_query</p>
            <p class="text-xs text-slate-500 mt-2">提交 URL / 文件到沙箱分析</p>
          </div>
          
          <div class="p-4 bg-slate-800/30 rounded-xl">
            <h3 class="font-semibold mb-2 flex items-center gap-2">
              <RefreshCw class="w-5 h-5 text-green-400" />
              沙箱结果回写
            </h3>
            <p class="text-sm text-slate-400">POST /api/email/update_sandbox_result</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Shield, Globe, FileWarning, RefreshCw } from 'lucide-vue-next'
</script>