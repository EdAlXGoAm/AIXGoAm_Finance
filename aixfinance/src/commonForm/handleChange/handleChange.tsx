import { Validator } from "../floatingFormElements";



export const ChangeCheckBox = (setData: (value: any) => void, name: string, value: boolean) => {
  setData((prevData: any) => ({ ...prevData, [name]: value }));
}

export const ChangeImageSelect = (setData: (value: any) => void, name: string, value: any) => {
  setData((prevData: any) => ({ ...prevData, [name]: value }));
}

export const ChangeWithValidation = (
  setData: (value: any) => void,
  setDisplayData: (value: any) => void,
  setDisplayError: (value: any) => void,
  name: string,
  value: string,
  required?: boolean,
  validators?: { [key: string]: Validator }
) => {
  if (required && value === '') {
    setDisplayError((prevError: any) => ({ ...prevError, [name]: 'Este campo es requerido' }));
  } else {
    setDisplayError((prevError: any) => ({ ...prevError, [name]: '' }));
  }
  setDisplayData((prevData: any) => ({ ...prevData, [name]: value }));

  if (validators && validators[name]) {
    const validationResult = validators[name].validation(value);
    if (validationResult.valid) {
      setData((prevData: any) => ({ ...prevData, [name]: validationResult.value }));
      setDisplayError((prevError: any) => ({ ...prevError, [name]: '' }));
    } else {
      setDisplayError((prevError: any) => ({ ...prevError, [name]: validationResult.error }));
    }
  } else {
    setData((prevData: any) => ({ ...prevData, [name]: value }));
  }
}

export const ChangeTextAndSelect = (
  setData: (value: any) => void,
  setDisplayError: (value: any) => void,
  name: string,
  value: string,
  required?: boolean
) => {
  if (required && value === '') {
    setDisplayError((prevError: any) => ({ ...prevError, [name]: 'Este campo es requerido' }));
  } else {
    setDisplayError((prevError: any) => ({ ...prevError, [name]: '' }));
  }
  setData((prevData: any) => ({ ...prevData, [name]: value }));
}

export const ChangeTextAndSelectList = (
  setData: (index: number, name: string, value: any) => void,
  setDisplayError: (index: number, name: string, value: any) => void,
  name: string,
  value: string,
  index: number,
  required?: boolean
) => {
  console.log('hola', index, name, value);
  if (required && value === '') {
    setDisplayError(index, name, 'Este campo es requerido');
  } else {
    setDisplayError(index, name, '');
  }
  setData(index, name, value);
}

export const ChangeList = (setData: (value: any) => void, name: string, value: string) => {
  const listName = name.split('[')[0];
  const index = parseInt(name.split('[')[1].split(']')[0]);
  setData((prevData: any) => ({
    ...prevData,
    [listName]: [...prevData[listName].slice(0, index), value, ...prevData[listName].slice(index + 1)]
  }));
}

export const AddListItem = (setData: (value: any) => void, listName: string, value: string) => {
  setData((prevData: any) => ({
    ...prevData,
    [listName]: [...prevData[listName], value]
  }));
}

export const RemoveListItem = (setData: (value: any) => void, listName: string, index: number) => {
  setData((prevData: any) => ({
    ...prevData,
    [listName]: prevData[listName].filter((_: any, i: number) => i !== index)
  }));
}

