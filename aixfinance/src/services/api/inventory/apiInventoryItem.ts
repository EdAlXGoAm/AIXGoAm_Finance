import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { InventoryFormData, RemoteInventoryData, updateInventory } from './apiInventory';
import { RemoteSourceItemData } from '../source/apiSourceItem';
// import { RemoteBuildingItemData } from '../building/apiBuildingItem';
// import { RemoteTimeTaskData } from '../timeTask/apiTimeTask';
import { local_host } from '@/utils/tmp_local_host';

const api: AxiosInstance = axios.create({
  baseURL: local_host,
});

export interface ConsumableOperation {
  date: Date;
  validConsumption: number;
  wasteConsumption: number;
  totalConsumption: number;
  note: string;
}

export const emptyConsumableOperation: ConsumableOperation = {
  date: new Date(),
  validConsumption: 0,
  wasteConsumption: 0,
  totalConsumption: 0,
  note: '',
};

export interface ConsumableProps {
  consumableOperations: ConsumableOperation[];
  currentQuantity: number;
}

export const emptyConsumableProps: ConsumableProps = {
  consumableOperations: [],
  currentQuantity: 0,
};

export interface AssetMaintenanceOperation {
  date: Date;
  valueMaintenance: number;
  note: string;
}

export const emptyAssetMaintenanceOperation: AssetMaintenanceOperation = {
  date: new Date(),
  valueMaintenance: 0,
  note: '',
};

export interface AssetDepreciationOperation {
  date: Date;
  reason: string;
  valueDepreciation: number;
  note: string;
}

export const emptyAssetDepreciationOperation: AssetDepreciationOperation = {
  date: new Date(),
  reason: '',
  valueDepreciation: 0,
  note: '',
};

export interface AssetRentOperation {
  date: Date;
  formulaRentUsage: string;
  valueRentUsage: number;
  note: string;
}

export const emptyAssetRentOperation: AssetRentOperation = {
  date: new Date(),
  formulaRentUsage: '',
  valueRentUsage: 0,
  note: '',
};

export interface AssetProps {
  showWarranty: boolean;
  showMaintenance: boolean;
  showDepreciation: boolean;
  showRent: boolean;
  formulaRentValue: string;
  assetWarrantyDate: string;
  assetMaintenanceOperation: AssetMaintenanceOperation;
  assetMaintenanceValue: number;
  assetDepreciationOperation: AssetDepreciationOperation;
  assetDepreciationValue: number;
  assetRentOperation: AssetRentOperation;
  assetRentValue: number;
  assetStatus: string;
}

export const emptyAssetProps: AssetProps = {
  showWarranty: false,
  showMaintenance: false,
  showDepreciation: false,
  showRent: false,
  formulaRentValue: '',
  assetWarrantyDate: '',
  assetMaintenanceOperation: emptyAssetMaintenanceOperation,
  assetMaintenanceValue: 0,
  assetDepreciationOperation: emptyAssetDepreciationOperation,
  assetDepreciationValue: 0,
  assetRentOperation: emptyAssetRentOperation,
  assetRentValue: 0,
  assetStatus: '',
};

export interface ManufacturingOperation {
  date: Date;
  valueProgress: number;
  id_timeTask: any; //RemoteTimeTaskData;
  note: string;
}

export const emptyManufacturingOperation: ManufacturingOperation = {
  date: new Date(),
  valueProgress: 0,
  id_timeTask: {} as any, //RemoteTimeTaskData;
  note: '',
};

export interface ManufacturingProps {
  manufacturingOperations: ManufacturingOperation[];
  manufacturingRemainingHours: number;
  manufacturingStartedDate: Date;
  manufacturingDueDate: Date;
  manufacturingFinishedDate: Date;
  manufacturingDeliveredDate: Date;
}

export const emptyManufacturingProps: ManufacturingProps = {
  manufacturingOperations: [],
  manufacturingRemainingHours: 0,
  manufacturingStartedDate: new Date(),
  manufacturingDueDate: new Date(),
  manufacturingFinishedDate: new Date(),
  manufacturingDeliveredDate: new Date(),
};

export interface SaleProps {
  formulaSaleProfit: string;
  saleDate: Date;
  saleCost: number;
  saleProfit: number;
  saleTax: number;
  salePrice: number;
  saleWarrantyDate: Date;
}

export const emptySaleProps: SaleProps = {
  formulaSaleProfit: '',
  saleDate: new Date(),
  saleCost: 0,
  saleProfit: 0,
  saleTax: 0,
  salePrice: 0,
  saleWarrantyDate: new Date(),
};

