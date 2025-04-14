<template>
  <div class="forget-password-container">
    <el-card class="password-card">
      <!-- 标题 -->
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>

      <!-- 主体内容 -->
      <div :class="['card-body', { 'mobile-layout': isMobile }]">
        <!-- 桌面端布局 -->
        <template v-if="!isMobile">
          <div class="desktop-layout">
            <div class="left-section">
              <el-form :model="form" label-width="100px" label-position="right">
                <el-form-item label="用户名">
                  <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="旧密码">
                  <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="right-section">
              <el-form :model="form" label-width="100px" label-position="right">
                <el-form-item label="新密码">
                  <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                  <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </template>

        <!-- 移动端布局 -->
        <template v-else>
          <div class="mobile-layout">
            <el-form :model="form" label-width="0px" label-position="top" >
              <el-form-item label="用户名" label-width="0px" >
                <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="旧密码" label-width="0px">
                <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码"></el-input>
              </el-form-item>
              <el-form-item label="新密码" label-width="0px">
                <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" label-width="0px">
                <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </div>

      <!-- 底部按钮 -->
      <div class="card-footer">
        <el-button type="primary" @click="handleSubmit">修改密码</el-button>
        <el-button @click="handleBack">返回登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import responsiveMixin from '@/utils/responsive'
export default {
  mixins: [responsiveMixin], // 替换为实际的mixin名称
  data () {
    return {
      form: {
        username: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    handleSubmit () {
      // 处理修改密码逻辑
      console.log('提交修改密码', this.form)
      // 这里可以添加表单验证和提交逻辑
    },
    handleBack () {
      // 返回登录页面逻辑
      console.log('返回登录')
      this.$router.push('/login') // 根据实际路由调整
    }
  }
}
</script>

<style scoped>
.forget-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: white;
}

.password-card {
  width: 100%;
  max-width: 800px;
}

.card-header {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.card-body {
  padding: 20px;
}

.desktop-layout {
  display: flex;
  gap: 20px;
}

.left-section, .right-section {
  flex: 1;
  margin-left: -20px;
}

.mobile-layout .el-form-item {
  margin-bottom: 0px;
  margin-top: 0px;
}

.card-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 20px;
}

/* 移动端适配 */
@media (max-width: 800px) {
  .password-card {
    width: 100%;
  }

  .card-header {
    font-size: 1.2rem;
    /*margin-bottom: -30px;*/
  }

  .card-footer {
    flex-direction: column;
    justify-content: flex-start;
    gap: 10px;
  }

  .card-footer .el-button {
    width: 100%;
    margin-left: -2px;
  }
}
</style>
