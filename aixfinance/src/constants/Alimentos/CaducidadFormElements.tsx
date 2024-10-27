import React, {useState, useEffect } from 'react';
import { getDate, getDatePlusOneDay, getDaysBetweenDates, evaluateIfDate2IsGreaterThanDate1, getDatePlusDays } from '../../utils/dateUtils';
import { CaducidadModel, createCaducidad, updateCaducidad } from '../../services/apiCaducidad';
interface CaducidadElementsProps {
  onCleanData?: () => void,
  elementToEdit?: CaducidadModel,
}

export const CaducidadElements = ({ onCleanData, elementToEdit}: CaducidadElementsProps) => {

  const emptyElementData = {
    date_of_purchase: getDate(),
    date_of_expiration: getDatePlusOneDay(),
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
      const diff_date = getDaysBetweenDates(formData.date_of_purchase, formData.date_of_expiration)
      const new_date_of_purchase = new Date(value + 'T00:00:00')
      const new_date_of_expiration = getDatePlusDays(new_date_of_purchase, diff_date)
      console.log("new_date_of_purchase", new_date_of_purchase)
      console.log("new_date_of_expiration", new_date_of_expiration)
      setFormData({
        date_of_purchase: new_date_of_purchase,
        date_of_expiration: new_date_of_expiration,
      })
    } else if (name === "date_of_expiration") {
      if (!evaluateIfDate2IsGreaterThanDate1(formData.date_of_purchase, new Date(value + 'T00:00:00'))) {
        setError("La fecha de expiración debe ser mayor que la fecha de compra");
      } else {
        setError(null);
        setFormData((prevData) => ({
          ...prevData,
          [name]: new Date(value + 'T00:00:00'),
        }));
      }
    }
    else if (name === "days_to_expiration") {
      if (value === "") {
        setError("El campo días a expiración es requerido");
        setFormData((prevData) => ({
          ...prevData,
          date_of_expiration: getDatePlusDays(formData.date_of_purchase, 0),
        }));
      } else {
        if (Number(value) > 0) {
          setError(null);
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            date_of_expiration: getDatePlusDays(formData.date_of_purchase, Number(value)),
          }));
        } else {
          setError("El campo días a expiración debe ser un número positivo");
          setFormData((prevData) => ({
            ...prevData,
            date_of_expiration: getDatePlusDays(formData.date_of_purchase, 0),
          }));
        }
      }
    }
    else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(elementToEdit) {
        await updateCaducidad(elementToEdit._id, formData);
      } else {
        await createCaducidad(formData);
      }
      handleClose();
    } catch (error: any) {
      setError(error.message || 'Error al agregar la caducidad');
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarChange = (selectedDates: any) => {
    if (Array.isArray(selectedDates) && selectedDates.length === 2) {
      const [start, end] = selectedDates;
      // End time set to 12:00:00 AM
      end.setHours(0, 0, 0, 0);
      setFormData({
        ...formData,
        date_of_purchase: start,
        date_of_expiration: end,
      });
    }
  };
  
  return {
    emptyElementData,
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleChange,
    handleSubmit,
    handleClose,
    handleCalendarChange
  };
}

