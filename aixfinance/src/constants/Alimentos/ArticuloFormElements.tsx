import React, { useState, useEffect } from 'react';
import { ArticuloModel, createArticulo, updateArticulo } from '../../services/apiArticulo';
import { toISOStringLocal } from '../../utils/dateUtils';

interface ArticuloElementsProps {
  onCleanData?: () => void,
  elementToEdit?: ArticuloModel,
}

export const ArticuloElements = ({ onCleanData, elementToEdit }: ArticuloElementsProps) => {

  const emptyElementData = {
    date_of_purchase: new Date(),
    cost: 0,
    name: "Desconocido",
    description: "",
    amount: 0,
    weight: 0,
    volume: 0,
    id_param_config: "",
    id_operation: "",
    id_place_person_site_transaction: "",
    ids_consumption_history: [""],
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
    if (name === "date_of_purchase") {
      const time_of_purchase = toISOStringLocal(formData.date_of_purchase).split('T')[1].slice(0, 5)
      const new_date_of_purchase = new Date(value + 'T' + time_of_purchase)
      console.log("new_date_of_purchase", new_date_of_purchase)
      setFormData((prevData) => ({ ...prevData, [name]: new_date_of_purchase }));
    } else if (name === "time_of_purchase") {
      const date_of_purchase = toISOStringLocal(formData.date_of_purchase).split('T')[0]
      const new_date_of_purchase = new Date(date_of_purchase + 'T' + value)
      console.log("new_date_of_purchase", new_date_of_purchase)
      setFormData((prevData) => ({ ...prevData, ["date_of_purchase"]: new_date_of_purchase }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(elementToEdit) {
        await updateArticulo(elementToEdit._id, formData);
      } else {
        await createArticulo(formData);
      }
      handleClose();
    } catch (error: any) {
      setError(error.message || 'Error al agregar el artículo');
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
