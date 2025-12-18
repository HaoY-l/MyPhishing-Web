import request from './request'

// ========== 统计数据接口 ==========
export const statsApi = {
  /**
   * 获取仪表盘统计数据 (包含趋势和最近记录)
   * @param {string} timeRange - 时间范围 (如 '12h', '7d', 或自定义时间戳范围 'start-end')
   */
  getDashboardStats(timeRange) {
    return request.get('/api/web/dashboard', { params: { timeRange } })
  }
}

// ========== 邮件管理接口 ==========
export const emailApi = {
  // 获取邮件列表
  getEmailList(params) {
    return request.get('/api/web/emaildata', { params })
  }
}

// ========== 向量检索接口 ==========
export const vectorApi = {
  /**
   * 获取向量库统计信息
   */
  getVectorStats() {
    return request.get('/api/web/vectordata')
  },

  /**
   * 相似邮件检索
   * @param {Object} params - 检索参数
   * @param {string} params.email_id - 邮件ID (可选，与query_text二选一)
   * @param {string} params.query_text - 检索文本 (可选，与email_id二选一)
   * @param {number} params.top_k - 返回结果数量，默认10
   * @param {number} params.threshold - 相似度阈值，默认0.7
   */
  searchSimilarEmails(params) {
    return request.post('/api/web/vectordata', params)
  }
}

// ========== AI分析接口（仅保留前端所需核心接口） ==========
export const aiApi = {
  /**
   * AI邮件分析（适配前端展示的格式化数据）
   * @param {Object} params - 分析参数
   * @param {string} params.email_id - 邮件ID (可选，与email_text二选一)
   * @param {string} params.email_text - 邮件文本内容 (可选，与email_id二选一)
   */
  analyzeEmail(params) {
    return request.post('/api/web/aidata', params)
  }
}

// ========== 配置管理接口（新增） ==========
export const settingApi = {
  /**
   * 获取配置（对应后端 GET /api/web/setting）
   */
  getConfig() {
    return request.get('/api/web/setting')
  },
  /**
   * 保存配置（对应后端 POST /api/web/setting）
   * @param {Object} config - 配置数据
   */
  saveConfig(config) {
    return request.post('/api/web/setting', config)
  },
  /**
   * 恢复默认配置（对应后端 POST /api/web/setting）
   */
  resetConfig() {
    return request.post('/api/web/setting', { action: 'reset' })
  }
}