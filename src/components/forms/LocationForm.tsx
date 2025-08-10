import { Form, Formik } from 'formik';
import { useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  getLocationList,
  handleErrorToastFromServer,
  locationSchema,
  LocationType,
} from '../../utils';
import api from '../../utils/api';
import Button, { ButtonColors } from '../buttons/Button';
import AsyncSelectField from '../fields/AsyncSelect';
import NumericTextField from '../fields/NumericTextField';
import SelectField from '../fields/SelectField';
import { Grid } from '../other/CommonStyles';

const LocationForm = ({ handleSetLocationManually, locationType, onClose }: any) => {
  const queryClient = useQueryClient();
  const { data: bars, isLoading } = useQuery(['bars'], async () => api.getFishinSections(), {
    enabled: locationType === LocationType.ESTUARY,
    retry: false,
  });

  const initialValues = { location: '', x: '', y: '' };

  const handleSubmit = async (values: any) => {
    if (values.location) {
      handleSetLocationManually(values.location);
      onClose();
    } else if (values.x && values.y) {
      queryClient
        .fetchQuery({
          queryKey: ['manualLocation'],
          queryFn: () => {
            return api.getLocation({
              query: JSON.stringify({
                type: locationType,
                coordinates: { x: values.x, y: values.y },
              }),
            });
          },
        })
        .then((data) => {
          handleSetLocationManually({ ...data, x: values.x, y: values.y });
          queryClient.refetchQueries(['builtTools', data?.id]);
          onClose();
        })
        .catch((error) => {
          handleErrorToastFromServer(error?.response);
        });
    }
  };

  const getInputValue = (location: any) =>
    location ? `${location?.name}, ${location?.cadastralId}` : '';

  return (
    <Container>
      <Heading>Esate kitur?</Heading>
      <Description>
        Prašome pasirinkti iš sąrašo
        {locationType === LocationType.ESTUARY ? ' baro numerį ' : ' vandens telkinį '} arba
        įrašykite koordinates.
      </Description>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validationSchema={locationSchema}
      >
        {({ values, errors, setFieldValue }: any) => {
          return (
            <FormContainer>
              {locationType === LocationType.ESTUARY && (
                <SelectField
                  options={bars}
                  getOptionLabel={(option) => option?.name}
                  value={values.location}
                  error={errors.location}
                  label={'Baro nr.'}
                  name={'location'}
                  onChange={(value) => {
                    setFieldValue('location', value);
                  }}
                  loading={isLoading}
                />
              )}
              {locationType === LocationType.INLAND_WATERS && (
                <AsyncSelectField
                  name={'location'}
                  value={values.location}
                  error={errors.location}
                  label={'Pasirinkite vandens telkinį'}
                  onChange={(val) => {
                    const { municipality, municipalityCode, lat, lng, ...rest } = val;

                    setFieldValue('location', {
                      ...rest,
                      x: lat,
                      y: lng,
                      municipality: { name: municipality, id: municipalityCode },
                    });
                  }}
                  getOptionValue={(option) => option?.cadastralId}
                  getOptionLabel={getInputValue}
                  loadOptions={(input: string, page: number | string) =>
                    getLocationList(input, page)
                  }
                  inputValue={getInputValue(values.location)}
                />
              )}
              <Or>
                <Separator />
                <SeparatorLabelContainer>
                  <SeparatorLabel>arba</SeparatorLabel>
                </SeparatorLabelContainer>
              </Or>
              <Grid $columns={2}>
                <NumericTextField
                  label="Platuma (WGS)"
                  name="y"
                  value={values.y || ''}
                  error={errors.y}
                  onChange={(e) => setFieldValue('y', e)}
                  digitsAfterComma={12}
                  placeholder={'55.329931'}
                />
                <NumericTextField
                  label="Ilguma (WGS)"
                  name="x"
                  value={values.x || ''}
                  error={errors.x}
                  onChange={(e) => setFieldValue('x', e)}
                  digitsAfterComma={12}
                  placeholder={'23.905544'}
                />
              </Grid>
              <Grid>
                <Button type="button" variant={ButtonColors.SECONDARY} onClick={onClose}>
                  {'Atšaukti'}
                </Button>
                <Button type="submit">{'Saugoti'}</Button>
              </Grid>
            </FormContainer>
          );
        }}
      </Formik>
    </Container>
  );
};

export default LocationForm;

const Container = styled.div`
  padding: 68px 16px 16px 16px;
`;

const Heading = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
  text-align: center;
`;

const Description = styled.div`
  margin-bottom: 40px;
  line-height: 26px;
  text-align: center;
  font-weight: 500;
`;

const FormContainer = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Or = styled.div`
  width: 100%;
  position: relative;
`;

const SeparatorLabelContainer = styled.div`
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 40px;
  color: #0b1f518f;
  position: absolute;
  width: 100%;
  text-align: center;
  opacity: 1;
`;

const SeparatorLabel = styled.span`
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 40px;
  letter-spacing: 1.02px;
  color: #0b1f518f;
  background-color: white;
  padding: 0 8px;
  margin: 0 auto;
  vertical-align: middle;
  opacity: 1;
`;

const Separator = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  position: absolute;
  width: 100%;
  margin: 24px 0;
`;
