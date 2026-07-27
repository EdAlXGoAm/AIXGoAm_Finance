import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { local_host } from '@/utils/tmp_local_host';
import { RemoteInventoryItemData } from './apiSourceItem';
import { RemoteTrackingItemData } from './apiTrackingItem';
import { RemoteSourceData } from './apiSource';
import { RemoteConsumptionData } from './apiConsumption';
import { RemoteCaducidadData } from './apiCaducidad';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface PurchaseItemStoryModel {
  _id: string;
  data: PurchaseItemStoryData;
}

export interface PurchaseItemStoryData {
  idSource: RemoteSourceData;
  idInventoryItem: RemoteInventoryItemData;
  copyInventoryItem: RemoteInventoryItemData;
  date: Date;
  quantity: number;
  consumptionCost: number;
  discount: number;
  formulaDiscount: string;
  totalPrice: number;
  categorized: boolean;
  itemLabel: string;
  itemType: string;
  budgetCategory: string;
  purpose: string;
  potential: string;
  potentialReason: string;
  expires: boolean;
  idExpiration: RemoteCaducidadData | undefined;
  inventorized: boolean;
  idInventory: string;
  inventoryCategory1: string;
  inventoryCategory2: string;
  inventoryCategory3: string;
  inventoryCategory4: string;
  inventoryCategory5: string;
  measurable: boolean;
  measureType: string;
  idsConsumptionHistory: RemoteConsumptionData[];
  leftQuantity: number;
  status: string;
}

export interface RemotePurchaseItemStoryData {
  _id: string;
  idSource: RemoteSourceData;
  idInventoryItem: RemoteInventoryItemData;
  copyInventoryItem: RemoteInventoryItemData;
  date: Date;
  quantity: number;
  consumptionCost: number;
  discount: number;
  formulaDiscount: string;
  totalPrice: number;
  categorized: boolean;
  itemLabel: string;
  itemType: string;
  budgetCategory: string;
  purpose: string;
  potential: string;
  potentialReason: string;
  expires: boolean;
  idExpiration: RemoteCaducidadData | undefined;
  inventorized: boolean;
  idInventory: string;
  inventoryCategory1: string;
  inventoryCategory2: string;
  inventoryCategory3: string;
  inventoryCategory4: string;
  inventoryCategory5: string;
  measurable: boolean;
  measureType: string;
  idsConsumptionHistory: RemoteConsumptionData[];
  leftQuantity: number;
  status: string;
}

export const createPurchaseItemStory = async (purchaseItemStory: PurchaseItemStoryData): Promise<AxiosResponse<RemotePurchaseItemStoryData>> => {
  try {
    const response: AxiosResponse<RemotePurchaseItemStoryData> = await api.post('/purchaseItemStory', purchaseItemStory);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPurchaseItemStories = async (): Promise<AxiosResponse<RemotePurchaseItemStoryData[]>> => {
  try {
    const response: AxiosResponse<RemotePurchaseItemStoryData[]> = await api.get('/purchaseItemStory');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPurchaseItemStoryById = async (id: string): Promise<AxiosResponse<RemotePurchaseItemStoryData>> => {
  try {
    const response: AxiosResponse<RemotePurchaseItemStoryData> = await api.get(`/purchaseItemStory/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePurchaseItemStory = async (id: string, purchaseItemStory: PurchaseItemStoryData): Promise<AxiosResponse<RemotePurchaseItemStoryData>> => {
  try {
    const response: AxiosResponse<RemotePurchaseItemStoryData> = await api.put(`/purchaseItemStory/${id}`, purchaseItemStory);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deletePurchaseItemStory = async (id: string): Promise<AxiosResponse<RemotePurchaseItemStoryData>> => {
  try {
    const response: AxiosResponse<RemotePurchaseItemStoryData> = await api.delete(`/purchaseItemStory/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

