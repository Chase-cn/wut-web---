<template>
  <div id="app" :class="{'mobile-layout': isMobile, 'desktop-layout': !isMobile}">
    <!-- 直接显示路由视图，不再需要导航栏 -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      isMobile: false
    }
  },
  methods: {
    checkScreenSize () {
      this.isMobile = window.innerWidth < 800
    }
  },
  mounted () {
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)

    // 确保打开应用时跳转到登录页
    if (this.$route.path !== '/login') {
      this.$router.replace('/login')
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.checkScreenSize)
  }
}
</script>

<style>
/* 基础样式 */
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

/* 桌面布局样式 (≥800px) */
.desktop-layout .login-container {
  width: 40%;
  min-width: 400px;
  max-width: 500px;
  padding: 40px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: white;
}

/* 移动布局样式 (<800px) */
.mobile-layout .login-container {
  width: 90%;
  padding: 20px;
  box-shadow: none;
  border-radius: 0;
  background: transparent;
}

.mobile-layout .login-card {
  width: 100% !important;
  padding: 15px !important;
}

.mobile-layout h2 {
  font-size: 1.5rem !important;
  margin-bottom: 15px !important;
}

/* 响应式字体大小 */
@media (max-width: 800px) {
  html {
    font-size: 14px;
  }
}
</style>
