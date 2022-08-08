<template>
  <div class="widjet">dfs,g;lksdjfg;lkjdgkl;</div>
</template>

<script lang="ts">
  import { AxiosResponse, AxiosError } from 'axios';
  export default {
    name: 'weather-widjet',
    mounted() {
      this.getWeather();
    },
    methods: {
      async getWeather() {
        const params = {
          id: 524901,
          appid: 'e758a22a0c8788762afcbadda4a20310',
          units: 'metric',
          lang: 'ru',
        };
        //@ts-ignore
        await this.axios
          .get('https://api.openweathermap.org/data/2.5/weather', { params })
          .then((responce: AxiosResponse<any>): void => {
            console.log(responce);
          })
          .catch((error: AxiosError): void => {
            console.log(error);
          });
      },
    },
  };
</script>

<style lang="scss">
  .widjet {
    height: fit-content;
  }
</style>
