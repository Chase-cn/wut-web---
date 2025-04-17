import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ResetPwd from '../views/ResetPwd.vue'
import Home from '../views/Home.vue'
import UserMng from '../views/UserManagement.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/reset-password', component: ResetPwd },
  { path: '/home', component: Home },
  { path: '/user-management', component: UserMng }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
