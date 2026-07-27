import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { local_host } from '@/utils/tmp_local_host';
import { RemoteSourceData, SourceFormData, updateSource } from '@/services/api/source/apiSource';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface QuantitativeProp {
  propType: string;
  propPurpose: string;
  propLabel: string;
  propUnit: string;
  propValue: number;
}

export const emptyQuantitativeProp: QuantitativeProp = {
  propType: 'quantitative',
  propPurpose: '',
  propLabel: '',
  propUnit: '',
  propValue: 0,
};

export interface QualitativeProp {
  propType: string;
  propPurpose: string;
  propLabel: string;
  propValue: string;
}

export const emptyQualitativeProp: QualitativeProp = {
  propType: 'qualitative',
  propPurpose: '',
  propLabel: '',
  propValue: '',
};

export interface SourceItemFormData {
  id_source: RemoteSourceData;
  date: Date;
  name: string;
  provider: string;
  description: string;
  image: string;
  link: string;
  price: number;
  type: string;
  quantitativeProps: QuantitativeProp[];
  qualitativeProps: QualitativeProp[];
  stock: number;
}

export interface SourceItemModel {
  _id: string;
  data: SourceItemFormData;
}

export interface RemoteSourceItemData extends SourceItemFormData {
  _id: string;
}

export const RemoteToModel = (sourceItem: RemoteSourceItemData): SourceItemModel => {
  return {
    _id: sourceItem._id,
    data: {
      id_source: sourceItem.id_source,
      date: sourceItem.date,
      name: sourceItem.name,
      provider: sourceItem.provider,
      description: sourceItem.description,
      image: sourceItem.image,
      link: sourceItem.link,
      price: sourceItem.price,
      type: sourceItem.type,
      quantitativeProps: sourceItem.quantitativeProps,
      qualitativeProps: sourceItem.qualitativeProps,
      stock: sourceItem.stock,
    }
  };
};

export const emptySourceItemFormData: SourceItemFormData = {
  id_source: {} as RemoteSourceData,
  date: new Date(),
  name: 'Desconocido',
  provider: '',
  description: '',
  image: 'https://i.imgur.com/XERBhWO.png',
  link: '',
  price: 0,
  type: 'consumible',
  quantitativeProps: [],
  qualitativeProps: [],
  stock: 1,
};

export const createSourceItem = async (
  sourceItem: SourceItemFormData
): Promise<AxiosResponse<RemoteSourceItemData>> => {
  try {
    // Primero, creamos el SourceItem
    const response = await api.post('/sourceItem', sourceItem);
    const createdSourceItem = response.data;

    // Luego, actualizamos el Source correspondiente
    const sourceId = sourceItem.id_source._id;
    await addSourceItemToSource(sourceId, createdSourceItem);

    return response;
  } catch (error) {
    throw error;
  }
};

// Nueva función para agregar el SourceItem al Source
const addSourceItemToSource = async (
  sourceId: string,
  sourceItem: RemoteSourceItemData
): Promise<void> => {
  try {
    console.log('sourceId', sourceId);
    console.log('sourceItem', sourceItem);
    // Obtenemos el Source actual
    const sourceResponse = await api.get(`/source/${sourceId}`);
    const sourceData = sourceResponse.data as RemoteSourceData;

    // Agregamos el nuevo SourceItem al arreglo de sourceItems
    const updatedSourceItems = [...sourceData.sourceItems, sourceItem];

    // Actualizamos el Source con el nuevo arreglo de sourceItems
    const updatedSourceData: SourceFormData = {
      name: sourceData.name,
      description: sourceData.description,
      image: sourceData.image,
      sourceItems: updatedSourceItems,
    };

    const response = await updateSource(sourceId, updatedSourceData);
    console.log('response', response);
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const getSourceItems = async (): Promise<AxiosResponse<RemoteSourceItemData[]>> => {
  try {
    const response = await api.get('/sourceItem');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSourceItemById = async (
  id: string
): Promise<AxiosResponse<RemoteSourceItemData>> => {
  try {
    const response = await api.get(`/sourceItem/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSourceItemsBySourceId = async (
  id_source: string
): Promise<AxiosResponse<RemoteSourceItemData[]>> => {
  try {
    const response = await api.get(`/sourceItem/source/${id_source}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateSourceItem = async (
  id: string,
  sourceItem: SourceItemFormData
): Promise<AxiosResponse<RemoteSourceItemData>> => {
  try {
    const response = await api.put(`/sourceItem/${id}`, sourceItem);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSourceItem = async (
  id: string
): Promise<AxiosResponse<void>> => {
  try {
    const response = await api.delete(`/sourceItem/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
