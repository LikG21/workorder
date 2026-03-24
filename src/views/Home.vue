<template>
  <div class="home-container">
    <!-- 头部导航 -->
    <div class="header">
      <div class="header-left">
        <h1>工单管理系统</h1>
        <span class="user-info">
          当前用户：{{ userInfo?.username }}
          <span class="role-tag" :class="userInfo?.isAdmin ? 'admin' : 'user'">
            {{ userInfo?.isAdmin ? "管理员" : "普通用户" }}
          </span>
        </span>
      </div>
      <a-button type="primary" danger @click="handleLogout">
        退出登录
      </a-button>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-wrapper">
        <!-- 左侧：工单列表 -->
        <div class="left-panel">
          <a-card title="工单列表" class="table-card">
            <a-table
              :columns="columns"
              :data-source="workOrders"
              :row-key="(record) => record.id"
              :pagination="pagination"
              size="small"
              bordered
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'overtime'">
                  <!-- record.overtime转字符 -->
                  <div v-if="record.overtime.toString() != ''">
                    {{ record.overtime.toString() }}
                  </div>
                  <div v-else>
                    {{ record.overtime ? "Yes" : "No" }}
                  </div>
                </template>
                <template v-if="column.key === 'hours'">
                  {{ record.hours }}h
                </template>
                <template v-if="column.key === 'action' && userInfo?.isAdmin">
                  <a-popconfirm
                    title="确定要删除这个工单吗？"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="handleDelete(record.id)"
                  >
                    <a-button type="link" danger size="small">删除</a-button>
                  </a-popconfirm>
                </template>
              </template>
            </a-table>
          </a-card>
        </div>

        <!-- 右侧：图表展示 -->
        <div class="right-panel" v-if="workOrders.length != 0">
          <a-card title="项目工时分布图" class="chart-card">
            <project-chart :work-orders="workOrders" />
          </a-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import ProjectChart from "../components/ProjectChart.vue";

const router = useRouter();

// 用户信息
const userInfo = ref(null);

// 模拟数据
const mockData = [
  {
    id: "001",
    project: "Road Project A",
    overtime: true,
    hours: 3.5,
    created_at: "2024-04-10 10:30",
  },
  {
    id: "002",
    project: "Bridge Maintenance B",
    overtime: false,
    hours: 2,
    created_at: "2024-04-09 13:00",
  },
  {
    id: "003",
    project: "Pipeline Fix C",
    overtime: true,
    hours: 4.5,
    created_at: "2024-04-08 08:00",
  },
  {
    id: "004",
    project: "Bridge Maintenance B",
    overtime: true,
    hours: 3,
    created_at: "2024-04-07 16:45",
  },
  {
    id: "005",
    project: "Tunnel Cleaning D",
    overtime: false,
    hours: 8.1,
    created_at: "2024-04-03 11:43",
  },
];

// 工单数据
const workOrders = ref([...mockData]);

// 表格列定义
const columns = reactive([
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
    align: "center",
  },
  {
    title: "Project",
    dataIndex: "project",
    key: "project",
    align: "center",
  },
  {
    title: "Overtime",
    dataIndex: "overtime",
    key: "overtime",
    width: 100,
    align: "center",
  },
  {
    title: "Hours",
    dataIndex: "hours",
    key: "hours",
    width: 100,
    align: "center",
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    width: 200,
    align: "center",
  },
]);

// 初始化列配置
const updateColumns = () => {
  if (userInfo.value?.isAdmin) {
    columns.push({
      title: "操作",
      key: "action",
      width: 100,
      align: "center",
    });
  }
};

// 分页配置
const pagination = reactive({
  current: 1, // 当前页码
  total: workOrders.value.length,
  pageSize: 10,
  pageSizeOptions: ["10", "20", "50", "100"], // 页面大小选项
  showSizeChanger: true, // 显示页面大小选择器
  showQuickJumper: true, // 显示快速跳转
  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
  onChange: (page, pageSize) => {
    // 当页码或页面大小改变时更新配置
    pagination.current = page;
    if (pageSize) {
      pagination.pageSize = pageSize;
    }
  },
  onShowSizeChange: (current, pageSize) => {
    // 专门处理页面大小变化
    pagination.current = 1; // 重置到第一页
    pagination.pageSize = pageSize;
    pagination.total = workOrders.value.length; // 更新总数
  },
});

// 获取用户信息
const getUserInfo = () => {
  const userInfoStr = localStorage.getItem("userInfo");

  if (userInfoStr) {
    userInfo.value = JSON.parse(userInfoStr);
    updateColumns();
  } else {
    router.push("/login");
  }
};

// 删除工单
const handleDelete = (id) => {
  const index = workOrders.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    workOrders.value.splice(index, 1);
    message.success("删除成功！");
    // 更新分页总数
    pagination.total = workOrders.value.length;
    // 如果当前页没有数据了，回到上一页
    const maxPage = Math.ceil(pagination.total / pagination.pageSize);
    if (pagination.current > maxPage && maxPage > 0) {
      pagination.current = maxPage;
    }
  }
};

// 退出登录
const handleLogout = () => {
  localStorage.removeItem("userInfo");
  message.success("已退出登录");
  router.push("/login");
};
// 获取用户信息
onMounted(() => {
  getUserInfo();
  // 初始化分页总数
  pagination.total = workOrders.value.length;
});
</script>

<style lang="less" scoped>
.home-container {
  min-height: 100vh;
  background-color: #f0f2f5;

  .header {
    background: #fff;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      h1 {
        margin: 0;
        color: #1890ff;
        font-size: 24px;
      }

      .user-info {
        font-size: 14px;
        color: #666;

        .role-tag {
          margin-left: 8px;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          color: #fff;

          &.admin {
            background-color: #f50;
          }

          &.user {
            background-color: #52c41a;
          }
        }
      }
    }
  }

  .main-content {
    padding: 24px;
    max-width: 1600px;
    margin: 0 auto;

    .content-wrapper {
      display: flex;
      gap: 24px;
      align-items: flex-start;

      .left-panel {
        flex: 1;
        min-width: 600px;

        .table-card {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          height: fit-content;

          :deep(.ant-table) {
            max-height: 500px;
            overflow-y: auto;
          }
        }
      }

      .right-panel {
        flex: 1;
        min-width: 500px;

        .chart-card {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }
      }
    }
  }
}
</style>
