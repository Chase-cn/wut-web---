<template>
  <div :class="['login-container', { 'mobile-layout': isMobile }]">
    <el-card class="login-card">
      <h2>用户登录</h2>
      <div class="login-content">
        <!-- 左侧：第三方登录 -->
        <div class="login-left">
          <div class="third-party-login">
            <el-button class="login-btn qq" icon="el-icon-qq" @click="thirdPartyLogin('qq')">QQ登录</el-button>
            <el-button class="login-btn wechat" icon="el-icon-wechat" @click="thirdPartyLogin('wechat')">微信登录
            </el-button>
            <el-button class="login-btn alipay" icon="el-icon-bank-card" @click="thirdPartyLogin('alipay')">支付宝登录
            </el-button>
          </div>
        </div>

        <!-- 右侧：账号密码登录 -->
        <div class="login-right">
          <el-form :model="loginForm" :rules="rules" ref="loginForm">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm" style="width: 100%">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 底部链接 -->
      <div class="login-footer">
        <el-link type="primary" @click="$router.push('/register')">注册用户</el-link>
        <!--这里用的是分割线而不是border-->
        <el-divider direction="vertical"></el-divider>
        <el-link type="primary" @click="$router.push('/reset-password')">修改密码</el-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import responsiveMixin from '@/utils/responsive'
import api from '@/api/api'

export default {
  mixins: [responsiveMixin], // 增加响应式布局的内容

  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      // rules校验立大功 (注意rules要在<标签>中注册,这可能是为什么要用$refs.loginForm进行校验的原因(本体))
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 转化成表单参数格式
          const params = new URLSearchParams()
          params.append('name', this.loginForm.username)
          params.append('password', this.loginForm.password)
          /**
           * (
           *     url: string,
           *     data?: URLSearchParams,
           *     config?: AxiosRequestConfig<URLSearchParams>,
           * ) 最基本参数方案
           */
          api.post('/users/login', params, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
            .then(res => {
              console.log('登录成功!', res)

              this.$message.success('登录成功')
              this.$router.push('/home')
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    async thirdPartyLogin (type) {
      this.$message(`正在跳转${type}登录...`, 2000)
      // 这里添加第三方登录逻辑
      try {
        // 强制等待 2 秒（不可跳过）
        await new Promise(resolve => setTimeout(resolve, 1000))
        // 等待结束后执行路由跳转
        this.$router.push('/home')
      } finally {
        this.$message(' 登录成功！', 500)
      }
    }
  }
}
</script>

<style scoped>
/*基础样式:通用*/
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: white;
}

/* 桌面端样式 + 部分通用*/
.login-container:not(.mobile-layout) {
  flex-direction: row;
}

.login-container:not(.mobile-layout) > .login-card {
  width: 50%; /* 增加宽度 */
  padding: 30px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.login-container:not(.mobile-layout) .login-content {
  display: flex;
  justify-content: space-between;
}

/*先搭框架*/
.login-container:not(.mobile-layout) .login-left {
  width: 48%;
  padding-right: 20px;
  /*分割线是怎么来的?相当于加了个右边框*/
  border-right: 1px solid #eee;
}

.login-container:not(.mobile-layout) .login-right {
  width: 48%;
  padding-left: 20px;
}

/*再填内容*/
.third-party-login {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: start;
}

.login-btn {
  margin-bottom: 15px;
  width: 100%;
}

.login-btn.qq {
  margin-left: 10px; /*补丁*/
  background-color: #12B7F5;
  color: white;
}

.login-btn.wechat {
  background-color: #07C160;
  color: white;
}

.login-btn.alipay {
  background-color: #1677FF;
  color: white;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.el-divider--vertical {
  margin: 0 10px;
}

/* 移动端样式 */
.login-container.mobile-layout {
  flex-direction: column;
}

.login-container.mobile-layout .login-left {
  width: 100%;
}

.login-container.mobile-layout .login-card {
  width: 70%; /* 增加宽度 */
  margin-bottom: 20%;
}
</style>
