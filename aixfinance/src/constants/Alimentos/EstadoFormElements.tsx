import React, { useState, useEffect } from 'react';
import { EstadoModel, createEstado, updateEstado } from '../../services/apiEstado';

interface EstadoElementsProps {
  onCleanData?: () => void,
  elementToEdit?: EstadoModel,
}

export const EstadoElements = ({ onCleanData, elementToEdit}: EstadoElementsProps) => {
  
  const emptyElementData = {
    name: "",
    warning: "",
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
        await updateEstado(elementToEdit._id, formData);
    } else {
        await createEstado(formData);
      }
      handleClose();
    } catch (error: any) {
      setError(error.message || 'Error al agregar el estado');
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