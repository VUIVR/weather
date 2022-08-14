<template>
    <weather-widjet />
</template>

<script>
import weatherWidjet from './components/weather-widget'

export default {
  components: {
    weatherWidjet
  }
}
</script>

<style>
.main-page {
  display: flex;
  justify-content: center;
  margin-top: 10vh;
}
</style>