export interface PurchaseProps {
  purchasePrice: number;
  purchaseDeliveryDate: Date;
}

export const emptyPurchaseProps: PurchaseProps = {
  purchasePrice: 0,
  purchaseDeliveryDate: new Date(),
};

export interface AcquisitionProps {
  showConsumableProps: boolean;
  showAssetProps: boolean;
  showSaleProps: boolean;
  acquisitionMethod: string;
  type: string;
  quantity: number;
  purchaseProps: PurchaseProps;
  manufacturingProps: ManufacturingProps;
  consumableProps: ConsumableProps;
  assetProps: AssetProps;
  saleProps: SaleProps;
  status: string;
}

export const emptyAcquisitionProps: AcquisitionProps = {
  showConsumableProps: false,
  showAssetProps: false,
  showSaleProps: false,
  acquisitionMethod: '',
  type: '',
  quantity: 0,
  purchaseProps: emptyPurchaseProps,
  manufacturingProps: emptyManufacturingProps,
  consumableProps: emptyConsumableProps,
  assetProps: emptyAssetProps,
  saleProps: emptySaleProps,
  status: '',
};

export interface InventoryItemFormData {
  id_inventory: RemoteInventoryData;
  date: Date;
  category: string;
  id_sourceItem: RemoteSourceItemData;
  id_buildingItem: any; //RemoteBuildingItemData;
  acquisitionProps: AcquisitionProps;
}

export interface InventoryItemModel {
  _id: string;
  data: InventoryItemFormData;
}

export interface RemoteInventoryItemData extends InventoryItemFormData {
  _id: string;
}

export const RemoteToModel = (inventoryItem: RemoteInventoryItemData): InventoryItemModel => {
  return {
    _id: inventoryItem._id,
    data: {
      id_inventory: inventoryItem.id_inventory,
      date: inventoryItem.date,
      category: inventoryItem.category,
      id_sourceItem: inventoryItem.id_sourceItem,
      id_buildingItem: inventoryItem.id_buildingItem,
      acquisitionProps: inventoryItem.acquisitionProps,
    }
  };
};

export const emptyInventoryItemFormData: InventoryItemFormData = {
  id_inventory: {} as RemoteInventoryData,
  date: new Date(),
  category: '',
  id_sourceItem: {} as RemoteSourceItemData,
  id_buildingItem: {} as any, //RemoteBuildingItemData;
  acquisitionProps: emptyAcquisitionProps,
};

export const createInventoryItem = async (inventoryItem: InventoryItemFormData): Promise<AxiosResponse<RemoteInventoryItemData>> => {
  try {
    const response = await api.post('/inventoryItem', inventoryItem);
    const createdInventoryItem = response.data;

    const inventoryId = inventoryItem.id_inventory._id;
    await addInventoryItemToInventory(inventoryId, createdInventoryItem);

    return response;
  } catch (error) {
    throw error;
  }
};

const addInventoryItemToInventory = async (
  inventoryId: string,
  inventoryItem: RemoteInventoryItemData
): Promise<void> => {
  try {
    const inventoryResponse = await api.put(`/inventory/${inventoryId}`, inventoryItem);
    const inventoryData = inventoryResponse.data as RemoteInventoryData;

    const updatedInventoryItems = [...inventoryData.inventoryItems, inventoryItem];

    const updatedInventoryData: InventoryFormData = {
      name: inventoryData.name,
      description: inventoryData.description,
      image: inventoryData.image,
      type: inventoryData.type,
      categories: inventoryData.categories,
      categoriesWarningRules: inventoryData.categoriesWarningRules,
      warningItems: inventoryData.warningItems,
      inventoryItems: updatedInventoryItems,
    };

    const response = await updateInventory(inventoryId, updatedInventoryData);
    console.log('response', response);
  } catch (error) {
    throw error;
  }
};

export const getInventoryItems = async (): Promise<AxiosResponse<RemoteInventoryItemData[]>> => {
  try {
    const response = await api.get('/inventoryItem');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInventoryItemById = async (id: string): Promise<AxiosResponse<RemoteInventoryItemData>> => {
  try {
    const response = await api.get(`/inventoryItem/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInventoryItemsByInventoryId = async (inventoryId: string): Promise<AxiosResponse<RemoteInventoryItemData[]>> => {
  try {
    const response = await api.get(`/inventoryItem/inventory/${inventoryId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateInventoryItem = async (id: string, inventoryItem: InventoryItemFormData): Promise<AxiosResponse<RemoteInventoryItemData>> => {
  try {
    const response = await api.put(`/inventoryItem/${id}`, inventoryItem);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteInventoryItem = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    const response = await api.delete(`/inventoryItem/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
