import { CenteredLabel } from '@/utils/textUtils';
import { ListBoxAddButton } from '@/commonForm/FrontButtons';
import { ErrorMessage, ListBoxElement } from '@/commonForm/FrontBody';
import { RowForm } from '@/commonForm/FrontBody';
import { ListBoxContainer } from '@/commonForm/FrontBody';
import React, { useState, useEffect } from 'react';
import { emptyQuantitativeProp, QuantitativeProp } from '@/services/api/source/apiSourceItem';
import { ChangeTextAndSelectList } from '@/commonForm/handleChange/handleChange';
import { propLabelOptions, propUnitOptions } from './QuaPropElements/QuanPropElements';

interface SourceItemQuanPropsFormProps {
  listElements: QuantitativeProp[];
  handleUpdateListItem: (value: QuantitativeProp[]) => void;
}

const SourceItemQuanPropsForm: React.FC<SourceItemQuanPropsFormProps> = ({ listElements, handleUpdateListItem }) => {
  interface DisplayError {
    propPurpose: string;
    propLabel: string;
    propUnit: string;
    propValue: string;
  }
  const emptyDisplayError: DisplayError = {
    propPurpose: '',
    propLabel: '',
    propUnit: '',
    propValue: ''
  }

  const [localListElements, setLocalListElements] = useState<QuantitativeProp[]>(listElements);
  const [displayError, setDisplayError] = useState<DisplayError[]>(Array(listElements.length).fill(emptyDisplayError));

  const handleUpdateLocalListItem = (index: number, name: string, value: QuantitativeProp) => {
    setLocalListElements((prevListElements: QuantitativeProp[]) => [
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
    setLocalListElements([...localListElements, emptyQuantitativeProp]);
    setDisplayError([...displayError, emptyDisplayError]);
  }

  const handleRemoveListItem = (index: number) => {
    setLocalListElements(localListElements.filter((_: QuantitativeProp, i: number) => i !== index));
    setDisplayError(displayError.filter((_: DisplayError, i: number) => i !== index));
  }

  const renderQantitiveFormItem = (value: QuantitativeProp, index: number) => {
    const currentPropPurpose = value.propPurpose || '';
    const currentPropLabelOptions = propLabelOptions[currentPropPurpose as keyof typeof propLabelOptions] || [];

    const currentPropLabel = value.propLabel || '';
    const currentPropUnitOptions = propUnitOptions[currentPropLabel as keyof typeof propUnitOptions] || [];

    return (
      <ListBoxElement
        key={index}
        onClick={() => handleRemoveListItem(index)}
      >
        <select value={value.propPurpose} onChange={(e) => handleChangeTextAndSelect(e, 'propPurpose', index)}>
          <option value="">Seleccione Propósito</option>
          <option value="default">Default</option>
          <option value="consumption">Consumption</option>
          <option value="usage">Usage</option>
          <option value="other">Other</option>
        </select>
        {displayError[index].propPurpose && <ErrorMessage>{displayError[index].propPurpose}</ErrorMessage>}
        
        <select value={value.propLabel} onChange={(e) => handleChangeTextAndSelect(e, 'propLabel', index)}>
          {currentPropLabelOptions.map((option: { value: string; label: string }) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {displayError[index].propLabel && <ErrorMessage>{displayError[index].propLabel}</ErrorMessage>}
        
        <select value={value.propUnit} onChange={(e) => handleChangeTextAndSelect(e, 'propUnit', index)}>
          {currentPropUnitOptions.map((option: { value: string; label: string }) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {displayError[index].propUnit && <ErrorMessage>{displayError[index].propUnit}</ErrorMessage>}
        
        <input type="text" value={value.propValue} onChange={(e) => handleChangeTextAndSelect(e, 'propValue', index)} />
        {displayError[index].propValue && <ErrorMessage>{displayError[index].propValue}</ErrorMessage>}
      </ListBoxElement>
    );
  };

  return (
    <RowForm>
      <CenteredLabel>Propiedades Cuantitativas</CenteredLabel>
      <ListBoxContainer>  
        <ListBoxAddButton text='Agregar' onClick={handleAddListItem} />
        {localListElements.map((value: QuantitativeProp, index: number) => (
          renderQantitiveFormItem(value, index)
        ))}
      </ListBoxContainer>
    </RowForm>
  )
}

export default SourceItemQuanPropsForm;