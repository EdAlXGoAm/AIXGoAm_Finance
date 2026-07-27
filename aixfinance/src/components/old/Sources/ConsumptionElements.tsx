import { useState, useEffect } from 'react';
import { ConsumptionModel, RemoteConsumptionData } from '@/services/apiConsumption';
import { getConsumptions, deleteConsumption } from '@/services/apiConsumption';

interface ConsumptionElementsProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const ConsumptionElements = ({ refresh, setRefresh }: ConsumptionElementsProps) => {

  const [elementToEditConsumption, setElementToEditConsumption] = useState<ConsumptionModel | undefined>(undefined);

  const onCleanDataConsumption = () => {
    setElementToEditConsumption(undefined);
  };

  const onCreateConsumptionId = (id: string) => {
    onRefreshConsumptions();
  };

  const onRefreshConsumptions = () => {
    setRefresh(!refresh);
  };
  
  const RemoteConsumptionDataToModel = (remoteConsumption: RemoteConsumptionData): ConsumptionModel => {
    return {
      _id: remoteConsumption._id,
      data: {
        idPurchaseItemStory: remoteConsumption.idPurchaseItemStory,
        date: remoteConsumption.date,
        type: remoteConsumption.type,
        quantityConsumed: remoteConsumption.quantityConsumed,
        waste: remoteConsumption.waste,
        cost: remoteConsumption.cost,
      }
    };
  };

  const [consumptions, setConsumptions] = useState<ConsumptionModel[]>([]);

  const fetchConsumptions = async () => {
    const response = await getConsumptions();
    setConsumptions(response.map(RemoteConsumptionDataToModel));
  };

  const onEditConsumption = (consumption: ConsumptionModel) => {
    setElementToEditConsumption(consumption);
  };

  const onDeleteConsumption = (id: string) => {
    deleteConsumption(id);
    setConsumptions((prev) => {
      const newConsumptions = prev.filter((consumption) => consumption._id !== id);
      return newConsumptions;
    });
    onRefreshConsumptions();
  };

  return {
    elementToEditConsumption, setElementToEditConsumption,
    onCleanDataConsumption,
    onCreateConsumptionId,
    onRefreshConsumptions,
    RemoteConsumptionDataToModel,
    consumptions, fetchConsumptions,
    onEditConsumption, onDeleteConsumption,
  };
};
