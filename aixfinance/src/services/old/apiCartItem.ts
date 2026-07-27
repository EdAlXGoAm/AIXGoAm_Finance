import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { local_host } from '@/utils/tmp_local_host';
import { RemoteInventoryItemData } from './apiSourceItem';
import { RemoteSourceData } from './apiSource';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface CartItemModel {
  _id: string;
  data: CartItemData;
}

export interface CartItemData {
  idSource: RemoteSourceData;
  idInventoryItem: RemoteInventoryItemData;
  quantity: number;
  totalPrice: number;
  priority: string;
}

export interface RemoteCartItemData {
  _id: string;
  idSource: RemoteSourceData;
  idInventoryItem: RemoteInventoryItemData;
  quantity: number;
  totalPrice: number;
  priority: string;
}

export const createCartItem = async (cartItem: CartItemData): Promise<AxiosResponse<RemoteCartItemData>> => {
  try {
    const response: AxiosResponse<RemoteCartItemData> = await api.post('/cartItems', cartItem);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCartItems = async (): Promise<AxiosResponse<RemoteCartItemData[]>> => {
  try {
    const response: AxiosResponse<RemoteCartItemData[]> = await api.get('/cartItems');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCartItem = async (id: string, cartItem: CartItemData): Promise<AxiosResponse<RemoteCartItemData>> => {
  try {
    const response: AxiosResponse<RemoteCartItemData> = await api.put(`/cartItems/${id}`, cartItem);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteCartItem = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response: AxiosResponse<void> = await api.delete(`/cartItems/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
