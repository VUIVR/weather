export interface ICity {
  coord: ICoord,
  weather: IWeather[],
  base: string,
  main: IMain,
  visibility: number,
  wind: IWind,
  clouds: IClouds,
  dt: number,
  sys: ISys,
  timezone: number,
  id: number,
  name: string,
  cod: number,
  lat: number
}

export interface ISys {
  type: number,
  id: number,
  country: string,
  sunrise: number,
  sunset: number
}

export interface IClouds {
  all: number
}

export interface IWind {
  speed: number,
  deg: number
}

export interface ICoord {
  country: string,
  lon: number,
  local_names: any
  lat: number,
  name: string,
  state: string
}
export interface IWeather {
  id: number,
  main: string,
  description: string,
  icon: string
}

export interface IMain {
  temp: number,
  feels_like: number,
  temp_min: number,
  temp_max: number,
  pressure: number,
  humidity: number
}