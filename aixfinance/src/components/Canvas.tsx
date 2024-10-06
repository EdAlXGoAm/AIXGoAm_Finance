import React, { useState, useEffect } from 'react';
import Card from './Card';
import { getExpenses, deleteExpense, Expense } from '../services/apiService';
import NewCardForm from './NewCardForm';
import styles from '../styles/Canvas.module.css';

const Canvas: React.FC<{ refresh: boolean, setRefresh: React.Dispatch<React.SetStateAction<boolean>> }> = ({ refresh, setRefresh }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getExpenses();
        setExpenses(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar gastos.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [refresh]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id);
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== id));
      setRefresh((prev) => !prev);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al eliminar el gasto.');
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleFormSuccess = () => {
    setRefresh((prev) => !prev);
  };


  if (loading) {
    return <div>Cargando gastos...</div>;
  }

  if (error) {
    return <div>Error al cargar gastos: {error}</div>;
  }

  return (
    <div className={styles.canvas}>
      {expenses.map((expense) => (
        <Card
          key={expense._id}
          id={expense._id}
          title={expense.title}
          expense={expense}
          content={`Monto: ${expense.amount} 
                    Categoría: ${expense.category}
                    Fecha: ${expense.date} 
                    Notas: ${expense.notes || 'N/A'}`}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      <NewCardForm
        onAdd={handleFormSuccess}
        editingExpense={editingExpense || undefined}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
};

export default Canvas;