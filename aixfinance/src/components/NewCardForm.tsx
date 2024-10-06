import React, { useState, useEffect } from 'react';
import styles from '../styles/NewCardForm.module.css';
import { createExpense, updateExpense, Expense } from '../services/apiService';

interface NewCardFormProps {
  onAdd: () => void;
  editingExpense?: Expense;
  onCancelEdit?: () => void;
}

const NewCardForm: React.FC<NewCardFormProps> = ({
  onAdd,
  editingExpense,
  onCancelEdit,
}) => {
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

  useEffect(() => {
    if (editingExpense) {
      setExpenseData({
        type: editingExpense.type,
        date: editingExpense.date,
        time: editingExpense.time,
        title: editingExpense.title,
        amount: editingExpense.amount.toString(),
        category_group_name: editingExpense.category_group_name,
        category: editingExpense.category,
        type_group_name: editingExpense.type_group_name,
        type_name: editingExpense.type_name,
        account: editingExpense.account,
        frequency: editingExpense.frequency,
        notes: editingExpense.notes || '',
      });
      setIsOpen(true);
    }
  }, [editingExpense]);

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
      if (editingExpense) {
        await updateExpense(editingExpense._id, expenseDataToSubmit as Expense);
        onAdd();
        if (onCancelEdit) onCancelEdit();
      } else {
        await createExpense(expenseDataToSubmit as Expense);
        onAdd(); // Notifica al componente padre para recargar los gastos
      }
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

  const handleClose = () => {
    setIsOpen(false);
    if (onCancelEdit) onCancelEdit();
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
    setError(null);
  };

  return (
    <>
      {!editingExpense && (
        <button className={styles.addButton} onClick={() => setIsOpen(true)}>
          +
        </button>
      )}

      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro del modal
          >
            <h2>{editingExpense ? 'Editar Gasto' : 'Agregar Nuevo Gasto'}</h2>
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
                  {loading ? (editingExpense ? 'Actualizando...' : 'Agregando...') : (editingExpense ? 'Actualizar' : 'Agregar')}
                </button>
                <button type="button" onClick={handleClose}>
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