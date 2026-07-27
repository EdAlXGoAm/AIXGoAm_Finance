import { useState } from 'react';
import { InventoryModel, RemoteInventoryData, getAllInventories, deleteInventory } from '@/services/Inventario/apiInventory';

interface InventoryElementsProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const InventoryElements = ({ refresh, setRefresh }: InventoryElementsProps) => {
  const onRefreshInventories = () => {
    setRefresh(!refresh);
  };
  
  const [elementToEditInventory, setElementToEditInventory] = useState<InventoryModel | undefined>(undefined);

  const onCleanElementToEditInventory = () => {
    setElementToEditInventory(undefined);
  };

  const onEditElementToEditInventory = (inventory: RemoteInventoryData | InventoryModel) => {
    if ('data' in inventory) {
      setElementToEditInventory(inventory);
    } else {
      setElementToEditInventory(RemoteInventoryDataToModel(inventory));
    }
  };
  
  const [inventories, setInventories] = useState<RemoteInventoryData[]>([]);
  const [isLoadingInventories, setIsLoadingInventories] = useState<boolean>(true);

  const fetchInventories = async () => {
    setIsLoadingInventories(true);
    const response = await getAllInventories();
    setInventories(response.data);
    setIsLoadingInventories(false);
  };

  const onCreateInventory = (response: RemoteInventoryData) => {
    setInventories((prev) => [...prev, response]);
  };

  const onUpdateInventory = (response: RemoteInventoryData) => {
    setInventories((prev) => prev.map((inv) => inv._id === response._id ? response : inv));
  };

  const onDeleteInventory = (id: string) => {
    deleteInventory(id);
    setInventories((prev) => prev.filter((inv) => inv._id !== id));
  };

  const RemoteInventoryDataToModel = (remoteInventory: RemoteInventoryData): InventoryModel => {
    return {
      _id: remoteInventory._id,
      data: {
        name: remoteInventory.name,
        description: remoteInventory.description,
        image: remoteInventory.image,
        type: remoteInventory.type,
        categories: remoteInventory.categories,
        categoriesWarningRules: remoteInventory.categoriesWarningRules,
        warningItems: remoteInventory.warningItems,
      }
    };
  };

  return {
    onRefreshInventories,
    elementToEditInventory, setElementToEditInventory,
    onCleanElementToEditInventory,
    onEditElementToEditInventory,
    inventories, fetchInventories,
    isLoadingInventories,
    onCreateInventory,
    onUpdateInventory,
    onDeleteInventory,
    RemoteInventoryDataToModel,
  };
};