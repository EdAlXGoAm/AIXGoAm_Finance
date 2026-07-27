import React from 'react';
import styles from '@/commonForm/floatingForm.module.css';
import { RemoteSourceData, SourceModel } from '@/services/apiSource';
import { SourceFormElements } from './SourceFormElements';
import { Row, Column, RowForm, FormulasContainer, FormulaLabel, CustomForm } from '@/utils/formatUtils';
import { ButtonRectangle, ButtonSubmit } from '@/commonForm/FrontButtons';
import { ButtonCircle } from '@/commonForm/FrontButtons';

interface SourceFormProps {
  onCleanElementToEdit: () => void;
  elementToEdit?: SourceModel;
  hideButton?: boolean;
  mode?: 'floating' | 'subform';
  onAddResponse: (remoteSource: RemoteSourceData) => void;
  onUpdateResponse: (remoteSource: RemoteSourceData) => void;
  newTriggeredFromExternalComponent?: boolean;
  setNewTriggeredFromExternalComponent?: (value: boolean) => void;
}

const SourceForm: React.FC<SourceFormProps> = ({
  elementToEdit,
  onCleanElementToEdit,
  hideButton,
  mode,
  onAddResponse,
  onUpdateResponse,
  newTriggeredFromExternalComponent,
  setNewTriggeredFromExternalComponent
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

    onSubmitSource,
  } = SourceFormElements({ onCleanElementToEdit, elementToEdit, onAddResponse, onUpdateResponse, newTriggeredFromExternalComponent, setNewTriggeredFromExternalComponent });

  return (
    <React.Fragment>
      {!elementToEdit && !hideButton && (
        mode === 'floating' ? (
          <ButtonCircle
            textToShow="Fuente"
            positionX={100}
            positionY={20}
            action={handleCreateNewElement}
          />
        ) : (
          <ButtonRectangle
            textToShow="Agregar Fuente"
            action={handleCreateNewElement}
          />
        )
      )}
      {isOpen && (
        <div className={styles.overlay} ref={overlayRef}>
          <div className={styles.modal} ref={modalRef} style={{ '--max-width-modal': '600px' } as React.CSSProperties}>
            <button className={styles.closeButton} onClick={handleClose}>
              X
            </button>
            <h2>{elementToEdit ? 'Editar Fuente' : 'Agregar Fuente'}</h2>
            <CustomForm>
              <Row>
                <Column>
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChangeTextAndSelect}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Descripción</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChangeTextAndSelect}
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Imagen URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChangeTextAndSelect}
                  />
                </Column>
              </Row>
              {error && <p className={styles.error}>{error}</p>}
              <ButtonSubmit
                actionText={elementToEdit ? 'Actualizar' : 'Agregar'}
                loading={loadingSubmit}
                action={onSubmitSource}
              />
            </CustomForm>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default SourceForm;
