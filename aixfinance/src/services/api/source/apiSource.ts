import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RemoteSourceItemData } from '@/services/api/source/apiSourceItem';
import { local_host } from '@/utils/tmp_local_host';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface SourceModel {
  _id: string;
  data: SourceFormData;
}

export interface SourceFormData {
  name: string;
  description: string;
  image: string;
  sourceItems?: RemoteSourceItemData[];
}

export interface RemoteSourceData extends SourceFormData {
  _id: string;
  sourceItems: RemoteSourceItemData[];
}

export const RemoteToModel = (source: RemoteSourceData): SourceModel => {
  return {
    _id: source._id,
    data: {
      name: source.name,
      description: source.description,
      image: source.image,
    },
  };
};

export const emptySourceFormData: SourceFormData = {
  name: 'Desconocido',
  description: '',
  image: 'https://i.imgur.com/SNEHf4Y.png',
};

export const createSource = async (source: SourceFormData): Promise<AxiosResponse<RemoteSourceData>> => {
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

export const getSourceByArgument = async (argument: string, argumentValue: string): Promise<AxiosResponse<RemoteSourceData[]>> => {
  try {
    const response = await api.get(`/source/argument?argument=${argument}&argumentValue=${argumentValue}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateSource = async (
  id: string,
  source: SourceFormData
): Promise<AxiosResponse<RemoteSourceData>> => {
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

export const deleteSourceAndChilds = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response = await api.delete(`/source/${id}/childs`);
    return response;
  } catch (error) {
    throw error;
  }
};
