import { ICity, ICoord } from './city'

export interface IData {
  loading: boolean,
  searchLoading: boolean,
  weatherList: ICity[],
  showPopover: boolean,
  searchCityes: ICoord[],
  searchText: string | null
}
