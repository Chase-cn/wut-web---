import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * 这就像你让秘书（action）去档案室（state）修改资料：
 *
 * {commit} → 秘书手上拿着的盖章工具（唯一能修改档案的权限章）
 * userInfo → 你要更新的新资料表
 * commit('SET_USER_INFO', userInfo) → 秘书找到对应的档案袋（SET_USER_INFO），盖上章并把新资料塞进去
 * 为什么形象？
 *
 * ✋ 安全管控：就像公司规定只有盖章才能改文件（必须通过 commit 改数据）
 * 📦 流程清晰：先交给秘书（action），秘书再操作档案室（mutation）
 * 🔍 记录明确：每次盖章（commit）都会留下记录（Vue Devtools 可追踪）
 */
export default new Vuex.Store({
  /**
   * 存数据的地方
   */
  state: {
    theme: 'blue', // 默认值
    userInfo: null // 用户信息初始为null
  },
  /**
   * 获取器
   */
  getters: {
    // 获取用户信息
    getUserInfo: state => state.userInfo,
    // 获取特定用户字段
    getUserAvatar: state => state.userInfo?.avatar,
    getUserEmail: state => state.userInfo?.email
  },
  /** -------------> 突变 ,唯一能直接改 state 的地方<--------------------------
   * BIGWRITE(state,param...)
   * state:类似this指针的用法,一般写在第一个
   * 各种修改state状态用到的参数
   * 调用: ***.commit('BIGWRITE',param...)
   * ---------------->同步的,简单的操作<-----------------------------
   */
  mutations: {
    SET_THEME (state, theme) {
      state.theme = theme
    },
    // 设置用户信息
    SET_USER_INFO (state, userInfo) {
      state.userInfo = userInfo
    },
    /**
     * 更新新部分(任意)用户字段
     * @param state 类似this指针一样的东西,样板
     * @param field 键名
     * @param value 键值
     * {Key1,Key2}一种解构写法,把{Key1:sthvalue,Key2:sthvalue}的对象的属性值 自然解构为Key1,Key2(类似形参)使用
     */
    UPDATE_USER_FIELD (state, { field, value }) {
      if (state.userInfo) {
        Vue.set(state.userInfo, field, value) // 实时更新
      }
    },
    // 清空用户信息
    CLEAR_USER_INFO (state) {
      state.userInfo = null
    }
  },
  /**
   * ------------------>动作, 通过 commit 调用 mutations<----------------
   * theActionMethod({commit},param...)
   * {commit}也可以看作是某种this,其实是context对象取[键]commit的[值],同样的[键]还有state,getters,dispatch...
   * 调用:***.dispatch('theActionMethod',param...)
   * -------------------->处理异步操作或复杂逻辑<----------------------------------
   */
  actions: {
    // 设置用户信息
    setUserInfo ({ commit }, userInfo) {
      commit('SET_USER_INFO', userInfo)
    },
    /**
     * 更新单个用户字段,参数一定要是{field:***,value:***}
     * @param commit 某种this
     * @param payload {field:***,value:***}
     * p.s.js的对象很json
     */
    updateUserField ({ commit }, payload) {
      commit('UPDATE_USER_FIELD', payload)
    },
    // 清空用户信息
    clearUserInfo ({ commit }) {
      commit('CLEAR_USER_INFO')
    }
  },
  /**
   * 把大仓库拆成小仓库
   */
  modules: {
  }
})
