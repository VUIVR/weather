import { IState } from "@/interfaces/data"
import { ICity, ICoord } from "@/interfaces/city"
import { AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'

export default {
  strict: true,
  state: {
    weatherList: [],
    searchCityes: []

  },
  mutations: {
    getWetherList (state:IState, data:ICity) {
      state.weatherList.push(data)
      localStorage.setItem("weatherWidjet", JSON.stringify(state.weatherList))
    },
    deleteCity (state:IState, item:ICity) {
      state.weatherList = state.weatherList.filter((i:ICity):boolean => i.id !== item.id)
      localStorage.setItem ("weatherWidjet", JSON.stringify(state.weatherList))
    },
    searchCity (state:IState, items:ICoord[]) {
        state.searchCityes = items
    }
  },
  actions: {
    async getWeatherList ({ commit }:any, params:any) {
      await axios
        .get(`${process.env.VUE_APP_URL_WEATHER}`, { params })
        .then((responce: AxiosResponse<ICity>):void => {
          commit('getWetherList', responce.data)
        })
        .catch((error: AxiosError):void => {
          console.log(error)
        })
    },
    deleteCity({ commit }:any, item:ICity) {
      commit('deleteCity', item)
    },
    async searchCity ({ commit }:any, params:any) {
      await axios
      .get(`${process.env.VUE_APP_URL_CITY}`, { params })
      .then((responce: AxiosResponse<ICoord[]>):void => {
        commit('searchCity', responce.data)
      })
    }
  },
  getters: {
    weatherList: (state:IState) => state.weatherList,
    searchCityes: (state:IState) => state.searchCityes
  }
}