import React, { useEffect, useState } from 'react';
import styles from '../../styles/Sources/ConsumptionForm.module.css';
import { ConsumptionData, ConsumptionModel } from '@/services/apiConsumption';
import { ConsumptionFormElements } from './ConsumptionFormElements';
import { Row, Column, RowForm, FormulasContainer, FormulaLabel, CustomForm, VariableText } from '@/utils/formatUtils';
import { CenteredSelect } from '@/utils/textUtils';
import ImageSelect from '@/utils/CustomSelector/ImageSelect';
import { Button } from '@mui/material';
import { toISOStringLocal } from '@/utils/dateUtils';
import { RemotePurchaseItemStoryData } from '@/services/apiPurchaseItemStory';
import { RemoteInventoryItemData } from '@/services/apiSourceItem';
import { getInventoryItemById } from '@/services/apiSourceItem';
import { getPurchaseItemStoryById } from '@/services/apiPurchaseItemStory';

interface ConsumptionFormProps {
  onCleanData: () => void;
  elementToEdit?: ConsumptionModel;
  onCreateConsumptionId: (id: string) => void;
  onRefreshConsumptions: () => void;
  mode?: 'floating' | 'subform';
  idPurchaseItemStory: string;
}

const ConsumptionForm: React.FC<ConsumptionFormProps> = ({
  onCleanData,
  elementToEdit,
  onCreateConsumptionId,
  onRefreshConsumptions,
  mode,
  idPurchaseItemStory
}) => {
  const {
    isOpen, setIsOpen,
    error, setError,
    loading, setLoading,
    formData, setFormData,
    handleClose,
    displayQuantity, setDisplayQuantity, displayQuantityError,
    displayWaste, setDisplayWaste, displayWasteError,
    handleChangeQuantity,
    displayPrice, setDisplayPrice, displayPriceError, handleChangePrice,
    handleChange,
    handleSubmit,
  } = ConsumptionFormElements({ onCleanData, elementToEdit, onCreateConsumptionId, onRefreshConsumptions });

  const [loadingForm, setLoadingForm] = useState<boolean>(true);

  useEffect(() => {
    if(elementToEdit) {
      setFormData(elementToEdit.data);
      setIsOpen(true);
    }
  }, [elementToEdit]);

  useEffect(() => {
    const fetchPurchaseItemStory = async () => {
      try {
        const response = await getPurchaseItemStoryById(idPurchaseItemStory);
        const fetchedData = response.data;
        setFormData({...formData, idPurchaseItemStory: fetchedData});
        setLoadingForm(false);
      } catch (error) {
        setError('Error al obtener el PurchaseItemStory.');
        setLoadingForm(false);
      }
    };
    
    setLoadingForm(true);
    if (idPurchaseItemStory) {
      fetchPurchaseItemStory();
    }
    setDisplayPrice(formData.cost.toFixed(2));
    setDisplayQuantity(formData.quantityConsumed.toFixed(0));
    setDisplayWaste(formData.waste.toFixed(0));
  }, [isOpen]);

  const [copyInventoryItem, setCopyInventoryItem] = useState<RemoteInventoryItemData>({} as RemoteInventoryItemData);

  const fetchCopyInventoryElement = async (id: string) => {
    try {
      setLoading(true);
      const inventoryItem = await getInventoryItemById(id);
      setCopyInventoryItem(inventoryItem.data);
      setLoading(false);
    } catch (err) {
      setError('Error al obtener el elemento de inventario.');
      setLoading(false);
    }
  };

  const [referenceUnit, setReferenceUnit] = useState<string>('');
  const [referenceUnitName, setReferenceUnitName] = useState<string>('');
  const [referenceUnitQuantity, setReferenceUnitQuantity] = useState<number>(0);
  const [costPerReferenceUnit, setCostPerReferenceUnit] = useState<number>(0);

  useEffect(() => {
    if (copyInventoryItem && Object.keys(copyInventoryItem).length > 0) {
      setReferenceUnit(copyInventoryItem.idParamConfig.reference_unit);
      if (referenceUnit === 'quantity_unit') {
        setReferenceUnitQuantity(copyInventoryItem.quantity);
        setReferenceUnitName(copyInventoryItem.idParamConfig.quantity_unit);  
      } else if (referenceUnit === 'weight_unit') {
        setReferenceUnitQuantity(copyInventoryItem.weight);
        setReferenceUnitName(copyInventoryItem.idParamConfig.weight_unit);
      } else if (referenceUnit === 'volume_unit') {
        setReferenceUnitQuantity(copyInventoryItem.volume);
        setReferenceUnitName(copyInventoryItem.idParamConfig.volume_unit);
      } else if (referenceUnit === 'time_unit') {
        setReferenceUnitQuantity(copyInventoryItem.time);
        setReferenceUnitName(copyInventoryItem.idParamConfig.time_unit);
      }
      setCostPerReferenceUnit(copyInventoryItem.price / referenceUnitQuantity);
      const newCost = (costPerReferenceUnit * (formData.quantityConsumed + formData.waste)).toFixed(2);
      setDisplayPrice(newCost);
      setFormData((prev) => ({
        ...prev,
        type: referenceUnitName,
        cost: parseFloat(newCost)
      }));
    }
  }, [displayQuantity, displayWaste, displayPrice, copyInventoryItem]);

  useEffect(() => {
    if (formData.idPurchaseItemStory && formData.idPurchaseItemStory.copyInventoryItem) {
      fetchCopyInventoryElement(formData.idPurchaseItemStory.copyInventoryItem._id);
    }
  }, [formData.idPurchaseItemStory]);

  return (
    <React.Fragment>
      {!elementToEdit && (
        mode === 'floating' ? (
          <button className={styles.addButton} onClick={() => setIsOpen(true)}
            style={{ '--add-button-bottom': `${20+(80*1)}px` } as React.CSSProperties}
          >
            <pre style={{ fontSize: '0.6rem' }}>Consumo</pre>
            +
          </button>
        ) : (
          <button className={styles.simpleButtonForForm} onClick={() => setIsOpen(true)}>
            Add Consumption
          </button>
        )
      )}
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{elementToEdit ? 'Editar Consumo' : 'Agregar Consumo'}</h2>
            {loadingForm && <p>Cargando...</p>}
            {!loadingForm && (
              <CustomForm>
                {copyInventoryItem && Object.keys(copyInventoryItem).length > 0 && (
                  <React.Fragment>
                    <Row>
                      <Column>
                        <label>Fecha</label>
                        <input type="date" name="date" value={toISOStringLocal(formData.date).split('T')[0]} onChange={handleChange} required />
                      </Column>
                      <Column>
                        <label>Hora</label>
                        <input type="time" name="time" value={toISOStringLocal(formData.date).split('T')[1].slice(0, 5)} onChange={handleChange} required />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <VariableText
                          variable="Nombre"
                          value={copyInventoryItem.name}
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <VariableText
                          variable="Precio"
                          value={`$${copyInventoryItem.price.toFixed(2)}`}
                        />
                      </Column>
                    </Row>
                    <Row>
                    <Column>
                        <VariableText
                          variable="Cantidad"
                          value={`${referenceUnitQuantity} ${referenceUnitName}`}
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <VariableText
                          variable="Costo por unidad"
                          value={`$${costPerReferenceUnit.toFixed(2)}`}
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <label>Cantidad</label>
                        <input type="text" name="quantityConsumed" value={displayQuantity} onChange={(e) => handleChangeQuantity('quantityConsumed', e)} required />
                      </Column>
                      <Column>
                        <label>&nbsp;</label>
                        <label>{referenceUnitName}</label>
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <label>Desperdicio</label>
                        <input type="text" name="waste" value={displayWaste} onChange={(e) => handleChangeQuantity('waste', e)} required />
                      </Column>
                      <Column>
                        <label>&nbsp;</label>
                        <label>{referenceUnitName}</label>
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <label>Costo</label>
                        <input type="text" name="cost" value={displayPrice} onChange={(e) => handleChangePrice('cost', e)} required />
                      </Column>
                    </Row>
                  </React.Fragment>     
                )}
              </CustomForm>
            )}
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.buttons}>
              <button className={`${styles.button} ${styles.submitButton}`} disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? 'Actualizando...' : (elementToEdit ? 'Actualizar' : 'Agregar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ConsumptionForm;
