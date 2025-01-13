import { Form, Formik } from 'formik';
import styled from 'styled-components';
import { getBars, getLocationList, inputLabels, locationSchema } from '../../utils';
import Button, { ButtonColors } from '../buttons/Button';
import AsyncSelectField from '../fields/AsyncSelect';
import NumericTextField from '../fields/NumericTextField';
import SelectField from '../fields/SelectField';
import { Grid } from '../other/CommonStyles';
import { useQuery } from 'react-query';

const LocationForm = ({ initialValues, handleSetLocationManually, isEstuary, onClose }: any) => {
  const { data: bars } = useQuery(['bars'], async () => getBars(), {
    enabled: isEstuary,
    retry: false,
  });
  const getInputValue = (location: any) =>
    location ? `${location?.name}, ${location?.cadastralId}` : '';

  return (
    <Container>
      <Heading>Esate kitur?</Heading>
      <Description>
        Prašome pasirinkti iš sąrašo baro numerį arba įrašykite koordinates.
      </Description>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleSetLocationManually}
        validateOnChange={false}
        validationSchema={locationSchema}
      >
        {({ values, errors, setFieldValue }: any) => {
          return (
            <FormContainer>
              {isEstuary ? (
                <SelectField
                  options={bars}
                  getOptionLabel={(option) => option?.name}
                  value={values.location}
                  error={errors.location}
                  label={'Baro nr.'}
                  name={'location'}
                  onChange={(value) => setFieldValue('location', value)}
                />
              ) : (
                <AsyncSelectField
                  name={'location'}
                  label={inputLabels.location}
                  value={values.location}
                  error={errors.location}
                  onChange={(value) => {
                    const { lat, lng, name, cadastralId } = value;
                    setFieldValue('location', { x: lng, y: lat, name, cadastralId });
                  }}
                  getOptionValue={(option) => option?.cadastralId}
                  showError={false}
                  getOptionLabel={getInputValue}
                  inputValue={getInputValue(values.location)}
                  loadOptions={(input: string, page: number | string) =>
                    getLocationList(input, page)
                  }
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
