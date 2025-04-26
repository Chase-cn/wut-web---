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
              <el-form :model="form" :rules="rules" ref="form" label-width="100px" label-position="right">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="right-section">
              <el-form :model="form" :rules="rules" ref="form"  label-width="100px" label-position="right">
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </template>

        <!-- 移动端布局 -->
        <template v-else>
          <div class="mobile-layout">
            <el-form :model="form"  :rules="rules" ref="form" label-width="0px" label-position="top" >
              <el-form-item label="用户名" label-width="0px" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名" ></el-input>
              </el-form-item>
              <el-form-item label="旧密码" label-width="0px" prop="oldPassword">
                <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码"></el-input>
              </el-form-item>
              <el-form-item label="新密码" label-width="0px" prop="newPassword">
                <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" label-width="0px" prop="confirmPassword">
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
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 16, message: '用户名长度为 3 到 16 个字符', trigger: 'blur' }
        ],
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度为 6 到 20 个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度为 6 到 20 个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === this.form.oldPassword) {
                callback(new Error('新密码不能与旧密码相同'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.newPassword) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }

    }
  },
  methods: {
    async handleSubmit () {
      try {
        // 1. 触发表单验证
        const valid = await this.$refs.form.validate()
        if (!valid) return // 验证失败时终止

        // 2. 检查新旧密码是否相同（额外校验，避免绕过前端规则）
        if (this.form.newPassword === this.form.oldPassword) {
          this.$message.error('新密码不能与旧密码相同')
          return
        }

        // 3. 构造请求数据（可根据后端需求调整字段）
        // const payload = {
        //   username: this.form.username,
        //   oldPassword: this.form.oldPassword,
        //   newPassword: this.form.newPassword
        // }

        // 4. 调用API提交修改密码请求
        // const res = await axios.post('/api/change-password', payload)

        // 5. 处理响应结果
        // if (res.data.success) {
        this.$message.success('密码修改成功！')
        this.$router.push('/login') // 跳转到登录页
        // } else {
        // this.$message.error(res.data.message || '密码修改失败')
        // }
      } catch (error) {
        // 6. 统一错误处理
        console.error('修改密码失败:', error)
        this.$message.error(
          error.response?.data?.message ||
          '网络错误，请稍后重试'
        )
      } finally {
        // 7. 可选的清理操作（如禁用按钮状态恢复）
      }
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
/*一定要搞清楚是'谁的'margin padding在起主导作用,调了没用一定是找错人了*/
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
    width: 120%;
    min-width: 300px;/*补丁*/
  }

  .card-header {
    font-size: 1.2rem;
    /*margin-bottom: -30px;*/
  }

  .card-body {
    padding: 0px;
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
