import axios, { AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3010/api',
});

export interface ParamConfigModel {
  _id: string;
  data: ParamConfigData;
}

interface ParamConfigData {
  amount_unit: string;
  weight_unit: string;
  volume_unit: string;
  preferred_unit: string;
  states_list: string[];
}

export const createParamConfig = async (paramConfig: ParamConfigData): Promise<AxiosResponse<ParamConfigData>> => {
  try {
    const response = await api.post('/param_config', paramConfig);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getParamConfig = async (): Promise<AxiosResponse<ParamConfigData[]>> => {
  try {
    const response = await api.get('/param_config');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateParamConfig = async (id: string, paramConfig: ParamConfigData): Promise<AxiosResponse<ParamConfigData>> => {
  try {
    const response = await api.put(`/param_config/${id}`, paramConfig);
    return response;
  } catch (error) {
    throw error;
  }
};
