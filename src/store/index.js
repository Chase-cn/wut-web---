import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: 'blue' // 默认值
  },
  getters: {
  },
  mutations: {
    SET_THEME (state, theme) {
      state.theme = theme
    }
  },
  actions: {
  },
  modules: {
  }
})
