import React from 'react';
import styles from '../../commonForm/floatingForm.module.css';
import { ParamConfigModel, RemoteParamConfigData } from '../../services/apiParamConfig';
import { ParamConfigFormElements } from '../../constants/Alimentos/ParamConfigFormElements';
import { CustomForm, RowForm } from '../../utils/formatUtils';
import { ButtonCircle, ButtonRectangle, ButtonSubmit } from '../../commonForm/FrontButtons';

interface ParamConfigFormProps {
  onCleanElementToEdit: () => void;
  elementToEdit?: ParamConfigModel;
  hideButton?: boolean;
  mode?: 'floating' | 'subform';
  onAddResponse: (response: RemoteParamConfigData) => void;
  onUpdateResponse: (response: RemoteParamConfigData) => void;
}

const ParamConfigForm: React.FC<ParamConfigFormProps> = ({
  elementToEdit,
  onCleanElementToEdit,
  hideButton,
  mode,
  onAddResponse,
  onUpdateResponse,
}) => {
  const {
    isOpen,
    error,
    loadingSubmit,
    formData,
    overlayRef, modalRef,
    handleCreateNewElement,
    handleClose,
    handleChangeTextAndSelect,
    handleChangeList, handleAddListItem, handleRemoveListItem,
    onSubmitParamConfig,
  } = ParamConfigFormElements({
    onCleanElementToEdit,
    elementToEdit,
    onAddResponse,
    onUpdateResponse,
  });


  return (
    <React.Fragment>
      {!elementToEdit && !hideButton && (
        mode === 'floating' ? (
          <ButtonCircle
            textToShow="Parámetros"
            positionX={100}
            positionY={100}
            action={handleCreateNewElement}
          />
        ) : (
          <ButtonRectangle
            textToShow="Agregar Parámetro de Configuración"
            action={handleCreateNewElement}
          />
        )
      )}
      {isOpen && (
        <div className={styles.overlay} ref={overlayRef}>
          <div className={styles.modal} ref={modalRef} style={{ '--max-width-modal': '800px' } as React.CSSProperties}>
            <button className={styles.closeButton} onClick={handleClose}>
              X
            </button>
            <h2>{elementToEdit ? 'Editar Parámetro de Configuración' : 'Agregar Parámetro de Configuración'}</h2>
            <CustomForm>
              <div className={styles.formContainer}>
                <div className={styles.column}>
                  <RowForm>
                    <label className={styles.centeredLabel}>Unidad de Cantidad</label>
                    <select name="quantity_unit" value={formData.quantity_unit} onChange={handleChangeTextAndSelect}>
                      <option value="">Seleccione una unidad</option>
                      <option value="pz">pz - Piezas</option>
                      <option value="reb">reb - Rebanadas</option>
                      <option value="ud">ud - Unidades</option>
                      <option value="min">min - Minutos</option>
                    </select>
                  </RowForm>
                  <RowForm>
                    <label className={styles.centeredLabel}>Unidad de Peso</label>
                    <select name="weight_unit" value={formData.weight_unit} onChange={handleChangeTextAndSelect}>
                      <option value="">Seleccione una unidad</option>
                      <option value="kg">kg - Kilogramos</option>
                      <option value="gr">gr - Gramos</option>
                      <option value="oz">oz - Onzas</option>
                      <option value="lb">lb - Libras</option>
                    </select>
                  </RowForm>
                  <RowForm>
                    <label className={styles.centeredLabel}>Unidad de Volumen</label>
                    <select name="volume_unit" value={formData.volume_unit} onChange={handleChangeTextAndSelect}>
                      <option value="">Seleccione una unidad</option>
                      <option value="ml">ml - Mililitros</option>
                      <option value="l">l - Litros</option>
                      <option value="oz">oz - Onzas</option>
                      <option value="gal">gal - Galones</option>
                      <option value="cm3">cm3 - Centímetros cúbicos</option>
                      <option value="m3">m3 - Metros cúbicos</option>
                    </select>
                  </RowForm>
                  <RowForm>
                    <label className={styles.centeredLabel}>Unidad de Tiempo</label>
                    <select name="time_unit" value={formData.time_unit} onChange={handleChangeTextAndSelect}>
                      <option value="">Seleccione una unidad</option>
                      <option value="y">y - Años</option>
                      <option value="m">m - Meses</option>
                      <option value="w">w - Semanas</option>
                      <option value="d">d - Días</option>
                      <option value="h">h - Horas</option>
                      <option value="min">min - Minutos</option>
                    </select>
                  </RowForm>
                </div>
                <div className={styles.column}>
                  <RowForm>
                    <label className={styles.centeredLabel}>Unidad Default</label>
                    <select name="default_unit" value={formData.default_unit} onChange={handleChangeTextAndSelect}>
                      <option value="">Seleccione una unidad</option>
                      <option value="quantity_unit">{`Cantidad (${formData.quantity_unit})`}</option>
                      <option value="weight_unit">{`Peso (${formData.weight_unit})`}</option>
                      <option value="volume_unit">{`Volumen (${formData.volume_unit})`}</option>
                      <option value="time_unit">{`Tiempo (${formData.time_unit})`}</option>
                    </select>
                  </RowForm>
                  <RowForm>
                    <label className={styles.centeredLabel}>Unidad de Referencia</label>
                    <select name="reference_unit" value={formData.reference_unit} onChange={handleChangeTextAndSelect}>
                      <option value="">Seleccione una unidad</option>
                      <option value="quantity_unit">{`Cantidad (${formData.quantity_unit})`}</option>
                      <option value="weight_unit">{`Peso (${formData.weight_unit})`}</option>
                      <option value="volume_unit">{`Volumen (${formData.volume_unit})`}</option>
                      <option value="time_unit">{`Tiempo (${formData.time_unit})`}</option>
                    </select>
                  </RowForm>
                  <RowForm>
                    <label className={styles.centeredLabel}>Estados</label>
                    {/* Caja de Estados */}
                    <div className={styles.listBoxContainer}>
                      <button
                        className={`${styles.listBoxAddButton}`}
                        type="button"
                        onClick={() => handleAddListItem('states_list', '')}
                      >
                        Agregar Estado
                      </button>
                      {formData.states_list.map((state: string, index: number) => (
                        <div key={index} className={styles.listBoxElement}>
                          <input
                            type="text"
                            name={`states_list[${index}]`}
                            value={state}
                            onChange={handleChangeList}
                            className={styles.listBoxInput}
                          />
                          <button
                            className={styles.listBoxRemoveButton}
                            type="button"
                            onClick={() => handleRemoveListItem('states_list', index)}
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  </RowForm>
                </div>
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <ButtonSubmit
                actionText={elementToEdit ? 'Actualizar' : 'Agregar'}
                loading={loadingSubmit}
                action={onSubmitParamConfig}
              />
            </CustomForm>
          </div>
        </div>  
      )}
    </React.Fragment>
  );
}

export default ParamConfigForm;
