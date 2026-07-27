import React, { createContext, useContext, useEffect, useState } from 'react';
import { RemoteSourceItemData, SourceItemFormData, SourceItemModel, getSourceItems } from '@/services/api/source/apiSourceItem';

interface SourceItemContextProps {
  elementToCreateSourceItem: SourceItemFormData | null;
  setElementToCreateSourceItem: (element: SourceItemFormData | null) => void;
  elementToEditSourceItem: SourceItemModel | null;
  setElementToEditSourceItem: (element: SourceItemModel | null) => void;
  sourceItems: RemoteSourceItemData[];
  setSourceItems: (sourceItems: RemoteSourceItemData[]) => void;
  selectedSourceItem: RemoteSourceItemData | null;
  setSelectedSourceItem: (sourceItem: RemoteSourceItemData | null) => void;
}

const SourceItemContext = createContext<SourceItemContextProps | undefined>(undefined);

export const SourceItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elementToCreateSourceItem, setElementToCreateSourceItem] = useState<SourceItemFormData | null>(null);
  const [elementToEditSourceItem, setElementToEditSourceItem] = useState<SourceItemModel | null>(null);
  const [sourceItems, setSourceItems] = useState<RemoteSourceItemData[]>([]);
  const [selectedSourceItem, setSelectedSourceItem] = useState<RemoteSourceItemData | null>(null);

  const fetchSourceItems = async () => {
    const sourceItems = await getSourceItems();
    setSourceItems(sourceItems.data);
  }

  useEffect(() => {
    fetchSourceItems();
  }, []);

  return (
    <SourceItemContext.Provider value={{
      elementToCreateSourceItem, setElementToCreateSourceItem,
      elementToEditSourceItem, setElementToEditSourceItem,
      sourceItems, setSourceItems,
      selectedSourceItem, setSelectedSourceItem
    }}>
      {children}
    </SourceItemContext.Provider>
  );
};

export const useSourceItem = () => {
  const context = useContext(SourceItemContext);
  if (!context) {
    throw new Error('useSourceItem must be used within a SourceItemProvider');
  }
  return context;
};