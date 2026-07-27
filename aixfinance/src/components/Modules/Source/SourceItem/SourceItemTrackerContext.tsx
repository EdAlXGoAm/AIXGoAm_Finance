import React, { createContext, useContext, useEffect, useState } from 'react';
import { RemoteSourceItemData, SourceItemFormData, SourceItemModel, getSourceItems } from '@/services/api/source/apiSourceItem';
import { useSourceItem } from './SourceItemContext';

interface SourceItemTrackerContextProps {
  sourceItemsTracker: RemoteSourceItemData[];
  setSourceItemsTracker: (sourceItemsTracker: RemoteSourceItemData[]) => void;
}

const SourceItemTrackerContext = createContext<SourceItemTrackerContextProps | undefined>(undefined);

export const SourceItemTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sourceItemsTracker, setSourceItemsTracker] = useState<RemoteSourceItemData[]>([]);

  const {
    sourceItems,
    selectedSourceItem,
  } = useSourceItem();

  const fetchSourceItemsTracker = async () => {
    if (selectedSourceItem) {
      const filteredItems = sourceItems
        .filter((item: RemoteSourceItemData) => item.name === selectedSourceItem.name)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSourceItemsTracker(filteredItems);
    }
  }

  useEffect(() => {
    fetchSourceItemsTracker();
  }, [selectedSourceItem, sourceItems]);

  return (
    <SourceItemTrackerContext.Provider value={{
      sourceItemsTracker, setSourceItemsTracker
    }}>
      {children}
    </SourceItemTrackerContext.Provider>
  );
};

export const useSourceItemTracker = () => {
  const context = useContext(SourceItemTrackerContext);
  if (!context) {
    throw new Error('useSourceItemTracker must be used within a SourceItemTrackerProvider');
  }
  return context;
};