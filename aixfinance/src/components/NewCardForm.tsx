// src/components/NewCardForm.tsx

import React, { useState } from 'react';
import styles from '../styles/NewCardForm.module.css';
import { usePanelContext } from '../contexts/PanelContext';

const NewCardForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [account, setAccount] = useState('');

  const { addCard } = usePanelContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addCard({
      title,
      amount,
      account,
    });

    // Cerrar el formulario y limpiar los campos
    setIsOpen(false);
    setTitle('');
    setAmount(0);
    setAccount('');
  };

  return (
    <>
      <button className={styles.addButton} onClick={() => setIsOpen(true)}>
        +
      </button>

      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Agregar Nuevo Gasto</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nombre del Gasto:
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </label>
              <label>
                Cantidad:
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(parseFloat(e.target.value))}
                  required
                />
              </label>
              <label>
                Cuenta:
                <select value={account} onChange={e => setAccount(e.target.value)} required>
                  <option value="">Selecciona una cuenta</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                  <option value="Vales">Vales</option>
                  {/* Agrega más opciones según sea necesario */}
                </select>
              </label>
              <div className={styles.buttons}>
                <button type="submit">Agregar</button>
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
