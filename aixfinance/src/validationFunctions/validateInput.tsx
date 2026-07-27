export const validatePriceInput = (input: string): { valid: boolean, value?: number, error?: string } => {
  const sanitizedValue = input.replace(/\$/g, '').replace(/,/g, '');
  
  if (/[^0-9.]/.test(sanitizedValue)) {
    return { valid: false, error: 'El precio no debe contener letras ni caracteres inválidos' };
  }

  if (sanitizedValue.split('.').length > 2) {
    return { valid: false, error: 'El precio no debe contener múltiples puntos decimales' };
  }

  const value = parseFloat(sanitizedValue);
  if (isNaN(value) || value < 0) {
    return { valid: false, error: 'El precio debe ser un número positivo' };
  }

  return { valid: true, value };
};

export const validateFloatQuantity = (input: string): { valid: boolean, value?: number, error?: string } => {
  if (/[\$,]/.test(input)) {
    return { valid: false, error: 'La cantidad no debe contener comas ni signos de dólar' };
  }

  if (/[^0-9.]/.test(input)) {
    return { valid: false, error: 'La cantidad solo debe contener números y un punto decimal' };
  }

  if (input.split('.').length > 2) {
    return { valid: false, error: 'La cantidad no debe contener múltiples puntos decimales' };
  }

  const value = parseFloat(input);
  
  if (isNaN(value) || value < 0) {
    return { valid: false, error: 'La cantidad debe ser un número positivo válido' };
  }

  return { valid: true, value };
};


export const validateIntQuantity = (input: string): { valid: boolean, value?: number, error?: string } => {
  if (/[\$,]/.test(input)) {
    return { valid: false, error: 'La cantidad no debe contener comas ni signos de dólar' };
  }

  if (/[^0-9]/.test(input)) {
    return { valid: false, error: 'La cantidad solo debe contener números enteros' };
  }

  const value = parseInt(input, 10);

  if (isNaN(value) || value < 0) {
    return { valid: false, error: 'La cantidad debe ser un número entero positivo válido' };
  }

  return { valid: true, value };
};
