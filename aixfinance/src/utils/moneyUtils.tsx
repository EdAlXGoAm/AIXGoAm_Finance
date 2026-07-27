export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

export const parseCurrency = (formattedValue: string) => {
  return parseFloat(formattedValue.replace(/[^0-9.-]+/g, ''));
};