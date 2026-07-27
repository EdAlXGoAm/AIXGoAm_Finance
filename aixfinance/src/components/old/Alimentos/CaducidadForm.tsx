import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../../styles/Alimentos/CaducidadForm.module.css';
import { CaducidadModel } from '../../services/apiCaducidad';
import { CaducidadElements } from '../../constants/Alimentos/CaducidadFormElements';
import { getDaysBetweenDates, toISOStringLocal } from '../../utils/dateUtils';
import { RowForm } from '../../utils/formatUtils';
interface CaducidadFormProps {
  onCleanData: () => void;
  elementToEdit?: CaducidadModel;
  onCreateCaducidadId: (id: string) => void;
  onRefreshCaducidads: () => void;
  hideButton?: boolean;
  mode?: 'floating' | 'subform';
}

const CaducidadForm: React.FC<CaducidadFormProps> = ({
  elementToEdit,
  onCleanData,
  onCreateCaducidadId,
  onRefreshCaducidads,
  hideButton,
  mode
}) => {
  
  const {
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleChange,
    handleSubmit,
    handleClose,
    handleCalendarChange
  } = CaducidadElements({
    onCleanData, elementToEdit,
    onCreateCaducidadId, onRefreshCaducidads
  });

  useEffect(() => {
    if(elementToEdit) {
      setFormData(elementToEdit.data);
      setIsOpen(true);
    }
  }, [elementToEdit]);

  const tileClassName = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') { // Solo aplicar en la vista de mes
      const purchaseDate = new Date(formData.datePurchase);
      const expirationDate = new Date(formData.dateExpiration);
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
    <React.Fragment>
      {!elementToEdit && !hideButton && (
        mode === 'floating' ? (
          <button className={styles.addButton} onClick={() => setIsOpen(true)}
            style={{ '--add-button-bottom': `${100}px` } as React.CSSProperties}
          >
            <pre style={{ fontSize: '0.6rem' }}>Caducidad</pre>
            +
          </button>
        ) : (
          <button className={styles.simpleButtonForForm} onClick={() => setIsOpen(true)}>
            Add Caducidad
          </button>
        )
      )}
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{elementToEdit ? 'Editar Caducidad' : 'Agregar Caducidad'}</h2>

            {/* Calendario Dinámico */}
            <div className={styles.calendarContainer}>
              <Calendar
                value={[formData.datePurchase, formData.dateExpiration]}
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
                  name="datePurchase"
                  value={toISOStringLocal(formData.datePurchase).split('T')[0]}
                  onChange={handleChange}
                  required
                />
              </RowForm>
              <RowForm>
                <label>Fecha de expiración</label>
                <input
                  type="date"
                  name="dateExpiration"
                  value={toISOStringLocal(formData.dateExpiration).split('T')[0]}
                  onChange={handleChange}
                  required
                />
              </RowForm>
              <RowForm>
                <label>Días a expiración</label>
                <input
                  type="text"
                  name="daysToExpiration"
                  value={getDaysBetweenDates(formData.datePurchase, formData.dateExpiration).toString()}
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
    </React.Fragment>
  );
}

export default CaducidadForm;