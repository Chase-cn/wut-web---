<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>用户登录</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button @click="$router.push('/register')">注册</el-button>
          <el-link type="primary" @click="$router.push('/reset-password')">忘记密码?</el-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 这里添加登录逻辑
          this.$message.success('登录成功')
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}
.login-card {
  width: 400px;
  padding: 20px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.el-button + .el-button {
  margin-left: 10px;
}
.el-link {
  margin-left: 10px;
}
</style>
