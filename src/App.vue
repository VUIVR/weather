<template>
  <div class="main-page">
    <weather-widjet />
  </div>
</template>

<script lang="ts">
import weatherWidjet from '@/components/weather-widget.vue'

export default {
  components: {
    weatherWidjet
  },
  methods: {
  },
}
</script>

<style>
.main-page {
  display: flex;
  justify-content: center;
  margin-top: 10vh;
}
</style>
