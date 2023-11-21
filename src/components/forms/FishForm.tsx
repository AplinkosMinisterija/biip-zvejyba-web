import { Form, Formik } from 'formik';
import styled from 'styled-components';
import { buttonLabels } from '../../utils';
import Button from '../buttons/Button';
import FishRow from '../other/FishRow';

export const FishForm = ({ initialValues, handleSubmit, loading }: any) => {
  return (
    <Container>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnChange={false}
      >
        {({ values, setFieldValue }) => {
          return (
            <FormContainer>
              <Column>
                {values?.map((value: any, index: number) => (
                  <FishRow
                    fish={value}
                    onChange={(value) => setFieldValue(`${index}.amount`, value)}
                  />
                ))}
              </Column>
              <Button type="submit" loading={loading} disabled={loading}>
                {buttonLabels.saveChanges}
              </Button>
            </FormContainer>
          );
        }}
      </Formik>
    </Container>
  );
};

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 650px;
  overflow-y: auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
`;

const FormContainer = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export default FishForm;
