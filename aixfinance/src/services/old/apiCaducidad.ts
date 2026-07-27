import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { local_host } from '../utils/tmp_local_host'; 
const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface CaducidadModel {
  _id: string;
  data: CaducidadData;
}

export interface CaducidadData {
  datePurchase: Date;
  dateExpiration: Date;
}

export interface RemoteCaducidadData {
  _id: string;
  datePurchase: Date;
  dateExpiration: Date;
}

export const createCaducidad = async (caducidad: CaducidadData): Promise<AxiosResponse<RemoteCaducidadData>> => {
  try {
    const response = await api.post('/caducidad', caducidad);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCaducidad = async (): Promise<AxiosResponse<RemoteCaducidadData[]>> => {
  try {
    const response = await api.get('/caducidad');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCaducidadById = async (id: string): Promise<AxiosResponse<RemoteCaducidadData>> => {
  try {
    const response = await api.get(`/caducidad/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCaducidad = async (id: string, caducidad: CaducidadData): Promise<AxiosResponse<RemoteCaducidadData>> => {
  try {
    const response = await api.put(`/caducidad/${id}`, caducidad);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteCaducidad = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response = await api.delete(`/caducidad/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

