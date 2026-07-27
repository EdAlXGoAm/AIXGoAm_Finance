import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { local_host } from '../utils/tmp_local_host';
const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface EstadoModel {
  _id: string;
  data: EstadoData;
}

interface EstadoData {
  name: string;
  warning: string;
}

export const createEstado = async (estado: EstadoData): Promise<AxiosResponse<EstadoData>> => {
  try {
    const response = await api.post('/estado', estado);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getEstado = async (): Promise<AxiosResponse<EstadoData[]>> => {
  try {
    const response = await api.get('/estado');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateEstado = async (id: string, estado: EstadoData): Promise<AxiosResponse<EstadoData>> => {
  try {
    const response = await api.put(`/estado/${id}`, estado);
    return response;
  } catch (error) {
    throw error;
  }
};
