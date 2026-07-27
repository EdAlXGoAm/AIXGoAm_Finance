import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { local_host } from '../utils/tmp_local_host';
const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface ArticuloModel {
  _id: string;
  data: ArticuloData;
}

interface ArticuloData {
  date_of_purchase: Date;
  cost: number;
  name: string;
  description: string;
  amount: number;
  weight: number;
  volume: number;
  id_param_config: string;
  id_operation: string;
  id_place_person_site_transaction: string;
  ids_consumption_history: string[];
}

export const createArticulo = async (articulo: ArticuloData): Promise<AxiosResponse<ArticuloData>> => {
  try {
    const response = await api.post('/articulo', articulo);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getArticulo = async (): Promise<AxiosResponse<ArticuloData[]>> => {
  try {
    const response = await api.get('/articulo');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateArticulo = async (id: string, articulo: ArticuloData): Promise<AxiosResponse<ArticuloData>> => {
  try {
    const response = await api.put(`/articulo/${id}`, articulo);
    return response;
  } catch (error) {
    throw error;
  }
};

