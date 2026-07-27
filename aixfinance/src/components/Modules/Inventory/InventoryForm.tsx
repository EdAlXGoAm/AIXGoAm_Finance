import React from 'react';
import { useInventory } from './InventoryContext';
import { RemoteInventoryData, emptyInventoryFormData, createInventory, updateInventory } from '@/services/api/inventory/apiInventory';
import { FloatingFormElements } from '@/commonForm/floatingFormElements';
import { FrontCloseButton, FrontModalContainer, FrontOverlayContainer } from "@/commonForm/frontContainer";

const InventoryElementsForm = () => {
  const {
    elementToCreateInventory, setElementToCreateInventory,
    elementToEditInventory, setElementToEditInventory,
    inventories, setInventories
  } = useInventory();

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
    renderSelectRow,
    renderListBox
  } = FloatingFormElements({
    onCleanElementToEdit: () => setElementToEditInventory(null),
    onCleanElementToCreate: () => setElementToCreateInventory(null),
    elementToEdit: elementToEditInventory,
    elementToCreate: elementToCreateInventory,
    emptyElementData: emptyInventoryFormData,
    onCloseExternalActions: () => null,
    apiCreate: createInventory,
    apiUpdate: updateInventory,
  });

  const handleSubmitInventory = async () => {
    const inventory = await handleSubmitWithResponse();
    const handleAddInventory = (inventory: RemoteInventoryData) => {
      console.log('handleAddInventory', inventory);
      setInventories([...inventories, inventory]);
    }
    const handleUpdateInventory = (inventory: RemoteInventoryData) => {
      setInventories(inventories.map((i) => i._id === inventory._id ? inventory : i));
    }
    if (submitAction === 'create') {
      handleAddInventory(inventory);
    } else {
      handleUpdateInventory(inventory);
    }
  }

  return (
    <React.Fragment>
      {renderButtonCircle('Inventory', 20, 20+80)}
      {isOpen && (
        <React.Fragment>
          <FrontOverlayContainer overlayRef={overlayRef}>
            <FrontModalContainer modalRef={modalRef} maxWidth='600px'>
              <FrontCloseButton handleClose={handleClose} />
              <h2>{elementToEditInventory ? 'Edit Inventory' : 'Add Inventory'}</h2>
              {renderTextInputRow('name', 'Name', 'Desconocido')}
              {renderTextInputRow('description', 'Description')}
              {renderTextInputRow('image', 'Image')}
              {renderSelectRow('type', 'Type',
                ['', 'food', 'electronic devices', 'furniture', 'maker', 'appliances', 'tools', 'kitchen'],
                ['Elija un tipo', 'Alimentos', 'Electrónicos', 'Muebles', 'Maker Tools', 'Electrodomésticos', 'Herramientas', 'Cocina'])}
              {renderSelectRow('categories', 'Categories', [], [])}
              {renderListBox('categoriesWarningRules', 'Categories Warning Rules')}
              {renderListBox('warningItems', 'Warning Items')}
              {renderButtonSubmit(['Save', 'Update'], handleSubmitInventory)}
            </FrontModalContainer>
          </FrontOverlayContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  )
};

export default InventoryElementsForm;
