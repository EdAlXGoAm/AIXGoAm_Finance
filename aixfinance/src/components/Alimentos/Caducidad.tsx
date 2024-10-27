import React, { useState, useEffect } from 'react';
import styles from '../../styles/Alimentos/CaducidadForm.module.css';
import { Caducidad } from '../../services/apiCaducidad';
import TestCaducidadForm from './CaducidadForm';

interface TestCaducidadProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const TestCaducidad: React.FC<TestCaducidadProps> = ({
  refresh,
  setRefresh
}) => {
  const [elementToEdit, setElementToEdit] = useState<Caducidad | null>(null);

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

export default TestCaducidad;