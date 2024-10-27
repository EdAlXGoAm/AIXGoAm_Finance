import React, { useState, useEffect } from 'react';
import styles from '../../styles/Alimentos/EstadoForm.module.css';
import { EstadoModel } from '../../services/apiEstado';
import { EstadoElements } from '../../constants/Alimentos/EstadoFormElements';

interface EstadoFormProps {
  onAdd: () => void;
  elementToEdit?: EstadoModel;
  onCleanData: () => void;
}

const EstadoForm: React.FC<EstadoFormProps> = ({
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
    handleClose
  } = EstadoElements({
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
            <h2>{elementToEdit ? 'Editar Estado' : 'Agregar Estado'}</h2>
            <form onSubmit={handleSubmit}>
              <label>Nombre</label>
              <select
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un estado</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Abierto">Abierto</option>
                <option value="Consumido">Consumido</option>
                <option value="Deshechado">Deshechado</option>
              </select>
              <label>Advertencia</label>
              <input
                type="text"
                name="warning"
                value={formData.warning}
                onChange={handleChange}
              />  
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
  )
}

export default EstadoForm;
