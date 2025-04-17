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
      <!-- 右侧内容区 -->
      <div class="main-content">
        <div class="user-management-container">
          <h2 class="page-title">用户管理</h2>
          <div class="operation-bar">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="handleAdd"
              class="add-btn"
            >
              新增
            </el-button>
            <el-input
              v-model="searchQuery"
              placeholder="请输入姓名搜索"
              class="search-input"
              clearable
              @clear="handleSearchClear"
              @keyup.enter.native="handleSearch"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSearch"
              />
            </el-input>
          </div>
          <el-table
            :data="filteredUserList"
            border
            style="width: 100%"
            class="user-table"
            :header-cell-style="{ background: currentTheme === 'blue' ? '#ecf5ff' : '#fdf6ec' }"
          >
            <el-table-column
              type="index"
              label="序号"
              width="60"
              align="center"
            />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="province" label="省份" width="120" />
            <el-table-column prop="city" label="市区" width="120" />
            <el-table-column prop="address" label="地址" />
            <el-table-column prop="zip" label="邮编" width="100" />
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
                >
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
            />
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
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <h2>用户管理</h2>
      </span>
      <div class="mobile-content">
        <div class="mobile-operation-bar">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            size="small"
            circle
          />
          <el-input
            v-model="searchQuery"
            placeholder="搜索"
            class="mobile-search-input"
            clearable
            @clear="handleSearchClear"
            @keyup.enter.native="handleSearch"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleSearch"
            />
          </el-input>
        </div>
        <div class="mobile-user-list">
          <div
            v-for="(user, index) in filteredUserList"
            :key="index"
            class="mobile-user-item"
          >
            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-address">
                {{ user.province }} {{ user.city }} {{ user.address }}
              </div>
              <div class="user-zip">邮编: {{ user.zip }}</div>
            </div>
            <div class="user-actions">
              <el-button
                size="mini"
                @click="handleEdit(index, user)"
                class="action-btn"
              >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(index, user)"
                class="action-btn"
              >删除</el-button
              >
            </div>
          </div>
        </div>
        <div class="mobile-pagination">
          <el-pagination
            small
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15]"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="total"
          />
        </div>
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="userForm"
        :rules="rules"
        ref="userForm"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="userForm.province"></el-input>
        </el-form-item>
        <el-form-item label="市区" prop="city">
          <el-input v-model="userForm.city"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userForm.address"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="zip">
          <el-input v-model="userForm.zip"></el-input>
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
import responsiveMixin from '@/utils/responsive'

