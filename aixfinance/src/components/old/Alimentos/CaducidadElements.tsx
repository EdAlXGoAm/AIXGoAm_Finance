import { useState } from 'react';
import { CaducidadModel, RemoteCaducidadData } from '@/services/apiCaducidad';
import { getCaducidad, deleteCaducidad } from '@/services/apiCaducidad';

interface CaducidadElementsProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
  idCreatedCaducidad?: string;
  setIdCreatedCaducidad?: (id: string) => void;
}

export const CaducidadElements = ({ refresh, setRefresh, idCreatedCaducidad, setIdCreatedCaducidad }: CaducidadElementsProps) => {
  
  const [elementToEditCaducidad, setElementToEditCaducidad] = useState<CaducidadModel | undefined>(undefined);

  const onCleanDataCaducidad = () => {
    setElementToEditCaducidad(undefined);
  };

  const onCreateCaducidadId = (id: string) => {
    if (setIdCreatedCaducidad) {
      setIdCreatedCaducidad(id);
    }
  };

  const onRefreshCaducidads = () => {
    setRefresh(!refresh);
  };

  const RemoteCaducidadDataToModel = (remoteCaducidad: RemoteCaducidadData): CaducidadModel => {
    return {
      _id: remoteCaducidad._id,
      data: {
        datePurchase: remoteCaducidad.datePurchase,
        dateExpiration: remoteCaducidad.dateExpiration
      }
    };
  };

  const [caducidad, setCaducidad] = useState<RemoteCaducidadData[]>([]);

  const fetchCaducidad = async () => {
    const response = await getCaducidad();
    setCaducidad(response.data);
  };

  const onEditCaducidad = (caducidad: CaducidadModel) => {
    setElementToEditCaducidad(caducidad);
    onRefreshCaducidads();
  };

  const onDeleteCaducidad = (id: string) => {
    deleteCaducidad(id);
    setCaducidad((prev) => {
      const newCaducidads = prev.filter((caducidad) => caducidad._id !== id);
      onRefreshCaducidads();
      return newCaducidads;
    });
  };

  return {
    elementToEditCaducidad, setElementToEditCaducidad,
    onCleanDataCaducidad,
    onCreateCaducidadId,
    onRefreshCaducidads,
    RemoteCaducidadDataToModel,
    caducidad, fetchCaducidad,
    onEditCaducidad,
    onDeleteCaducidad
  };
};
