import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RemoteInventoryItemData } from './apiInventoryItem';
import { local_host } from '@/utils/tmp_local_host';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface InventoryModel {
  _id: string;
  data: InventoryFormData;
}

export interface InventoryFormData {
  name: string;
  description: string;
  image: string;
  type: string;
  categories: string[];
  categoriesWarningRules: string[];
  warningItems: string[];
  inventoryItems?: RemoteInventoryItemData[];
}

export interface RemoteInventoryData extends InventoryFormData {
  _id: string;
  inventoryItems: RemoteInventoryItemData[];
}

export const RemoteToModel = (inventory: RemoteInventoryData): InventoryModel => {
  return {
    _id: inventory._id,
    data: {
      name: inventory.name,
      description: inventory.description,
      image: inventory.image,
      type: inventory.type,
      categories: inventory.categories,
      categoriesWarningRules: inventory.categoriesWarningRules,
      warningItems: inventory.warningItems,
    },
  };
};

export const emptyInventoryFormData: InventoryFormData = {
  name: '',
  description: '',
  image: '',
  type: '',
  categories: [],
  categoriesWarningRules: [],
  warningItems: [],
};

export const createInventory = async (inventory: InventoryFormData): Promise<AxiosResponse<RemoteInventoryData>> => {
  try {
    const response = await api.post('/inventory', inventory);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInventories = async (): Promise<AxiosResponse<RemoteInventoryData[]>> => {
  try {
    const response = await api.get('/inventory');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInventoryById = async (id: string): Promise<AxiosResponse<RemoteInventoryData>> => {
  try {
    const response = await api.get(`/inventory/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateInventory = async (id: string, inventory: InventoryFormData): Promise<AxiosResponse<RemoteInventoryData>> => {
  try {
    const response = await api.put(`/inventory/${id}`, inventory);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteInventory = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response = await api.delete(`/inventory/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteInventoryAndChilds = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response = await api.delete(`/inventory/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
