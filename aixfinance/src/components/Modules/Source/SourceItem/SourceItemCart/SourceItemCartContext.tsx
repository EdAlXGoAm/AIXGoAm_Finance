import React, { createContext, useContext, useEffect, useState } from 'react';
import { RemoteSourceItemCartData, SourceItemCartFormData, SourceItemCartModel, getSourceItemCartsByArgument } from '@/services/api/source/apiSourceItemsCart';
import { useSourceItem } from '../SourceItemContext';

interface SourceItemCartContextProps {
  elementToCreateSourceItemCart: SourceItemCartFormData | null;
  setElementToCreateSourceItemCart: (elementToCreateSourceItemCart: SourceItemCartFormData | null) => void;
  elementToEditSourceItemCart: SourceItemCartModel | null;
  setElementToEditSourceItemCart: (elementToEditSourceItemCart: SourceItemCartModel | null) => void;
  sourceItemsCarts: RemoteSourceItemCartData[];
  setSourceItemsCarts: (sourceItemsCarts: RemoteSourceItemCartData[]) => void;
  viewSourceItemCart: boolean;
  setViewSourceItemCart: (viewSourceItemCart: boolean) => void;
}

const SourceItemCartContext = createContext<SourceItemCartContextProps | undefined>(undefined);

export const SourceItemCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elementToCreateSourceItemCart, setElementToCreateSourceItemCart] = useState<SourceItemCartFormData | null>(null);
  const [elementToEditSourceItemCart, setElementToEditSourceItemCart] = useState<SourceItemCartModel | null>(null);
  const [sourceItemsCarts, setSourceItemsCarts] = useState<RemoteSourceItemCartData[]>([]);
  const [viewSourceItemCart, setViewSourceItemCart] = useState<boolean>(false);
  const {
    sourceItems,
    selectedSourceItem,
  } = useSourceItem();

  const fetchSourceItemsCart = async () => {
    const response = await getSourceItemCartsByArgument('status', 'Pendiente');
    console.log(response.data);
    setSourceItemsCarts(response.data);
  }

  useEffect(() => {
    fetchSourceItemsCart();
  }, [selectedSourceItem, sourceItems]);

  return (
    <SourceItemCartContext.Provider value={{
      elementToCreateSourceItemCart, setElementToCreateSourceItemCart,
      elementToEditSourceItemCart, setElementToEditSourceItemCart,
      sourceItemsCarts, setSourceItemsCarts,
      viewSourceItemCart, setViewSourceItemCart
    }}>
      {children}
    </SourceItemCartContext.Provider>
  );
};

export const useSourceItemCart = () => {
  const context = useContext(SourceItemCartContext);
  if (!context) {
    throw new Error('useSourceItemCart must be used within a SourceItemCartProvider');
  }
  return context;
};