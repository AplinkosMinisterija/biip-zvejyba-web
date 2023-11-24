import { Form, Formik } from 'formik';
import { getLocationList, inputLabels, locationSchema } from '../../utils';
import SelectField from '../fields/SelectField';
import AsyncSelectField from '../fields/AsyncSelect';
import { Grid } from '../other/CommonStyles';
import Button, { ButtonColors } from '../buttons/Button';
import styled from 'styled-components';
import TextField from '../fields/TextField';

const LocationForm = ({
  initialValues,
  handleSetLocationManually,
  isEstuary,
  bars,
  onClose,
}: any) => {
  const preventNumInputFromScrolling = (e: any) =>
    e.target.addEventListener(
      'wheel',
      function (e: any) {
        e.preventDefault();
      },
      { passive: false },
    );
  return (
    <Container>
      <Heading>Esate kitur?</Heading>
      <Description>
        Prašome pasirinkti iš sąrašo telkinio pavadinimą/baro numerį arba įrašykite koordinates.
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
                  label={inputLabels.location}
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
                    const { lat, lng, name } = value;
                    setFieldValue('location', { x: lng, y: lat, name });
                  }}
                  getOptionValue={(option) => option?.cadastralId}
                  getInputLabel={(option) => option?.name}
                  showError={false}
                  getOptionLabel={(option) => {
                    const { name } = option;
                    return name;
                  }}
                  loadOptions={(input: string, page: number | string) =>
                    getLocationList(input, page, {})
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
                <TextField
                  label="Ilguma"
                  name="x"
                  value={values.x || ''}
                  error={errors.x}
                  height={56}
                  onChange={(e) => setFieldValue('x', Number(e))}
                  type="number"
                  pattern={/^\d*\.?\d*$/}
                  onFocus={preventNumInputFromScrolling}
                />
                <TextField
                  label="Platuma"
                  name="y"
                  value={values.y || ''}
                  error={errors.y}
                  height={56}
                  onChange={(e) => setFieldValue('y', Number(e))}
                  type="number"
                  pattern={/^\d*\.?\d*$/}
                  onFocus={preventNumInputFromScrolling}
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
  padding-top: 68px;
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
  font: normal normal 600 16px/40px Manrope;
  color: #0b1f518f;
  position: absolute;
  width: 100%;
  text-align: center;
  opacity: 1;
`;

const SeparatorLabel = styled.span`
  font: normal normal 600 16px/40px Manrope;
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
