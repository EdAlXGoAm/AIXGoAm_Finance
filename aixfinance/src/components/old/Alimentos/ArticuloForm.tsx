import React, { useState, useEffect } from 'react';
import styles from '../../styles/Alimentos/ArticuloForm.module.css';
import { ArticuloModel } from '../../services/apiArticulo';
import { ArticuloElements } from '../../constants/Alimentos/ArticuloFormElements';
import { toISOStringLocal } from '../../utils/dateUtils';
import { Row, Column, RowForm } from '../../utils/formatUtils';

interface ArticuloFormProps {
  onAdd: () => void;
  elementToEdit?: ArticuloModel;
  onCleanData: () => void;
}

const ArticuloForm: React.FC<ArticuloFormProps> = ({
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
    handleFocus,
    handleBlur
  } = ArticuloElements({
    onCleanData: () => onCleanData(),
    elementToEdit: elementToEdit,
  });

  useEffect(() => {
    if(elementToEdit) {
      setFormData(elementToEdit.data);
      setIsOpen(true);
    }
  }, [elementToEdit]);

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
            <h2>{elementToEdit ? 'Editar Articulo' : 'Agregar Articulo'}</h2>
            <form onSubmit={handleSubmit}>
              <Row>
                <Column>
                  <label>Fecha de compra</label>
                  <input
                    type="date"
                    name="date_of_purchase"
                    value={toISOStringLocal(formData.date_of_purchase).split('T')[0]}
                    onChange={handleChange}
                    required
                  />
                </Column>
                <Column>
                  <label>Hora de compra</label>
                  <input
                    type="time"
                    name="time_of_purchase"
                    value={toISOStringLocal(formData.date_of_purchase).split('T')[1].slice(0, 5)}
                    onChange={handleChange}
                    required
                  />
                </Column>
              </Row>
              <RowForm>
                <label>Nombre</label>
                <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ color: formData.name === 'Desconocido' ? 'gray' : 'black'}}
                required
              />
              </RowForm>
              <RowForm>
                <label>Descripción</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} />
              </RowForm>
              <RowForm>
                <label>Cantidad</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
              </RowForm>
              <RowForm>
                <label>Peso</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
              </RowForm>
              <RowForm>
                <label>Volumen</label>
                <input type="number" name="volume" value={formData.volume} onChange={handleChange} />
              </RowForm>
              <RowForm>
                <label>Parámetro de Configuración</label>
                <select name="id_param_config" value={formData.id_param_config} onChange={handleChange}>
                  <option value="">Seleccione un parámetro de configuración</option>
                </select>
              </RowForm>
              <RowForm>
                <label>Operación</label>
                <select name="id_operation" value={formData.id_operation} onChange={handleChange}>
                  <option value="">Seleccione una operación</option>
                </select>
              </RowForm>
              <RowForm>
                <label>Lugar de la Persona en la Transacción</label>
                <select name="id_place_person_site_transaction" value={formData.id_place_person_site_transaction} onChange={handleChange}>
                  <option value="">Seleccione un lugar de la persona en la transacción</option>
                </select>
              </RowForm>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.buttons}>
                <button type="submit" disabled={loading}>
                  {loading ? 'Actualizando...' : (elementToEdit ? 'Actualizar' : 'Agregar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ArticuloForm;
