import { FieldArray, Form, Formik } from 'formik';
import { filter, map, some } from 'lodash';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import { getLocationList, handleAlert, isNew, Research, slugs, useFishTypes } from '../../utils';
import { validationTexts } from '../../utils/texts';
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
import LoaderComponent from '../other/LoaderComponent';
import ResearchFishItem from '../other/ResearchFishItem';
import { Location } from '../../utils/types';

enum FormTypes {
  UETK = 'UETK',
  NOT_UETK = 'NOT_UETK',
}

const ResearchTypeOptions = [
  { label: 'UETK objektas', value: FormTypes.UETK },
  { label: 'Ne UETK objektas', value: FormTypes.NOT_UETK },
];

interface ResearchProps extends Research {
  formType?: FormTypes;
}

const validateSchema = Yup.object().shape({
  startAt: Yup.date().required(validationTexts.requireSelect).nullable(),
  endAt: Yup.date().required(validationTexts.requireSelect).nullable(),
  cadastralId: Yup.string().when('formType', (formType: any, schema) => {
    if (formType[0] === FormTypes.UETK) {
      return schema.required(validationTexts.requireText);
    }
    return schema.nullable();
  }),
  geom: Yup.object().when('formType', (formType: any, schema) => {
    if (formType[0] === FormTypes.NOT_UETK) {
      return schema.required(validationTexts.requireText);
    }
    return schema.nullable();
  }),
  files: Yup.array()
    .required(validationTexts.requireSelect)
    .min(1, validationTexts.requireSelect)
    .nullable(),
  fishes: Yup.array().of(
    Yup.object().shape({
      fishType: Yup.object().required(validationTexts.requireText),
      abundance: Yup.string().required(validationTexts.requireText),
      abundancePercentage: Yup.string().required(validationTexts.requireText),
      biomass: Yup.string().required(validationTexts.requireText),
      biomassPercentage: Yup.string().required(validationTexts.requireText),
    }),
  ),
  waterBodyData: Yup.object().when('formType', (formType: any, schema) => {
    if (formType[0] === FormTypes.NOT_UETK) {
      return schema.shape({
        name: Yup.string().required(validationTexts.requireText),
        area: Yup.string().required(validationTexts.requireText),
      });
    }
    return schema.nullable();
  }),
  predatoryFishesRelativeAbundance: Yup.string().required(validationTexts.requireText),
  predatoryFishesRelativeBiomass: Yup.string().required(validationTexts.requireText),
  averageWeight: Yup.string().required(validationTexts.requireText),
  valuableFishesRelativeBiomass: Yup.string().required(validationTexts.requireText),
  conditionIndex: Yup.string().required(validationTexts.requireText),
});

