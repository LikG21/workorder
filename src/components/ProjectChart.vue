<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 定义一个响应式引用，用于存储图表的 DOM 元素
const props = defineProps({
  workOrders: {
    type: Array,
    required: true
  }
})
// 创建一个响应式引用，用于存储图表实例
const chartRef = ref(null)
let chart = null

// 处理数据：按项目名称统计累计工时
const processChartData = (workOrders) => {
  const projectHours = {}

  workOrders.forEach(order => {
    if (projectHours[order.project]) {
      projectHours[order.project] += order.hours
    } else {
      projectHours[order.project] = order.hours
    }
  })

  const projects = Object.keys(projectHours)
  const hours = Object.values(projectHours)

  return { projects, hours }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  // Only update chart if we have data
  if (props.workOrders && props.workOrders.length > 0) {
    updateChart()
  }
}

// 更新图表数据
const updateChart = () => {
  if (!chart) return

  const { projects, hours } = processChartData(props.workOrders)

  const option = {
    title: {
      text: 'Project Hours Distribution',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c} h'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: projects,
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: 'Hours',
      axisLabel: {
        formatter: '{value}h'
      }
    },
    series: [
      {
        name: '工时',
        type: 'bar',
        data: hours,
        itemStyle: {
          color: '#1890ff'
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}h'
        }
      }
    ]
  }

  chart.setOption(option)
}

// 监听数据变化，自动更新图表
watch(() => props.workOrders, () => {
  if (chart) {
    updateChart()
  }
}, { 
  // 深度监听，确保对象内部的变化也能被监听到
  deep: true, 
  // 立即执行一次，以便在组件挂载时初始化图表
  immediate: true 
})

// 窗口大小改变时重绘图表
const handleResize = () => {
  if (chart) {
    chart.resize()
  }
}
// 组件挂载时初始化图表
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})
// 组件卸载时销毁图表实例
onUnmounted(() => {
  if (chart) {
    chart.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="less" scoped>
.chart-container {
  width: 100%;
  height: 400px;
  margin: 20px 0;

  .chart {
    width: 100%;
    height: 100%;
    min-height: 350px;
  }
}
</style>