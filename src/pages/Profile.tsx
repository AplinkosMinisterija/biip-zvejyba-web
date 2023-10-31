import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import Button from '../components/buttons/Button';
import TextField from '../components/fields/TextField';
import DefaultLayoutWrapper from '../components/layouts/DefaultLayoutWrapper';
import { Grid, Title } from '../components/other/CommonStyles';
import Loader from '../components/other/Loader';
import { RootState } from '../state/store';
import { buttonLabels, inputLabels, profileSchema, titles, User, validationTexts } from '../utils';
import api from '../utils/api';
import { handleAlert, handleSelectProfile, handleSuccessToast } from '../utils/functions';
import { useLogoutMutation } from '../utils/hooks';

export interface UserProps {
  email?: string;
  phone?: string;
}

const cookies = new Cookies();
const Profile = () => {
  const user: User = useSelector((state: RootState) => state?.user?.userData);
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = useLogoutMutation();
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

  const handleSelect = (profileId: string) => {
    setLoading(true);
    handleSelectProfile(profileId);
  };

  const initialValues = {
    email: user.email || '',
    phone: user.phone || '',
  };

  if (loading) return <Loader />;

  return (
    <DefaultLayoutWrapper>
      <Title>{titles.profile}</Title>
      <UserInfo>
        <Name>{`${user.firstName} ${user.lastName}`}</Name>
        <Email>{`${user.email}`}</Email>
      </UserInfo>

      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values) => profileMutation(values)}
        validateOnChange={false}
        validationSchema={profileSchema}
      >
        {({ values, errors, setFieldValue, resetForm }: any) => {
          return (
            <FormContainer>
              <Grid columns={1}>
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

const UserInfo = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Name = styled.div`
  font-size: 2.4rem;
  font-weight: 600;
`;

const ButtonContainer = styled.div`
  width: 100%;
`;

const Email = styled.div`
  color: ${({ theme }) => theme.colors.text.grey};
  font-size: 1.6rem;
  margin-bottom: 32px;
`;
