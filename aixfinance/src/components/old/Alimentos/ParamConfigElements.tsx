import { useState } from 'react';
import { ParamConfigModel, RemoteParamConfigData } from '@/services/apiParamConfig';
import { getParamConfig, deleteParamConfig } from '@/services/apiParamConfig';

interface ParamConfigElementsProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const ParamConfigElements = ({ refresh, setRefresh }: ParamConfigElementsProps) => {
  const onRefreshParamConfigs = () => {
    setRefresh(!refresh);
  };

  const [elementToEditParamConfig, setElementToEditParamConfig] = useState<ParamConfigModel | undefined>(undefined);

  const onCleanElementToEditParamConfig = () => {
    setElementToEditParamConfig(undefined);
  };

  const onEditElementToEditParamConfig = (paramConfig: RemoteParamConfigData | ParamConfigModel) => {
    if ('data' in paramConfig) {
      setElementToEditParamConfig(paramConfig);
    } else {
      setElementToEditParamConfig(RemoteParamConfigDataToModel(paramConfig));
    }
  };
  
  const [paramConfigs, setParamConfigs] = useState<RemoteParamConfigData[]>([]);
  
  const fetchParamConfigs = async () => {
    const response = await getParamConfig();
    setParamConfigs(response.data);
  };
  
  const onCreateParamConfig = (response: RemoteParamConfigData) => {
    setParamConfigs((prev) => {
      const newParamConfigs = [...prev, response];
      return newParamConfigs;
    });
  };
  
  const onUpdateParamConfig = (response: RemoteParamConfigData) => {
    setParamConfigs((prev) => {
      const newParamConfigs = prev.map((paramConfig) => paramConfig._id === response._id ? response : paramConfig);
      return newParamConfigs;
    });
  };
  
  const onDeleteParamConfig = (id: string) => {
    deleteParamConfig(id);
    setParamConfigs((prev) => {
      const newParamConfigs = prev.filter((paramConfig) => paramConfig._id !== id);
      return newParamConfigs;
    });
  };
  
  const RemoteParamConfigDataToModel = (remoteParamConfig: RemoteParamConfigData): ParamConfigModel => {
    return {
      _id: remoteParamConfig._id,
      data: {
        quantity_unit: remoteParamConfig.quantity_unit,
        weight_unit: remoteParamConfig.weight_unit,
        volume_unit: remoteParamConfig.volume_unit,
        time_unit: remoteParamConfig.time_unit,
        default_unit: remoteParamConfig.default_unit,
        reference_unit: remoteParamConfig.reference_unit,
        states_list: remoteParamConfig.states_list,
      }
    };
  };
  
  return {
    onRefreshParamConfigs,
    elementToEditParamConfig, setElementToEditParamConfig,
    onCleanElementToEditParamConfig,
    onEditElementToEditParamConfig,
    paramConfigs, fetchParamConfigs,
    onCreateParamConfig,
    onUpdateParamConfig,
    onDeleteParamConfig,
    RemoteParamConfigDataToModel,
  };
};

