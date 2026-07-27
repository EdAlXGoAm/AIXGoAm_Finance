import React, { createContext, useContext, useEffect, useState } from 'react';
import { RemoteInventoryData, InventoryFormData, InventoryModel, getInventories } from '@/services/api/inventory/apiInventory';

interface InventoryContextProps {
  elementToCreateInventory: InventoryFormData | null;
  setElementToCreateInventory: (element: InventoryFormData | null) => void;
  elementToEditInventory: InventoryModel | null;
  setElementToEditInventory: (element: InventoryModel | null) => void;
  inventories: RemoteInventoryData[];
  setInventories: (inventories: RemoteInventoryData[]) => void;
  selectedInventory: RemoteInventoryData | null;
  setSelectedInventory: (inventory: RemoteInventoryData | null) => void;
}

const InventoryContext = createContext<InventoryContextProps | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elementToCreateInventory, setElementToCreateInventory] = useState<InventoryFormData | null>(null);
  const [elementToEditInventory, setElementToEditInventory] = useState<InventoryModel | null>(null);
  const [inventories, setInventories] = useState<RemoteInventoryData[]>([]);
  const [selectedInventory, setSelectedInventory] = useState<RemoteInventoryData | null>(null);
  const fetchInventories = async () => {
    const inventories = await getInventories();
    setInventories(inventories.data);
  }

  useEffect(() => {
    fetchInventories();
  }, []);

  return (
    <InventoryContext.Provider value={{
      elementToCreateInventory, setElementToCreateInventory,
      elementToEditInventory, setElementToEditInventory,
      inventories, setInventories,
      selectedInventory, setSelectedInventory,
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within a InventoryProvider');
  }
  return context;
};