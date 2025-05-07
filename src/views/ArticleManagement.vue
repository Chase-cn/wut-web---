<template>
  <div :class="['app-container', currentTheme]">
    <!-- 桌面端布局 -->
    <div class="desktop-layout">
      <!-- 左侧菜单栏 -->
      <div class="sidebar">
        <!-- 首页按钮 -->
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
            <el-menu-item index="1-1">联系人管理</el-menu-item>
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
        <div class="article-management">
          <h2 class="page-title">文章管理</h2>
          <div class="card-container">
            <!-- 作者信息表格 -->
            <el-card class="author-table-card">
              <div slot="header" class="clearfix">
                <span>作者信息</span>
              </div>
              <el-table
                :data="authorList"
                style="width: 100%"
                border
                stripe
                v-loading="loading"
              >
                <el-table-column
                  prop="id"
                  label="序号"
                  width="80"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="姓名"
                  width="120"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="articleCount"
                  label="文章数量"
                  width="120"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="操作"
                  width="180"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleArticleManage(scope.row)"
                    >进入文章管理</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination>
              </div>
            </el-card>

            <!-- 文章统计图表 -->
            <el-card class="chart-card">
              <div slot="header" class="clearfix">
                <span>作者发布文章统计图表</span>
              </div>
              <div class="chart-container" ref="chartContainer"></div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import responsiveMixin from '@/utils/responsive'

export default {
  mixins: [responsiveMixin],
  data () {
    return {
      username: '用户',
      userAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      currentDate: new Date(),
      activeMenu: '1-2', // 默认选中文章管理菜单
      currentTheme: 'blue',

      // 表格相关数据
      authorList: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,

      // 图表相关
      chart: null
    }
  },
  mounted () {
    this.currentTheme = this.$store.state.theme
    this.username = this.$store.getters.getUserName
    this.userAvatar = this.$store.getters.getUserAvatar

    this.fetchAuthorData()
    this.$nextTick(() => {
      this.initChart()
    })

    // 监听窗口大小变化，重新调整图表大小
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    // 销毁图表实例
    if (this.chart) {
      this.chart.dispose()
    }
    // 移除事件监听
    window.removeEventListener('resize', this.handleResize)
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('SET_THEME', this.currentTheme)
    next()
  },
  methods: {
    goHome () {
      this.activeMenu = ''
      this.$router.push('/home')
    },
    handleMenuSelect (index) {
      this.activeMenu = index
      if (index === '1-1') {
        this.$router.push('/user-management')
      } else if (index === '1-2') {
        this.$router.push('/article-management')
      }
    },
    changeTheme (theme) {
      this.currentTheme = theme
    },

    // 获取作者数据
    fetchAuthorData () {
      this.loading = true
      // 模拟API请求
      setTimeout(() => {
        // 模拟数据
        const mockData = []
        for (let i = 1; i <= 50; i++) {
          mockData.push({
            id: i,
            name: `作者${i}`,
            articleCount: Math.floor(Math.random() * 100) + 1
          })
        }

        // 分页处理
        const start = (this.currentPage - 1) * this.pageSize
        const end = start + this.pageSize
        this.authorList = mockData.slice(start, end)
        this.total = mockData.length
        this.loading = false

        // 更新图表数据
        this.updateChartData()
      }, 500)
    },

    // 初始化图表
    initChart () {
      this.chart = echarts.init(this.$refs.chartContainer)
      this.updateChartData()
    },

    // 更新图表数据
    updateChartData () {
      if (!this.chart) return

      const names = this.authorList.map(item => item.name)
      const counts = this.authorList.map(item => item.articleCount)

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: names,
          axisLabel: {
            rotate: 30, // 如果名字太长可以旋转
            interval: 0 // 显示所有标签
          }
        },
        yAxis: {
          type: 'value',
          name: '文章数量'
        },
        series: [
          {
            name: '文章数量',
            type: 'bar',
            data: counts,
            itemStyle: {
              color: this.currentTheme === 'blue' ? '#409EFF' : '#E6A23C'
            },
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }

      this.chart.setOption(option)
    },

    // 处理分页大小变化
    handleSizeChange (val) {
      this.pageSize = val
      this.fetchAuthorData()
    },

    // 处理当前页变化
    handleCurrentChange (val) {
      this.currentPage = val
      this.fetchAuthorData()
    },

    // 处理进入文章管理
    handleArticleManage (row) {
      this.$message.success(`进入 ${row.name} 的文章管理`)
      // 这里可以跳转到具体的文章管理页面
      // this.$router.push(`/article-management/${row.id}`);
    },

    // 处理窗口大小变化
    handleResize () {
      if (this.chart) {
        this.chart.resize()
      }
    }
  },
  watch: {
    // 监听主题变化，更新图表颜色
    currentTheme () {
      this.updateChartData()
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
  width: 230px;
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
  width: 1350px;
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 文章管理页面特定样式 */
.article-management {
  width: 100%;
  height: 100%;
}

.page-title {
  margin-bottom: 20px;
  color: var(--primary-color);
}

.card-container {
  display: flex;
  gap: 20px;
  height: calc(100% - 60px);
}

.author-table-card {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-card {
  flex: 1;
  min-width: 0;
  height: 100%;
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
}

/* 主题样式 */
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
@media (max-width: 1200px) {
  .card-container {
    flex-direction: column;
  }

  .author-table-card,
  .chart-card {
    flex: none;
    height: auto;
  }

  .chart-container {
    min-height: 300px;
  }
}
</style>
