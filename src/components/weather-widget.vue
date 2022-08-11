<template>
  <div
    v-loading="loading"
    class="widjet__wrapper"
  >
    <el-popover
      title="Настройки"
      width="180"
      @click="showPopover = true"
      placement="bottom-end"
      @hide="resetInput"
    >
      <el-select
        size="mini"
        v-model="nameCity"
        filterable
        remote
        clearable
        reserve-keyword
        placeholder="Поиск города"
        :remote-method="remoteMethod"
        no-data-text="Нет совпадений"
      >
        <el-option
          v-for="item in searchCityes"
          :key="item.lat"
          :label="`${item.local_names?.ru || item.name}, ${item.country}`"
          :value="item">
        </el-option>
      </el-select>
      <div slot="reference" class="widjet__settings">
        <i class="el-icon-s-tools"></i>
      </div>
    </el-popover>
    <div
      v-for="city in weatherList"
      :key="city?.id"
      class="widjet"
    >
      <div class="widjet__city">{{ city.name }}, {{ city.sys.country }} </div>
      <div class="widjet__temp">
        <img :src="`http://openweathermap.org/img/w/${city.weather[0].icon}.png`" alt="weather" class="widjet__temp-img" />
        <div>{{ Math.round(city.main.temp) }}℃</div>
      </div>
      <div class="widjet__descr">
        Ущущается как {{ city.main.feels_like }}℃.  <br/>
        {{ city.weather[0].description.split('').splice(0,1).join('').toUpperCase() +
        city.weather[0].description.split('').slice(1).join('') }}.
      </div>
      <div class="widjet__sunrise">Рассвет: {{ getTime(city.sys.sunrise) }}</div>
      <div class="widjet__sunset">Закат: {{ getTime(city.sys.sunset) }}</div>
      <div class="widjet__wind">Ветер: {{ Math.round(city.wind.speed) }}м/с</div>

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
        searchLoading: false,
        weatherList: [],
        showPopover: false,
        nameCity: '',
        searchCityes: []
      }
    },
    methods: {
      async getWeather() {
        this.loading = true
        const params = {
          id: 524901,
          appid: 'e758a22a0c8788762afcbadda4a20310', //TODO спрятать
          units: 'metric',
          lang: 'ru',
        }
        //@ts-ignore
        await this.$axios
          .get('https://api.openweathermap.org/data/2.5/weather', { params })
          .then((responce: AxiosResponse<CurrentResponse>):void => {
            //@ts-ignore
            this.weatherList.push(responce.data);
          })
          .catch((error: AxiosError):void => {
            console.log(error)
          })
          .finally(():void => { this.loading = false })
      },
      async remoteMethod (query: string) {
        this.searchloading = true
        const params = {
          q: query,
          appid: 'e758a22a0c8788762afcbadda4a20310', //TODO спрятать
          limit: 5
        }
        //@ts-ignore
        await this.$axios
          .get('http://api.openweathermap.org/geo/1.0/direct', { params })
          .then((responce: AxiosResponse<CurrentResponse>):void => {
            //@ts-ignore
            this.searchCityes = new Set(responce.data)
            //@ts-ignore
            console.log(this.searchCityes)
          })
          .finally(()=> { this.searchloading = false })
      },
      getTime ( time:number ):string {
        const date =new Date( time*1000 )
        const hour = date.getHours()
        const minutes = date.getMinutes()
        return `${hour > 10 ? hour : `0${hour}` }:${minutes > 10 ? minutes : `0${minutes}` }`
      },
      resetInput () {
        this.nameCity = ''
        this.searchCityes = []
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
    border-radius: 5px;
    transition: 1s;

    &__wrapper {
      position: relative;
      padding-top: 25px;
    }

    &:hover {
      transform: scale(1.05);
    }

    &__city {
      margin-bottom: 5px;
    }

    &__temp {
      display: flex;
      align-items: center;
      font-size: 40px;
    }

    &__temp-img {
      height: 70px;
    }

    &__settings {
      position: absolute;
      top: 0;
      right: 0;
      width: fit-content;
      padding: 2px;
      margin-bottom: 5px;
      cursor: pointer;
      z-index: 2;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
</style>
