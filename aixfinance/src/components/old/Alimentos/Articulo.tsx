import React, { useState, useEffect } from 'react';
import { ArticuloModel } from '../../services/apiArticulo';
import ArticuloForm from './ArticuloForm';

interface ArticuloProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const Articulo: React.FC<ArticuloProps> = ({
  refresh,
  setRefresh
}) => {
  const [elementToEdit, setElementToEdit] = useState<ArticuloModel | null>(null);

  return (
    <div>
      <ArticuloForm onAdd={() => setRefresh((prev) => !prev)}
        elementToEdit={elementToEdit || undefined}
        onCleanData={() => setElementToEdit(null)}
      />
    </div>
  );
}

export default Articulo;
