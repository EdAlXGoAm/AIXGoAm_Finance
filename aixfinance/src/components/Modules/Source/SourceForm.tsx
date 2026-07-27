import React from 'react';
import { useSource } from './SourceContext';
import { RemoteSourceData, emptySourceFormData, createSource, updateSource } from '@/services/api/source/apiSource';
import { FloatingFormElements } from '@/commonForm/floatingFormElements';
import { FrontCloseButton, FrontModalContainer, FrontOverlayContainer } from "@/commonForm/frontContainer";

const SourceElementsForm = () => {
  const {
    elementToCreateSource, setElementToCreateSource,
    elementToEditSource, setElementToEditSource,
    sources, setSources
  } = useSource();

  const {
    isOpen,
    submitAction,
    overlayRef,
    modalRef,
    handleClose,
    handleSubmitWithResponse,
    renderButtonCircle,
    renderButtonSubmit,
    renderTextInputRow,
  } = FloatingFormElements({
    onCleanElementToEdit: () => setElementToEditSource(null),
    onCleanElementToCreate: () => setElementToCreateSource(null),
    elementToEdit: elementToEditSource,
    elementToCreate: elementToCreateSource,
    emptyElementData: emptySourceFormData,
    onCloseExternalActions: () => null,
    apiCreate: createSource,
    apiUpdate: updateSource,
  });

  const handleSubmitSource = async () => {
    const source = await handleSubmitWithResponse();
    const handleAddSource = (source: RemoteSourceData) => {
      console.log('handleAddSource', source);
      setSources([...sources, source]);
    }
    const handleUpdateSource = (source: RemoteSourceData) => {
      setSources(sources.map((s) => s._id === source._id ? source : s));
    }
    if (submitAction === 'create') {
      handleAddSource(source);
    } else {
      handleUpdateSource(source);
    }
  }

  return (
    <React.Fragment>
      {renderButtonCircle('Source', 20, 20)}
      {isOpen && (
        <React.Fragment>
          <FrontOverlayContainer overlayRef={overlayRef}>
            <FrontModalContainer modalRef={modalRef} maxWidth='600px'>
              <FrontCloseButton handleClose={handleClose} />
              <h2>{elementToEditSource ? 'Edit Source' : 'Add Source'}</h2>
              {renderTextInputRow('name', 'Name', 'Desconocido')}
              {renderTextInputRow('description', 'Description')}
              {renderTextInputRow('image', 'Image')}
              {renderButtonSubmit(['Save', 'Update'], handleSubmitSource)}
            </FrontModalContainer>
          </FrontOverlayContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  )
};

export default SourceElementsForm;
