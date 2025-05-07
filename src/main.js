import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
// import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// 拜托,vue是个类名儿,关于其性质的拓展一定是在new前才对啊,
// 不需要给这个对象起名儿是因为整个项目就ta一个vue对象啊
