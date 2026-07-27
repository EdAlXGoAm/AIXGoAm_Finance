import React, {useState, useEffect } from 'react';
import { getDate, getDatePlusOneDay, getDaysBetweenDates, evaluateIfDate2IsGreaterThanDate1, getDatePlusDays } from '../../utils/dateUtils';
import { CaducidadModel, createCaducidad, updateCaducidad } from '../../services/apiCaducidad';
interface CaducidadElementsProps {
  onCleanData?: () => void,
  elementToEdit?: CaducidadModel,
  onCreateCaducidadId: (id: string) => void,
  onRefreshCaducidads: () => void,
}

export const CaducidadElements = ({ onCleanData, elementToEdit, onCreateCaducidadId, onRefreshCaducidads }: CaducidadElementsProps) => {

  const emptyElementData = {
    datePurchase: getDate(),
    dateExpiration: getDatePlusOneDay(),
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
    if (name === "datePurchase") {
      const diff_date = getDaysBetweenDates(formData.datePurchase, formData.dateExpiration)
      const new_date_of_purchase = new Date(value + 'T00:00:00')
      const new_date_of_expiration = getDatePlusDays(new_date_of_purchase, diff_date)
      setFormData({
        datePurchase: new_date_of_purchase,
        dateExpiration: new_date_of_expiration,
      })
    } else if (name === "dateExpiration") {
      if (!evaluateIfDate2IsGreaterThanDate1(formData.datePurchase, new Date(value + 'T00:00:00'))) {
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
          dateExpiration: getDatePlusDays(formData.datePurchase, 0),
        }));
      } else {
        if (Number(value) > 0) {
          setError(null);
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            dateExpiration: getDatePlusDays(formData.datePurchase, Number(value)),
          }));
        } else {
          setError("El campo días a expiración debe ser un número positivo");
          setFormData((prevData) => ({
            ...prevData,
            dateExpiration: getDatePlusDays(formData.datePurchase, 0),
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
        const response = await createCaducidad(formData);
        const remoteCaducidad = response.data;
        if (remoteCaducidad._id) {
          onCreateCaducidadId(remoteCaducidad._id);
        }
      }
      handleClose();
      onRefreshCaducidads();
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
        datePurchase: start,
        dateExpiration: end,
      });
    }
  };
  
  return {
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleClose,
    handleChange,
    handleSubmit,
    handleCalendarChange
  };
}

