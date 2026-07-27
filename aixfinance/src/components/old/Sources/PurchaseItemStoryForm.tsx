import React, { useEffect, useState } from 'react';
import styles from '../../styles/Sources/PurchaseItemsStory.module.css';
import { PurchaseItemStoryModel, RemotePurchaseItemStoryData } from '../../services/apiPurchaseItemStory';
import { PurchaseItemStoryFormElements } from './PurchaseItemStoryFormElements';
import { Switch, FormControlLabel, Table, TableCell, TableRow, TableBody, TableHead, IconButton } from '@mui/material';
import { Row, Column, RowForm, FormulasContainer, FormulaLabel, CustomForm, VariableText } from '../../utils/formatUtils';
import ImageSelect from '@/utils/CustomSelector/ImageSelect';
import { CenteredLabel, CenteredSelect } from '@/utils/textUtils';
import { getDaysBetweenDates, toISOStringLocal } from '@/utils/dateUtils';
import CaducidadForm from '../Alimentos/CaducidadForm';
import { CaducidadElements } from '../Alimentos/CaducidadElements';
import { getCaducidadById } from '@/services/apiCaducidad';
import { ConsumptionElements } from './ConsumptionElements';
import ConsumptionForm from '../Sources/ConsumptionForm';
import { getConsumptionsByPurchaseItemStory } from '@/services/apiConsumption';
import { FaButtonDelete } from '@/utils/buttonUtils';
import { FaButtonEdit } from '@/utils/buttonUtils';
import { RemoteSourceItemData } from '@/services/apiSourceItem';
import { ButtonRectangle } from '@/commonForm/FrontButtons';
import { ButtonCircle } from '@/commonForm/FrontButtons';

interface PurchaseItemStoryFormProps {
  onCleanElementToEdit: () => void;
  elementToEdit?: PurchaseItemStoryModel;
  hideButton: boolean;
  mode: 'floating' | 'inline';
  onAddResponse: (response: any) => void;
  onUpdateResponse: (response: any) => void;
  newTriggeredFromExternalComponent: boolean;
  setNewTriggeredFromExternalComponent: (value: boolean) => void;
  idSourceItemTriggeredFromExternalComponent?: RemoteSourceItemData | null;
}

