<!-- 个人中心页面 -->
<template>
  <div class="user-center-root">
    <div class="user-center-wrap flex-b">
      <!-- 左侧：个人资料卡片 -->
      <div class="profile-col">
        <div class="profile-card art-card-sm">
          <img class="profile-bg" src="@imgs/user/bg.webp" />
          <img class="profile-avatar" src="@imgs/user/avatar.webp" />
          <h2 class="profile-name">{{ userInfo.userName }}</h2>
          <p class="profile-desc">专注于用户体验跟视觉设计</p>

          <div class="profile-info">
            <div class="info-row">
              <ArtSvgIcon icon="ri:mail-line" class="info-icon" />
              <span class="info-text">jdkjjfnndf@mall.com</span>
            </div>
            <div class="info-row">
              <ArtSvgIcon icon="ri:user-3-line" class="info-icon" />
              <span class="info-text">交互专家</span>
            </div>
            <div class="info-row">
              <ArtSvgIcon icon="ri:map-pin-line" class="info-icon" />
              <span class="info-text">广东省深圳市</span>
            </div>
            <div class="info-row">
              <ArtSvgIcon icon="ri:dribbble-fill" class="info-icon" />
              <span class="info-text">字节跳动－某某平台部－UED</span>
            </div>
          </div>

          <div class="tags-section">
            <h3 class="tags-title">标签</h3>
            <div class="tags-list">
              <div
                v-for="item in lableList"
                :key="item"
                class="tag-item"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：设置区域 -->
      <div class="settings-col">
        <div class="art-card-sm">
          <h1 class="card-title">基本设置</h1>

          <ElForm
            :model="form"
            class="settings-form"
            ref="ruleFormRef"
            :rules="rules"
            label-width="86px"
            label-position="top"
          >
            <ElRow>
              <ElFormItem label="姓名" prop="realName">
                <ElInput v-model="form.realName" :disabled="!isEdit" />
              </ElFormItem>
              <ElFormItem label="性别" prop="sex" class="form-item-ml">
                <ElSelect v-model="form.sex" placeholder="Select" :disabled="!isEdit">
                  <ElOption
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElRow>

            <ElRow>
              <ElFormItem label="昵称" prop="nikeName">
                <ElInput v-model="form.nikeName" :disabled="!isEdit" />
              </ElFormItem>
              <ElFormItem label="邮箱" prop="email" class="form-item-ml">
                <ElInput v-model="form.email" :disabled="!isEdit" />
              </ElFormItem>
            </ElRow>

            <ElRow>
              <ElFormItem label="手机" prop="mobile">
                <ElInput v-model="form.mobile" :disabled="!isEdit" />
              </ElFormItem>
              <ElFormItem label="地址" prop="address" class="form-item-ml">
                <ElInput v-model="form.address" :disabled="!isEdit" />
              </ElFormItem>
            </ElRow>

            <ElFormItem label="个人介绍" prop="des" class="form-item-tall">
              <ElInput type="textarea" :rows="4" v-model="form.des" :disabled="!isEdit" />
            </ElFormItem>

            <div class="flex-c button-row">
              <ElButton type="primary" v-ripple @click="edit">
                {{ isEdit ? '保存' : '编辑' }}
              </ElButton>
            </div>
          </ElForm>
        </div>

        <div class="art-card-sm pwd-card">
          <h1 class="card-title">更改密码</h1>

          <ElForm :model="pwdForm" class="settings-form" label-width="86px" label-position="top">
            <ElFormItem label="当前密码" prop="password">
              <ElInput
                v-model="pwdForm.password"
                type="password"
                :disabled="!isEditPwd"
                show-password
              />
            </ElFormItem>

            <ElFormItem label="新密码" prop="newPassword">
              <ElInput
                v-model="pwdForm.newPassword"
                type="password"
                :disabled="!isEditPwd"
                show-password
              />
            </ElFormItem>

            <ElFormItem label="确认新密码" prop="confirmPassword">
              <ElInput
                v-model="pwdForm.confirmPassword"
                type="password"
                :disabled="!isEditPwd"
                show-password
              />
            </ElFormItem>

            <div class="flex-c button-row">
              <ElButton type="primary" v-ripple @click="editPwd">
                {{ isEditPwd ? '保存' : '编辑' }}
              </ElButton>
            </div>
          </ElForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store/modules/user'
  import type { FormInstance, FormRules } from 'element-plus'

  defineOptions({ name: 'UserCenter' })

  const userStore = useUserStore()
  const userInfo = computed(() => userStore.getUserInfo)

  const isEdit = ref(false)
  const isEditPwd = ref(false)
  const date = ref('')
  const ruleFormRef = ref<FormInstance>()

  /**
   * 用户信息表单
   */
  const form = reactive({
    realName: 'John Snow',
    nikeName: '皮卡丘',
    email: '59301283@mall.com',
    mobile: '18888888888',
    address: '广东省深圳市宝安区西乡街道101栋201',
    sex: '2',
    des: 'Art Design Pro 是一款兼具设计美学与高效开发的后台系统.'
  })

  /**
   * 密码修改表单
   */
  const pwdForm = reactive({
    password: '123456',
    newPassword: '123456',
    confirmPassword: '123456'
  })

  /**
   * 表单验证规则
   */
  const rules = reactive<FormRules>({
    realName: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    nikeName: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
    address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'blur' }]
  })

  /**
   * 性别选项
   */
  const options = [
    { value: '1', label: '男' },
    { value: '2', label: '女' }
  ]

  /**
   * 用户标签列表
   */
  const lableList: Array<string> = ['专注设计', '很有想法', '辣~', '大长腿', '川妹子', '海纳百川']

  onMounted(() => {
    getDate()
  })

  /**
   * 根据当前时间获取问候语
   */
  const getDate = () => {
    const h = new Date().getHours()

    if (h >= 6 && h < 9) date.value = '早上好'
    else if (h >= 9 && h < 11) date.value = '上午好'
    else if (h >= 11 && h < 13) date.value = '中午好'
    else if (h >= 13 && h < 18) date.value = '下午好'
    else if (h >= 18 && h < 24) date.value = '晚上好'
    else date.value = '很晚了，早点睡'
  }

  /**
   * 切换用户信息编辑状态
   */
  const edit = () => {
    isEdit.value = !isEdit.value
  }

  /**
   * 切换密码编辑状态
   */
  const editPwd = () => {
    isEditPwd.value = !isEditPwd.value
  }
