import { useRef, useState, useEffect } from "react";
import { ButtonCircle, ButtonRectangle, ButtonSubmit, ListBoxAddButton, ListBoxRemoveButton } from "./FrontButtons";
import { RowForm, ErrorMessage, ListBoxContainer, ListBoxElement, ListBoxElementInput } from "./FrontBody";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Column, Row } from "@/utils/formatUtils";
import { toISOStringLocal } from '@/utils/dateUtils';
import LevelSelector from "@/commonTools/LevelSelector";
import { CenteredLabel, CenteredSelect } from "@/utils/textUtils";
import { AddListItem, ChangeCheckBox, ChangeImageSelect, ChangeList, ChangeTextAndSelect, ChangeWithValidation, RemoveListItem } from "@/commonForm/handleChange/handleChange";

export interface Validator {
  validation: (input: string) => { valid: boolean; value?: number; error?: string };
  initValue: string;
}

export interface ValidatorsFunction {
  [key: string]: Validator;
}

interface FloatingFormProps {
  onCleanElementToEdit: () => void;
  onCleanElementToCreate: () => void;
  elementToEdit?: any;
  elementToCreate?: any;
  emptyElementData: any;
  onCloseExternalActions?: () => void;
  apiCreate: (data: any) => Promise<any>;
  apiUpdate: (id: string, data: any) => Promise<any>;
  emptyDisplayData?: ValidatorsFunction;
}

