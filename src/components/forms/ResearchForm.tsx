import { FieldArray, Form, Formik } from 'formik';
import { filter, map, some } from 'lodash';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import { getLocationList, Research, useFishTypes } from '../../utils';
import api from '../../utils/api';
import Button from '../buttons/Button';
import SwitchButton from '../buttons/SwitchButton';
import AsyncSelectField from '../fields/AsyncSelect';
import DateField from '../fields/DateField';
import DragAndDropUploadField from '../fields/DragAndDropField';
import NumericTextField from '../fields/NumericTextField';
import TextField from '../fields/TextField';
import { Grid } from '../other/CommonStyles';
import DrawMap from '../other/DrawMap';
import ResearchFishItem from '../other/ResearchFishItem';

export enum FormTypes {
  UETK = 'UETK',
  NOT_UETK = 'NOT_UETK',
}

const ResearchTypeOptions = [
  { label: 'UETK objektas', value: FormTypes.UETK },
  { label: 'Ne UETK objektas', value: FormTypes.NOT_UETK },
];

export interface ResearchProps extends Research {
  formType?: FormTypes;
}

const ResearchForm = ({
  initialValues,
  onSubmit,
  disableMainFields = false,
}: {
  initialValues: ResearchProps;
  onSubmit: (values: ResearchProps) => void;
  disableMainFields?: boolean;
}) => {
  const { fishTypes } = useFishTypes();

  const uploadedFiletMutation = useMutation((files: File[]) => api.uploadFiles(files));

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validateOnChange={false}
      // validationSchema={() => {}}
    >
      {({ values, errors, setFieldValue, resetForm }: any) => {
        const isUetkFormType = values.formType === FormTypes.UETK;

        return (
          <FormContainer>
            <SwitchButton
              options={ResearchTypeOptions}
              value={values.formType}
              onChange={(value: string) => {
                if (disableMainFields) return;

                resetForm();
                setFieldValue('formType', value);
              }}
            />
            <Grid columns={1}>
              {isUetkFormType && (
                <AsyncSelectField
                  name={'location'}
                  label={'Vandens telkinys'}
                  value={{ cadastralId: values.cadastralId, ...values?.waterBodyData }}
                  error={errors.cadastralId}
                  onChange={(value: any) => {
                    const { name, municipality, area, cadastralId } = value;
                    setFieldValue('cadastralId', cadastralId);
                    setFieldValue('waterBodyData', { name, municipality, area });
                  }}
                  getOptionValue={(option: string) => option}
                  getInputLabel={(data) => {
                    const { name, municipality, area, cadastralId } = data;
                    return `${name || ''} ${cadastralId || ''} ${municipality || ''}  ${
                      area || ''
                    }`;
                  }}
                  showError={false}
                  getOptionLabel={(option: any) => {
                    const { name, municipality, area, cadastralId } = option;
                    return `${name} ${cadastralId} ${municipality}  ${area}`;
                  }}
                  loadOptions={(input: string, page: number | string) =>
                    getLocationList(input, page, {})
                  }
                />
              )}
              {!isUetkFormType && (
                <>
                  <Grid columns={2}>
                    <TextField
                      label={'Vandens telkinio pavadinimas'}
                      name="waterBodyDataName"
                      value={values.waterBodyData?.name}
                      error={errors.waterBodyData?.name}
                      onChange={(value) => setFieldValue('waterBodyData.name', value)}
                    />
                    <TextField
                      label={'Vandens telkinio plotas'}
                      name="waterBodyDataArea"
                      value={values.waterBodyData?.area}
                      error={errors.waterBodyData?.area}
                      onChange={(value) => setFieldValue('waterBodyData.area', value)}
                    />
                  </Grid>
                  <Grid columns={1}>
                    <DrawMap
                      label="Vandens telkinio vieta"
                      value={values?.geom!}
                      error={errors?.geom}
                      onSave={(data) => setFieldValue('geom', data)}
                      height={'300px'}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Grid columns={2}>
              <DateField
                name={'startAt'}
                label={'Mokslinio tyrimo pradžia'}
                value={values.startAt}
                error={errors.startAt}
                onChange={(startAt) => setFieldValue('startAt', startAt)}
              />
              <DateField
                name={'endAt'}
                label={'Mokslinio tyrimo pabaiga'}
                value={values.endAt}
                error={errors.endAt}
                onChange={(endAt) => setFieldValue('endAt', endAt)}
              />
            </Grid>
            {!isUetkFormType && (
              <>
                <Grid columns={1}>
                  <div>
                    <FormLabel>
                      Ankstesniais metais bendras žuvų gausumas ir biomasė, išteklių būklės indeksas
                    </FormLabel>
                    <FormSubLabel>
                      Laimikyje, perskaičiuotame standartizuotai žvejybos pastangai vienu selektyviu
                      tinklu
                    </FormSubLabel>
                  </div>
                </Grid>
                <Grid columns={2}>
                  <TextField
                    label={'Metai'}
                    name="previousResearchDataYear"
                    value={values.previousResearchData?.year}
                    error={errors.previousResearchData?.year}
                    onChange={(value) => {
                      const yearPattern = /^(?:1000|[1-9]\d{0,3})?$/;
                      if (yearPattern.test(value)) {
                        setFieldValue('previousResearchData.year', value);
                      }
                    }}
                  />
                  <NumericTextField
                    label={'Išteklių būklės indeksas'}
                    name="conditionIndex"
                    value={values?.previousResearchData?.conditionIndex}
                    error={errors?.previousResearchData?.conditionIndex}
                    onChange={(e) =>
                      setFieldValue('previousResearchData.conditionIndex', Number(e))
                    }
                    digitsAfterComma={2}
                  />
                  <NumericTextField
                    label={'Bendras žuvų gausumas'}
                    name="previousResearchDataTotalAbundance"
                    value={values?.previousResearchData?.totalAbundance}
                    error={errors?.previousResearchData?.totalAbundance}
                    onChange={(e) =>
                      setFieldValue('previousResearchData.totalAbundance', Number(e))
                    }
                  />
                  <NumericTextField
                    label={'Bendras žuvų gausumas'}
                    name="previousResearchDataTotalBiomass"
                    value={values?.previousResearchData?.totalBiomass}
                    error={errors?.previousResearchData?.totalBiomass}
                    onChange={(e) => setFieldValue('previousResearchData.totalBiomass', Number(e))}
                  />
                </Grid>
              </>
            )}
            <Grid columns={1}>
              <FormLabel>Atskirų žuvų rūšių gausumas ir biomasė</FormLabel>
            </Grid>
            <FieldArray
              name="fishes"
              render={(arrayHelpers) => (
                <Grid columns={1}>
                  {map(values.fishes, (currentFish, index: number) => {
                    const rowErrors = errors?.fishes?.[index];
                    const showDelete = values?.fishes?.length! > 1;

                    const filteredFishTypes = filter(
                      fishTypes,
                      (fishType) =>
                        !some(
                          values.fishes,
                          (fish) =>
                            fish.fishType?.id === fishType.id &&
                            fishType.id !== currentFish.fishType?.id,
                        ),
                    );

                    return (
                      <ResearchFishItem
                        fishTypes={filteredFishTypes}
                        fish={currentFish}
                        onSetFieldValue={setFieldValue}
                        onDelete={(index) => arrayHelpers.remove(index)}
                        index={index}
                        errors={rowErrors}
                        showDelete={showDelete}
                      />
                    );
                  })}
                  <AddFishButton
                    onClick={() =>
                      arrayHelpers.push({
                        fishType: {},
                        abundance: '',
                        abundancePercentage: '',
                        biomass: '',
                        biomassPercentage: '',
                      })
                    }
                  >
                    Pridėti žuvį
                  </AddFishButton>
                </Grid>
              )}
            />
            <Grid columns={1}>
              <FormLabel>Žuvų išteklių būklės indeksas</FormLabel>
            </Grid>
            <Grid columns={2}>
              <NumericTextField
                label={'Plėšrių žuvų santykinis gausumas'}
                name="predatoryFishesRelativeAbundance"
                value={values.predatoryFishesRelativeAbundance}
                error={errors.predatoryFishesRelativeAbundance}
                onChange={(value) => setFieldValue('predatoryFishesRelativeAbundance', value)}
                digitsAfterComma={2}
              />
              <NumericTextField
                label={'Plėšrių žuvų santykinė biomasė'}
                name="predatoryFishesRelativeBiomass"
                value={values.predatoryFishesRelativeBiomass}
                error={errors.predatoryFishesRelativeBiomass}
                onChange={(value) => setFieldValue('predatoryFishesRelativeBiomass', value)}
                digitsAfterComma={2}
              />
            </Grid>
            <Grid columns={1}>
              <NumericTextField
                label={'Vidutinis individo svoris (gausumas/biomasė)'}
                name="averageWeight"
                value={values.averageWeight}
                error={errors.averageWeight}
                onChange={(value) => setFieldValue('averageWeight', value)}
                digitsAfterComma={2}
              />
              <NumericTextField
                label={'Vertingų, leidžiamo sužvejoti dydžio žuvų santykinė biomasė'}
                name="valuableFishesRelativeBiomass"
                value={values.valuableFishesRelativeBiomass}
                error={errors.valuableFishesRelativeBiomass}
                onChange={(e) => setFieldValue('valuableFishesRelativeBiomass', Number(e))}
                digitsAfterComma={2}
              />
              <NumericTextField
                label={'Išteklių būklės indeksas'}
                name="conditionIndex"
                value={values.conditionIndex}
                error={errors.conditionIndex}
                onChange={(e) => setFieldValue('conditionIndex', Number(e))}
                digitsAfterComma={2}
              />
            </Grid>
            <Grid columns={1}>
              <DragAndDropUploadField
                files={values.files}
                label={'Mokslinio tyrimo dokumentas'}
                onUpload={async (files) => {
                  const uploadedFiles = await uploadedFiletMutation.mutateAsync(files);
                  setFieldValue('files', uploadedFiles);
                }}
                onDelete={(files: File[]) => setFieldValue('file', files)}
              />
            </Grid>
            <Button type="submit" loading={false} disabled={false}>
              Saugoti
            </Button>
          </FormContainer>
        );
      }}
    </Formik>
  );
};

const FormContainer = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.div`
  height: 21px;
  font-size: 1.6rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.royalBlue};
  opacity: 1;
`;

const FormSubLabel = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AddFishButton = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.lightSteelBlue};
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  position: relative;
  background-color: white;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.royalBlue};
  font-size: 1.6rem;
  line-height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ResearchForm;
