import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { local_host } from '@/utils/tmp_local_host';
import { RemoteCartItemData } from './apiCartItem';
import { RemoteTrackingItemData } from './apiTrackingItem';
import { RemoteSourceItemData } from './apiSourceItem';
import { RemotePurchaseItemStoryData } from './apiPurchaseItemStory';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface SourceModel {
  _id: string;
  data: SourceData;
}

export interface SourceData {
  name: string;
  description: string;
  image: string;
  itemsCart: RemoteCartItemData[];
  itemsTracking: RemoteTrackingItemData[];
  itemsInventory: RemoteSourceItemData[];
  purchaseHistory: RemotePurchaseItemStoryData[];
}

export interface RemoteSourceData {
  _id: string;
  name: string;
  description: string;
  image: string;
  itemsCart: RemoteCartItemData[];
  itemsTracking: RemoteTrackingItemData[];
  itemsInventory: RemoteSourceItemData[];
  purchaseHistory: RemotePurchaseItemStoryData[];
}

export const createSource = async (source: SourceData): Promise<AxiosResponse<RemoteSourceData>> => {
  try {
    const response = await api.post('/source', source);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSources = async (): Promise<AxiosResponse<RemoteSourceData[]>> => {
  try {
    const response = await api.get('/source');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSourceById = async (id: string): Promise<AxiosResponse<RemoteSourceData>> => {
  try {
    const response = await api.get(`/source/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateSource = async (id: string, source: SourceData): Promise<AxiosResponse<RemoteSourceData>> => {
  try {
    const response = await api.put(`/source/${id}`, source);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSource = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response = await api.delete(`/source/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
