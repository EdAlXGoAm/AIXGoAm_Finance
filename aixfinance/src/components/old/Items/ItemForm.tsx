import React from 'react';
import { ItemModel } from '@/services/apiItems';
import { ItemFormElements } from '@/constants/Items/ItemFormElements';
import styles from '@/styles/Items/itemForm.module.css';

interface ItemFormProps {

  elementToEdit?: ItemModel;
}

const ItemForm: React.FC<ItemFormProps> = ({  }) => {

  const {
    emptyItemData,
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleClose,
    handleCancel,
  } = ItemFormElements();

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={handleCancel}>
          <h1>Item Form</h1>
        </div>
      )}
    </>
  );
};
