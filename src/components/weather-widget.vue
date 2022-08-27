<template>
  <div class="widjet__wrapper">
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
              <i class="el-icon-sort city-list__icon-drag" > </i>
              <div class="city-list__city">
                {{ city.name }}
              </div>
              <i v-if="weatherList.length > 1" class="el-icon-delete city-list__icon-delete" @click="deleteCity(city)"> </i>
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
            :remote-method="searchCity"
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
        <div class="widjet__city">{{ city.name }}, {{ city.sys.country || '' }} </div>
        <div class="widjet__temp">
          <img :src="`${url_img}${city.weather[0].icon}.png`" alt="weather" class="widjet__temp-img" />
          <div>{{ Math.round(city.main.temp) }}℃</div>
        </div>
        <div class="widjet__descr">
          Ощущается как {{ Math.round(city.main.feels_like) }}℃  <br/>
          {{ city.weather[0].description[0].toUpperCase() + city.weather[0].description.slice(1) }}
        </div>
        <div class="widjet__sunrise">Рассвет: {{ getTime(city.sys.sunrise) }}</div>
        <div class="widjet__sunset">Закат: {{ getTime(city.sys.sunset) }}</div>
        <div class="widjet__wind">Ветер: {{ Math.round(city.wind.speed) }}м/с</div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts" type="module">
  import draggable from 'vuedraggable'

  import { ICity, ICoord } from '@/interfaces/city'
  import { IData } from '@/interfaces/data'
  import { defineComponent } from 'vue'
  import { mapGetters, mapMutations } from 'vuex'

  export default defineComponent({
    name: 'weather-widjet',
    components: {
      draggable
    },
    data():IData {
      return {
        loading: false,
        searchLoading: false,
        showPopover: false,
        searchText: null,
        url_img: process.env.VUE_APP_URL_IMG
      }
    },
    computed: {
      ...mapGetters ([
        'weatherList',
        'searchCityes'
      ]),


    },
    mounted()  {
      const dataLocalStorage: string | null = localStorage.getItem('weatherWidjet')
      if (dataLocalStorage && JSON.parse(dataLocalStorage).length) {
        JSON.parse(localStorage.getItem('weatherWidjet')!)
        .forEach((el:ICity) => this.getWeather(el.coord))
      }
      else {
        this.searchCity('Москва')
        .then(()=> this.getWeather(this.searchCityes[0]))
      }
    },
    methods: {
      getWeather(item:ICoord):void {
        this.loading = true
        const params = {
          appid: process.env.VUE_APP_APPID,
          units: 'metric',
          lang: 'ru',
          lat: item?.lat,
          lon: item?.lon
        }
        this.$store.dispatch('getWeatherList', params)
        .finally(():void => { this.loading = false })
      },

      async searchCity (query: string):Promise<void> {
        this.searchLoading = true
        const params = {
          q: query,
          appid: process.env.VUE_APP_APPID,
          limit: 5
        }
        await this.$store.dispatch('searchCity', params)
        .finally(()=> { this.searchLoading = false })
      },

      getTime ( time:number ):string {
        const date =new Date( time*1000 )
        const hour = date.getHours()
        const minutes = date.getMinutes()
        return `${hour > 10 ? hour : `0${hour}` }:${minutes > 10 ? minutes : `0${minutes}` }`
      },

      changeCity (item: ICoord):void {
        this.resetInput()
        this.getWeather(item)
      },

      resetInput ():void {
        this.searchCityes = []
        this.searchText = null
      },

      deleteCity (city:ICity):void {
        this.searchText = null
        this.$store.dispatch('deleteCity', city)
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
