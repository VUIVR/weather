<template>
  <el-row class="main-page">
    <weather-widjet />
  </el-row>
</template>

<script>
import weatherWidjet from './components/weather-widget'

export default {
  name: 'app',
  components: {
    weatherWidjet
  }
}
</script>

<style>
.main-page {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
