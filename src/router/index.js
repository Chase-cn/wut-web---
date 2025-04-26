import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ResetPwd from '../views/ResetPwd.vue'
import Home from '../views/Home.vue'
import UserMng from '../views/UserManagement.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/reset-password', component: ResetPwd },
  { path: '/home', component: Home, meta: { checkTheme: true } },
  { path: '/user-management', component: UserMng, meta: { checkTheme: true } }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 1. 获取来源页面的组件实例
  const fromComponent = from.matched[0]?.components?.default

  // 2. 检查来源组件是否有 currentTheme 字段
  if (fromComponent && fromComponent.data?.().currentTheme) {
    const theme = fromComponent.data().currentTheme
    store.commit('SET_THEME', theme) // 更新 Vuex 中的主题
    console.log('从来源页面获取主题:', theme)
  }

  next() // 放行路由
})

export default router
