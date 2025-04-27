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

// 全局的路由首位无法获得组件页的实时数据,只能在页面内部的beforeRouteLeave中实现
router.beforeEach((to, from, next) => {
  const fromData = store.state.theme // 获取实时数据
  console.log('来源页主题:', fromData)
  next()
})

export default router
