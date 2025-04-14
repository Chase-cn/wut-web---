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
              <el-form :model="form" label-width="100px" label-position="right">
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
                <!-- 替换为实际的上传接口 -->
              <img v-if="form.avatar" :src="form.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="upload-tip">建议尺寸：200×200像素，支持JPG、PNG格式</div>
            </div>
          </div>
        </template>

        <!-- 移动端布局 -->
        <template v-else>
          <div class="mobile-layout">
            <el-form :model="form" label-width="100px" label-position="top">
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
              <el-form-item label="头像上传">
                <div class="upload-header">请上传头像</div>
                <el-upload
                  class="avatar-uploader"
                  action="/api/upload"

                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                >
                  <!-- 替换为实际的上传接口 -->
                <img v-if="form.avatar" :src="form.avatar" class="avatar" />
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
      }
    }
  },
  methods: {
    handleRegister () {
      // 处理注册逻辑
      console.log('提交注册', this.form)
      // 这里可以添加表单验证和提交逻辑
    },
    handleBack () {
      // 返回登录页面逻辑
      console.log('返回登录')
      this.$router.push('/login') // 根据实际路由调整
    },
    handleAvatarSuccess (res, file) {
      // 头像上传成功回调
      this.form.avatar = URL.createObjectURL(file.raw)
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
  padding: 20px;
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
@media (max-width: 768px) {
  .register-card {
    width: 100%;
    height: 1200px;
    /*min-width: 400px;*/
  }
  .card-header {
    font-size: 1.2rem;
  }
  .mobile-layout {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 10%;
  }
  .card-footer {
    flex-direction: column;

    gap: 10px;
    padding: 15px 0;
    margin-top: 10px;
    margin-left: -10px;
  }

  .card-footer .el-button {
    width: 100%;
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
