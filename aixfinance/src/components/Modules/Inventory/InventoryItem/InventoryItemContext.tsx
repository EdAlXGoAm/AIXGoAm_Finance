import React, { createContext, useContext, useEffect, useState } from 'react';
import { RemoteInventoryItemData, InventoryItemFormData, InventoryItemModel, getInventoryItems } from '@/services/api/inventory/apiInventoryItem';

interface InventoryItemContextProps {
  elementToCreateInventoryItem: InventoryItemFormData | null;
  setElementToCreateInventoryItem: (element: InventoryItemFormData | null) => void;
  elementToEditInventoryItem: InventoryItemModel | null;
  setElementToEditInventoryItem: (element: InventoryItemModel | null) => void;
  inventoryItems: RemoteInventoryItemData[];
  setInventoryItems: (inventoryItems: RemoteInventoryItemData[]) => void;
  selectedInventoryItem: RemoteInventoryItemData | null;
  setSelectedInventoryItem: (inventoryItem: RemoteInventoryItemData | null) => void;
}

const InventoryItemContext = createContext<InventoryItemContextProps | undefined>(undefined);

export const InventoryItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elementToCreateInventoryItem, setElementToCreateInventoryItem] = useState<InventoryItemFormData | null>(null);
  const [elementToEditInventoryItem, setElementToEditInventoryItem] = useState<InventoryItemModel | null>(null);
  const [inventoryItems, setInventoryItems] = useState<RemoteInventoryItemData[]>([]);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<RemoteInventoryItemData | null>(null);

  const fetchInventoryItems = async () => {
    const inventoryItems = await getInventoryItems();
    setInventoryItems(inventoryItems.data);
  }

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  return (
    <InventoryItemContext.Provider value={{
      elementToCreateInventoryItem, setElementToCreateInventoryItem,
      elementToEditInventoryItem, setElementToEditInventoryItem,
      inventoryItems, setInventoryItems,
      selectedInventoryItem, setSelectedInventoryItem
    }}>
      {children}
    </InventoryItemContext.Provider>
  );
};

export const useInventoryItem = () => {
  const context = useContext(InventoryItemContext);
  if (!context) {
    throw new Error('useInventoryItem must be used within a InventoryItemProvider');
  }
  return context;
};