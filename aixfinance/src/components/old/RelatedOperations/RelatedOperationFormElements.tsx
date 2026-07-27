import React, { useState, useEffect, useRef } from 'react';
import { RelatedOperationModel, createRelatedOperation, updateRelatedOperation, RemoteRelatedOperationData } from '../../services/apiRelatedOperations';
import { toDateLocal, toISOStringLocal } from '../../utils/dateUtils';

interface RelatedOperationFormElementsProps {
  onCleanData: () => void,
  elementToEdit?: RelatedOperationModel,
  onCreateRelatedOperationId: (id: string) => void,
  onRefreshRelatedOperations: () => void,
}

export const RelatedOperationFormElements = ({ onCleanData, elementToEdit, onCreateRelatedOperationId, onRefreshRelatedOperations }: RelatedOperationFormElementsProps) => {

  const emptyElementData = {
    date: new Date(),
    type: "Pre",
    amountType: "Aumento",
    name: "Desconocido",
    amount: 0,
    source: "",
    formula: ""
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [formData, setFormData] = useState(emptyElementData);

  const handleClose = () => {
    setError(null);
    setIsOpen(false);
    setFormData(emptyElementData);
    onCleanData();
  };

  const formulaInputRef = useRef<HTMLInputElement>(null);
  
  const handleFormulaLabelClick = (key: string, value: string) => {
    if (!formulaInputRef.current) return;
    
    const input = formulaInputRef.current;
    const cursorPos = input.selectionStart || 0;
    const textToInsert = `{${key}:${value}}`;
    
    const newFormula = formData.formula.slice(0, cursorPos) + textToInsert + formData.formula.slice(cursorPos);
    
    setFormData((prevData) => ({ ...prevData, formula: newFormula }));
    
    setTimeout(() => {
      if (input) {
        const newCursorPos = cursorPos + textToInsert.length;
        input.setSelectionRange(newCursorPos, newCursorPos);
        input.focus();
      }
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'date') {
      const time = toISOStringLocal(formData.date).split('T')[1].slice(0, 5)
      setFormData((prevData) => ({ ...prevData, [name]: new Date(value + 'T' + time) }));
    } else if (name === 'time') {
      const date = toISOStringLocal(formData.date).split('T')[0]
      setFormData((prevData) => ({ ...prevData, ["date"]: new Date(date + 'T' + value) }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let remoteRelatedOperation: RemoteRelatedOperationData;
      let response;
      if(elementToEdit) {
        response = await updateRelatedOperation(elementToEdit._id, formData)
      } else {
        response = await createRelatedOperation(formData);
        remoteRelatedOperation = response.data;
        if (remoteRelatedOperation._id) {
          onCreateRelatedOperationId(remoteRelatedOperation._id);
        }
      }
      handleClose();
      onRefreshRelatedOperations();
    } catch (error: any) {
      setError(error.message || 'Error al agregar la operación');
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === 'Desconocido') setFormData((prevData) => ({ ...prevData, name: '' }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === '') setFormData((prevData) => ({ ...prevData, name: 'Desconocido' }));
  };

  return {
    emptyElementData,
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleChange,
    handleSubmit,
    handleClose,
    handleFocus,
    handleBlur,
    handleFormulaLabelClick,
    formulaInputRef
  }
}
