import { Form, Formik } from 'formik';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import FormLayout from '../components/layouts/FormLayout';
import { Grid } from '../components/other/CommonStyles';
import FishRow from '../components/other/FishRow';
import Icon from '../components/other/Icon';
import { buttonLabels, profileSchema } from '../utils';
import { useFishTypes, useGetCurrentRoute } from '../utils/hooks';

export interface UserProps {
  email?: string;
  phone?: string;
}

export const CaughtFishesWithTool = () => {
  const currentRoute = useGetCurrentRoute();
  const { fishTypes } = useFishTypes();

  return (
    <>
      <FormLayout
        title={currentRoute?.title}
        infoTitle={'irankis'}
        infoSubTitle={'0000'}
        back={currentRoute?.back}
      >
        <Container>
          <Formik
            enableReinitialize={true}
            initialValues={{}}
            onSubmit={(values) => console.log({ ...values })}
            validateOnChange={false}
            validationSchema={profileSchema}
          >
            {({ values, errors, setFieldValue }) => {
              return (
                <FormContainer>
                  <Grid columns={1}>
                    {fishTypes?.map((fishType) => (
                      <FishRow fish={fishType} onChange={() => {}} value={24} />
                    ))}
                    <Button loading={false} disabled={false}>
                      {buttonLabels.saveChanges}
                    </Button>
                  </Grid>
                </FormContainer>
              );
            }}
          </Formik>
        </Container>
      </FormLayout>
    </>
  );
};

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2.4rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
`;

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const FormContainer = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export default CaughtFishesWithTool;
