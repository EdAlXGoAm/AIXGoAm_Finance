import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RemoteRelatedOperationData } from './apiRelatedOperations';
import { local_host } from '@/utils/tmp_local_host';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface OperationModel {
  _id: string;
  data: OperationData;
}

export interface OperationData {
  date: Date;
  type: string;
  name: string;
  amount: number;
  description: string;
  account: string;
  deferred: boolean;
  installments: number;
  preRelatedOperations: RemoteRelatedOperationData[];
  preAmount: number;
  postRelatedOperations: RemoteRelatedOperationData[];
  postAmount: number;
  operationAmount: number;
  amountToShow: string;
}

export interface RemoteOperationModel {
  _id: string;
  date: Date;
  type: string;
  name: string;
  amount: number;
  description: string;
  account: string;
  deferred: boolean;
  installments: number;
  preRelatedOperations: RemoteRelatedOperationData[];
  preAmount: number;
  postRelatedOperations: RemoteRelatedOperationData[];
  postAmount: number;
  operationAmount: number;
  amountToShow: string;
}

export const createOperation = async (operation: OperationData): Promise<AxiosResponse<RemoteOperationModel>> => {
  try {
    const response = await api.post('/operation', operation);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getOperations = async (): Promise<AxiosResponse<RemoteOperationModel[]>> => {
  try {
    const response = await api.get('/operation');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateOperation = async (id: string, operation: OperationData): Promise<AxiosResponse<RemoteOperationModel>> => {
  try {
    const response = await api.put(`/operation/${id}`, operation);
    return response;
  } catch (error) {
    throw error;
  } 
};

export const deleteOperation = async (id: string): Promise<AxiosResponse<RemoteOperationModel>> => {
  try {
    const response = await api.delete(`/operation/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
