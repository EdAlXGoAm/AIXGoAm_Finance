import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../../styles/Alimentos/CaducidadForm.module.css';
import { CaducidadModel } from '../../services/apiCaducidad';
import { CaducidadElements } from '../../constants/Alimentos/CaducidadFormElements';
import { getDaysBetweenDates, toISOStringLocal } from '../../utils/dateUtils';
import { RowForm } from '../../utils/formatUtils';
interface CaducidadFormProps {
  onAdd: () => void;
  elementToEdit?: CaducidadModel;
  onCleanData: () => void;
}

const CaducidadForm: React.FC<CaducidadFormProps> = ({
  onAdd,
  elementToEdit,
  onCleanData
}) => {
  
  const {
    emptyElementData,
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleChange,
    handleSubmit,
    handleClose,
    handleCalendarChange
  } = CaducidadElements({
    onCleanData: () => onCleanData(),
    elementToEdit: elementToEdit,
  });

  useEffect(() => {
    if(elementToEdit) {
      setFormData(elementToEdit.data);
      setIsOpen(true);
    }
  }, [elementToEdit]);

  const tileClassName = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') { // Solo aplicar en la vista de mes
      const purchaseDate = new Date(formData.date_of_purchase);
      const expirationDate = new Date(formData.date_of_expiration);
      // Remover la hora para evitar problemas de comparación
      const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const startDate = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth(), purchaseDate.getDate());
      const endDate = new Date(expirationDate.getFullYear(), expirationDate.getMonth(), expirationDate.getDate());
      // console.log("Current date: ", currentDate, "\nStart date: ", startDate, "\nEnd date: ", endDate)
      if (currentDate >= startDate && currentDate <= endDate) {
        return styles.highlight;
      }
    }
    return null;
  };

  return (
    <>
      {!elementToEdit && (
        <button className={styles.addButton} onClick={() => setIsOpen(true)}>
          +
        </button>
      )}
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{elementToEdit ? 'Editar Caducidad' : 'Agregar Caducidad'}</h2>

            {/* Calendario Dinámico */}
            <div className={styles.calendarContainer}>
              <Calendar
                value={[formData.date_of_purchase, formData.date_of_expiration]}
                tileClassName={tileClassName}
                selectRange={true}
                onChange={handleCalendarChange}
              />
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <RowForm>
                <label>Fecha de compra</label>
                <input
                  type="date"
                  name="date_of_purchase"
                  value={toISOStringLocal(formData.date_of_purchase).split('T')[0]}
                  onChange={handleChange}
                  required
                />
              </RowForm>
              <RowForm>
                <label>Fecha de expiración</label>
                <input
                  type="date"
                  name="date_of_expiration"
                  value={toISOStringLocal(formData.date_of_expiration).split('T')[0]}
                  onChange={handleChange}
                  required
                />
              </RowForm>
              <RowForm>
                <label>Días a expiración</label>
                <input
                  type="text"
                  name="days_to_expiration"
                  value={getDaysBetweenDates(formData.date_of_purchase, formData.date_of_expiration).toString()}
                  onChange={handleChange}
                  required
                />
              </RowForm>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.buttons}>
                <button type="submit" disabled={loading}>
                  {loading ? (elementToEdit ? 'Actualizando...' : 'Agregando...') : (elementToEdit ? 'Actualizar' : 'Agregar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CaducidadForm;