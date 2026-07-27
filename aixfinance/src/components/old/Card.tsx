import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { DraggableEventHandler } from 'react-draggable';
import styles from '../styles/Card.module.css';
import { Expense } from '../services/apiService';

interface CardProps {
  id: string;
  title: string;
  expense: Expense;
  content: string;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ id, title, expense, content, onEdit, onDelete }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuVisible(true);
  };

  const handleDrag: DraggableEventHandler = (e, data) => {
    setMenuVisible(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    onEdit(expense);
    setMenuVisible(false);
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      onDelete(id);
    }
    setMenuVisible(false);
  };

  return (
    <Draggable
      onDrag={handleDrag}
      >
      <div
        className={styles.card}
        onContextMenu={handleContextMenu}
        ref={cardRef}
      >
        <h3>{title}</h3>
        <p>{content}</p>

        {menuVisible && (
          <ul
            className={styles.contextMenu}
            style={{ top: 20, left: 200 }}
          >
            <li onClick={handleEdit}>Editar</li>
            <li onClick={handleDelete}>Eliminar</li>
          </ul>
        )}
      </div>
    </Draggable>
  );
};

export default Card;