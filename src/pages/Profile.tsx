import { Form, Formik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import Button from '../components/buttons/Button';
import TextField from '../components/fields/TextField';
import DefaultLayoutWrapper from '../components/layouts/DefaultLayoutWrapper';
import {
  Grid,
  InfoContainer,
  InfoSubTitle,
  InfoTitle,
  Title,
} from '../components/other/CommonStyles';
import { RootState } from '../state/store';
import { buttonLabels, inputLabels, profileSchema, titles, User, validationTexts } from '../utils';
import api from '../utils/api';
import { handleAlert, handleSuccessToast } from '../utils/functions';

export interface UserProps {
  email?: string;
  phone?: string;
}

const cookies = new Cookies();
const Profile = () => {
  const user: User = useSelector((state: RootState) => state?.user?.userData);
  const token = cookies.get('token');
  const queryClient = useQueryClient();

  const { mutateAsync: profileMutation, isLoading } = useMutation(
    (values: UserProps) => api.updateProfile(values),
    {
      onError: () => {
        handleAlert();
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries([token]);
        handleSuccessToast(validationTexts.profileUpdated);
      },
      retry: false,
    },
  );

  const initialValues = {
    email: user.email || '',
    phone: user.phone || '',
  };

  return (
    <DefaultLayoutWrapper>
      <Title>{titles.profile}</Title>
      <InfoContainer>
        <InfoTitle>{`${user.firstName} ${user.lastName}`}</InfoTitle>
        <InfoSubTitle>{user.email}</InfoSubTitle>
      </InfoContainer>

      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values) => profileMutation(values)}
        validateOnChange={false}
        validationSchema={profileSchema}
      >
        {({ values, errors, setFieldValue }) => {
          return (
            <FormContainer>
              <Grid $columns={1}>
                <TextField
                  label={inputLabels.phone}
                  value={values.phone}
                  error={errors.phone}
                  name="phone"
                  onChange={(phone) => setFieldValue('phone', phone)}
                />
                <TextField
                  label={inputLabels.email}
                  name="email"
                  value={values.email}
                  error={errors.email}
                  onChange={(email) => setFieldValue('email', email)}
                />
              </Grid>

              <Button loading={isLoading} disabled={isLoading}>
                {buttonLabels.saveChanges}
              </Button>
            </FormContainer>
          );
        }}
      </Formik>
    </DefaultLayoutWrapper>
  );
};

export default Profile;

const FormContainer = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;
