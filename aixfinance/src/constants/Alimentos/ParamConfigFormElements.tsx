import React, { useState, useEffect } from 'react';
import { ParamConfigModel, createParamConfig, updateParamConfig } from '../../services/apiParamConfig';

interface ParamConfigElementsProps {
  onCleanData?: () => void,
  elementToEdit?: ParamConfigModel,
}

export const ParamConfigElements = ({ onCleanData, elementToEdit }: ParamConfigElementsProps) => {

  const emptyElementData = {
    amount_unit: "pz",
    weight_unit: "gr",
    volume_unit: "l",
    preferred_unit: "amount_unit",
    states_list: ["Nuevo", "Abierto", "Consumido", "Deshechado"],
  };

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState(emptyElementData);

  const handleClose = () => {
    setError(null)
    setIsOpen(false);
    setFormData(emptyElementData);
    if(onCleanData) onCleanData();
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(elementToEdit) {
        await updateParamConfig(elementToEdit._id, formData);
      } else {
        await createParamConfig(formData);
      }
      handleClose();
    } catch (error: any) {
      setError(error.message || 'Error al agregar el parámetro de configuración');
    } finally {
      setLoading(false);
    }
  }

  return {
    emptyElementData,
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleChange,
    handleSubmit,
    handleClose
  }
}
