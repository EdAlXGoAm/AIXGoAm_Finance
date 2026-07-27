import React, { useState, useEffect } from 'react';
import { ParamConfigModel } from '../../services/apiParamConfig';
import ParamConfigForm from './ParamConfigForm';

interface ParamConfigProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const ParamConfig: React.FC<ParamConfigProps> = ({
  refresh,
  setRefresh
}) => {
  const [elementToEdit, setElementToEdit] = useState<ParamConfigModel | null>(null);

  return (
    <div>
      <ParamConfigForm
        onAdd={() => setRefresh((prev) => !prev)}
        elementToEdit={elementToEdit || undefined}
        onCleanData={() => setElementToEdit(null)}
      />
    </div>
  );
}

export default ParamConfig;