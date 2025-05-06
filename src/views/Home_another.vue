<template>
  <div :class="['app-container', currentTheme]">
    <!-- 桌面端布局 -->
    <div v-if="!isMobile" class="desktop-layout">
      <!-- 左侧菜单栏 -->
      <div class="sidebar">
        <div class="menu-item" @click="goHome">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </div>
        <el-menu
          class="menu-group"
          :default-active="activeMenu"
          @select="handleMenuSelect"
        >
          <el-submenu index="1">
            <template #title>
              <i class="el-icon-menu"></i>
              <span>功能菜单</span>
            </template>
            <el-menu-item index="1-1">用户管理</el-menu-item>
            <el-menu-item index="1-2">文章管理</el-menu-item>
          </el-submenu>
        </el-menu>
        <el-dropdown class="theme-dropdown" @command="changeTheme">
          <div class="dropdown-trigger">
            <i class="el-icon-brush"></i>
            <span>主题切换</span>
            <i class="el-icon-arrow-down"></i>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="blue">蓝色风格</el-dropdown-item>
              <el-dropdown-item command="yellow">黄色风格</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="menu-item">
          <i class="el-icon-setting"></i>
          <span>导航三</span>
        </div>
        <div class="menu-item">
          <i class="el-icon-user"></i>
          <span>导航四</span>
        </div>
      </div>
      <div class="right-part">
        <!-- 顶部栏区-->
        <div :class="['top-bar', currentTheme]">
          <div class="top-bar-content">
            <el-dropdown class="user-dropdown" @command="handleCommand">
        <span class="dropdown-trigger">
          用户<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="calendar">
                    <i class="el-icon-date"></i>日历
                  </el-dropdown-item>
                  <el-dropdown-item  command="logout">
                    <i class="el-icon-switch-button"></i>退出
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <!-- 右侧信息区 -->
        <div class="main-content">
          <div class="user-info">
            <!--          <el-button class="logout-button" type="text" @click="handleLogout">退出登录</el-button>-->
            <h2 style="margin-top: -100px;margin-bottom: 80px;font-size: 30px">欢迎 {{ username }}</h2>
            <div class="avatar-container">
              <el-avatar :size="350" :src="userAvatar"></el-avatar>
            </div>
          </div>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">姓名：</span>
              <span class="info-value">{{ userInfo.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邮箱：</span>
              <span class="info-value">{{ userInfo.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">余额：</span>
              <span class="info-value">¥{{ userInfo.money }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">生日：</span>
              <span class="info-value">{{ userInfo.birthday }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端布局 -->
    <div v-else class="mobile-layout">
      <span class="mobile-header">
        <el-dropdown @command="handleMobileMenu" @click.native.stop trigger="click">
          <div class="mobile-menu-trigger" @click.stop>
            <i class="el-icon-menu"></i>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="home">首页</el-dropdown-item>
              <el-dropdown-item command="user">用户管理</el-dropdown-item>
              <el-dropdown-item command="article">文章管理</el-dropdown-item>
              <el-dropdown-item command="theme">主题切换</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <h2>欢迎 {{ username }}</h2>
      </span>
      <div class="mobile-content">
        <div class="mobile-info-list">
          <div class="info-item">
            <span class="info-label">姓名：</span>
            <span class="info-value">{{ userInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">邮箱：</span>
            <span class="info-value">{{ userInfo.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">余额：</span>
            <span class="info-value">¥{{ userInfo.money }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">生日：</span>
            <span class="info-value">{{ userInfo.birthday }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import responsiveMixin from '@/utils/responsive'

export default {
  mixins: [responsiveMixin],
  data () {
    return {
      username: '用户',
      userAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      currentDate: new Date(),
      activeMenu: '',
      currentTheme: 'blue',
      userInfo: {
        name: '',
        email: '',
        money: 0,
        birthday: ''
      }
    }
  },
  mounted () {
    this.currentTheme = this.$store.state.theme
    this.username = this.$store.getters.getUserName
    this.userAvatar = this.$store.getters.getUserAvatar
    this.userInfo = this.$store.getters.getUserInfo || {}
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('SET_THEME', this.currentTheme)
    next()
  },
  methods: {
    goHome () {
      this.activeMenu = ''
    },
    handleMenuSelect (index) {
      this.activeMenu = index
      if (index === '1-1') {
        this.$router.push('/user-management')
      } else if (index === '1-2') {
        // 文章管理跳转
      }
    },
    changeTheme (theme) {
      this.currentTheme = theme
    },
    handleMobileMenu (command) {
      if (command === 'home') {
        this.goHome()
      } else if (command === 'theme') {
        this.changeTheme(this.currentTheme === 'blue' ? 'yellow' : 'blue')
      } else if (command === 'user') {
        this.$router.push('/user-management')
      } else if (command === 'logout') {
        this.handleLogout()
      }
    },
    handleLogout () {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('CLEAR_USER_INFO')
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style scoped>
.app-container {
  height: 100%;
  display: flex;
  font-family: 'Arial', sans-serif;
}

.desktop-layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.sidebar {
  width: 230px;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.menu-item:hover {
  background-color: #e6e6e6;
}

.menu-item i {
  margin-right: 10px;
  font-size: 18px;
}

.menu-group {
  border-right: none;
  margin: 10px 0;
}

.theme-dropdown {
  padding: 12px 20px;
  cursor: pointer;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
}

.dropdown-trigger i:first-child {
  margin-right: 10px;
}

.dropdown-trigger i:last-child {
  margin-left: auto;
}

.right-part {
  //width: 100%;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.top-bar.blue {
  background-color: #d5e6ff; /* 蓝色主题背景 */
}

.top-bar.yellow {
  background-color: #fef0d7 ; /* 黄色主题背景 */
}

.user-dropdown {
  cursor: pointer;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
}

.el-icon-arrow-down {
  margin-left: 5px;
  font-size: 12px;
}

.el-dropdown-menu__item {
  display: flex;
  align-items: center;
}

.el-dropdown-menu__item i {
  margin-right: 8px;
}

.main-content {
  width: 1350px;
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: row;
}

.user-info {
  width: 35%;
  position: relative;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.logout-button {
  position: absolute;
  right: 30px;
  top: 20px;
  color: var(--primary-color);
}

.info-list {
  padding: 30px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 25px;
}

.info-item {
  display: flex;
  align-items: baseline;
  padding: 18px 25px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.info-label {
  font-size: 18px;
  color: #666;
  min-width: 80px;
  margin-right: 20px;
}

.info-value {
  font-size: 20px;
  color: var(--primary-color);
  font-weight: 500;
}

.mobile-layout {
  width: 100%;
  height: 100%;
}

.mobile-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f5f5;
}

.mobile-menu-trigger {
  font-size: 24px;
  margin-right: 15px;
  cursor: pointer;
}

.mobile-content {
  padding: 15px;
}

.mobile-info-list .info-item {
  padding: 15px;
  margin-bottom: 15px;
}

.mobile-info-list .info-label {
  font-size: 16px;
}

.mobile-info-list .info-value {
  font-size: 17px;
}

.blue {
  --primary-color: #409EFF;
  --secondary-color: #ecf5ff;
  --bg-color: #f5f9ff;
  --sidebar-bg: #e6f0ff;
}

.yellow {
  --primary-color: #E6A23C;
  --secondary-color: #fdf6ec;
  --bg-color: #fffaf0;
  --sidebar-bg: #fff5e6;
}

.app-container.blue {
  background-color: var(--bg-color);
}

.app-container.yellow {
  background-color: var(--bg-color);
}

.blue .sidebar {
  background-color: var(--sidebar-bg);
}

.yellow .sidebar {
  background-color: var(--sidebar-bg);
}

.blue .main-content {
  background-color: var(--bg-color);
}

.yellow .main-content {
  background-color: var(--bg-color);
}

@media (max-width: 800px) {
  .mobile-content .el-table {
    font-size: 14px;
  }
}
</style>