</script>

<style scoped lang="scss">
  /* 根容器：透明背景无边框 */
  .user-center-root {
    width: 100%;
    height: 100%;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }

  /* 主体布局容器 */
  .user-center-wrap {
    position: relative;
    margin-top: 0.625rem;
  }

  /* 左侧个人资料卡片列 */
  .profile-col {
    width: 28rem;
    margin-right: 1.25rem;
  }

  /* 个人资料卡片 */
  .profile-card {
    position: relative;
    padding: 2.25rem 2.25rem 1.5rem;
    overflow: hidden;
    text-align: center;
  }

  /* 顶部背景图 */
  .profile-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 12.5rem;
    object-fit: cover;
  }

  /* 头像 */
  .profile-avatar {
    position: relative;
    z-index: 10;
    width: 5rem;
    height: 5rem;
    margin-top: 7.5rem;
    margin-left: auto;
    margin-right: auto;
    object-fit: cover;
    border: 2px solid white;
    border-radius: 9999px;
  }

  /* 用户名 */
  .profile-name {
    margin-top: 1.25rem;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 400;
  }

  /* 简介 */
  .profile-desc {
    margin-top: 1.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  /* 资料信息容器 */
  .profile-info {
    width: 18.75rem;
    margin: 1.875rem auto 0;
    text-align: left;
  }

  /* 信息行 */
  .info-row {
    margin-top: 0.625rem;
  }

  /* 信息图标颜色 */
  .info-icon {
    color: var(--art-gray-700);
  }

  /* 信息文字 */
  .info-text {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  /* 标签区域 */
  .tags-section {
    margin-top: 2.5rem;
  }

  /* 标签标题 */
  .tags-title {
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
  }

  /* 标签列表 */
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0.875rem;
  }

  /* 标签项 */
  .tag-item {
    padding: 0.25rem 0.375rem;
    margin-right: 0.625rem;
    margin-bottom: 0.625rem;
    font-size: 0.75rem;
    line-height: 1rem;
    border: 1px solid var(--art-gray-300);
    border-radius: 0.25rem;
  }

  /* 右侧设置列 */
  .settings-col {
    flex: 1 1 0%;
    overflow: hidden;
  }

  /* 卡片标题 */
  .card-title {
    padding: 1rem;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 400;
    border-bottom: 1px solid var(--art-gray-300);
  }

  /* 设置表单容器 */
  .settings-form {
    box-sizing: border-box;
    padding: 1.25rem;

    /* 表单项宽度（一行两个，留 10px 间距） */
    :deep(.el-row .el-form-item) {
      width: calc(50% - 10px);
    }

    /* 输入框 / 选择器宽度铺满 */
    :deep(.el-row .el-input),
    :deep(.el-row .el-select) {
      width: 100%;
    }
  }

  /* 表单项左间距（右侧列） */
  .form-item-ml {
    margin-left: 1.25rem;
  }

  /* 个人介绍表单项高度 */
  .form-item-tall {
    height: 8rem;
  }

  /* 按钮行 */
  .button-row {
    justify-content: flex-end;

    /* 按钮统一宽度 */
    :deep(.el-button) {
      width: 6.875rem !important;
    }
  }

  /* 密码卡片上下间距 */
  .pwd-card {
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
  }

  /* 响应式 max-md: 最大宽度 47.99rem（768px），单列布局 */
  @media (max-width: 47.99rem) {
    .user-center-wrap {
      display: block;
      margin-top: 0.25rem;
    }

    .profile-col {
      width: 100%;
      margin-right: 0;
    }

    .settings-col {
      width: 100%;
      margin-top: 0.875rem;
    }
  }
</style>
