import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RemoteRelatedOperationData } from './apiRelatedOperations';
import { RemoteCaducidadData } from './apiCaducidad';
import { RemoteParamConfigData } from './apiParamConfig';
import { local_host } from '@/utils/tmp_local_host';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface ItemModel {
  _id: string;
  data: ItemData;
}

export interface ItemData {
  datePurchase: Date;
  name: string;
  description: string;
  amountType: string;
  preAmount: number;
  preRelatedOperations: RemoteRelatedOperationData[];
  itemAmount: number;
  postRelatedOperations: RemoteRelatedOperationData[];
  finalAmount: number;
  imageUrl: string;
  // id source transaction
  idSourceTransaction: string; // TODO: change to RemoteSourceTransactionData
  // categorization
  categorized: boolean;
  itemLabel: string;
  itemType: string;
  budgetCategory: string;
  purpose: string;
  potential: string;
  potentialReason: string;
  // Quantity
  quantitized: boolean;
  idParamConfig: RemoteParamConfigData;
  quantity: number;
  weight: number;
  volume: number;
  // date of expiration
  expires: boolean;
  idExpiration: RemoteCaducidadData;
  // id inventory
  inventorized: boolean;
  idInventory: string; // TODO: change to RemoteInventoryData
  inventoryCategory1: string;
  inventoryCategory2: string;
  inventoryCategory3: string;
  inventoryCategory4: string;
  inventoryCategory5: string;
  // ids consumption history
  idsConsumptionHistory: string[]; // TODO: change to RemoteConsumptionHistoryData
}

export interface RemoteItemData {
  _id: string;
  datePurchase: Date;
  name: string;
  description: string;
  amountType: string;
  preAmount: number;
  preRelatedOperations: RemoteRelatedOperationData[];
  itemAmount: number;
  postRelatedOperations: RemoteRelatedOperationData[];
  finalAmount: number;
  imageUrl: string;
  // id source transaction
  idSourceTransaction: string; // TODO: change to RemoteSourceTransactionData
  // categorization
  categorized: boolean;
  itemLabel: string;
  itemType: string;
  budgetCategory: string;
  purpose: string;
  potential: string;
  potentialReason: string;
  // Quantity
  quantitized: boolean;
  idParamConfig: RemoteParamConfigData;
  quantity: number;
  weight: number;
  volume: number;
  // date of expiration
  expires: boolean;
  idExpiration: RemoteCaducidadData;
  // id inventory
  inventorized: boolean;
  idInventory: string; // TODO: change to RemoteInventoryData
  inventoryCategory1: string;
  inventoryCategory2: string;
  inventoryCategory3: string;
  inventoryCategory4: string;
  inventoryCategory5: string;
  // ids consumption history
  idsConsumptionHistory: string[]; // TODO: change to RemoteConsumptionHistoryData
}

export const createItem = async (item: ItemData): Promise<AxiosResponse<RemoteItemData>> => {
  try {
    const response = await api.post('/item', item);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getItems = async (): Promise<AxiosResponse<RemoteItemData[]>> => {
  try {
    const response = await api.get('/item');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateItem = async (id: string, item: ItemData): Promise<AxiosResponse<RemoteItemData>> => {
  try {
    const response = await api.put(`/item/${id}`, item);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteItem = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response = await api.delete(`/item/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};