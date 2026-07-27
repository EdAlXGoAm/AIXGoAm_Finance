import React, { useEffect } from 'react';
import { useSourceItemCart } from './SourceItemCartContext';
import { RemoteSourceItemCartData, emptySourceItemCartFormData, createSourceItemCart, updateSourceItemCart } from '@/services/api/source/apiSourceItemsCart';
import { FloatingFormElements} from '@/commonForm/floatingFormElements';
import { validatePriceInput, validateFloatQuantity } from '@/validationFunctions/validateInput';
import { FrontCloseButton, FrontModalContainer, FrontOverlayContainer } from "@/commonForm/frontContainer";
import { ErrorMessage } from '@/commonForm/FrontBody';
import { miniIconRound } from '@/commonIcons/icons';

const SourceItemElementsForm = () => {
  const {
    elementToCreateSourceItemCart, setElementToCreateSourceItemCart,
    elementToEditSourceItemCart, setElementToEditSourceItemCart,
    sourceItemsCarts, setSourceItemsCarts
  } = useSourceItemCart();

  const emptyDisplayData = {
    quantity: { validation: validateFloatQuantity, initValue: '1' },
    totalPrice: { validation: validatePriceInput, initValue: '$0' },
  };

  const {
    isOpen,
    error, setError,
    formData, setFormData,
    submitAction, setSubmitAction,
    displayData, setDisplayData,
    overlayRef,
    modalRef,
    handleClose,
    handleSubmitWithResponse,
    renderButtonCircle,
    renderButtonSubmit,
    renderDateInputRow,
    renderTextInputRow,
    renderTextInputRowWithValidation,
    renderTextAreaRow,
    renderSelectRow,
    renderLevelRow,
  } = FloatingFormElements({
    onCleanElementToEdit: () => setElementToEditSourceItemCart(null),
    onCleanElementToCreate: () => setElementToCreateSourceItemCart(null),
    elementToEdit: elementToEditSourceItemCart,
    elementToCreate: elementToCreateSourceItemCart,
    emptyElementData: emptySourceItemCartFormData,
    onCloseExternalActions: () => null,
    apiCreate: createSourceItemCart,
    apiUpdate: updateSourceItemCart,
    emptyDisplayData,
  });

  const handleSubmitSourceItemCart = async () => {
    const handleAddSourceItem = (sourceItem: RemoteSourceItemCartData) => {
      setSourceItemsCarts([...sourceItemsCarts, sourceItem]);
    }
    const handleUpdateSourceItem = (sourceItem: RemoteSourceItemCartData) => {
      setSourceItemsCarts(sourceItemsCarts.map((s) => s._id === sourceItem._id ? sourceItem : s));
    }
    if (formData.quantity === 0 || formData.totalPrice === 0 || formData.priority === '') {
      setError('Por favor, completa todos los campos requeridos.');
      return;
    }
    const sourceItem = await handleSubmitWithResponse();
    if (submitAction === 'create') {
      handleAddSourceItem(sourceItem);
    } else {
      handleUpdateSourceItem(sourceItem);
    }
  }

  useEffect(() => {
    setFormData((prevData: any) => ({
      ...prevData,
      quantity: 1,
    }));
    setDisplayData((prevData: any) => ({
      ...prevData,
      quantity: 1,
    }));
  }, [isOpen]);

  useEffect(() => {
    setFormData((prevData: any) => ({
      ...prevData,
      totalPrice: (formData.quantity * formData.id_sourceItem.price).toFixed(2),
    }));
    setDisplayData((prevData: any) => ({
      ...prevData,
      totalPrice: (formData.quantity * formData.id_sourceItem.price).toFixed(2),
    }));
  }, [formData.quantity]);

  return (
    <React.Fragment>
      {isOpen && (
        <React.Fragment>
          <FrontOverlayContainer overlayRef={overlayRef}>
            <FrontModalContainer modalRef={modalRef} maxWidth='600px'>
              <FrontCloseButton handleClose={handleClose} />
              <h2>{elementToEditSourceItemCart ? 'Edit Item in Cart' : 'Add Item to Cart'}</h2>
              {formData.id_sourceItem && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {miniIconRound(formData.id_sourceItem.image, formData.id_sourceItem.name, 20)}
                  <span>Source: {formData.id_sourceItem.name}</span>
                  <span>Precio: {`$${formData.id_sourceItem.price}`}</span>
                </div>
              )}
              {renderTextInputRowWithValidation('quantity', 'Quantity', '1', true)}
              {renderTextInputRowWithValidation('totalPrice', 'Total Price', '0', true)}
              {renderLevelRow('priority', 'Priority', ['Deseo', 'Necesario', 'Urgente'])}
              {renderLevelRow('status', 'Status', ['Pendiente', 'Comprado', 'Cancelado'])}
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {renderButtonSubmit(['Save', 'Update'], handleSubmitSourceItemCart)}
            </FrontModalContainer>
          </FrontOverlayContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  )
};

export default SourceItemElementsForm;
