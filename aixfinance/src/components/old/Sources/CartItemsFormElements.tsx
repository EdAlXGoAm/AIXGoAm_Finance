import React, { useEffect, useState } from 'react';
import { CartItemModel, createCartItem, updateCartItem, RemoteCartItemData } from '@/services/apiCartItem';
import { RemoteInventoryItemData } from '@/services/apiSourceItem';
import { InventoryItemElements } from './SourceItemElements';
import { RemoteSourceData } from '@/services/apiSource';

interface CartItemsFormElementsProps {
  onCleanData: () => void,
  elementToEdit?: CartItemModel,
  onCreateCartItemId: (id: string) => void,
  onRefreshCartItems: () => void,
}

export const CartItemsFormElements = ({ onCleanData, elementToEdit, onCreateCartItemId, onRefreshCartItems }: CartItemsFormElementsProps) => {

  
  const emptyElementData = {
    idInventoryItem: {} as RemoteInventoryItemData,
    idSource: {} as RemoteSourceData,
    quantity: 0,
    totalPrice: 0,
    priority: ''
  };
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // InventoryItemElements

  const { inventoryItems, fetchInventoryItems } = InventoryItemElements({ refresh: false, setRefresh: () => {} });
  const [dicInventoryItem, setDicInventoryItem] = useState<{ [key: string]: RemoteInventoryItemData }>({});

  useEffect(() => {
    fetchInventoryItems();
  }, [isOpen]);

  useEffect(() => {
    setDicInventoryItem(() => {
      const newDicInventoryItem: { [key: string]: RemoteInventoryItemData } = {};
      inventoryItems.forEach((inventoryItem) => {
        newDicInventoryItem[inventoryItem._id] = inventoryItem;
      });
      return newDicInventoryItem;
    });
    if (inventoryItems.length > 0) {
      const inventoryItem = inventoryItems[0];
      setSelectedInventoryItem(inventoryItem._id);
      setFormData((prev) => ({
        ...prev,
        idInventoryItem: inventoryItem,
        idSource: inventoryItem.idSource,
      }));
    }
  }, [inventoryItems]);

  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string>('');
  const handleChangeInventoryItem = (value: string) => {
    setSelectedInventoryItem(value);
    setFormData((prev) => ({
      ...prev,
      idSource: dicInventoryItem[value].idSource,
      idInventoryItem: dicInventoryItem[value],
    }));
  };

  
  const [formData, setFormData] = useState(emptyElementData);
  
  useEffect(() => {
    if (formData.idInventoryItem) {
      setFormData((prev) => ({
        ...prev,
        totalPrice: parseFloat(formData.quantity.toString()) * formData.idInventoryItem.price
      }));
    }
  }, [formData.idInventoryItem]);

  const handleClose = () => {
    setError(null);
    setIsOpen(false);
    setFormData(emptyElementData);
    onCleanData();
  };

  const [displayQuantity, setDisplayQuantity] = useState<string>('0');
  const [displayQuantityError, setDisplayQuantityError] = useState<string | null>(null);

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayQuantity(e.target.value);
    try {
      const value = parseFloat(e.target.value);
      if (isNaN(value) || value < 0 || !Number.isInteger(value)) {
        setDisplayQuantityError('La cantidad debe ser un número entero positivo');
        setFormData((prev) => ({ ...prev, 
          quantity: 0,
          totalPrice: 0 
        }));
        return;
      }
      setDisplayQuantityError(null);
      setFormData((prev) => ({ ...prev, 
        quantity: value,
        totalPrice: value * formData.idInventoryItem.price
      }));
    } catch (error) {
      setDisplayQuantityError('Error al cambiar la cantidad');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'pricePerUnit' || name === 'totalPrice') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let remoteCartItem: RemoteCartItemData;
      let response;
      if (elementToEdit) {
        response = await updateCartItem(elementToEdit._id, formData);
      } else {
        response = await createCartItem(formData);
        remoteCartItem = response.data;
        if (remoteCartItem._id) {
          onCreateCartItemId(remoteCartItem._id);
        }
      }
      handleClose();
      onRefreshCartItems();
    } catch (error) {
      setError('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === 'Desconocido') setFormData((prev) => ({ ...prev, name: '' }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === '') setFormData((prev) => ({ ...prev, name: 'Desconocido' }));
  };

  return {
    dicInventoryItem,
    selectedInventoryItem,
    handleChangeInventoryItem,
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleClose, 
    displayQuantity, displayQuantityError, handleChangeQuantity,
    handleChange,
    handleSubmit,
    handleFocus,
    handleBlur
  };
};
