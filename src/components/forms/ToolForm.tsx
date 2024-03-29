import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  buttonLabels,
  device,
  getToolTypeList,
  slugs,
  toolSchema,
  ToolTypeType,
} from '../../utils';
import Button, { ButtonColors } from '../buttons/Button';
import ToolTypeButton from '../buttons/ToolTypeButton';
import AsyncSelectField from '../fields/AsyncSelect';
import TextField from '../fields/TextField';
import { Footer, Grid } from '../other/CommonStyles';

const ToolForm = ({ onSubmit, initialValues, isLoading, isNew }: any) => {
  const navigate = useNavigate();
  const disabled = !isNew;
  const preventNumInputFromScrolling = (e: any) =>
    e.target.addEventListener(
      'wheel',
      function (e: any) {
        e.preventDefault();
      },
      { passive: false },
    );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validateOnChange={false}
      validationSchema={toolSchema}
    >
      {({ values, errors, setFieldValue, resetForm }) => {
        const { type } = values;
        return (
          <FormContainer>
            <ToolTypeContainer>
              <ToolTypeButton
                label="Tinklas"
                icon="/net.svg"
                onClick={() => {
                  resetForm();
                  setFieldValue('type', ToolTypeType.NET);
                }}
                active={type === ToolTypeType.NET}
                disabled={disabled}
              />
              <ToolTypeButton
                label="Gaudyklė"
                icon="/catcher.svg"
                onClick={() => {
                  resetForm();
                  setFieldValue('type', ToolTypeType.CATCHER);
                }}
                active={type === ToolTypeType.CATCHER}
                disabled={disabled}
              />
            </ToolTypeContainer>
            <Grid $columns={1}>
              <TextField
                label="Plombos Nr."
                name="sealNr"
                value={values.sealNr || ''}
                error={errors.sealNr}
                onChange={(e) => setFieldValue('sealNr', e)}
                type="number"
                onFocus={preventNumInputFromScrolling}
                disabled={disabled}
                pattern={/[0-9]+/}
                inputMode="numeric"
              />
              <AsyncSelectField
                label={type === ToolTypeType.NET ? 'Tinklo tipas' : 'Gaudyklės tipas'}
                name="toolType"
                dependsOnValue={values.type}
                loadOptions={(input, page, toolType) => getToolTypeList(input, page, toolType)}
                value={values.toolType}
                onChange={(e) => setFieldValue('toolType', e)}
                getOptionLabel={(option) => option.label}
                error={errors.toolType}
                disabled={disabled}
              />
              {type === ToolTypeType.CATCHER && <SectionTitle>Gaudyklės akių dydis</SectionTitle>}
              <ToolDetails $columns={type === ToolTypeType.NET ? 2 : 3}>
                <TextField
                  label={type === ToolTypeType.NET ? 'Akių dydis, mm' : 'Sparnuose, mm'}
                  name="eyeSize"
                  value={values.eyeSize || ''}
                  error={errors.eyeSize}
                  onChange={(e) => setFieldValue('eyeSize', Number(e))}
                  type="number"
                  inputMode="numeric"
                  onFocus={preventNumInputFromScrolling}
                />

                {type === ToolTypeType.CATCHER && (
                  <>
                    <TextField
                      label="Jungiamoje dalyje, mm"
                      name="eyeSize2"
                      value={values.eyeSize2 || ''}
                      error={errors.eyeSize2}
                      onChange={(e) => setFieldValue('eyeSize2', Number(e))}
                      type="number"
                      inputMode="numeric"
                      onFocus={preventNumInputFromScrolling}
                    />
                    <TextField
                      label="Maiše, mm"
                      name="eyeSize3"
                      value={values.eyeSize3 || ''}
                      error={errors.eyeSize3}
                      onChange={(e) => setFieldValue('eyeSize3', Number(e))}
                      type="number"
                      inputMode="numeric"
                      onFocus={preventNumInputFromScrolling}
                    />
                  </>
                )}
                {type === ToolTypeType.NET && (
                  <TextField
                    label="Tinklo ilgis, m"
                    name="netLength"
                    value={values.netLength || ''}
                    error={errors.netLength}
                    height={56}
                    onChange={(e) => setFieldValue('netLength', Number(e))}
                    type="number"
                    inputMode="numeric"
                    onFocus={preventNumInputFromScrolling}
                  />
                )}
              </ToolDetails>
            </Grid>
            {isNew ? (
              <Footer>
                <Button loading={isLoading} disabled={isLoading}>
                  {buttonLabels.addTool}
                </Button>
              </Footer>
            ) : (
              <Grid $columns={2}>
                <Button
                  variant={ButtonColors.TRANSPARENT}
                  onClick={() => navigate(slugs.tools)}
                  disabled={isLoading}
                >
                  {buttonLabels.cancel}
                </Button>
                <Button loading={isLoading} disabled={isLoading}>
                  {buttonLabels.saveChanges}
                </Button>
              </Grid>
            )}
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
  padding: 16px;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.text.accent};
`;

export const ToolTypeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const ToolDetails = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);

  gap: 16px;
  width: 100%;
  @media ${device.mobileL} {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export default ToolForm;