const ResearchForm = () => {
  const { fishTypes } = useFishTypes();
  const uploadedFiletMutation = useMutation((files: File[]) => api.uploadFiles(files));
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const disableMainFields = !isNew(id);

  const { data: research, isLoading: researchLoading } = useQuery(
    ['research', id],
    () => api.getResearch(id),
    { retry: false, enabled: !isNew(id) },
  );

  const updateResearch = useMutation((values: any) => api.updateResearch(values, id!), {
    onError: ({ response }: any) => {
      handleAlert(response);
    },
    onSuccess: () => {
      navigate(slugs.researches);
    },
  });

  const createResearch = useMutation(api.createResearch, {
    onError: ({ response }: any) => {
      handleAlert(response);
    },
    onSuccess: () => {
      navigate(slugs.researches);
    },
  });

  const formValues = !isNew(id)
    ? {
        ...research,
        formType: !research?.cadastralId ? FormTypes.NOT_UETK : FormTypes.UETK,
      }
    : {
        cadastralId: '',
        formType: FormTypes.UETK,
        waterBodyData: {
          name: '',
          municipality: '',
          area: '',
        },
        startAt: undefined,
        endAt: undefined,
        predatoryFishesRelativeAbundance: '',
        predatoryFishesRelativeBiomass: '',
        averageWeight: '',
        valuableFishesRelativeBiomass: '',
        conditionIndex: '',
        files: [],
        previousResearchData: {
          year: '',
          conditionIndex: '',
          totalAbundance: '',
          totalBiomass: '',
        },
        fishes: [
          {
            fishType: undefined,
            abundance: '',
            abundancePercentage: '',
            biomass: '',
            biomassPercentage: '',
          },
        ],
      };

  const handleSubmit = (values: ResearchProps) => {
    const { formType, cadastralId, previousResearchData, geom, ...rest } = values;
    const isUetkFormType = values.formType === FormTypes.UETK;
    const params = {
      ...rest,
      ...(!!isUetkFormType && { cadastralId }),
      ...(!isUetkFormType && { previousResearchData, geom }),
      fishes: rest.fishes?.map((fish) => {
        return {
          ...fish,
          fishType: fish.fishType?.id,
        };
      }),
    };
    isNew(id) ? createResearch.mutateAsync(params) : updateResearch.mutateAsync(params);
  };

  const submitLoading = [createResearch.isLoading, updateResearch.isLoading].some(
    (loading) => loading,
  );

  if (researchLoading) return <LoaderComponent />;

  const getWaterBodyLabel = (option: Location) => {
    const { name, municipality, area, cadastralId } = option;
    if (!name) return '';

    const areaValue = area ? `${(area / 10000).toFixed(3)} ha` : '';

    return `${name || ''} ${cadastralId || ''} ${municipality || ''}  ${areaValue}`;
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={formValues}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validationSchema={validateSchema}
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
            <Grid $columns={1}>
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
                  getInputLabel={getWaterBodyLabel}
                  showError={false}
                  getOptionLabel={getWaterBodyLabel}
                  loadOptions={(input: string, page: number | string) =>
                    getLocationList(input, page)
                  }
                />
              )}
              {!isUetkFormType && (
                <>
                  <Grid $columns={2}>
                    <TextField
                      label={'Vandens telkinio pavadinimas'}
                      name="waterBodyDataName"
                      value={values.waterBodyData?.name}
                      error={errors.waterBodyData?.name}
                      onChange={(value) => setFieldValue('waterBodyData.name', value)}
                    />
                    <NumericTextField
                      label={'Vandens telkinio plotas'}
                      name="waterBodyDataArea"
                      value={values.waterBodyData?.area}
                      error={errors.waterBodyData?.area}
                      onChange={(value) => setFieldValue('waterBodyData.area', value)}
                      rightIcon={<MeasurementLabel>ha</MeasurementLabel>}
                      digitsAfterComma={3}
                    />
                  </Grid>
                  <Grid $columns={1}>
                    <DrawMap
                      label="Vandens telkinio vieta"
                      value={values?.geom}
                      error={errors?.geom}
                      onSave={(data) => setFieldValue('geom', data)}
                      height={'300px'}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Grid $columns={2}>
              <DateField
                name={'startAt'}
                label={'Mokslinio tyrimo pradžia'}
                value={values.startAt}
                maxDate={values.endAt}
                error={errors.startAt}
                onChange={(startAt) => setFieldValue('startAt', startAt)}
              />
              <DateField
                name={'endAt'}
                label={'Mokslinio tyrimo pabaiga'}
                value={values.endAt}
                minDate={values.startAt}
                error={errors.endAt}
                onChange={(endAt) => setFieldValue('endAt', endAt)}
              />
            </Grid>
            {!isUetkFormType && (
              <>
                <Grid $columns={1}>
                  <Gap>
                    <FormLabel>
                      Ankstesniais metais bendras žuvų gausumas ir biomasė, išteklių būklės indeksas
                    </FormLabel>
                    <FormSubLabel>
                      Laimikyje, perskaičiuotame standartizuotai žvejybos pastangai vienu selektyviu
                      tinklu
                    </FormSubLabel>
                  </Gap>
                </Grid>
                <Grid $columns={2}>
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
                    onChange={(e) => setFieldValue('previousResearchData.conditionIndex', e)}
                    digitsAfterComma={2}
                  />
                  <NumericTextField
                    label={'Bendras žuvų gausumas'}
                    name="previousResearchDataTotalAbundance"
                    value={values?.previousResearchData?.totalAbundance}
                    error={errors?.previousResearchData?.totalAbundance}
                    rightIcon={<MeasurementLabel>vnt./ha</MeasurementLabel>}
                    onChange={(e) => setFieldValue('previousResearchData.totalAbundance', e)}
                  />
                  <NumericTextField
                    label={'Bendras žuvų gausumas'}
                    name="previousResearchDataTotalBiomass"
                    value={values?.previousResearchData?.totalBiomass}
                    error={errors?.previousResearchData?.totalBiomass}
                    rightIcon={<MeasurementLabel>kg/ha</MeasurementLabel>}
                    onChange={(e) => setFieldValue('previousResearchData.totalBiomass', e)}
                  />
                </Grid>
              </>
            )}
            <Grid $columns={1}>
              <FormLabel>Atskirų žuvų rūšių gausumas ir biomasė</FormLabel>
            </Grid>
            <FieldArray
              name="fishes"
              render={(arrayHelpers) => (
                <Grid $columns={1}>
                  {map(values.fishes, (currentFish, index: number) => {
                    const rowErrors = errors?.fishes?.[index];
                    const showDelete = values?.fishes?.length > 1;

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
                        fishType: undefined,
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
            <Grid $columns={1}>
              <FormLabel>Žuvų išteklių būklės indeksas</FormLabel>
            </Grid>
            <Grid $columns={2}>
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
            <Grid $columns={1}>
              <NumericTextField
                label={'Vidutinis individo svoris (gausumas/biomasė)'}
                name="averageWeight"
                value={values.averageWeight}
                error={errors.averageWeight}
                onChange={(value) => setFieldValue('averageWeight', value)}
                rightIcon={<MeasurementLabel>g</MeasurementLabel>}
                digitsAfterComma={2}
              />
              <NumericTextField
                label={'Vertingų, leidžiamo sužvejoti dydžio žuvų santykinė biomasė'}
                name="valuableFishesRelativeBiomass"
                value={values.valuableFishesRelativeBiomass}
                error={errors.valuableFishesRelativeBiomass}
                onChange={(e) => setFieldValue('valuableFishesRelativeBiomass', e)}
                digitsAfterComma={2}
              />
              <NumericTextField
                label={'Išteklių būklės indeksas'}
                name="conditionIndex"
                value={values.conditionIndex}
                error={errors.conditionIndex}
                onChange={(e) => setFieldValue('conditionIndex', e)}
                digitsAfterComma={2}
              />
            </Grid>
            <Grid $columns={1}>
              <DragAndDropUploadField
                error={errors?.files}
                files={values.files}
                label={'Mokslinio tyrimo dokumentas'}
                onUpload={async (files) => {
                  const uploadedFiles = await uploadedFiletMutation.mutateAsync(files);
                  setFieldValue('files', uploadedFiles);
                }}
                onDelete={(files: File[]) => setFieldValue('files', files)}
              />
            </Grid>
            <Button type="submit" loading={submitLoading} disabled={submitLoading}>
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
  font-size: 1.6rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.royalBlue};
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

const MeasurementLabel = styled.div`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.tertiary};
  padding: 16px;
`;

const Gap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default ResearchForm;
