import { local_host } from '@/utils/tmp_local_host';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface ParamConfigModel {
  _id: string;
  data: ParamConfigData;
}

export interface ParamConfigData {
  quantity_unit: string;
  weight_unit: string;
  volume_unit: string;
  time_unit: string;
  default_unit: string;
  reference_unit: string;
  states_list: string[];
}

export interface RemoteParamConfigData {
  _id: string;
  quantity_unit: string;
  weight_unit: string;
  volume_unit: string;
  time_unit: string;
  default_unit: string;
  reference_unit: string;
  states_list: string[];
}

export const getParamConfigById = async (id: string): Promise<AxiosResponse<RemoteParamConfigData>> => {
  try {
    const response = await api.get(`/param_config/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createParamConfig = async (paramConfig: ParamConfigData): Promise<AxiosResponse<RemoteParamConfigData>> => {
  try {
    const response = await api.post('/param_config', paramConfig);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getParamConfig = async (): Promise<AxiosResponse<RemoteParamConfigData[]>> => {
  try {
    const response = await api.get('/param_config');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateParamConfig = async (id: string, paramConfig: ParamConfigData): Promise<AxiosResponse<RemoteParamConfigData>> => {
  try {
    const response = await api.put(`/param_config/${id}`, paramConfig);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteParamConfig = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response = await api.delete(`/param_config/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
