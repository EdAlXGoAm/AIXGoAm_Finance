import { CenteredLabel } from '@/utils/textUtils';
import { ListBoxAddButton } from '@/commonForm/FrontButtons';
import { ErrorMessage, ListBoxElement } from '@/commonForm/FrontBody';
import { RowForm } from '@/commonForm/FrontBody';
import { ListBoxContainer } from '@/commonForm/FrontBody';
import React, { useState, useEffect } from 'react';
import { emptyQualitativeProp, QualitativeProp } from '@/services/api/source/apiSourceItem';
import { ChangeTextAndSelectList } from '@/commonForm/handleChange/handleChange';

interface SourceItemQualPropsFormProps {
  listElements: QualitativeProp[];
  handleUpdateListItem: (value: QualitativeProp[]) => void;
}

const SourceItemQualPropsForm: React.FC<SourceItemQualPropsFormProps> = ({ listElements, handleUpdateListItem }) => {
  interface DisplayError {
    propPurpose: string;
    propLabel: string;
    propValue: string;
  }
  const emptyDisplayError: DisplayError = {
    propPurpose: '',
    propLabel: '',
    propValue: ''
  }

  const [localListElements, setLocalListElements] = useState<QualitativeProp[]>(listElements);
  const [displayError, setDisplayError] = useState<DisplayError[]>(Array(listElements.length).fill(emptyDisplayError));

  const handleUpdateLocalListItem = (index: number, name: string, value: QualitativeProp) => {
    setLocalListElements((prevListElements: QualitativeProp[]) => [
      ...prevListElements.slice(0, index), { ...prevListElements[index], [name]: value }, ...prevListElements.slice(index + 1)
    ]);
  }

  const handleUpdateLocalDisplayError = (index: number, name: string, value: any) => {
    setDisplayError((prevError: DisplayError[]) => [
      ...prevError.slice(0, index), { ...prevError[index], [name]: value }, ...prevError.slice(index + 1)
    ]);
  }

  useEffect(() => {
    handleUpdateListItem(localListElements);
  }, [localListElements]);

  const handleChangeTextAndSelect = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    name: string,
    index: number
  ) => {
    ChangeTextAndSelectList(
      handleUpdateLocalListItem,
      handleUpdateLocalDisplayError,
      name,
      e.target.value,
      index
    );
  }

  const handleAddListItem = () => {
    setLocalListElements([...localListElements, emptyQualitativeProp]);
    setDisplayError([...displayError, emptyDisplayError]);
  }

  const handleRemoveListItem = (index: number) => {
    setLocalListElements(localListElements.filter((_: QualitativeProp, i: number) => i !== index));
    setDisplayError(displayError.filter((_: DisplayError, i: number) => i !== index));
  }

  const renderQualitativeItem = (value: QualitativeProp, index: number) => (
    <ListBoxElement
      key={index}
      onClick={() => handleRemoveListItem(index)}
    >
      <select value={value.propPurpose} onChange={(e) => handleChangeTextAndSelect(e, 'propPurpose', index)}>
        <option value="">Seleccione Propósito</option>
        <option value="default">Default</option>
        <option value="consumption">Consumption</option>
        <option value="other">Other</option>
      </select>
      {displayError[index].propPurpose && <ErrorMessage>{displayError[index].propPurpose}</ErrorMessage>}
      <input type="text" value={value.propLabel} onChange={(e) => handleChangeTextAndSelect(e, 'propLabel', index)} />
      {displayError[index].propLabel && <ErrorMessage>{displayError[index].propLabel}</ErrorMessage>}
      <input type="text" value={value.propValue} onChange={(e) => handleChangeTextAndSelect(e, 'propValue', index)} />
      {displayError[index].propValue && <ErrorMessage>{displayError[index].propValue}</ErrorMessage>}
    </ListBoxElement>
  );

  return (
    <RowForm>
      <CenteredLabel>Propiedades Cuantitativas</CenteredLabel>
      <ListBoxContainer>  
        <ListBoxAddButton text='Agregar' onClick={handleAddListItem} />
        {localListElements.map((value: QualitativeProp, index: number) => (
          renderQualitativeItem(value, index)
        ))}
      </ListBoxContainer>
    </RowForm>
  )
}

export default SourceItemQualPropsForm;