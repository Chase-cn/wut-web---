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
        <div class="article-detail">
          <!-- 返回按钮 -->
          <div class="back-button">
            <el-button
              type="primary"
              icon="el-icon-arrow-left"
              @click="goBack"
              size="small"
            >返回作者列表
            </el-button>
          </div>

          <!-- 上部：用户信息 -->
          <div class="user-info-section">
            <el-card class="user-avatar-card">
              <div class="avatar-container">
                <el-avatar :size="120" :src="currentUser.avatar"></el-avatar>
                <div class="user-status">
                  <el-tag :type="currentUser.status === 'active' ? 'success' : 'danger'">
                    {{ currentUser.status === 'active' ? '活跃' : '停用' }}
                  </el-tag>
                </div>
              </div>
            </el-card>

            <el-card class="user-detail-card">
              <div class="user-details">
                <div class="detail-item">
                  <span class="detail-label">姓名：</span>
                  <span class="detail-value">{{ currentUser.name }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">邮箱：</span>
                  <span class="detail-value">{{ currentUser.email }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">余额：</span>
                  <span class="detail-value">¥{{ currentUser.balance.toFixed(2) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">生日：</span>
                  <span class="detail-value">{{ currentUser.birthday }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">注册时间：</span>
                  <span class="detail-value">{{ currentUser.registerDate }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">文章总数：</span>
                  <span class="detail-value">{{ currentUser.articleCount }}</span>
                </div>
              </div>
            </el-card>
          </div>

          <!-- 下部：文章表格 -->
          <el-card class="article-table-card">
            <div slot="header" class="clearfix">
              <span>文章列表</span>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                style="float: right;"
                @click="handleAddArticle"
              >新增文章
              </el-button>
            </div>

            <el-table
              :data="articleList"
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
                prop="title"
                label="标题"
                width="180"
              ></el-table-column>
              <el-table-column
                prop="content"
                label="内容"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  {{ scope.row.content | contentEllipsis }}
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="发布时间"
                width="180"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="views"
                label="浏览量"
                width="100"
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
                    icon="el-icon-edit"
                    @click="handleEdit(scope.row)"
                  >编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination-container">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <!-- 文章编辑/新增对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetForm">

      <el-form
        :model="currentArticle"
        :rules="formRules"
        ref="articleForm"
        label-width="80px">

        <el-form-item label="标题" prop="title">
          <el-input v-model="currentArticle.title"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            v-model="currentArticle.content"
            :rows="5"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '用户',
      userAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      currentDate: new Date(),
      activeMenu: '1-2', // 默认选中文章管理菜单
      currentTheme: 'blue',

      // 当前用户信息
      currentUser: {
        name: '',
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        email: '',
        balance: 0,
        birthday: '',
        registerDate: '',
        articleCount: 0,
        status: 'active'
      },

      // 文章表格相关数据
      articleList: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 对话框相关数据
      dialogVisible: false, // 控制对话框显示/隐藏
      dialogTitle: '', // 对话框标题
      currentArticle: {}, // 当前编辑的文章数据
      formRules: { // 表单验证规则
        title: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '请输入内容',
          trigger: 'blur'
        }]
      }
    }
  },
  // 你妹的, webstorm吃分号啊! 还有eslint真tmSB
  filters: {
    contentEllipsis (value) {
      if (!value) return ''
      if (value.length > 50) {
        return value.substring(0, 50) + '...'
      }
      return value
    }
  },
  created () {
    // 从路由参数获取作者信息
    if (this.$route.query) {
      this.currentUser.name = this.$route.query.name
      this.currentUser.articleCount = this.$route.query.articleCount || 0
    }
    this.generateUserData()
    this.fetchArticleData()
  },
  mounted () {
    this.currentTheme = this.$store.state.theme
    this.username = this.$store.getters.getUserName
    this.userAvatar = this.$store.getters.getUserAvatar
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('SET_THEME', this.currentTheme)
    next()
  },
  methods: {
    goHome () {
      this.activeMenu = ''
      this.$router.push('/')
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

    // 返回作者列表
    goBack () {
      this.$router.push('/article-management')
    },

    // 生成用户模拟数据
    generateUserData () {
      const domains = ['gmail.com', 'qq.com', '163.com', 'outlook.com']
      const statuses = ['active', 'inactive']

      this.currentUser = {
        ...this.currentUser,
        email: `${this.currentUser.name.toLowerCase().replace(/\s+/g, '')}@${domains[Math.floor(Math.random() * domains.length)]}`,
        balance: Math.random() * 10000,
        birthday: `${1980 + Math.floor(Math.random() * 20)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        registerDate: `${2020 + Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      }
    },

    // 获取文章数据
    fetchArticleData () {
      this.loading = true
      // 模拟API请求
      setTimeout(() => {
        // 模拟数据
        const mockData = []
        const titles = [
          'Vue3新特性解析',
          'Element Plus使用指南',
          '前端工程化实践',
          'TypeScript入门教程',
          'Webpack配置详解',
          'React Hooks原理',
          'Node.js最佳实践',
          'CSS布局技巧',
          'JavaScript设计模式',
          '前端性能优化'
        ]

        const contents = [
          '本文详细介绍了Vue3的新特性，包括Composition API、Teleport、Fragments等',
          'Element Plus是Vue3版本的Element UI，本文介绍其基本使用方法',
          '前端工程化是现代前端开发的重要部分，本文分享一些实践经验',
          'TypeScript作为JavaScript的超集，越来越受欢迎，本文是入门指南',
          'Webpack是前端构建工具的核心，本文详解其配置方法',
          'React Hooks是React 16.8引入的新特性，本文解析其实现原理',
          'Node.js后端开发有很多最佳实践，本文总结了一些经验',
          'CSS布局是前端基础，本文介绍一些实用技巧',
          '设计模式是编程中的重要概念，本文介绍JavaScript中的实现',
          '前端性能直接影响用户体验，本文分享一些优化技巧'
        ]

        for (let i = 1; i <= 50; i++) {
          const randomTitle = titles[Math.floor(Math.random() * titles.length)]
          const randomContent = contents[Math.floor(Math.random() * contents.length)]

          mockData.push({
            id: i,
            title: `${randomTitle} (${i})`,
            content: `${randomContent} 这是第${i}篇文章的详细内容。作者${this.currentUser.name}精心创作。`,
            createTime: `${2023}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            views: Math.floor(Math.random() * 10000)
          })
        }

        // 分页处理
        const start = (this.currentPage - 1) * this.pageSize
        const end = start + this.pageSize
        this.articleList = mockData.slice(start, end)
        this.total = mockData.length
        this.loading = false
      }, 500)
    },

    // 处理分页大小变化
    handleSizeChange (val) {
      this.pageSize = val
      this.fetchArticleData()
    },

    // 处理当前页变化
    handleCurrentChange (val) {
      this.currentPage = val
      this.fetchArticleData()
    },

    // 新增文章
    handleAddArticle () {
      this.dialogTitle = '新增文章'
      this.currentArticle = {
        id: null,
        title: '',
        content: '',
        createTime: new Date().toLocaleString(),
        views: 0
      }
      this.dialogVisible = true
    },

    // 编辑文章
    handleEdit (row) {
      this.$message.success(`编辑文章: ${row.title}`)
      // 实际项目中这里可以打开一个弹窗或跳转到编辑页面
      this.dialogTitle = '编辑文章'
      this.currentArticle = JSON.parse(JSON.stringify(row)) // 深拷贝
      this.dialogVisible = true
    },

    // 删除文章
    handleDelete (row) {
      this.$confirm(`确定要删除文章 "${row.title}" 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        // 实际项目中这里调用API删除文章
        this.fetchArticleData()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },

    // 提交表单
    submitForm () {
      this.$refs.articleForm.validate(valid => {
        if (valid) {
          // 这里应该是调用API保存数据
          if (this.currentArticle.id) {
            // 编辑逻辑
            const index = this.articleList.findIndex(item => item.id === this.currentArticle.id)
            this.articleList.splice(index, 1, this.currentArticle)
            this.$message.success('文章更新成功')
          } else {
            // 新增逻辑
            this.currentArticle.id = this.articleList.length + 1
            this.articleList.unshift(this.currentArticle)
            this.$message.success('文章添加成功')
          }
          this.dialogVisible = false
        }
      })
    },

    // 重置表单
    resetForm () {
      this.$refs.articleForm.resetFields()
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

/* 文章详情页面特定样式 */
.article-detail {
  width: 100%;
  height: 100%;
}

.back-button {
  margin-bottom: 20px;
}

.user-info-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.user-avatar-card {
  width: 200px;
}

.user-detail-card {
  flex: 1;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.user-status {
  margin-top: 15px;
}

.user-details {
  padding: 20px;
}

.detail-item {
  margin-bottom: 15px;
  display: flex;
}

.detail-label {
  font-weight: bold;
  width: 100px;
  color: #666;
}

.detail-value {
  flex: 1;
}

.article-table-card {
  width: 100%;
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
</style>
