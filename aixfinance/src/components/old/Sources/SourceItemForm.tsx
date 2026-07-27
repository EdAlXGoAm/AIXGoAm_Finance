import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importa los estilos de ReactQuill
import styles from '../../commonForm/floatingForm.module.css';
import { SourceItemModel, RemoteSourceItemData } from '../../services/apiSourceItem';
import { SourceItemFormElements } from './SourceItemFormElements';
import { Row, Column, RowForm, FormulasContainer, FormulaLabel, CustomForm, VariableText } from '../../utils/formatUtils';
import { RemoteSourceData } from '@/services/apiSource';
import { CenteredSelect } from '@/utils/textUtils';
import ImageSelect from '@/utils/CustomSelector/ImageSelect';
import ParamConfigForm from '../Alimentos/ParamConfigForm';
import { ButtonCircle, ButtonRectangle, ButtonSubmit } from '@/commonForm/FrontButtons';

interface SourceItemsFormProps {
  onCleanElementToEdit: () => void;
  elementToEdit?: SourceItemModel;
  hideButton?: boolean;
  mode?: 'floating' | 'subform';
  onAddResponse: (response: RemoteSourceItemData) => void;
  onUpdateResponse: (response: RemoteSourceItemData) => void;
  newTriggeredFromExternalComponent?: boolean;
  setNewTriggeredFromExternalComponent?: (value: boolean) => void;
  idSourceTriggeredFromExternalComponent?: RemoteSourceData | null;
}

