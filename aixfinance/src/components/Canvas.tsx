import React, { useState, useEffect } from 'react';
import Card from './Card';
import { getExpenses, Expense } from '../services/apiService';
import styles from '../styles/Canvas.module.css';

interface CanvasProps {
  refresh: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ refresh }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await getExpenses();
        setExpenses(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [refresh]);

  if (loading) {
    return <div>Cargando gastos...</div>;
  }

  if (error) {
    return <div>Error al cargar gastos: {error}</div>;
  }

  return (
    <div className={styles.canvas}>
      {expenses.map(expense => (
        <Card
          key={expense._id}
          id={expense._id}
          title={expense.title}
          content={`Monto: ${expense.amount} 
Categoría: ${expense.category}
Fecha: ${expense.date} 
Notas: ${expense.notes || 'N/A'}`}
        />
      ))}
    </div>
  );
};

export default Canvas;