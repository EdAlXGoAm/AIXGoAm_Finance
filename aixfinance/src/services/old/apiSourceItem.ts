import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RemoteSourceData } from './apiSource';
import { RemoteParamConfigData } from './apiParamConfig';
import { local_host } from '@/utils/tmp_local_host';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface SourceItemModel {
  _id: string;
  data: SourceItemData;
}

export interface SourceItemData {
  idSource: RemoteSourceData;
  idParamConfig: RemoteParamConfigData;
  providerName: string;
  name: string;
  description: string;
  image: string;
  link: string;
  price: number;
  quantity: number;
  weight: number;
  volume: number;
  time: number;
}

export interface RemoteSourceItemData {
  _id: string;
  idSource: RemoteSourceData;
  idParamConfig: RemoteParamConfigData;
  providerName: string;
  name: string;
  description: string;
  image: string;
  link: string;
  price: number;
  quantity: number;
  weight: number;
  volume: number;
  time: number;
}

export const getSourceItemById = async (id: string): Promise<AxiosResponse<RemoteSourceItemData>> => {
  try {
    const response: AxiosResponse<RemoteSourceItemData> = await api.get(`/sourceItems/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createSourceItem = async (sourceItem: SourceItemData): Promise<AxiosResponse<RemoteSourceItemData>> => {
  try {
    const response: AxiosResponse<RemoteSourceItemData> = await api.post('/sourceItems', sourceItem);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSourceItems = async (): Promise<AxiosResponse<RemoteSourceItemData[]>> => {
  try {
    const response: AxiosResponse<RemoteSourceItemData[]> = await api.get('/sourceItems');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateSourceItem = async (id: string, sourceItem: SourceItemData): Promise<AxiosResponse<RemoteSourceItemData>> => {
  try {
    const response: AxiosResponse<RemoteSourceItemData> = await api.put(`/sourceItems/${id}`, sourceItem);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSourceItem = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response: AxiosResponse<void> = await api.delete(`/sourceItems/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