export default {
  mixins: [responsiveMixin],
  data () {
    return {
      username: '管理员',
      currentTheme: 'blue',
      activeMenu: '1-1',
      currentDate: new Date(),
      // 用户管理相关数据
      userList: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 对话框相关
      dialogVisible: false,
      dialogTitle: '新增用户',
      userForm: {
        id: '',
        name: '',
        province: '',
        city: '',
        address: '',
        zip: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请输入省份', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入市区', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        zip: [
          { required: true, message: '请输入邮编', trigger: 'blur' },
          { pattern: /^[0-9]{6}$/, message: '邮编为6位数字', trigger: 'blur' }
        ]
      },
      editIndex: -1
    }
  },
  computed: {
    filteredUserList () {
      // 实际项目中这里应该是从API获取的分页数据
      // 这里为了演示，我们做前端过滤和分页
      let list = this.userList
      if (this.searchQuery) {
        list = list.filter(item =>
          item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.total = list.length // 按理说计算属性不该产生副作用(修改值),所以eslint报错,所以把严谨性给禁用了
      // 模拟分页
      return list.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      )
    }
  },
  created () {
    this.mockUserData()
  },
  methods: {
    goHome () {
      this.activeMenu = ''
      // 实际项目中这里应该是路由跳转
      this.$router.push('/home')
    },
    handleMenuSelect (index) {
      this.activeMenu = index
      if (index === '1-1') {
        // 用户管理
      } else if (index === '1-2') {
        // 文章管理
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
      }
    },
    // 用户管理相关方法
    mockUserData () {
      // 模拟数据
      const mockData = []
      const provinces = ['北京', '上海', '广东', '江苏', '浙江', '四川', '湖北']
      const cities = {
        北京: ['朝阳区', '海淀区', '东城区', '西城区'],
        上海: ['黄浦区', '徐汇区', '长宁区', '静安区'],
        广东: ['广州市', '深圳市', '珠海市', '东莞市'],
        江苏: ['南京市', '苏州市', '无锡市', '常州市'],
        浙江: ['杭州市', '宁波市', '温州市', '绍兴市'],
        四川: ['成都市', '绵阳市', '乐山市', '自贡市'],
        湖北: ['武汉市', '宜昌市', '襄阳市', '黄石市']
      }
      const streets = [
        '人民路',
        '解放路',
        '中山路',
        '建设路',
        '和平路',
        '新华路',
        '胜利路'
      ]

      for (let i = 1; i <= 50; i++) {
        const province = provinces[Math.floor(Math.random() * provinces.length)]
        const city = cities[province][
          Math.floor(Math.random() * cities[province].length)
        ]
        const street = streets[Math.floor(Math.random() * streets.length)]
        const num = Math.floor(Math.random() * 100) + 1

        mockData.push({
          id: i,
          name: `用户${i}`,
          province: province,
          city: city,
          address: `${street}${num}号`,
          zip: Math.floor(100000 + Math.random() * 900000).toString()
        })
      }

      this.userList = mockData
      this.total = mockData.length
    },
    handleAdd () {
      this.dialogTitle = '新增用户'
      this.userForm = {
        id: '',
        name: '',
        province: '',
        city: '',
        address: '',
        zip: ''
      }
      this.editIndex = -1
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
    },
    handleEdit (index, row) {
      this.dialogTitle = '编辑用户'
      this.userForm = JSON.parse(JSON.stringify(row))
      this.editIndex = index
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
    },
    handleDelete (index, row) {
      this.$confirm('确认删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.userList.splice(
            (this.currentPage - 1) * this.pageSize + index,
            1
          )
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    submitForm () {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.editIndex === -1) {
            // 新增
            this.userForm.id = this.userList.length + 1
            this.userList.unshift(this.userForm)
          } else {
            // 编辑
            const realIndex =
              (this.currentPage - 1) * this.pageSize + this.editIndex
            this.userList.splice(realIndex, 1, this.userForm)
          }
          this.dialogVisible = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          return false
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    handleSearch () {
      this.currentPage = 1
    },
    handleSearchClear () {
      this.searchQuery = ''
      this.currentPage = 1
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
  justify-content: flex-start; /* 明确左对齐 */
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
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  width:1350px;
}

.user-management-container {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.page-title {
  margin-bottom: 20px;
  color: var(--primary-color);
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.add-btn {
  margin-right: 10px;
}

.search-input {
  width: 300px;
}

.user-table {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
}

/* 移动端样式 */
.mobile-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e6e6e6;
}

.mobile-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--primary-color);
}

.mobile-menu-trigger {
  font-size: 24px;
  margin-right: 15px;
  cursor: pointer;
  color: var(--primary-color);
}

.mobile-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: white;
}

.mobile-operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 5px 0;
}

.mobile-search-input {
  width: 70%;
}

.mobile-user-list {
  margin-top: 10px;
}

.mobile-user-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--primary-color);
}

.user-address {
  font-size: 14px;
  color: #666;
  margin-bottom: 3px;
}

.user-zip {
  font-size: 12px;
  color: #999;
}

.user-actions {
  display: flex;
  flex-direction: column;
}

.action-btn {
  margin: 2px 0;
  padding: 5px 8px;
}

.mobile-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

/* 主题样式 */
.blue {
  --primary-color: #409eff;
  --secondary-color: #ecf5ff;
  --bg-color: #f5f9ff;
  --sidebar-bg: #e6f0ff;
}

.yellow {
  --primary-color: #e6a23c;
  --secondary-color: #fdf6ec;
  --bg-color: #fffaf0;
  --sidebar-bg: #fff5e6;
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
    padding: 10px;
  }

  .user-management-container {
    padding: 15px;
  }

  .operation-bar {
    flex-direction: column;
  }

  .add-btn {
    margin-bottom: 10px;
    margin-right: 0;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }
}
</style>
