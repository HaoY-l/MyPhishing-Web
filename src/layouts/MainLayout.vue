<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    
    <!-- 顶部导航栏 -->
    <nav class="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 z-50">
      <div class="h-full px-3 md:px-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button 
            @click="sidebarOpen = !sidebarOpen"
            class="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu v-if="!sidebarOpen" :size="20" />
            <X v-else :size="20" />
          </button>
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield class="w-6 h-6" />
            </div>
            <div class="hidden sm:block">
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                邮件安全检测平台
              </h1>
              <p class="text-xs text-slate-400">Email Security Detection Platform</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-3 md:gap-4">
          <div class="relative hidden sm:block">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="搜索邮件 ID..."
              @keyup.enter="handleSearch"
              class="w-48 md:w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-400"
            />
          </div>
          
          <button class="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Bell :size="20" />
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button class="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <User :size="20" />
          </button>
        </div>
      </div>
    </nav>

    <!-- 侧边栏 -->
    <aside 
      :class="[
        'fixed left-0 top-16 bottom-0 backdrop-blur-xl border-r border-slate-800 transition-transform duration-300 z-40',
        'md:w-64 w-full',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="p-4 space-y-2">
        <router-link
          v-for="item in navigationItems"
          :key="item.id"
          :to="item.path"
          custom
          v-slot="{ isActive, navigate }"
        >
          <button
            @click="navigate"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
              isActive 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                : 'hover:bg-slate-800/50 border border-transparent'
            ]"
          >
            <component :is="item.icon" :class="['w-5 h-5', item.color]" />
            <span class="font-medium">{{ item.label }}</span>
          </button>
        </router-link>
        
        <!-- 系统设置菜单 -->
        <router-link
          to="/settings"
          custom
          v-slot="{ isActive, navigate }"
        >
          <button
            @click="navigate"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
              isActive 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                : 'hover:bg-slate-800/50 border border-transparent'
            ]"
          >
            <Settings :class="['w-5 h-5', 'text-amber-400']" />
            <span class="font-medium">系统设置</span>
          </button>
        </router-link>
      </div>
    </aside>

    <!-- 移动端遮罩层 -->
    <div 
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- 主内容区域 -->
    <main :class="[
      'pt-16 transition-all duration-300',
      sidebarOpen ? 'md:pl-64 pl-0' : 'pl-0'
    ]">
      <div class="p-4 md:p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X, Shield, Search, Bell, User, BarChart3, Mail, Database, Brain, FileText, Settings } from 'lucide-vue-next'

const sidebarOpen = ref(false)
const searchQuery = ref('')

const navigationItems = [
  { id: 'dashboard', path: '/dashboard', icon: BarChart3, label: '数据面板', color: 'text-blue-400' },
  { id: 'emails', path: '/emails', icon: Mail, label: '邮件管理', color: 'text-purple-400' },
  { id: 'threats', path: '/threats', icon: Shield, label: '威胁检测', color: 'text-red-400' },
  { id: 'vector', path: '/vector', icon: Database, label: '向量检索', color: 'text-green-400' },
  { id: 'ai', path: '/ai', icon: Brain, label: 'AI分析', color: 'text-cyan-400' },
  { id: 'reports', path: '/reports', icon: FileText, label: '报告中心', color: 'text-indigo-400' }
]

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索邮件:', searchQuery.value)
  }
}

// 监听窗口大小变化，实现响应式侧边栏切换
const handleResize = () => {
  // md 断点（768px）：桌面端默认打开侧边栏，移动端默认隐藏
  const isDesktop = window.innerWidth >= 768
  sidebarOpen.value = isDesktop
}

// 组件挂载时初始化并添加监听
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

// 组件卸载时移除监听，防止内存泄漏
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>