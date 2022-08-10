<template>
  <div v-loading="loading">
    <div v-for="city in weatherList" :key="city?.id" class="widjet">
      {{ city?.id }}
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  import { AxiosResponse, AxiosError } from 'axios';
  import { CurrentResponse } from '../interfaces/responces'

  export default defineComponent ({
    name: 'weather-widjet',
    mounted() {
      this.getWeather();
    },
    data() {
      return {
        loading: false,
        weatherList: [],
      };
    },
    methods: {
      async getWeather() {
        this.loading = true
        const params = {
          id: 524901,
          appid: 'e758a22a0c8788762afcbadda4a20310',
          units: 'metric',
          lang: 'ru',
        };
        //@ts-ignore
        await this.$axios
          .get('https://api.openweathermap.org/data/2.5/weather', { params })
          .then((responce: AxiosResponse<CurrentResponse>):void => {
            //@ts-ignore
            this.weatherList.push(responce.data);
            console.log(responce)
          })
          .catch((error: AxiosError):void => {
            console.log(error)
          })
          .finally(():void => { this.loading = false })
      },
    },
  })
</script>

<style lang="scss">
  .widjet {
    height: fit-content;
  }
</style>
