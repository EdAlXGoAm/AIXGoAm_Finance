import React, { useState, useEffect } from 'react';
import styles from '../../styles/Alimentos/ParamConfigForm.module.css';
import { ParamConfigModel } from '../../services/apiParamConfig';
import { ParamConfigElements } from '../../constants/Alimentos/ParamConfigFormElements';

interface ParamConfigFormProps {
  onAdd: () => void;
  elementToEdit?: ParamConfigModel;
  onCleanData: () => void;
}

const ParamConfigForm: React.FC<ParamConfigFormProps> = ({
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
  } = ParamConfigElements({
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
            <h2>{elementToEdit ? 'Editar Parámetro de Configuración' : 'Agregar Parámetro de Configuración'}</h2>
            <form onSubmit={handleSubmit}>
              <label className={styles.centeredLabel}>Unidad de Cantidad</label>
              <select name="amount_unit" value={formData.amount_unit} onChange={handleChange}>
                <option value="">Seleccione una unidad</option>
                <option value="pz">pz - Piezas</option>
                <option value="reb">reb - Rebanadas</option>
                <option value="ud">ud - Unidades</option>
              </select>
              <label className={styles.centeredLabel}>Unidad de Peso</label>
              <select name="weight_unit" value={formData.weight_unit} onChange={handleChange}>
                <option value="">Seleccione una unidad</option>
                <option value="kg">kg - Kilogramos</option>
                <option value="gr">gr - Gramos</option>
                <option value="oz">oz - Onzas</option>
                <option value="lb">lb - Libras</option>
              </select>
              <label className={styles.centeredLabel}>Unidad de Volumen</label>
              <select name="volume_unit" value={formData.volume_unit} onChange={handleChange}>
                <option value="">Seleccione una unidad</option>
                <option value="ml">ml - Mililitros</option>
                <option value="l">l - Litros</option>
                <option value="oz">oz - Onzas</option>
                <option value="gal">gal - Galones</option>
                <option value="cm3">cm3 - Centímetros cúbicos</option>
                <option value="m3">m3 - Metros cúbicos</option>
              </select>
              <label className={styles.centeredLabel}>Unidad Preferida</label>
              <select name="preferred_unit" value={formData.preferred_unit} onChange={handleChange}>
                <option value="">Seleccione una unidad</option>
                <option value="amount_unit">{`Cantidad (${formData.amount_unit})`}</option>
                <option value="weight_unit">{`Peso (${formData.weight_unit})`}</option>
                <option value="volume_unit">{`Volumen (${formData.volume_unit})`}</option>
              </select>
              <label className={styles.centeredLabel}>Estados</label>
              {/* Estados Box */}
              <div className={styles.statesListBox}>
                <button className={`${styles.statesListBoxButton} ${styles.statesListBoxAddButton}`}
                  type="button"
                  onClick={() => setFormData({ ...formData, states_list: [...formData.states_list, ''] })}
                >
                  Agregar Estado
                </button>
                {formData.states_list.map((state, index) => (
                  <div key={index}>
                    <input type="text" name={`states_list[${index}]`} value={state} onChange={handleChange} />
                    <button className={`${styles.statesListBoxButton} ${styles.statesListBoxDeleteButton}`}
                      type="button"
                      onClick={() => setFormData({ ...formData, states_list: formData.states_list.filter((_, i) => i !== index) })}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
              {/* End Estados Box */}
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

export default ParamConfigForm;
