import axios, { AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3010/api',
});

export interface Caducidad {
  _id: string;
  data: CaducidadData;
}

interface CaducidadData {
  date_of_purchase: Date;
  date_of_expiration: Date;
}

export const createCaducidad = async (caducidad: CaducidadData): Promise<AxiosResponse<CaducidadData>> => {
  try {
    const response = await api.post('/caducidad', caducidad);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCaducidad = async (): Promise<AxiosResponse<CaducidadData[]>> => {
  try {
    const response = await api.get('/caducidad');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCaducidad = async (id: string, caducidad: CaducidadData): Promise<AxiosResponse<CaducidadData>> => {
  try {
    const response = await api.put(`/caducidad/${id}`, caducidad);
    return response;
  } catch (error) {
    throw error;
  }
};
