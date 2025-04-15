<template>
  <div :class="['app-container', currentTheme]">
    <!-- 桌面端布局 -->
    <div v-if="!isMobile" class="desktop-layout">
      <!-- 左侧菜单栏 -->
      <div class="sidebar">
        <!-- 首页按钮,div就够了 -->
        <div class="menu-item" @click="goHome">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </div>

        <!-- 功能菜单下拉栏 -->
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

        <!-- 主题切换下拉框 -->
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

        <!-- 其他导航项 -->
        <div class="menu-item">
          <i class="el-icon-setting"></i>
          <span>导航三</span>
        </div>
        <div class="menu-item">
          <i class="el-icon-user"></i>
          <span>导航四</span>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="main-content">
        <div class="user-info">
          <h2>欢迎 {{ username }}</h2>
          <div class="avatar-container">
            <el-avatar :size="150" :src="userAvatar"></el-avatar>
          </div>
        </div>
        <div class="calendar-container">
          <el-calendar v-model="currentDate"></el-calendar>
        </div>
      </div>
    </div>

    <!-- 移动端布局 -->
    <div v-else class="mobile-layout">
<!--      用span标签代替div就可以解决秒弹秒退的问题,疑似是el-dropdown也会处理div的click-->
<!--      行内容器span相对于块容器div似乎事件捕获逻辑更简单,方便处理多次触发的问题-->
      <span class="mobile-header">
        <el-dropdown  @command="handleMobileMenu" @click.native.stop trigger="click">
<!--          span的问题(可能行内显示下拉框被遮蔽了),用div标签就可以正常弹出下拉框-->
          <div class="mobile-menu-trigger" @click.stop>
            <i class="el-icon-menu"></i>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="home">首页</el-dropdown-item>
              <el-dropdown-item command="user">用户管理</el-dropdown-item>
              <el-dropdown-item command="article">文章管理</el-dropdown-item>
              <el-dropdown-item command="theme">主题切换</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <h2>欢迎 {{ username }}</h2>
      </span>
      <div class="mobile-content">
        <el-calendar v-model="currentDate"></el-calendar>
      </div>
    </div>
  </div>
</template>

<script>
import responsiveMixin from '@/utils/responsive'

export default {
  mixins: [responsiveMixin], // 增加响应式布局的内容
  data () {
    return {
      username: '用户',
      userAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      currentDate: new Date(),
      activeMenu: '',
      currentTheme: 'blue' // 默认蓝色主题
    }
  },
  methods: {
    goHome () {
      // 首页跳转逻辑
      this.activeMenu = ''
    },
    handleMenuSelect (index) {
      // 菜单选择逻辑
      this.activeMenu = index
      if (index === '1-1') {
        // 用户管理跳转
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
        // 两个主题下切换-很妙的设计
        this.changeTheme(this.currentTheme === 'blue' ? 'yellow' : 'blue')
      } else {
        // 其他菜单项处理
      }
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.app-container {
  height: 100vh;
  display: flex;
  font-family: 'Arial', sans-serif;
}

/* 桌面端样式 */
.desktop-layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.sidebar {
  width: 220px;
  background-color: #f5f5f5;
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

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-bottom: 30%;
}

.avatar-container {
  margin-bottom: 20px;
}

.calendar-container {
  flex: 2;
  padding: 20px;
}

/* 移动端样式 */
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

/* 主题样式 */
.blue {
  --primary-color: #409EFF;
  --secondary-color: #ecf5ff;
  --bg-color: #f5f9ff; /* 新增蓝色主题背景色 */
  --sidebar-bg: #e6f0ff; /* 新增侧边栏背景色 */
}

.yellow {
  --primary-color: #E6A23C;
  --secondary-color: #fdf6ec;
  --bg-color: #fffaf0; /* 新增黄色主题背景色 */
  --sidebar-bg: #fff5e6; /* 新增侧边栏背景色 */
}

/* 应用背景色到整体布局 */
.app-container.blue {
  background-color: var(--bg-color);
}

.app-container.yellow {
  background-color: var(--bg-color);
}

/* 侧边栏背景色 */
.blue .sidebar {
  background-color: var(--sidebar-bg);
}

.yellow .sidebar {
  background-color: var(--sidebar-bg);
}

/* 主内容区背景色 */
.blue .main-content {
  background-color: var(--bg-color);
}

.yellow .main-content {
  background-color: var(--bg-color);
}

/* 保留原有的悬停和激活状态样式 */
.blue .menu-item:hover,
.blue .el-menu-item:hover,
.blue .el-submenu__title:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.yellow .menu-item:hover,
.yellow .el-menu-item:hover,
.yellow .el-submenu__title:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.blue .el-menu-item.is-active,
.blue .el-submenu__title.is-active {
  color: var(--primary-color);
}

.yellow .el-menu-item.is-active,
.yellow .el-submenu__title.is-active {
  color: var(--primary-color);
}

/* 响应式调整 */
@media (max-width: 800px) {
  .main-content {
    flex-direction: column;
  }

  .user-info,
  .calendar-container {
    width: 100%;
    flex: none;
  }

}
</style>
