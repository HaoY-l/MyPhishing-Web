// 风险等级样式映射
export const getRiskStyle = (risk) => {
  const styles = {
    0: { 
      bg: 'bg-green-500/10', 
      text: 'text-green-400', 
      border: 'border-green-500/30', 
      label: '安全' 
    },
    1: { 
      bg: 'bg-yellow-500/10', 
      text: 'text-yellow-400', 
      border: 'border-yellow-500/30', 
      label: '可疑' 
    },
    2: { 
      bg: 'bg-red-500/10', 
      text: 'text-red-400', 
      border: 'border-red-500/30', 
      label: '恶意' 
    }
  }
  return styles[risk] || styles[0]
}

// 格式化数字
export const formatNumber = (num) => {
  if (num === null || num === undefined) return 0
  return num.toLocaleString()
}

// 时间格式化
export const formatTime = (time) => {
  if (!time) return '-'
  
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  
  // 1分钟内
  if (diff < 60000) {
    return '刚刚'
  }
  // 1小时内
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  // 24小时内
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  // 7天内
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  }
  
  // 超过7天显示具体日期
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 截取文本
export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}