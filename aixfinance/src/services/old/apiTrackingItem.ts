import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { local_host } from '@/utils/tmp_local_host';
import { RemoteSourceData } from './apiSource';
import { RemoteSourceItemData } from './apiSourceItem';
import { getSourceItemById } from './apiSourceItem';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface TrackingItemModel {
  _id: string;
  data: TrackingItemData;
}

export interface TrackingItemData {
  idSource: RemoteSourceData;
  idSourceItem: RemoteSourceItemData;
  copySourceItem: RemoteSourceItemData;
  date: Date;
  stock: number;
  price: number;
}

export interface RemoteTrackingItemData {
  _id: string;
  idSource: RemoteSourceData;
  idSourceItem: RemoteSourceItemData;
  copySourceItem: RemoteSourceItemData;
  date: Date;
  stock: number;
  price: number;
}

export const getTrackingItemsByIdSourceItem = async (idSourceItem: string): Promise<RemoteTrackingItemData[]> => {
  try {
    const item = await getSourceItemById(idSourceItem);
    const allTrackingItems = await getTrackingItems();
    const filteredTrackingItems = allTrackingItems.data.filter((trackingItem: RemoteTrackingItemData) => trackingItem.idSourceItem._id === item.data._id);
    return filteredTrackingItems;
  } catch (error) {
    throw error;
  }
};

export const createTrackingItem = async (trackingItem: TrackingItemData): Promise<AxiosResponse<RemoteTrackingItemData>> => {
  try {
    const response: AxiosResponse<RemoteTrackingItemData> = await api.post('/trackingItems', trackingItem);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTrackingItems = async (): Promise<AxiosResponse<RemoteTrackingItemData[]>> => {
  try {
    const response: AxiosResponse<RemoteTrackingItemData[]> = await api.get('/trackingItems');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateTrackingItem = async (id: string, trackingItem: TrackingItemData): Promise<AxiosResponse<RemoteTrackingItemData>> => {
  try {
    const response: AxiosResponse<RemoteTrackingItemData> = await api.put(`/trackingItems/${id}`, trackingItem);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteTrackingItem = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response: AxiosResponse<void> = await api.delete(`/trackingItems/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