const PurchaseItemStoryForm: React.FC<PurchaseItemStoryFormProps> = ({
  elementToEdit,
  onCleanElementToEdit,
  hideButton,
  mode,
  onAddResponse,
  onUpdateResponse,
  newTriggeredFromExternalComponent,
  setNewTriggeredFromExternalComponent,
  idSourceItemTriggeredFromExternalComponent
}) => {
  const {
    isOpen,
    error, setError,
    loadingSubmit, setLoadingSubmit,
    loadingForm, setLoadingForm,
    formData, setFormData,
    submitAction, setSubmitAction,
    displayData, setDisplayData,
    displayError, setDisplayError,
    overlayRef,
    modalRef,
    handleCreateNewElement,
    handleClose,
    handleChangeCheckbox,
    handleChangeImageSelect,
    handleChangeTextAndSelect,
    handleChangeWithValidation,
    handleChangeList,
    handleAddListItem,
    handleRemoveListItem,
    handleSubmitWithResponse,
    handleFocus,
    handleBlur,
    handleChangeRichText,

    activeTrackingItem,
    handleChangeDate,
    handleChangeCheckboxActiveTrackingItem,
    formulaDiscountInputRef,
    handleFormulaDiscountLabelClick,

    trackingItemOptions,
    onSubmitPurchaseItemStory,
  } = PurchaseItemStoryFormElements({
    onCleanElementToEdit,
    elementToEdit,
    onAddResponse,
    onUpdateResponse,
    openTriggeredFromExternalComponent: newTriggeredFromExternalComponent,
    setOpenTriggeredFromExternalComponent: setNewTriggeredFromExternalComponent,
    idSourceItemTriggeredFromExternalComponent: idSourceItemTriggeredFromExternalComponent
  });

  const [refreshCaducidad, setRefreshCaducidad] = useState<boolean>(false);
  const [idCreatedCaducidad, setIdCreatedCaducidad] = useState<string | undefined>(undefined);
  const {
    elementToEditCaducidad, setElementToEditCaducidad,
    onCleanDataCaducidad,
    onCreateCaducidadId,
    onRefreshCaducidads,
    RemoteCaducidadDataToModel,
    caducidad, fetchCaducidad,
    onEditCaducidad,
    onDeleteCaducidad
  } = CaducidadElements({
    refresh: refreshCaducidad, setRefresh: setRefreshCaducidad,
    idCreatedCaducidad, setIdCreatedCaducidad
  });


  useEffect(() => {
    if (idCreatedCaducidad) {
      getCaducidadById(idCreatedCaducidad).then(response => {
        setFormData({ ...formData, idExpiration: response.data });
      });
    }
  }, [idCreatedCaducidad]);

  useEffect(() => {
    if (idCreatedCaducidad) {
      getCaducidadById(idCreatedCaducidad).then(response => {
        setFormData({ ...formData, idExpiration: response.data });
      });
    }
  }, [refreshCaducidad]);

  const handleCancel = () => {
    if (idCreatedCaducidad) {
      if (formData.idExpiration) {
        onDeleteCaducidad(formData.idExpiration._id);
      }
    }
    handleClose();
  };

  const [refreshConsumption, setRefreshConsumption] = useState<boolean>(false);

  const {
    elementToEditConsumption, setElementToEditConsumption,
    onCleanDataConsumption,
    onCreateConsumptionId,
    onRefreshConsumptions,
    RemoteConsumptionDataToModel,
    consumptions, fetchConsumptions,
    onEditConsumption,
    onDeleteConsumption
  } = ConsumptionElements({
    refresh: refreshConsumption,
    setRefresh: setRefreshConsumption,
  });


  useEffect(() => {
    const fetchConsumptions = async () => {
      if (elementToEdit && elementToEdit._id) {
        try {
          const consumptions = await getConsumptionsByPurchaseItemStory(elementToEdit._id);
          setFormData((prevData: any) => ({
            ...prevData,
            idsConsumptionHistory: consumptions,
          }));
        } catch (error) {
          console.error('Error al obtener los consumos:', error);
          setError('No se pudieron cargar los consumos.');
        }
      }
    };

    fetchConsumptions();
  }, [elementToEdit, refreshConsumption]);
  
  const [referenceUnit, setReferenceUnit] = useState<string>('');
  const [referenceUnitQuantity, setReferenceUnitQuantity] = useState<number>(0);
  const [referenceUnitName, setReferenceUnitName] = useState<string>('');
  const [costPerReferenceUnit, setCostPerReferenceUnit] = useState<number>(0);

  useEffect(() => {
    const fetchReferenceVariables = async () => {
      if (formData.copyInventoryItem && Object.keys(formData.copyInventoryItem).length > 0) {
        setReferenceUnit(formData.copyInventoryItem.idParamConfig.reference_unit);
        if (referenceUnit === 'quantity_unit') {
          setReferenceUnitQuantity(formData.copyInventoryItem.quantity);
          setReferenceUnitName(formData.copyInventoryItem.idParamConfig.quantity_unit);  
        } else if (referenceUnit === 'weight_unit') {
          setReferenceUnitQuantity(formData.copyInventoryItem.weight);
          setReferenceUnitName(formData.copyInventoryItem.idParamConfig.weight_unit);
        } else if (referenceUnit === 'volume_unit') {
          setReferenceUnitQuantity(formData.copyInventoryItem.volume);
          setReferenceUnitName(formData.copyInventoryItem.idParamConfig.volume_unit);
        } else if (referenceUnit === 'time_unit') {
          setReferenceUnitQuantity(formData.copyInventoryItem.time);
          setReferenceUnitName(formData.copyInventoryItem.idParamConfig.time_unit);
        }
        let consumedQuantity = 0;
        formData.idsConsumptionHistory.forEach((consumption: any) => {
          consumedQuantity += consumption.quantityConsumed;
        });
        const leftQuantity = ((referenceUnitQuantity*formData.quantity) - consumedQuantity).toFixed(2);

        if (parseFloat(leftQuantity) === 0){
          setFormData((prev: any) => ({
            ...prev,
            leftQuantity: parseFloat(leftQuantity),
            status: formData.measureType === 'consumption' ? 'Consumido' : formData.measureType === 'usage' ? 'Requiere Mantenimiento' : 'Rentabilidad'
          }));
        } else if (parseFloat(leftQuantity) === parseFloat((referenceUnitQuantity*formData.quantity).toFixed(2))){
          setFormData((prev: any) => ({
            ...prev,
            status: 'Nuevo'
          }));
        } else if (parseFloat(leftQuantity) < parseFloat((referenceUnitQuantity*formData.quantity).toFixed(2))){
          setFormData((prev: any) => ({
            ...prev,
            leftQuantity: parseFloat(leftQuantity),
            status: formData.measureType === 'consumption' ? 'Abierto' : formData.measureType === 'usage' ? 'Usado' : 'Rentabilidad'
          }));
        }
        setFormData((prev: any) => ({
          ...prev,
          leftQuantity: parseFloat(leftQuantity)
        }));
      }
    }
    fetchReferenceVariables();
  }, [formData.idsConsumptionHistory, formData.quantity]);

  useEffect(() => {
    let quantityConsumed = 0;
    if (consumptions.length > 0) {
      quantityConsumed = consumptions.reduce((acc, curr) => acc + curr.data.quantityConsumed, 0);
      setFormData({ ...formData, leftQuantity: formData.quantity - quantityConsumed });
    }
  }, [consumptions]);

  useEffect(() => {
    if (formData.formulaDiscount) {
      try {
        // Expresión regular para encontrar patrones {key:value}
        const regex = /\{(\w+):([\d.]+)\}/g;
        let match;
        const variables: Record<string, number> = {};
        let formulaExpression = formData.formulaDiscount;
        
        // Extraer variables y reemplazar en la fórmula
        while ((match = regex.exec(formData.formulaDiscount)) !== null) {
          const key = match[1];
          const value = parseFloat(match[2]);
          variables[key] = value;
          // Reemplazar {key:value} con el valor numérico
          formulaExpression = formulaExpression.replace(match[0], value.toString());
        }
        // Evaluar la expresión matemática resultante
        // Nota: Usar el constructor Function puede ser inseguro si la entrada no es confiable.
        // Considera usar una librería de evaluación de expresiones como mathjs para mayor seguridad.
        const resultado = Function('"use strict"; return (' + formulaExpression + ')')();
        
        if (typeof resultado === 'number' && !isNaN(resultado)) {
          setDisplayData((prev: any) => ({
            ...prev,
            discount: parseFloat(resultado.toFixed(2)).toString()
          }));
        }
      } catch (error) {
        // Manejar errores en la evaluación de la fórmula
        console.error('Error al evaluar la fórmula de descuento:', error);
        // Opcional: Puedes establecer un estado de error adicional aquí
      }
    } else {
      // Si no hay fórmula, restablecer el descuento
      setDisplayData((prev: any) => ({
        ...prev,
        discount: '$0.00'
      }));
    }
  }, [formData.formulaDiscount, setDisplayData]);

  return (
    <React.Fragment>
    {!elementToEdit && (
      mode === 'floating' ? (
        <ButtonCircle
          textToShow="Historia"
          positionX={100+(80*2)}
          positionY={100}
          action={handleCreateNewElement}
        />
      ) : (
        <ButtonRectangle
          textToShow="Agregar Item a la Historia"
          action={handleCreateNewElement}
        />
      )
    )}
      {isOpen && (
        <div className={styles.overlay} ref={overlayRef}>
          <div className={styles.modal} ref={modalRef} style={{ '--max-width-modal': '600px' } as React.CSSProperties}>
            <button className={styles.closeButton} onClick={handleClose}>
              X
            </button>
            <h2>{elementToEdit ? 'Editar Item' : 'Agregar Item a la Historia'}</h2>
            <CustomForm>
              {/* <Row mb="10px">
                <Column>
                  <CenteredSelect label="Item" width="50%">
                    <ImageSelect
                      options={inventoryItemOptions}
                      value={formData.idInventoryItem}
                      onChange={(value) => handleChangeImageSelect('idInventoryItem', value)}
                      compareFn={(a, b) => a._id === b._id}
                    />
                  </CenteredSelect>
                </Column>
              </Row> */}
              <Row>
                <Column alignment="center" width="40%">
                  <FormControlLabel control={<Switch checked={activeTrackingItem} onChange={(event, checked) => handleChangeCheckbox('activeTrackingItem', checked)} />} label="Tracking Item" />
                </Column>
              </Row>
              {activeTrackingItem && (
                <React.Fragment>
                  <Row>
                    <Column>
                      <CenteredSelect label="Tracking Item" width="50%">
                        <ImageSelect
                          options={trackingItemOptions}
                          value={formData.idTrackingItem}
                          onChange={(value) => handleChangeImageSelect('idTrackingItem', value)}
                          compareFn={(a, b) => a._id === b._id}
                        />
                      </CenteredSelect>
                    </Column>
                  </Row>
                </React.Fragment>
              )}
              <Row>
                <Column>
                  <label>Fecha</label>
                  <input type="date" name="date" value={toISOStringLocal(formData.date).split('T')[0]} onChange={handleChangeDate} required />
                </Column>
                <Column>
                  <label>Hora</label>
                  <input type="time" name="time" value={toISOStringLocal(formData.date).split('T')[1].slice(0, 5)} onChange={handleChangeDate} required />
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Cantidad</label>
                  <input
                    type="text"
                    name="quantity"
                    value={displayData.quantity}
                    onChange={handleChangeWithValidation}
                    required
                  />
                </Column>
              </Row>
              <Row>
                {formData.copyInventoryItem._id !== '' && (
                  <React.Fragment>
                    <Column>
                      <VariableText variable="Precio Unitario/Consumo" value={`$${formData.consumptionCost.toFixed(2)}`} />
                    </Column>
                    <Column>
                      <VariableText variable="Precio por cantidad" value={`$${(formData.consumptionCost*formData.quantity).toFixed(2)}`} />
                    </Column>
                  </React.Fragment>
                )}
              </Row>
              <Row>
                <Column>
                  <label>Descuento</label>
                  <input type="string" name="discount" value={displayData.discount} onChange={handleChangeWithValidation} required />
                </Column>
                <Column>
                  <label>Formula Descuento</label>
                  <input type="string" name="formulaDiscount" value={formData.formulaDiscount} onChange={handleChangeTextAndSelect} ref={formulaDiscountInputRef} />
                </Column>
              </Row>
              <Row>
                <Column>
                  <VariableText variable="Precio Total" value={`$${formData.totalPrice.toFixed(2)}`} />
                </Column>
              </Row>
              <Row>
                <Column alignment="center" width="40%">
                  <FormControlLabel control={<Switch checked={formData.expires} onChange={(event, checked) => handleChangeCheckbox('expires', checked)} />} label="Caducidad" />
                </Column>
              </Row>
              {formData.expires && (
                <Row mt="10px">
                  <Column width='80%' alignment='center' border={true}>
                    {!formData.idExpiration || (typeof formData.idExpiration === 'object' && Object.keys(formData.idExpiration).length > 0) ? (
                      <React.Fragment>
                        <label>Caducidad</label>
                        {formData.idExpiration && formData.idExpiration.datePurchase && (
                          <React.Fragment>
                            <Row mt="0px" mb="0px">
                              <VariableText fontSize='0.7rem' variable="datePurchase" value={toISOStringLocal(formData.idExpiration.datePurchase).split('T')[0]} />
                            </Row>
                            <Row mt="0px" mb="0px">
                              <VariableText fontSize='0.7rem' variable="dateExpiration" value={toISOStringLocal(formData.idExpiration.dateExpiration).split('T')[0]} />
                            </Row>
                            <Row mt="0px" mb="0px">
                              <VariableText fontSize='0.7rem' variable="daysToExpiration" value={getDaysBetweenDates(formData.idExpiration.datePurchase, formData.idExpiration.dateExpiration).toString()} />
                            </Row>
                          </React.Fragment>
                        )}
                        <Row mt="0px" mb="0px">
                          <Column alignment='right'>
                            <button
                              className={styles.simpleButtonForForm}
                              onClick={() => {
                                if (formData.idExpiration) {
                                  onEditCaducidad(RemoteCaducidadDataToModel(formData.idExpiration));
                                }
                              }}
                            >
                              Editar
                            </button>
                          </Column>
                        </Row>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <label>Configurar Caducidad</label>
                      </React.Fragment>
                    )}
                    <React.Fragment>
                      <CaducidadForm
                        elementToEdit={elementToEditCaducidad}
                        onCleanData={onCleanDataCaducidad}
                        onCreateCaducidadId={onCreateCaducidadId}
                        onRefreshCaducidads={onRefreshCaducidads}
                        mode="subform"
                        hideButton={!formData.idExpiration || (typeof formData.idExpiration === 'object' && Object.keys(formData.idExpiration).length > 0)}
                      />
                    </React.Fragment>
                  </Column>
                </Row>
              )}
              <Row>
                <Column>
                  <label>Categorías</label>
                  <select name="itemLabel" value={formData.itemLabel} onChange={handleChangeTextAndSelect}>
                    <option value="Diezmo">Diezmo</option>
                    <option value="Alimento">Alimento</option>
                    <option value="Consumible">Consumible</option>
                    <option value="Dispositivo">Dispositivo</option>
                    <option value="Herramienta">Herramienta</option>
                    <option value="Electrodomestico">Electrodomestico</option>
                    <option value="Maquina">Maquina</option>
                    <option value="Mueble">Mueble</option>
                    <option value="Servicio">Servicio</option>
                    <option value="Streaming">Streaming</option>
                    <option value="Entretenimiento - Videojuego">Entretenimiento - Videojuego</option>
                    <option value="Entretenimiento - Pelicula">Entretenimiento - Pelicula</option>
                    <option value="Entretenimiento - Juegos">Entretenimiento - Juegos</option>
                    <option value="Entretenimiento - Salida">Entretenimiento - Salida</option>
                    <option value="Entretenimiento - Viaje">Entretenimiento - Viaje</option>
                    <option value="Hobbies">Hobbies</option>
                    <option value="Comunicacion">Comunicaciones</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Vuelos">Vuelos</option>
                    <option value="Higiene">Higiene</option>
                    <option value="Salud">Salud</option>
                    <option value="Ropa">Ropa</option>
                  </select>
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Categoría de presupuesto</label>
                  <select name="budgetCategory" value={formData.budgetCategory} onChange={handleChangeTextAndSelect}>
                    <option value="Diezmo">Diezmo</option>
                    <option value="Basic">Necesidades</option>
                    <option value="Desires">Deseos</option>
                    <option value="External">Ajenos</option>
                    <option value="Philanthropic">Filantrópicos</option>
                    <option value="AssetsRentable">Activos - Rentables</option> 
                    <option value="SuppliesRentable">Insumos - Rentables</option>
                    <option value="OperativeRentable">Operativo - Rentables</option>
                    <option value="AssetsNonRentable">Activos - No Rentables</option>
                    <option value="SuppliesNonRentable">Insumos - No Rentables</option>
                    <option value="OperativeNonRentable">Operativo - No Rentables</option>
                  </select>
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Tipo de Articulo</label>
                  <select name="itemType" value={formData.itemType} onChange={handleChangeTextAndSelect}>
                    <option value="Diezmo">Diezmo</option>
                    <option value="Perishable">Producto perecedero</option>
                    <option value="Consumible">Producto consumible</option>
                    <option value="HumanService">Servicio Humano</option>
                    <option value="DigitalService">Servicio Digital</option>
                    <option value="SoftwareAsService">Software como Servicio</option>
                    <option value="ShortLife">Producto con obsolescencia</option>
                    <option value="LongLife">Producto con larga vida</option>
                  </select>
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Proposito</label>
                  <select name="purpose" value={formData.purpose} onChange={handleChangeTextAndSelect}>
                    <option value="Diezmo">Diezmo</option>
                    <option value="Needs">Necesidades Básicas</option>
                    <option value="Lifestyle">Estilo de vida</option>
                    <option value="Audiovisual">Entretenimiento - Audiovisuales</option>
                    <option value="Family">Entretenimiento - Familiar</option>
                    <option value="Business">Rentable - Negocio</option>
                    <option value="Career">Rentable - Carrera</option>
                    <option value="Travel">Viajes</option>
                    <option value="Outings">Salidas</option>
                    <option value="Gifts">Regalos</option>
                    <option value="Filantropics">Filantrópicos</option>
                    <option value="Others">Otros</option>
                  </select>
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Potencialidad</label>
                  <select name="potential" value={formData.potential} onChange={handleChangeTextAndSelect}>
                    <option value="Diezmo">Diezmo</option>
                    <option value="Non-sellable">No vendible</option>
                    <option value="Sellable">Vendible</option>
                    <option value="Rentable">Rentable</option>
                  </select>
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Razón de potencialidad</label>
                  <select name="potentialReason" value={formData.potentialReason} onChange={handleChangeTextAndSelect}>
                    <option value="Diezmo">Diezmo</option>
                    <option value="Perishable">No - Perecedero</option>
                    <option value="Service">No - Servicio</option>
                    <option value="Consumable">Si - Consumible/Insumo</option>
                    <option value="Active">Si - Activo</option>
                    <option value="Demand">Si - Demanda</option>
                  </select>
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Inventario</label>
                  <input type="text" name="idInventory" value={formData.idInventory} onChange={handleChangeTextAndSelect} />
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Categorías de Inventario</label>
                  <input type="text" name="inventoryCategory1" value={formData.inventoryCategory1} onChange={handleChangeTextAndSelect} />
                  <input type="text" name="inventoryCategory2" value={formData.inventoryCategory2} onChange={handleChangeTextAndSelect} />
                  <input type="text" name="inventoryCategory3" value={formData.inventoryCategory3} onChange={handleChangeTextAndSelect} />
                  <input type="text" name="inventoryCategory4" value={formData.inventoryCategory4} onChange={handleChangeTextAndSelect} />
                  <input type="text" name="inventoryCategory5" value={formData.inventoryCategory5} onChange={handleChangeTextAndSelect} />
                </Column>
              </Row>
              <Row>
                <Column mt="20px">
                  <label><CenteredLabel>Tipo de medición</CenteredLabel></label>
                  <FormControlLabel control={<Switch checked={formData.measurable} onChange={(event, checked) => handleChangeCheckbox('measurable', checked)} />} label="Medible" />
                </Column>
              </Row>
              {formData.measurable && (
                <Row>
                  <Column>
                    <label>Tipo de medida</label>
                    <select name="measureType" value={formData.measureType} onChange={handleChangeTextAndSelect}>
                      <option value="consumption">Consumo</option>
                      <option value="usage">Uso</option>
                      <option value="rentability">Rentabilidad</option>
                    </select>
                  </Column>
                </Row>
              )}
              {elementToEdit && elementToEdit._id !== '' && (
                <React.Fragment>
                  <Row>
                    <Column mt="20px">
                      <label><CenteredLabel>Historial de consumo</CenteredLabel></label>
                      <ConsumptionForm
                        elementToEdit={elementToEditConsumption}
                        onCleanData={onCleanDataConsumption}
                        onCreateConsumptionId={onCreateConsumptionId}
                        onRefreshConsumptions={onRefreshConsumptions}
                        mode="subform"
                        idPurchaseItemStory={elementToEdit._id}
                      />
                      
                      <div style={{ border: '1px solid gray', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', margin: '10px 0' }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                Text
                              </TableCell>
                              <TableCell>
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                          {formData.idsConsumptionHistory.map((consumption: any, index: number) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>
                                <VariableText variable={`${toISOStringLocal(consumption.date).split('T')[0]} ${formData.measureType === 'consumption' ? 'Consumo' : formData.measureType === 'usage' ? 'Uso' : 'Rentabilidad'}`} value={`${consumption.quantityConsumed.toString()} ${consumption.type} - $${consumption.cost.toFixed(2)}`} />
                                </TableCell>
                                <TableCell>
                                  <IconButton onClick={() => onEditConsumption(RemoteConsumptionDataToModel(consumption))}>
                                      <FaButtonEdit />
                                  </IconButton>
                                  <IconButton onClick={() => onDeleteConsumption(consumption._id)}>
                                    <FaButtonDelete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                          </TableBody>
                        </Table>
                      </div>
                      {formData.idsConsumptionHistory.length > 0 && (
                        <VariableText variable="Cantidad Restante" value={formData.leftQuantity.toString()} />
                      )}
                    </Column>
                  </Row>
                </React.Fragment>
              )}
              <Row>
                <Column>
                  <label>Estado</label>
                  <select name="status" value={formData.status} onChange={handleChangeTextAndSelect}>
                    {formData.copyInventoryItem.idParamConfig.states_list.map((state: any, index: number) => {
                      return <option key={index} value={state}>{state}</option>
                    })}
                  </select>
                </Column>
              </Row>
              <div className={styles.buttons}>
                <button className={`${styles.button} ${styles.submitButton}`}
                  disabled={loadingSubmit || (formData.expires && (!formData.idExpiration || Object.keys(formData.idExpiration).length === 0))}
                  style={{
                    backgroundColor: (formData.expires && (!formData.idExpiration || Object.keys(formData.idExpiration).length === 0)) ? 'gray' : '#0070f3'
                  }}
                  onClick={onSubmitPurchaseItemStory}
                >
                  {loadingSubmit ? 'Actualizando...' : (elementToEdit ? 'Actualizar' : 'Agregar')}
                </button>
              </div>
            </CustomForm>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default PurchaseItemStoryForm;
