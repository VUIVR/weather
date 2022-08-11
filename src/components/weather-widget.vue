<template>
  <div class="widjet__wrapper"
  >
  <transition-group name="slide-bottom" >
    <div
      v-loading="loading"
      v-for="city in weatherList"
      :key="city?.id"
      class="widjet"
    >
      <el-popover
        v-if="!loading"
        title="Настройки виджета"
        width="180"
        @click="showPopover = true"
        placement="bottom-end"
        @hide="resetInput"
      >
        <div slot="reference" class="widjet__settings">
          <i class="el-icon-s-tools"></i>
        </div>

        <draggable v-model="weatherList">
          <div v-for="city in changeCityList" :key="city.lat" class="widjet__city-list city-list">
            <i class="el-icon-sort city-list__icon-drag" />
            <div class="city-list__city">
              {{ city.name }}
            </div>
            <i v-if="changeCityList.length > 1" class="el-icon-delete city-list__icon-delete" @click="deleteCity(city)" />
          </div>
        </draggable>

        <el-select
          size="mini"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="Поиск города"
          :remote-method="remoteMethod"
          no-data-text="Нет совпадений"
          @change="changeCity"
        >
          <el-option
            v-for="item in searchCityes"
            :key="item.lat"
            :label="`${item.local_names?.ru || item.name}, ${item.country}`"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-popover>
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
    </transition-group>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import draggable from 'vuedraggable'

  import { AxiosResponse, AxiosError } from 'axios';
  import { CurrentResponse } from '../interfaces/responces'

  export default defineComponent ({
    name: 'weather-widjet',
    components: {
      draggable,
    },
    mounted() {
      this.getWeather({ lat: '55.7504461', lon: '37.6174943' })
    },
    data() {
      return {
        loading: false,
        searchLoading: false,
        weatherList: [],
        showPopover: false,
        changeCityList: [],
        searchCityes: []
      }
    },
    methods: {
      async getWeather(item?:any) {
        this.loading = true
        const params = {
          appid: 'e758a22a0c8788762afcbadda4a20310', //TODO спрятать
          units: 'metric',
          lang: 'ru',
          lat: item.lat,
          lon: item.lon
        }
        //@ts-ignore
        await this.$axios
          .get('https://api.openweathermap.org/data/2.5/weather', { params })
          .then((responce: AxiosResponse<CurrentResponse>):void => {
            //@ts-ignore
            this.weatherList.push(responce.data)
            //@ts-ignore
            this.changeCityList.push(responce.data)
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
            this.searchCityes = responce.data
          })
          .finally(()=> { this.searchloading = false })
      },

      getTime ( time:number ):string {
        const date =new Date( time*1000 )
        const hour = date.getHours()
        const minutes = date.getMinutes()
        return `${hour > 10 ? hour : `0${hour}` }:${minutes > 10 ? minutes : `0${minutes}` }`
      },

      changeCity (item: any) {
        this.resetInput()
        //@ts-ignore
        this.getWeather(item)
      },

      resetInput () {
        this.searchCityes = []
      },

      deleteCity (city:any) {
        console.log(city)
        this.changeCityList.filter((i:any) => { i.id !== city.id })
        console.log(this.changeCityList.filter((i:any) => { i.id !== city.id }));
      }
    }
  })
</script>

<style lang="scss">
  .widjet {
    position: relative;
    width: 100%;
    max-width: 200px;
    height: fit-content;
    box-shadow: 1px 5px 10px;
    padding: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    border-radius: 5px;
    transition: 1s;

    &__wrapper {
      width: 100%;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

      }
    }

    &:hover {
      transform: scale(1.05);
    }

    &__city {
      margin-bottom: 5px;
      padding-right: 20px;
    }

    &__temp {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
    }

    &__temp-img {
      height: 70px;
    }

    &__settings {
      position: absolute;
      top: 8px;
      right: 5px;
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
  .city-list {
    display: flex;
    justify-items: center;
    align-items: center;
    flex-wrap: nowrap;
    cursor: pointer;
    margin-bottom: 5px;
    padding: 2px;

    &:hover {
      background: rgb(190, 190, 190);
      border-radius: 5px;
    }

    &__icon-drag {
      margin-right: 2px;
    }

    &__city {
      flex-grow: 1;
      word-break: break-word;
    }

    &__icon-delete {
      color: red;
    }

  }
</style>
