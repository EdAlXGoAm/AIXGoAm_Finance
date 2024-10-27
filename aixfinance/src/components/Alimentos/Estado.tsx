import React, { useState, useEffect } from 'react';
import { EstadoModel } from '../../services/apiEstado';
import EstadoForm from './EstadoForm';

interface EstadoProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const Estado: React.FC<EstadoProps> = ({
  refresh,
  setRefresh
}) => {
  const [elementToEdit, setElementToEdit] = useState<EstadoModel | null>(null);

  return (
    <div>
      <EstadoForm
        onAdd={() => setRefresh((prev) => !prev)}
        elementToEdit={elementToEdit || undefined}
        onCleanData={() => setElementToEdit(null)}
      />
    </div>
    )
};

export default Estado;