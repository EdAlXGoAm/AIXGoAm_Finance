import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RemotePurchaseItemStoryData } from './apiPurchaseItemStory';
import { local_host } from '@/utils/tmp_local_host';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface ConsumptionModel {
  _id: string;
  data: ConsumptionData;
}

export interface ConsumptionData {
  idPurchaseItemStory: RemotePurchaseItemStoryData;
  date: Date;
  type: string;
  quantityConsumed: number;
  waste: number;
  cost: number;
}

export interface RemoteConsumptionData {
  _id: string;
  idPurchaseItemStory: RemotePurchaseItemStoryData;
  date: Date;
  type: string;
  quantityConsumed: number;
  waste: number;
  cost: number;
}

export const getConsumptions = async (): Promise<RemoteConsumptionData[]> => {
  try {
    const response: AxiosResponse<RemoteConsumptionData[]> = await api.get('/consumption');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConsumptionsByPurchaseItemStory = async (idPurchaseItemStory: string): Promise<RemoteConsumptionData[]> => {
  try {
    const response: AxiosResponse<RemoteConsumptionData[]> = await api.get(`/consumption/${idPurchaseItemStory}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createConsumption = async (consumption: ConsumptionData): Promise<AxiosResponse<RemoteConsumptionData>> => {
  try {
    const response: AxiosResponse<RemoteConsumptionData> = await api.post('/consumption', consumption);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateConsumption = async (id: string, consumption: ConsumptionData): Promise<RemoteConsumptionData> => {
  try {
    const response: AxiosResponse<RemoteConsumptionData> = await api.put(`/consumption/${id}`, consumption);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteConsumption = async (id: string): Promise<void> => {
  try {
    await api.delete(`/consumption/${id}`);
  } catch (error) {
    throw error;
  }
};