const SourceItemsForm: React.FC<SourceItemsFormProps> = ({
  elementToEdit,
  onCleanElementToEdit,
  hideButton,
  mode,
  onAddResponse,
  onUpdateResponse,
  newTriggeredFromExternalComponent,
  setNewTriggeredFromExternalComponent,
  idSourceTriggeredFromExternalComponent
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
    handleChangeImageSelect,
    handleChangeTextAndSelect,
    handleChangeWithValidation,
    handleChangeList,
    handleAddListItem,
    handleRemoveListItem,
    handleSubmitWithResponse,
    handleFocus,
    handleBlur,

    sourceOptions,

    elementToEditParamConfig,
    onCleanElementToEditParamConfig,
    onEditElementToEditParamConfig,
    RemoteParamConfigDataToModel,

    onSubmitInventoryItem,
    handleChangeRichText
  } = SourceItemForm+Elements({
    onCleanElementToEdit,
    elementToEdit,
    onAddResponse,
    onUpdateResponse,
    newTriggeredFromExternalComponent,
    setNewTriggeredFromExternalComponent,
    idSourceTriggeredFromExternalComponent
  });

  return (
    <React.Fragment>
      {!elementToEdit && (
        mode === 'floating' ? (
          <ButtonCircle
            textToShow="Item de Fuente"
            positionX={100+(80*2)}
            positionY={100}
            action={handleCreateNewElement}
          />
        ) : (
          <ButtonRectangle
            textToShow="Agregar Item a la Fuente"
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
            <h2>{elementToEdit ? 'Editar Item' : 'Agregar Item a la Fuente'}</h2>
            <CustomForm>
              {/* formData.idSource */}
              <RowForm>
                <CenteredSelect label="Fuente" width="50%">
                  <ImageSelect
                    options={sourceOptions}
                    value={formData.idSource}
                    onChange={(value) => handleChangeImageSelect('idSource', value)}
                    compareFn={(a, b) => a._id === b._id}
                  />
                </CenteredSelect>
              </RowForm>
              {/* formData.name */}
              <RowForm>
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChangeTextAndSelect}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </RowForm>
              {/* formData.providerName */}
              <RowForm>
                <label>Proveedor</label>
                <input
                  type="text"
                  name="providerName"
                  value={formData.providerName}
                  onChange={handleChangeTextAndSelect}
                />
              </RowForm>
              {/* formData.description */}
              <RowForm>
                <label>Descripción</label>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(content) => handleChangeRichText('description', content)}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                  formats={[
                    'header',
                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet', 'indent',
                    'link', 'image'
                  ]}
                />
              </RowForm>
              {/* formData.price */}
              <RowForm>
                <label>Precio</label>
                <input
                  type="text"
                  name="price"
                  value={displayData.price}
                  onChange={handleChangeWithValidation}
                  required
                />
                {displayError.price && <p className={styles.error}>{displayError.price}</p>}
              </RowForm>
              {/* formData.idParamConfig */}
              <RowForm>
                <Column width='80%' alignment='center' border={true} mt="10px">
                  {Object.keys(formData.idParamConfig).length !== 0 ? (
                    <React.Fragment>
                      <label>Parametros de Conversion</label>
                      <div className={styles.boxInfoContainer}>
                        <div className={styles.columnBoxInfo}>
                          <Row mt="0px" mb="0px">
                            <VariableText fontSize='0.7rem' variable="quantity_unit" value={formData.idParamConfig.quantity_unit} />
                          </Row>
                          <Row mt="0px" mb="0px">
                            <VariableText fontSize='0.7rem' variable="weight_unit" value={formData.idParamConfig.weight_unit} />
                          </Row>
                          <Row mt="0px" mb="0px">
                            <VariableText fontSize='0.7rem' variable="volume_unit" value={formData.idParamConfig.volume_unit} />
                          </Row>
                          <Row mt="0px" mb="0px">
                            <VariableText fontSize='0.7rem' variable="time_unit" value={formData.idParamConfig.time_unit} />
                          </Row>
                        </div>
                        <div className={styles.columnBoxInfo}>
                          <Row mt="0px" mb="0px">
                            <VariableText fontSize='0.7rem' variable="default_unit" value={formData.idParamConfig.default_unit} />
                          </Row>
                          <Row mt="0px" mb="0px">
                            <VariableText fontSize='0.7rem' variable="reference_unit" value={formData.idParamConfig.reference_unit} />
                          </Row>
                        </div>
                      </div>
                      <Row mt="0px" mb="0px">
                        <Column alignment='right'>
                          <button
                            className={styles.simpleButtonForForm}
                            onClick={() => {
                              onEditElementToEditParamConfig(RemoteParamConfigDataToModel(formData.idParamConfig));
                            }}
                          >
                            Editar
                          </button>
                        </Column>
                      </Row>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <label>Configurar Parametros de Conversion</label>
                    </React.Fragment>
                  )}
                  <React.Fragment>
                    <ParamConfigForm
                      onCleanElementToEdit={onCleanElementToEditParamConfig}
                      elementToEdit={elementToEditParamConfig}
                      hideButton={Object.keys(formData.idParamConfig).length !== 0}
                      mode="subform"
                      onAddResponse={(response) => {
                        setFormData((prev: any) => {
                          const newFormData = { ...prev };
                          newFormData.idParamConfig = response;
                          return newFormData;
                        });
                      }}
                      onUpdateResponse={(response) => {
                        setFormData((prev: any) => ({ ...prev, idParamConfig: response }));
                      }}
                    />
                  </React.Fragment>
                </Column>
              </RowForm>
              {Object.keys(formData.idParamConfig).length !== 0 && (
                <React.Fragment>
                  {/* formData.quantity */}
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
                      {displayError.quantity && <p className={styles.error}>{displayError.quantity}</p>}
                    </Column>
                    <Column>
                      <label>Unidad</label>
                      <label>{formData.idParamConfig.quantity_unit}</label>
                    </Column>
                  </Row>
                  {/* formData.weight */}
                  <Row>
                    <Column>
                      <label>Peso</label>
                      <input
                        type="text"
                        name="weight"
                        value={displayData.weight}
                        onChange={handleChangeWithValidation}
                        required
                      />
                      {displayError.weight && <p className={styles.error}>{displayError.weight}</p>}
                    </Column>
                    <Column>
                      <label>Unidad</label>
                      <label>{formData.idParamConfig.weight_unit}</label>
                    </Column>
                  </Row>
                  {/* formData.volume */}
                  <Row>
                    <Column>
                      <label>Volumen</label>
                      <input
                        type="text"
                        name="volume"
                        value={displayData.volume}
                        onChange={handleChangeWithValidation}
                        required
                      />
                      {displayError.volume && <p className={styles.error}>{displayError.volume}</p>}
                    </Column>
                    <Column>
                      <label>Unidad</label>
                      <label>{formData.idParamConfig.volume_unit}</label>
                    </Column>
                  </Row>
                  {/* formData.time */}
                  <Row>
                    <Column>
                      <label>Tiempo</label>
                      <input
                        type="text"
                        name="time"
                        value={displayData.time}
                        onChange={handleChangeWithValidation}
                        required
                      />
                      {displayError.time && <p className={styles.error}>{displayError.time}</p>}
                    </Column>
                    <Column>
                      <label>Unidad</label>
                      <label>{formData.idParamConfig.time_unit}</label>
                    </Column>
                  </Row>
                </React.Fragment>
              )}
              {/* formData.link */}
              <RowForm>
                <label>Link</label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleChangeTextAndSelect}
                  />
              </RowForm>
              {/* formData.image */}
              <RowForm>
                <label>Imagen URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChangeTextAndSelect}
                />
              </RowForm>
              {error && <p className={styles.error}>{error}</p>}
              <ButtonSubmit
                actionText={elementToEdit ? 'Actualizar' : 'Agregar'}
                loading={loadingSubmit}
                action={onSubmitInventoryItem}
              />
            </CustomForm>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default SourceItemsForm;
