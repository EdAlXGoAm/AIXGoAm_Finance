import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Configuración de la instancia de Axios
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3010/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces para los diferentes tipos de movimientos
export interface Movement {
  _id: string;
  type: 'ingreso' | 'gasto' | 'transferencia';
  date: string;
  time: string;
  title: string;
  amount: number;
  category_group_name: string;
  category: string;
  type_group_name: string;
  type_name: string;
  account: string;
  frequency: string;
  notes?: string;
}

export interface Expense extends Movement {}
export interface Income extends Movement {}
export interface Transfer extends Movement {}

// Servicios para Gastos
export const createExpense = async (expense: Expense): Promise<AxiosResponse<Expense>> => {
  try {
    const response = await api.post('/expenses', expense);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getExpenses = async (): Promise<AxiosResponse<Expense[]>> => {
  try {
    const response = await api.get('/expenses');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateExpense = async (id: string, expense: Expense): Promise<AxiosResponse<Expense>> => {
  try {
    const response = await api.put(`/expenses/${id}`, expense);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteExpense = async (id: string): Promise<AxiosResponse<{ message: string }>> => {
  try {
    const response = await api.delete(`/expenses/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// // Servicios para Ingresos (a implementar cuando el backend lo soporte)
// export const createIncome = async (income: Income): Promise<AxiosResponse<Income>> => {
//   // Implementar similar a createExpense
// };

// export const getIncomes = async (): Promise<AxiosResponse<Income[]>> => {
//   // Implementar similar a getExpenses
// };

// export const updateIncome = async (id: string, income: Income): Promise<AxiosResponse<Income>> => {
//   // Implementar similar a updateExpense
// };

// export const deleteIncome = async (id: string): Promise<AxiosResponse<{ message: string }>> => {
//   // Implementar similar a deleteExpense
// };

// // Servicios para Transferencias (a implementar cuando el backend lo soporte)
// export const createTransfer = async (transfer: Transfer): Promise<AxiosResponse<Transfer>> => {
//   // Implementar similar a createExpense
// };

// export const getTransfers = async (): Promise<AxiosResponse<Transfer[]>> => {
//   // Implementar similar a getExpenses
// };

// export const updateTransfer = async (id: string, transfer: Transfer): Promise<AxiosResponse<Transfer>> => {
//   // Implementar similar a updateExpense
// };

// export const deleteTransfer = async (id: string): Promise<AxiosResponse<{ message: string }>> => {
//   // Implementar similar a deleteExpense
// };