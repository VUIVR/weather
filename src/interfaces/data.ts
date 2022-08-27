import { ICity, ICoord } from './city'

export interface IData {
  loading: boolean,
  searchLoading: boolean,
  showPopover: boolean,
  searchText: string | null,
  url_img: string
}

export interface IState {
  weatherList: ICity[],
  searchCityes: ICoord[]
}
