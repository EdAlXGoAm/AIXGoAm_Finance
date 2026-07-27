import React, { useEffect, useState } from 'react';
import styles from '../../styles/Sources/TrackingItemsForm.module.css';
import { RemoteTrackingItemData, TrackingItemModel } from '@/services/apiTrackingItem';
import { TrackingItemsFormElements } from './TrackingItemsFormElements';
import { Row, Column, RowForm, FormulasContainer, FormulaLabel, CustomForm, VariableText } from '@/utils/formatUtils';
import { CenteredSelect } from '@/utils/textUtils';
import ImageSelect from '@/utils/CustomSelector/ImageSelect';
import { Button } from '@mui/material';
import { toISOStringLocal } from '@/utils/dateUtils';
import { ButtonCircle, ButtonSubmit } from '@/commonForm/FrontButtons';
import { ButtonRectangle } from '@/commonForm/FrontButtons';
interface TrackingItemsFormProps {
  onCleanElementToEdit: () => void;
  elementToEdit?: TrackingItemModel;
  hideButton?: boolean;
  mode?: 'floating' | 'subform';
  onAddResponse: (response: RemoteTrackingItemData) => void;
  onUpdateResponse: (response: RemoteTrackingItemData) => void;
  newTriggeredFromExternalComponent?: boolean;
  setNewTriggeredFromExternalComponent?: (value: boolean) => void;
  idSourceItemTriggeredFromExternalComponent?: any;
}

const TrackingItemsForm: React.FC<TrackingItemsFormProps> = ({
  onCleanElementToEdit,
  elementToEdit,
  hideButton,
  mode,
  onAddResponse,
  onUpdateResponse,
  newTriggeredFromExternalComponent,
  setNewTriggeredFromExternalComponent,
  idSourceItemTriggeredFromExternalComponent
}) => {
  const {
    isOpen,
    error, setError,
    loadingSubmit, setLoadingSubmit,
    loadingForm, setLoadingForm,
    formData, setFormData,
    submitAction, setSubmitAction,
    displayData, setDisplayData,
    displayError, setDisplayError,
    overlayRef,
    modalRef,
    handleCreateNewElement,
    handleClose,
    handleChangeImageSelect,
    handleChangeTextAndSelect,
    handleChangeWithValidation,
    handleChangeList,
    handleAddListItem,
    handleRemoveListItem,
    handleSubmitWithResponse,
    handleFocus,
    handleBlur,
    handleChangeRichText,

    onSubmitTrackingItem,

    sourceItemOptions,
    handleChangeDate,
  } = TrackingItemsFormElements({
    onCleanElementToEdit,
    elementToEdit,
    onAddResponse,
    onUpdateResponse,
    newTriggeredFromExternalComponent,
    setNewTriggeredFromExternalComponent,
    idSourceItemTriggeredFromExternalComponent
  });

  return (
    <React.Fragment>
    {!elementToEdit && !hideButton && (
      mode === 'floating' ? (
        <ButtonCircle
          textToShow="Seguimiento"
          positionX={180}
          positionY={100}
          action={handleCreateNewElement}
        />
      ) : (
        <ButtonRectangle
          textToShow="Agregar Seguimiento"
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
            <h2>{elementToEdit ? 'Editar Seguimiento' : 'Agregar Seguimiento'}</h2>
            <CustomForm>
              <Row mb="10px">
                <Column>
                  <CenteredSelect label="Item" width="50%">
                    <ImageSelect
                      options={sourceItemOptions}
                      value={formData.idSourceItem}
                      onChange={(value) => handleChangeImageSelect('idSourceItem', value)}
                      compareFn={(a, b) => a._id === b._id}
                      disabled={idSourceItemTriggeredFromExternalComponent}
                    />
                  </CenteredSelect>
                </Column>
              </Row>
              <RowForm>
                <VariableText
                  variable="Name"
                  value={
                    formData.idSourceItem
                      ? `${formData.idSourceItem.name} ${
                          formData.idSourceItem.providerName
                            ? `(By ${formData.idSourceItem.providerName})`
                            : ''
                        }`
                      : 'Cargando...'
                  }
                />
              </RowForm>
              <Row>
                <Column>
                  <label>Fecha</label>
                  <input
                    type="date"
                    name="date"
                    value={toISOStringLocal(formData.date).split('T')[0]}
                    onChange={handleChangeDate}
                    required
                  />
                </Column>
                <Column>
                  <label>Hora</label>
                  <input
                    type="time"
                    name="time"
                    value={toISOStringLocal(formData.date).split('T')[1].slice(0, 5)}
                    onChange={handleChangeDate}
                    required
                  />
                </Column>
              </Row>
              <Row mb="10px">
                <Column>
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={displayData.stock}
                    onChange={handleChangeWithValidation}
                    required
                  />
                  {displayError.stock && <p className={styles.error}>{displayError.stock}</p>}
                </Column>
              </Row>
              <RowForm>
                <label>Precio por unidad</label>
                <input
                  type="text"
                  name="price"
                  value={displayData.price}
                  onChange={handleChangeWithValidation}
                  required
                />
                {displayError.price && <p className={styles.error}>{displayError.price}</p>}
              </RowForm>
              {error && <p className={styles.error}>{error}</p>}
              <ButtonSubmit
                actionText={elementToEdit ? 'Actualizar' : 'Agregar'}
                loading={loadingSubmit}
                action={onSubmitTrackingItem}
              />
            </CustomForm>
          </div>
        </div>  
      )}
    </React.Fragment>
  );
};

export default TrackingItemsForm;
