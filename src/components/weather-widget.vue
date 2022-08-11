<template>
  <div
    v-loading="loading"
  >
    <div
      v-for="city in weatherList"
      :key="city?.id"
      class="widjet"
    >
      <div>{{ city.name }}, {{ city.sys.country }} </div>
      <div>
        <img :src="`http://openweathermap.org/img/w/${city.weather[0].icon}.png`" alt="weather" />
        <div>{{ Math.round(city.main.temp) }}℃</div>
      </div>
      <div>
        Ущущается как {{ city.main.feels_like }}℃.  <br/>
        {{ city.weather[0].description.split('').splice(0,1).join('').toUpperCase() +
        city.weather[0].description.split('').slice(1).join('') }}.
      </div>
      <div>Рассвет: {{ getTime(city.sys.sunrise) }}</div>
      <div>Закат: {{ getTime(city.sys.sunset) }}</div>
      <div>Ветер: {{ Math.round(city.wind.speed) }}м/с</div>

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
            console.log(responce.data)
          })
          .catch((error: AxiosError):void => {
            console.log(error)
          })
          .finally(():void => { this.loading = false })
      },
      getTime ( time:number ):string {
        const date =new Date( time*1000 )
        const hour = date.getHours()
        const minutes = date.getMinutes()
        return `${hour > 10 ? hour : `0${hour}` }:${minutes > 10 ? minutes : `0${minutes}` }`
      }
    }
  })
</script>

<style lang="scss">
  .widjet {
    height: fit-content;
    box-shadow: 1px 5px 10px;
    padding: 10px;
    margin-bottom: 10px;
  }
</style>