// Importa ReactQuill de manera dinámica para que solo se cargue en el cliente
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export const FloatingFormElements = ({ 
  onCleanElementToEdit,
  onCleanElementToCreate,
  elementToEdit,
  elementToCreate,
  emptyElementData,
  onCloseExternalActions,
  apiCreate,
  apiUpdate,
  emptyDisplayData,
}: FloatingFormProps) => {

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>(emptyElementData);
  const [submitAction, setSubmitAction] = useState<string>('create');

  const [displayData, setDisplayData] = useState<{ [key: string]: any }>({});
  const [displayError, setDisplayError] = useState<{ [key: string]: string | null }>({});

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [clickStartedInside, setClickStartedInside] = useState(false);

  const [validators, setValidators] = useState(emptyDisplayData || {});

  useEffect(() => {
    if(elementToEdit) {
      setFormData(elementToEdit.data);
      setSubmitAction('update');
      setIsOpen(true);
    }
    if(elementToCreate) {
      setFormData(elementToCreate);
      setSubmitAction('create');
      setIsOpen(true);
    }
  }, [elementToEdit, elementToCreate]);

  useEffect(() => {
    console.log('formData', formData);
  }, [formData]);

  useEffect(() => {
    if (emptyDisplayData && !elementToEdit && !elementToCreate) {
      setDisplayData((prevData) => ({ 
        ...prevData,
        ...Object.keys(emptyDisplayData).reduce((acc, key) => {
          acc[key] = emptyDisplayData[key].initValue;
          return acc;
        }, {} as { [key: string]: string })
      }));
    }
    else if (emptyDisplayData && elementToEdit && !elementToCreate) {
      setDisplayData((prevData) => ({
        ...prevData,
        ...Object.keys(emptyDisplayData).reduce((acc, key) => {
          acc[key] = elementToEdit.data[key];
          return acc;
        }, {} as { [key: string]: string })
      }));
    }
    else if (emptyDisplayData && elementToCreate && !elementToEdit) {
      setDisplayData((prevData) => ({
        ...prevData,
        ...Object.keys(emptyDisplayData).reduce((acc, key) => {
          acc[key] = elementToCreate[key];
          return acc;
        }, {} as { [key: string]: string })
      }));
    }
    setDisplayError({});
  }, [isOpen]);

  const handleCreateNewElement = () => {
    setFormData(emptyElementData);
    setSubmitAction('create');
    setIsOpen(true);
  }

  const handleClose = () => {
    if(onCloseExternalActions) onCloseExternalActions();
    setError(null)
    setIsOpen(false);
    setFormData(emptyElementData);
    onCleanElementToEdit();
    onCleanElementToCreate();
  }

  const handleChangeCheckbox = (name: string, value: boolean) => {
    ChangeCheckBox(setFormData, name, value);
  }

  const handleChangeImageSelect = (name: string, value: any) => {
    ChangeImageSelect(setFormData, name, value);
  }

  const handleChangeTextAndSelect = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, required?: boolean) => {
    const { name, value } = e.target;
    ChangeTextAndSelect(setFormData, setDisplayError, name, value, required);
  }

  const handleChangeWithValidation = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, required?: boolean) => {
    const { name, value } = e.target;
    ChangeWithValidation(setFormData, setDisplayData, setDisplayError, name, value, required, validators);
  };

  const handleChangeList = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    ChangeList(setFormData, name, value);
  }

  const handleAddListItem = (listName: string, value: any) => {
    AddListItem(setFormData, listName, value);
  }

  const handleRemoveListItem = (listName: string, index: number) => {
    RemoveListItem(setFormData, listName, index);
  }

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (modalRef.current && modalRef.current.contains(event.target as Node)) {
        setClickStartedInside(true);
      } else {
        setClickStartedInside(false);
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!clickStartedInside && overlayRef.current && overlayRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [clickStartedInside, handleClose]);

  const handleSubmitWithResponse = async (forceSubmitAction?: string) => {
    const action = forceSubmitAction || submitAction;
    console.log('action', action);
    console.log('elementToEdit', elementToEdit);
    setLoadingSubmit(true);
    try {
      let response;
      if (action === 'create') {
        response = await apiCreate(formData);
        onCleanElementToCreate();
      } else if (action === 'update') {
        response = await apiUpdate(elementToEdit._id, formData);
        onCleanElementToEdit();
      }
      handleClose();
      return response.data;
    } catch (error: any) {
      setError(error.message || 'Error al agregar el elemento');
    } finally {
      setLoadingSubmit(false);
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>, hint: string) => {
    const { name, value } = e.target;
    if (value === hint) setFormData((prev: any) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, hint: string) => {
    const { name, value } = e.target;
    if (value === '') setFormData((prev: any) => ({ ...prev, [name]: hint }));
  };

  const handleChangeRichText = (
    name: string,
    value: string
  ) => {
    setFormData((prevData: any) => ({ ...prevData, [name]: value }));
    
    if (validators && validators[name]) {
      const validationResult = validators[name].validation(value);
      if (validationResult.valid) {
        setFormData((prevData: any) => ({
          ...prevData,
          [name]: value,
        }));
        setDisplayError((prevError) => ({
          ...prevError,
          [name]: null
        }));
      } else {
        setDisplayError((prevError) => ({
          ...prevError,
          [name]: validationResult.error || 'Error de validación'
        }));
      }
    } else {
      setFormData((prevData: any) => ({ ...prevData, [name]: value }));
    }
  }

  const renderButtonCircle = (textToShow: string, positionX: number, positionY: number) => {
    return <ButtonCircle textToShow={textToShow} positionX={positionX} positionY={positionY} action={handleCreateNewElement} />;
  }

  const renderButtonRectangle = (textToShow: string) => {
    return <ButtonRectangle textToShow={textToShow} action={handleCreateNewElement} />;
  }

  const renderButtonSubmit = (actionText: string[], action: () => void) => {
    return <ButtonSubmit actionText={submitAction === 'create' ? actionText[0] : actionText[1]} loading={loadingSubmit} action={action} />;
  }

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'date') {
      const time = toISOStringLocal(formData.date).split('T')[1].slice(0, 5)
      setFormData((prevData: any) => ({ ...prevData, [name]: new Date(value + 'T' + time) }));
    } else if (name === 'time') {
      const date = toISOStringLocal(formData.date).split('T')[0]
      setFormData((prevData: any) => ({ ...prevData, ["date"]: new Date(date + 'T' + value) }));
    }
  }

  const renderDateInputRow = (name: string, label: string, required?: boolean) => {
    return (
      <Row>
        <Column>
          <label htmlFor={'date'}>Fecha</label>
          <input type="date" id={'date'} name={'date'} value={toISOStringLocal(formData.date).split('T')[0]} onChange={handleChangeDate} />
        </Column>
        <Column>
          <label htmlFor={'time'}>Hora</label>
          <input type="time" id={'time'} name={'time'} value={toISOStringLocal(formData.date).split('T')[1].slice(0, 5)} onChange={handleChangeDate} />
        </Column>
      </Row>
    );
  }
  
  const renderTextInputRow = (name: string, label: string, hint?: string, required?: boolean) => {
    return (
      <RowForm>
        <label htmlFor={name}>{label}</label>
        <input
          type="text"
          id={name}
          name={name}
          value={formData[name]}
          onChange={(e) => handleChangeTextAndSelect(e, required)}
          onFocus={(e) => handleFocus(e, hint || '')}
          onBlur={(e) => handleBlur(e, hint || '')}
          autoComplete="off"
        />
        {displayError[name] && <ErrorMessage>{displayError[name]}</ErrorMessage>}
      </RowForm>
    );
  }

  const renderTextInputRowWithValidation = (name: string, label: string, hint?: string, required?: boolean) => {
    return (
      <RowForm>
        <label htmlFor={name}>{label}</label>
        <input
          type="text"
          id={name}
          name={name}
          value={displayData[name]}
          onChange={(e) => handleChangeWithValidation(e, required)}
          autoComplete="off"
        />
        {displayError[name] && <ErrorMessage>{displayError[name]}</ErrorMessage>}
      </RowForm>
    )
  }

  const renderTextAreaRow = (name: string, label: string) => {
    return (
      <RowForm>
        <label htmlFor={name}>{label}</label>
        <ReactQuill
          theme="snow"
          value={formData[name]}
          onChange={(content: string | undefined) => handleChangeRichText(name, content || '')}
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image'],
              ['clean']
            ],
          }}
          formats={[
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
          ]}
        />
      </RowForm>
    );
  }

  const renderSelectRow = (name: string, label: string, values: string[], optionText: string[]) => {
    return <RowForm>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} value={formData[name]} onChange={(e) => handleChangeTextAndSelect(e)}>
        {values.map((value, index) => <option key={value} value={value}>{optionText[index]}</option>)}
      </select>
    </RowForm>
  }
  
  const renderLevelRow = (name: string, label: string, levels: string[]) => {
    return <RowForm>
      <CenteredSelect label={label} width="50%">
        <LevelSelector
          value={formData[name]}
          onChange={(value: string) => setFormData((prev: any) => ({ ...prev, [name]: value }))}
          levels={levels}
        />
      </CenteredSelect>
    </RowForm>
  }

  const renderListBox = (name: string, label: string) => {
    return <RowForm>
      <CenteredLabel>{label}</CenteredLabel>
      <ListBoxContainer>  
        <ListBoxAddButton text='Agregar' onClick={() => handleAddListItem(name, '')} />
        {formData[name].map((value: string, index: number) => (
          <ListBoxElementInput
            key={index}
            value={value}
            handleChangeList={handleChangeList}
            onClick={() => handleRemoveListItem(name, index)}
          >
            {value}
          </ListBoxElementInput>
        ))}
      </ListBoxContainer>
    </RowForm>
  }

  return {
    isOpen,
    error, setError,
    loadingSubmit, setLoadingSubmit,
    loadingForm, setLoadingForm,
    formData, setFormData,
    submitAction, setSubmitAction,
    displayData, setDisplayData,
    displayError, setDisplayError,
    overlayRef,
    modalRef,
    handleCreateNewElement,
    handleClose,
    handleChangeCheckbox,
    handleChangeImageSelect,
    handleChangeTextAndSelect,
    handleChangeWithValidation,
    handleChangeList,
    handleAddListItem,
    handleRemoveListItem,
    handleSubmitWithResponse,
    handleFocus,
    handleBlur,
    handleChangeRichText,
    renderButtonCircle,
    renderButtonRectangle,
    renderButtonSubmit,
    renderDateInputRow,
    renderTextInputRow,
    renderTextInputRowWithValidation,
    renderTextAreaRow,
    renderSelectRow,
    renderLevelRow,
    renderListBox,
  }
}
