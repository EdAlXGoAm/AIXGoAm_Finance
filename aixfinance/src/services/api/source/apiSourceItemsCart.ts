import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { local_host } from '@/utils/tmp_local_host';
import { RemoteSourceItemData } from './apiSourceItem';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface SourceItemCartFormData {
  id_sourceItem: RemoteSourceItemData;
  quantity: number;
  totalPrice: number;
  priority: string;
  status: string;
}

export interface SourceItemCartModel {
  _id: string;
  data: SourceItemCartFormData;
}

export interface RemoteSourceItemCartData extends SourceItemCartFormData {
  _id: string;
}

export const RemoteToModel = (sourceItemCart: RemoteSourceItemCartData): SourceItemCartModel => {
  return {
    _id: sourceItemCart._id,
    data: {
      id_sourceItem: sourceItemCart.id_sourceItem,
      quantity: sourceItemCart.quantity,
      totalPrice: sourceItemCart.totalPrice,
      priority: sourceItemCart.priority,
      status: sourceItemCart.status,
    }
  };
};

export const emptySourceItemCartFormData: SourceItemCartFormData = {
  id_sourceItem: {} as RemoteSourceItemData,
  quantity: 0,
  totalPrice: 0,
  priority: 'Deseo',
  status: 'Pendiente',
};

export const createSourceItemCart = async (sourceItemCart: SourceItemCartFormData): Promise<AxiosResponse<RemoteSourceItemCartData>> => {
  try {
    const response = await api.post('/sourceItemCart', sourceItemCart);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSourceItemCarts = async (): Promise<AxiosResponse<RemoteSourceItemCartData[]>> => {
  try {
    const response = await api.get('/sourceItemCart');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSourceItemCartById = async (id: string): Promise<AxiosResponse<RemoteSourceItemCartData>> => {
  try {
    const response = await api.get(`/sourceItemCart/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSourceItemCartsBySourceItemId = async (id: string): Promise<AxiosResponse<RemoteSourceItemCartData[]>> => {
  try {
    const response = await api.get(`/sourceItemCart/sourceItem/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSourceItemCartsByArgument = async (argument: string, argumentValue: string): Promise<AxiosResponse<RemoteSourceItemCartData[]>> => {
  try {
    const response = await api.get(`/sourceItemCart/argument/${argument}/${argumentValue}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateSourceItemCart = async (id: string, sourceItemCart: SourceItemCartFormData): Promise<AxiosResponse<RemoteSourceItemCartData>> => {
  try {
    const response = await api.put(`/sourceItemCart/${id}`, sourceItemCart);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSourceItemCart = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response = await api.delete(`/sourceItemCart/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};