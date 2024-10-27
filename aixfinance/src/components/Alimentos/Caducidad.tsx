import React, { useState, useEffect } from 'react';
import styles from '../../styles/Alimentos/CaducidadForm.module.css';
import { CaducidadModel } from '../../services/apiCaducidad';
import TestCaducidadForm from './CaducidadForm';

interface CaducidadProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const Caducidad: React.FC<CaducidadProps> = ({
  refresh,
  setRefresh
}) => {
  const [elementToEdit, setElementToEdit] = useState<CaducidadModel | null>(null);

  return (
    <div className={styles.floating}>
      <TestCaducidadForm
        onAdd={() => setRefresh((prev) => !prev)}
        elementToEdit={elementToEdit || undefined}
        onCleanData={() => setElementToEdit(null)}
      />
    </div>
    )
};

export default Caducidad;