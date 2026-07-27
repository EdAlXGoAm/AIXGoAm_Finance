import React from 'react';
import styles from '../../commonForm/floatingForm.module.css';
import { InventoryModel, RemoteInventoryData } from '@/services/api/inventory/apiInventory';
import { InventoryFormElements } from './inventoryFormElements';
import { ButtonCircle, ButtonRectangle, ButtonSubmit } from '@/commonForm/FrontButtons';
import { CustomForm, RowForm } from '@/commonForm/FrontBody';

interface InventoryFormProps {
  onCleanElementToEdit: () => void;
  elementToEdit?: InventoryModel;
  hideButton?: boolean;
  mode?: 'floating' | 'subform';
  onAddResponse: (response: RemoteInventoryData) => void;
  onUpdateResponse: (response: RemoteInventoryData) => void;
  newTriggeredFromExternalComponent: boolean;
  setNewTriggeredFromExternalComponent: (value: boolean) => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({
  onCleanElementToEdit,
  elementToEdit,
  hideButton,
  mode,
  onAddResponse,
  onUpdateResponse,
  newTriggeredFromExternalComponent,
  setNewTriggeredFromExternalComponent,
}) => {
  const {
    isOpen,
    error,
    loadingSubmit,
    formData,
    overlayRef,
    modalRef,
    handleCreateNewElement,
    handleClose,
    handleChangeTextAndSelect,
    onSubmitInventory,
  } = InventoryFormElements({
    onCleanElementToEdit,
    elementToEdit,
    onAddResponse,
    onUpdateResponse,
    newTriggeredFromExternalComponent,
    setNewTriggeredFromExternalComponent,
  });

  return (
    <React.Fragment>
      {!elementToEdit && !hideButton && (
        mode === 'floating' ? (
          <ButtonCircle
            textToShow="Inventario"
            positionX={100 + (80 * 2)}
            positionY={300}
            action={handleCreateNewElement}
          />
        ) : (
          <ButtonRectangle
            textToShow="Agregar Inventario"
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
            <h2>{elementToEdit ? 'Editar Inventario' : 'Agregar Inventario'}</h2>
            <CustomForm>
              {/* Nombre */}
              <RowForm>
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChangeTextAndSelect}
                />
              </RowForm>
              {/* Descripción */}
              <RowForm>
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChangeTextAndSelect}
                />
              </RowForm>
              {/* Tipo */}
              <RowForm>
                <label>Tipo</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChangeTextAndSelect}
                />
              </RowForm>
              {/* Imagen */}
              <RowForm>
                <label>Imagen URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChangeTextAndSelect}
                />
              </RowForm>
              {/* Categorías */}
              <RowForm>
                <label>Categorías</label>
                <input
                  type="text"
                  name="categories"
                  value={formData.categories.join(', ')}
                  onChange={(e) => handleChangeTextAndSelect(e)}
                />
              </RowForm>
              {/* Reglas de Advertencia */}
              <RowForm>
                <label>Reglas de Advertencia</label>
                <input
                  type="text"
                  name="categoriesWarningRules"
                  value={formData.categoriesWarningRules.join(', ')}
                  onChange={(e) => handleChangeTextAndSelect(e)}
                />
              </RowForm>
              {/* Items de Advertencia */}
              <RowForm>
                <label>Items de Advertencia</label>
                <input
                  type="text"
                  name="warningItems"
                  value={formData.warningItems.join(', ')}
                  onChange={(e) => handleChangeTextAndSelect(e)}
                />
              </RowForm>
              {error && <p className={styles.error}>{error}</p>}
              <ButtonSubmit
                actionText={elementToEdit ? 'Actualizar' : 'Agregar'}
                loading={loadingSubmit}
                action={onSubmitInventory}
              />
            </CustomForm>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default InventoryForm;
