<template>
  <div class="widjet__wrapper"
  >
  <transition-group name="slide-bottom" >
    <div
      v-loading="loading"
      element-loading-text="Загрузка, нужно подождать чуток..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
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
          <div v-for="city in weatherList" :key="city.lat" class="widjet__city-list city-list">
            <i class="el-icon-sort city-list__icon-drag" />
            <div class="city-list__city">
              {{ city.name }}
            </div>
            <i v-if="weatherList.length > 1" class="el-icon-delete city-list__icon-delete" @click="deleteCity(city)" />
          </div>
        </draggable>

        <el-select
          v-model="searchText"
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
        Ущущается как {{ Math.round(city.main.feels_like) }}℃  <br/>
        {{ city.weather[0].description.split('').splice(0,1).join('').toUpperCase() +
        city.weather[0].description.split('').slice(1).join('') }}
      </div>
      <div class="widjet__sunrise">Рассвет: {{ getTime(city.sys.sunrise) }}</div>
      <div class="widjet__sunset">Закат: {{ getTime(city.sys.sunset) }}</div>
      <div class="widjet__wind">Ветер: {{ Math.round(city.wind.speed)  }}м/с</div>
    </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import draggable from 'vuedraggable'

  import { AxiosResponse, AxiosError } from 'axios';
  import { ICity, ICoord } from '../interfaces/responces'

  export default defineComponent ({
    name: 'weather-widjet',
    components: {
      draggable
    },
    mounted() {
      if (localStorage.getItem('weatherWidjet')) {
        JSON.parse(localStorage.getItem('weatherWidjet')!).forEach((el:ICity) => {
          this.getWeather(el.coord)
        })
      }
      else {
        this.remoteMethod('Москва')
        this.getWeather(this.searchCityes[0]) // Moscow
      }
    },
    data() {
      return {
        loading: false,
        searchLoading:false,
        weatherList: [],
        showPopover: false,
        searchCityes: [],
        searchText: null
      }
    },
    methods: {
      async getWeather(item?:ICoord):Promise<void> {
        this.loading = true
        const params = {
          appid: 'e758a22a0c8788762afcbadda4a20310',
          units: 'metric',
          lang: 'ru',
          lat: item?.lat,
          lon: item?.lon
        }
        await this.$axios
          .get('https://api.openweathermap.org/data/2.5/weather', { params })
          .then((responce: AxiosResponse<ICity>):void => {
            const data: ICity[] = []
            data.push(responce.data)
            localStorage.setItem ("weatherWidjet", JSON.stringify(data))
            this.weatherList = Object.assign(data)
          })
          .catch((error: AxiosError):void => {
            console.log(error)
          })
          .finally(():void => { this.loading = false })
      },

      async remoteMethod (query: string):Promise<void> {
        this.searchloading = true
        const params = {
          q: query,
          appid: 'e758a22a0c8788762afcbadda4a20310',
          limit: 5
        }
        await this.$axios
          .get('http://api.openweathermap.org/geo/1.0/direct', { params })
          .then((responce: AxiosResponse<any>):void => {
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

      changeCity (item: ICity):void {
        this.resetInput()
        this.getWeather(item.coord)
      },

      resetInput ():void {
        this.searchCityes = []
        this.searchText = null
      },

      deleteCity (city:ICity):void {
        this.searchText = null
        this.weatherList = this.weatherList.filter((i:ICity) => i.id !== city.id)
        localStorage.setItem ("weatherWidjet", JSON.stringify(this.weatherList))
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
      justify-content: start;
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
