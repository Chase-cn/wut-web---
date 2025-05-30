<template>
  <div class="register-container">
    <el-card class="register-card">
      <!-- 标题 -->
      <template #header>
        <div class="card-header">
          <span>注册新用户</span>
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
                <el-form-item label="密码" prop="password">
                  <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday">
                  <el-date-picker
                    v-model="form.birthday"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <div class="right-section">
              <div class="upload-header">请上传头像</div>
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <!-- 替换为实际的上传接口 action-->
                <img v-if="form.avatar" :src="form.avatar" class="avatar"/>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="upload-tip">建议尺寸：200×200像素，支持JPG、PNG格式</div>
            </div>
          </div>
        </template>

        <!-- 移动端布局 -->
        <template v-else>
          <div class="mobile-layout">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px" label-position="top">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker
                  v-model="form.birthday"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="头像上传" prop="avatar">
                <div class="upload-header">请上传头像</div>
                <el-upload
                  class="avatar-uploader"
                  action="/api/upload"

                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <!-- 替换为实际的上传接口 -->
                  <img v-if="form.avatar" :src="form.avatar" class="avatar"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="upload-tip">建议尺寸：200×200像素，支持JPG、PNG格式</div>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </div>

      <!-- 底部按钮 -->
      <div class="card-footer">
        <el-button type="primary" @click="handleRegister">注册用户</el-button>
        <el-button @click="handleBack">返回登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import responsiveMixin from '@/utils/responsive'
import api from '@/api/api'

export default {
  mixins: [responsiveMixin], // 替换为实际的mixin名称
  data () {
    return {
      form: {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        birthday: '',
        avatar: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 16,
            message: '长度在 3 到 16 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error('两次输入的密码不一致！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱格式',
            trigger: ['blur', 'change']
          }
        ],
        birthday: [
          {
            type: 'date',
            required: true,
            message: '请选择出生日期',
            trigger: 'change'
          }
        ],
        avatar: [
          {
            required: true,
            message: '请上传头像',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    async handleRegister () {
      // 处理注册逻辑
      console.log('提交注册', this.form)
      // 补丁,关于日期类型转化
      if (this.form.birthday.length > 0) {
        this.form.birthday = new Date(this.form.birthday)
      }
      // console.log('生日', typeof this.form.birthday)

      // 验证表单
      const valid = await this.$refs.form.validate()
      // const res = await axios.post('/api/register', this.form)
      if (!valid) {
        return
      }

      // 设置默认头像
      if (this.form.avatar.length < 1) {
        this.form.avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      }

      // 构造请求体
      const params = {
        name: this.form.username,
        email: this.form.email,
        password: this.form.password,
        birthday: this.form.birthday,
        avatar: this.form.avatar // avatar打错了,改了半天bug,无语。。。
      }

      console.log('传给后端的注册信息', params)

      api.post('/users/register', params, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log(response)
        this.$message.success('注册成功! ')
        this.$router.push('/login') // 跳转到登录页
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    handleBack () {
      // 返回登录页面逻辑
      console.log('返回登录')
      this.$router.push('/login') // 根据实际路由调整
    },
    handleAvatarSuccess (res, file) {
      // 头像上传成功回调
      console.log(res)
      // this.form.avatar = URL.createObjectURL(file.raw)  //将网络url转化为本地可用的url
      this.form.avatar = res
    },
    beforeAvatarUpload (file) {
      // 头像上传前校验
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 0px;
  background-color: white;
}

.register-card {
  width: 100%;
  max-width: 900px;
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
  gap: 30px;
}

.left-section {
  flex: 1;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-header {
  font-size: 1rem;
  margin-bottom: 15px;
  text-align: center;
  font-weight: bold;
}

.upload-tip {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #999;
  text-align: center;
}

.card-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 20px;
}

/* 头像上传样式 */
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 150px;
  height: 150px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* 移动端适配 */
@media (max-width: 800px) {
  .register-container {
    height: 100%; /*单一滚动条补丁*/
  }

  .register-card {
    width: 100%;
    height: 800px; /*设置为具体的px值可以补丁el-card吃内容的问题*/
    min-width: 380px; /*拉宽遮进度条*/
    overflow-y: auto; /*进度条*/
    margin-top: -30px; /*遮刘海*/
  }

  .card-header {
    font-size: 1.2rem;
  }

  .mobile-layout {
    margin-top: -15px; /*表单主体(独属于mobile部分) 离卡头近一些*/
  }

  .card-footer {
    flex-direction: column;
    justify-content: flex-start;
    gap: 10px;
    padding: 15px 0;
    margin-top: 10px;
  }

  .card-footer .el-button {
    width: 100%;
    margin-left: -3px; /*对齐补丁*/
  }

  .avatar-uploader {
    width: 120px;
    height: 120px;
  }

  .avatar-uploader-icon {
    width: 120px;
    height: 120px;
    line-height: 120px;
  }
}
</style>
