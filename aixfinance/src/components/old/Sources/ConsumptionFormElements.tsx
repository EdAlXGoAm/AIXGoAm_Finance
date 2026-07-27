import React, { useEffect, useState } from 'react';
import { ConsumptionModel, createConsumption, updateConsumption, RemoteConsumptionData } from '@/services/apiConsumption';
import { RemotePurchaseItemStoryData } from '@/services/apiPurchaseItemStory';
import { validatePriceInput } from '@/validationFunctions/validateInput';
import { toISOStringLocal } from '@/utils/dateUtils';

interface ConsumptionFormElementsProps {
  onCleanData: () => void,
  elementToEdit?: ConsumptionModel,
  onCreateConsumptionId: (id: string) => void,
  onRefreshConsumptions: () => void,
}

export const ConsumptionFormElements = ({ onCleanData, elementToEdit, onCreateConsumptionId, onRefreshConsumptions }: ConsumptionFormElementsProps) => {

  const emptyElementData = {
    idPurchaseItemStory: {} as RemotePurchaseItemStoryData,
    date: new Date(),
    type: '',
    quantityConsumed: 0,
    waste: 0,
    cost: 0,
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState(emptyElementData);

  const handleClose = () => {
    setError(null);
    setIsOpen(false);
    setFormData(emptyElementData);
    onCleanData();
    setDisplayQuantity('0');
    setDisplayPrice('$0.00')
  }
    
  const [displayQuantity, setDisplayQuantity] = useState<string>('0');
  const [displayQuantityError, setDisplayQuantityError] = useState<string | null>(null);
  const [displayWaste, setDisplayWaste] = useState<string>('0');
  const [displayWasteError, setDisplayWasteError] = useState<string | null>(null);

  const handleChangeQuantity = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    name === 'quantityConsumed' ? setDisplayQuantity(e.target.value) : setDisplayWaste(e.target.value);
    try {
      const value = parseFloat(e.target.value);
      if (isNaN(value) || value < 0 || !Number.isInteger(value)) {
        name === 'quantityConsumed' ? setDisplayQuantityError('La cantidad debe ser un número entero positivo') : setDisplayWasteError('El desperdicio debe ser un número entero positivo');
        setFormData((prev) => ({
          ...prev,
          [name]: 0
        }));
        return;
      }
      name === 'quantityConsumed' ? setDisplayQuantityError(null) : setDisplayWasteError(null);
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    } catch (error) {
      name === 'quantityConsumed' ? setDisplayQuantityError('Error al cambiar la cantidad') : setDisplayWasteError('Error al cambiar el desperdicio');
    }
  };

  const [displayPrice, setDisplayPrice] = useState<string>('$0.00');
  const [displayPriceError, setDisplayPriceError] = useState<string | null>(null);

  const handleChangePrice = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    name === 'cost' ? setDisplayPrice(e.target.value) : setDisplayWasteError(e.target.value);
    const inputValue = e.target.value;
    setDisplayPrice(inputValue);
  
    const result = validatePriceInput(inputValue);
  
    if (!result.valid) {
      name === 'cost' ? setDisplayPriceError(result.error || 'Error de validación') : setDisplayWasteError(result.error || 'Error de validación');
      setFormData((prev) => ({
        ...prev,
        [name]: 0
      }));
      return;
    }

    name === 'cost' ? setDisplayPriceError(null) : setDisplayWasteError(null);
    setFormData((prev) => ({
      ...prev,
      [name]: result.value!
    }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "date") {
      const time = toISOStringLocal(formData.date).split('T')[1].slice(0, 5)
      setFormData((prev) => ({ ...prev, [name]: new Date(value + 'T' + time) }));
    } else if (name === "time") {
      const date = toISOStringLocal(formData.date).split('T')[0]
      setFormData((prev) => ({ ...prev, ["date"]: new Date(date + 'T' + value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let remoteConsumption: RemoteConsumptionData;
      let response;
      if (elementToEdit) {
        if (elementToEdit._id === '') {
          response = await createConsumption(formData);
          remoteConsumption = response.data;
          if (remoteConsumption._id) {
            onCreateConsumptionId(remoteConsumption._id);
          }
        } else {
          response = await updateConsumption(elementToEdit._id, formData);
        }
      } else {
        response = await createConsumption(formData);
        remoteConsumption = response.data;
        if (remoteConsumption._id) {
          onCreateConsumptionId(remoteConsumption._id);
        }
      }
      handleClose();
      onRefreshConsumptions();
    } catch (error) {
      setError('Error al crear el consumo');
    } finally {
      setLoading(false);
    }
  }

  return {
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleClose,
    displayQuantity, setDisplayQuantity, displayQuantityError,
    displayWaste, setDisplayWaste, displayWasteError,
    handleChangeQuantity,
    displayPrice, setDisplayPrice, displayPriceError, handleChangePrice,
    handleChange,
    handleSubmit,
  }

};
