import React from 'react';
import { useSourceItem } from './SourceItemContext';
import { RemoteSourceItemData, emptySourceItemFormData, createSourceItem, updateSourceItem } from '@/services/api/source/apiSourceItem';
import { QuantitativeProp, emptyQuantitativeProp, QualitativeProp, emptyQualitativeProp } from '@/services/api/source/apiSourceItem';
import { FloatingFormElements} from '@/commonForm/floatingFormElements';
import { validatePriceInput, validateFloatQuantity } from '@/validationFunctions/validateInput';
import { FrontCloseButton, FrontModalContainer, FrontOverlayContainer } from "@/commonForm/frontContainer";
import { ErrorMessage } from '@/commonForm/FrontBody';
import { miniIconRound } from '@/commonIcons/icons';
import Swal from 'sweetalert2';
import SourceItemQuanPropsForm from './SourceItemQuanPropsForm';
import SourceItemQualPropsForm from './SourceItemQualPropsForm';

const SourceItemElementsForm = () => {
  const {
    elementToCreateSourceItem, setElementToCreateSourceItem,
    elementToEditSourceItem, setElementToEditSourceItem,
    sourceItems, setSourceItems
  } = useSourceItem();

  const emptyDisplayData = {
    price: { validation: validatePriceInput, initValue: '$0' },
    stock: { validation: validateFloatQuantity, initValue: '1' },
  };

  const {
    isOpen,
    error, setError,
    formData, setFormData,
    submitAction, setSubmitAction,
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
    renderListBox
  } = FloatingFormElements({
    onCleanElementToEdit: () => setElementToEditSourceItem(null),
    onCleanElementToCreate: () => setElementToCreateSourceItem(null),
    elementToEdit: elementToEditSourceItem,
    elementToCreate: elementToCreateSourceItem,
    emptyElementData: emptySourceItemFormData,
    onCloseExternalActions: () => null,
    apiCreate: createSourceItem,
    apiUpdate: updateSourceItem,
    emptyDisplayData,
  });

  const handleSubmitSourceItem = async () => {
    const handleAddSourceItem = (sourceItem: RemoteSourceItemData) => {
      setSourceItems([...sourceItems, sourceItem]);
    }
    const handleUpdateSourceItem = (sourceItem: RemoteSourceItemData) => {
      setSourceItems(sourceItems.map((s) => s._id === sourceItem._id ? sourceItem : s));
    }
    let error = false;
    let message = '';
    if (formData.name === '' || formData.price === 0 || formData.type === '') {
      message = 'Por favor, completa todos los campos. (Name, Price, Type)';
      error = true;
    }
    formData.quantitativeProps.forEach((prop: QuantitativeProp) => {
      if (prop.propPurpose === '' || prop.propLabel === '' || prop.propUnit === '' || prop.propValue === 0) {
        message = 'Por favor, completa todos los campos de las propiedades cuantitativas. (Prop Purpose, Prop Label, Prop Unit, Prop Value)';
        error = true;
      }
    });
    formData.qualitativeProps.forEach((prop: QualitativeProp) => {
      if (prop.propPurpose === '' || prop.propLabel === '' || prop.propValue === '') {
        message = 'Por favor, completa todos los campos de las propiedades cualitativas. (Prop Purpose, Prop Label, Prop Value)';
        error = true;
      }
    });
    if (error) {
      setError(message);
      return;
    }
    if (submitAction === 'update' && formData.date !== elementToEditSourceItem?.data.date) {
      Swal.fire({
        title: 'La fecha ha sido modificada.',
        text: '¿Deseas trackear o actualizar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Trackear',
        cancelButtonText: 'Actualizar',
      }).then(async (result) => {
        let forceSubmitAction;
        if (result.isConfirmed) {
          forceSubmitAction = 'create';
        } else {
          forceSubmitAction = 'update';
        }
        const sourceItem = await handleSubmitWithResponse(forceSubmitAction);
        if (forceSubmitAction === 'create') {
          handleAddSourceItem(sourceItem);
        } else {
          handleUpdateSourceItem(sourceItem);
        }
      });
    }
    else {
      const sourceItem = await handleSubmitWithResponse();
      if (submitAction === 'create') {
        handleAddSourceItem(sourceItem);
      } else {
        handleUpdateSourceItem(sourceItem);
      }
    }
  }

  return (
    <React.Fragment>
      {isOpen && (
        <React.Fragment>
          <FrontOverlayContainer overlayRef={overlayRef}>
            <FrontModalContainer modalRef={modalRef} maxWidth='600px'>
              <FrontCloseButton handleClose={handleClose} />
              <h2>{elementToEditSourceItem ? 'Edit Source Item' : 'Add Source Item'}</h2>
              {formData.id_source && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {miniIconRound(formData.id_source.image, formData.id_source.name, 20)}
                  <span>Source: {formData.id_source.name}</span>
                </div>
              )}
              {renderTextInputRow('name', 'Name', 'Desconocido', true)}
              {renderDateInputRow('date', 'Date', true)}
              {renderTextInputRow('provider', 'Provider', 'Desconocido')}
              {renderTextAreaRow('description', 'Description')}
              {renderTextInputRow('image', 'Image')}
              {renderTextInputRow('link', 'Link')}
              {renderTextInputRowWithValidation('price', 'Price', '0', true)}
              {renderSelectRow('type', 'Type', ['consumible', 'usable'], ['Consumible', 'Usable'])}
              {renderTextInputRowWithValidation('stock', 'Stock', '0', true)}
              <SourceItemQuanPropsForm
                listElements={formData.quantitativeProps}
                handleUpdateListItem={(value: QuantitativeProp[]) => {
                  setFormData({
                    ...formData,
                    quantitativeProps: value
                  })
                }}
              />
              <SourceItemQualPropsForm
                listElements={formData.qualitativeProps}
                handleUpdateListItem={(value: QualitativeProp[]) => {
                  setFormData({
                    ...formData,
                    qualitativeProps: value
                  })
                }}
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {renderButtonSubmit(['Submit', 'Update'], handleSubmitSourceItem)}
            </FrontModalContainer>
          </FrontOverlayContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  )
};

export default SourceItemElementsForm;
