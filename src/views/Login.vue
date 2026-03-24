<template>
  <div class="login-container">
    <a-card title="工单管理系统登录" class="login-card">
      <a-form
        :model="loginForm"
        name="login"
        @finish="handleLogin"
        layout="vertical"
      >
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input v-model:value="loginForm.username" placeholder="请输入用户名" />
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password v-model:value="loginForm.password" placeholder="请输入密码" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" block :loading="loading">
            登录
          </a-button>
        </a-form-item>
      </a-form>

      <div class="login-tip">
        <p>提示：</p>
        <p>用户名 admin → 管理员权限</p>
        <p>其他用户名 → 普通用户权限</p>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const handleLogin = () => {
  loading.value = true

  // 模拟登录延迟
  setTimeout(() => {
    // 权限规则：用户名为 admin → 管理员；其他 → 普通用户
    const isAdmin = loginForm.username === 'admin'

    // 存储用户信息到 localStorage
    localStorage.setItem('userInfo', JSON.stringify({
      username: loginForm.username,
      isAdmin: isAdmin
    }))

    loading.value = false
    message.success(`登录成功！欢迎 ${loginForm.username}`)
    router.push('/home')
  }, 1000)
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .login-card {
    width: 400px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    :deep(.ant-card-head-title) {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .login-tip {
    margin-top: 16px;
    padding: 12px;
    background-color: #f6f8fa;
    border-radius: 4px;
    font-size: 12px;
    color: #666;

    p {
      margin: 4px 0;
    }
  }
}
</style>