import { toDateLocal } from '@/utils/dateUtils';
import { local_host } from '@/utils/tmp_local_host';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface RelatedOperationModel {
  _id: string;
  data: RelatedOperationData;
}

export interface RelatedOperationData {
  date: Date;
  type: string;
  amountType: string;
  name: string;
  amount: number;
  source: string;
  formula: string;
}

export interface RemoteRelatedOperationData {
  _id: string;
  date: Date;
  type: string;
  amountType: string;
  name: string;
  amount: number;
  source: string;
  formula: string;
}

export const createRelatedOperation = async (relatedOperation: RelatedOperationData): Promise<AxiosResponse<RemoteRelatedOperationData>> => {
  try {
    const response = await api.post('/relatedOperations', relatedOperation);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getRelatedOperations = async (): Promise<AxiosResponse<RemoteRelatedOperationData[]>> => {
  try {
    const response = await api.get('/relatedOperations');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getRelatedOperation = async (id: string): Promise<AxiosResponse<RemoteRelatedOperationData>> => {
  try {
    const response = await api.get(`/relatedOperations/${id}`);
    response.data.date = toDateLocal(response.data.date);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateRelatedOperation = async (id: string, relatedOperation: RelatedOperationData): Promise<AxiosResponse<RemoteRelatedOperationData>> => {
  try {
    const response = await api.put(`/relatedOperations/${id}`, relatedOperation);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteRelatedOperation = async (id: string): Promise<AxiosResponse<RemoteRelatedOperationData>> => {
  try {
    const response = await api.delete(`/relatedOperations/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};


