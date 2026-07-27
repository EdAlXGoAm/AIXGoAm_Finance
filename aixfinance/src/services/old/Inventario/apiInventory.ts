import { local_host } from '@/utils/tmp_local_host';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface InventoryModel {
  _id: string;
  data: InventoryData;
}

export interface InventoryData {
  name: string;
  description: string;
  image: string;
  type: string;
  categories: string[];
  categoriesWarningRules: string[];
  warningItems: string[];
}

export interface RemoteInventoryData {
  _id: string;
  name: string;
  description: string;
  image: string;
  type: string;
  categories: string[];
  categoriesWarningRules: string[];
  warningItems: string[];
}


export const getAllInventories = async (): Promise<AxiosResponse<RemoteInventoryData[]>> => {
  try {
    const response = await api.get(`/inventory`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Obtener un inventario por ID
export const getInventoryById = async (id: string): Promise<AxiosResponse<RemoteInventoryData>> => {
  try {
    const response = await api.get(`/inventory/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Crear un nuevo inventario
export const createInventory = async (inventoryData: InventoryData): Promise<AxiosResponse<RemoteInventoryData>> => {
  try {
    const response = await api.post(`/inventory`, inventoryData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Actualizar un inventario existente
export const updateInventory = async (id: string, inventoryData: InventoryData): Promise<AxiosResponse<RemoteInventoryData>> => {
  try {
    const response = await api.put(`/inventory/${id}`, inventoryData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Eliminar un inventario
export const deleteInventory = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response = await api.delete(`/inventory/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Aplicar reglas de advertencia a todos los inventarios
export const applyWarningRules = async (): Promise<AxiosResponse<RemoteInventoryData[]>> => {
  try {
    const response = await api.post(`/inventory/apply-warning-rules`);
    return response;
  } catch (error) {
    throw error;
  }
};