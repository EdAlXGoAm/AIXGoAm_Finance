import React, { useEffect } from 'react';
import styles from '../../styles/Sources/CartItemsForm.module.css';
import { CartItemModel } from '../../services/apiCartItem';
import { CartItemsFormElements } from './CartItemsFormElements';
import { Row, Column, RowForm, FormulasContainer, FormulaLabel, CustomForm, VariableText } from '../../utils/formatUtils';
import { CenteredLabel, CenteredSelect } from '@/utils/textUtils';
import PrioritySelector from '@/utils/PrioritySelector/PrioritySelector';
import ImageSelect from '@/utils/CustomSelector/ImageSelect';

interface CartItemsFormProps {
  onCleanData: () => void;
  elementToEdit?: CartItemModel;
  onCreateCartItemId: (id: string) => void;
  onRefreshCartItems: () => void;
}

const CartItemsForm: React.FC<CartItemsFormProps> = ({
  elementToEdit,
  onCleanData,
  onCreateCartItemId,
  onRefreshCartItems
}) => {
  const {
    dicInventoryItem,
    selectedInventoryItem,
    handleChangeInventoryItem,
    isOpen, setIsOpen,
    error,
    loading,
    formData, setFormData,
    displayQuantity, displayQuantityError, handleChangeQuantity,
    handleChange,
    handleSubmit,
    handleClose,
    handleFocus,
    handleBlur
  } = CartItemsFormElements({ onCleanData, elementToEdit, onCreateCartItemId, onRefreshCartItems });

  useEffect(() => {
    if (elementToEdit) {
      setFormData(elementToEdit.data);
      setIsOpen(true);
    }
  }, [elementToEdit]);

  const inventoryOptions = Object.values(dicInventoryItem).map(item => ({
    value: item._id,
    label: `${item.name} ${item.providerName ? `(By ${item.providerName})` : ''}`,
    image: item.image
  }));

  return (
    <React.Fragment>
      {!elementToEdit && (
        <React.Fragment>
          <button className={styles.addButton} onClick={() => setIsOpen(true)}
            style={{ '--add-button-bottom': `${180}px` } as React.CSSProperties}
          >
            <pre style={{ fontSize: '0.6rem' }}>Carrito</pre>
            +
          </button>
        </React.Fragment>
      )}
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{elementToEdit ? 'Editar Item' : 'Agregar Item al Carrito'}</h2>
            <CustomForm>
              <Row mb="10px">
                <Column>
                  <CenteredSelect label="Item" width="50%">
                    <ImageSelect
                      options={inventoryOptions}
                      value={selectedInventoryItem}
                      onChange={(value) => handleChangeInventoryItem(value)}
                    />
                  </CenteredSelect>
                </Column>
              </Row>
              <Row>
                <Column>
                  <VariableText variable="Nombre"
                    value={`${formData.idInventoryItem.name} ${formData.idInventoryItem.providerName ? `(By ${formData.idInventoryItem.providerName})` : ''}`}
                  />
                </Column>
              </Row>
              <Row mb="10px">
                <Column>
                  <label>Cantidad</label>
                  <input
                    type="number"
                    name="quantity"
                    value={displayQuantity}
                    onChange={handleChangeQuantity}
                    required
                  />
                  {displayQuantityError && <p className={styles.error}>{displayQuantityError}</p>}
                </Column>
              </Row>
              <Row>
                <Column>
                  <VariableText variable="Precio por unidad" value={`$${formData.idInventoryItem.price}`} />
                </Column>
                <Column>
                  <VariableText variable="PrecioTotal" value={`$${formData.totalPrice.toString()}`} />
                </Column>
              </Row>
              <Row>
                <Column>
                  <CenteredSelect label="Prioridad" width="50%">
                    <PrioritySelector
                      value={formData.priority}
                      onChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                    />
                  </CenteredSelect>
                </Column>
              </Row>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.buttons}>
                <button className={`${styles.button} ${styles.submitButton}`} disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Actualizando...' : (elementToEdit ? 'Actualizar' : 'Agregar')}
                </button>
              </div>
            </CustomForm>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default CartItemsForm;
