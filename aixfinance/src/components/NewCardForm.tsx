// src/components/NewCardForm.tsx

import React, { useState } from 'react';
import styles from '../styles/NewCardForm.module.css';
import { createExpense } from '../services/apiService';

interface NewCardFormProps {
  onAdd: () => void;
}

const NewCardForm: React.FC<NewCardFormProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Estado inicial para los datos del gasto
  const [expenseData, setExpenseData] = useState({
    type: 'gasto',
    date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    time: new Date().toTimeString().split(' ')[0].slice(0, 5), // Hora actual en formato HH:MM
    title: '',
    amount: '',
    category_group_name: '',
    category: 'Sin Categoría',
    type_group_name: '',
    type_name: '',
    account: '',
    frequency: '',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Maneja los cambios en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setExpenseData((prevData) => ({
      ...prevData,
      [name]: name === 'amount' ? value : value,
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validación básica
    if (isNaN(parseFloat(expenseData.amount))) {
      setError('La cantidad debe ser un número válido.');
      setLoading(false);
      return;
    }

    // Convierte el campo amount a un número antes de enviar los datos
    const expenseDataToSubmit = {
      ...expenseData,
      amount: parseFloat(expenseData.amount),
    };

    try {
      await createExpense(expenseDataToSubmit);
      onAdd(); // Notifica al componente padre para recargar los gastos
      setIsOpen(false);
      setExpenseData({
        type: 'gasto',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].slice(0, 5),
        title: '',
        amount: '',
        category_group_name: '',
        category: 'Sin Categoría',
        type_group_name: '',
        type_name: '',
        account: '',
        frequency: '',
        notes: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al agregar el gasto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className={styles.addButton} onClick={() => setIsOpen(true)}>
        +
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro del modal
          >
            <h2>Agregar Nuevo Gasto</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Tipo:
                <input
                  type="text"
                  name="type"
                  value={expenseData.type}
                  onChange={handleChange}
                  required
                  disabled
                />
              </label>
              <label>
                Fecha:
                <input
                  type="date"
                  name="date"
                  value={expenseData.date}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Hora:
                <input
                  type="time"
                  name="time"
                  value={expenseData.time}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Nombre del Gasto:
                <input
                  type="text"
                  name="title"
                  value={expenseData.title}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Cantidad:
                <input
                  type="number"
                  name="amount"
                  value={expenseData.amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                />
              </label>
              <label>
                Grupo de Categoría:
                <input
                  type="text"
                  name="category_group_name"
                  value={expenseData.category_group_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Categoría:
                <input
                  type="text"
                  name="category"
                  value={expenseData.category}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Grupo de Tipo:
                <input
                  type="text"
                  name="type_group_name"
                  value={expenseData.type_group_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Tipo:
                <input
                  type="text"
                  name="type_name"
                  value={expenseData.type_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Cuenta:
                <select
                  name="account"
                  value={expenseData.account}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una cuenta</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta de Crédito">
                    Tarjeta de Crédito
                  </option>
                  <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                  <option value="Vales">Vales</option>
                  {/* Agrega más opciones según sea necesario */}
                </select>
              </label>
              <label>
                Frecuencia:
                <input
                  type="text"
                  name="frequency"
                  value={expenseData.frequency}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Notas:
                <textarea
                  name="notes"
                  value={expenseData.notes}
                  onChange={handleChange}
                />
              </label>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.buttons}>
                <button type="submit" disabled={loading}>
                  {loading ? 'Agregando...' : 'Agregar'}
                </button>
                <button type="button" onClick={() => setIsOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewCardForm;