import { Form, Formik } from 'formik';
import { useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button, { ButtonColors } from '../components/buttons/Button';
import SelectField from '../components/fields/SelectField';
import TextField from '../components/fields/TextField';
import FormLayout from '../components/layouts/FormLayout';
import { Grid } from '../components/other/CommonStyles';
import Icon from '../components/other/Icon';
import LoaderComponent from '../components/other/LoaderComponent';
import {
  buttonLabels,
  deleteDescriptionFirstPart,
  deleteDescriptionSecondPart,
  DeleteInfoProps,
  deleteTitles,
  handleErrorToastFromServer,
  inputLabels,
  profileSchema,
  roleLabels,
  roleOptions,
  slugs,
} from '../utils';
import api from '../utils/api';
import { RoleTypes } from '../utils/constants';
import { useAppSelector, useGetCurrentRoute } from '../utils/hooks';

export interface UserProps {
  email?: string;
  phone?: string;
}

export const UserForm = () => {
  const currentRoute = useGetCurrentRoute();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state?.user?.userData);

  const { data: tenantUser, isLoading } = useQuery(['user', id], () => api.getUser(id), {
    onError: () => {
      navigate(slugs.users);
    },
    retry: false,
  });

  const user = tenantUser?.user;

  useEffect(() => {
    if (!user) return;

    if (user?.id === currentUser.id) {
      navigate(slugs.profile);
    }
  }, [user]);

  const { mutateAsync: updateUserMutation } = useMutation(
    (values: UserProps) => api.updateTenantUser(values, id),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: async () => {
        navigate(slugs.users);
      },
      retry: false,
    },
  );

  const fullName = `${user?.firstName} ${user?.lastName}`;

  const { mutateAsync: deleteUserMutation } = useMutation(() => api.deleteUser(id), {
    onError: () => {
      handleErrorToastFromServer();
    },
    onSuccess: async () => {
      navigate(slugs.users);
    },
    retry: false,
  });

  const deleteInfo: DeleteInfoProps = {
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.delete,
    deleteDescriptionSecondPart: deleteDescriptionSecondPart.user,
    deleteTitle: deleteTitles.user,
    deleteName: fullName,
    handleDelete: deleteUserMutation,
  };

  const initialValues = {
    email: user?.email || '',
    phone: user?.phone || '',
    role: tenantUser?.role || '',
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <>
      <FormLayout
        title={currentRoute?.title || ''}
        infoTitle={fullName}
        infoSubTitle={user?.email}
        back={currentRoute?.back}
        deleteInfo={deleteInfo}
      >
        <Container>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={(values) => updateUserMutation({ ...values })}
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
                    <SelectField
                      options={roleOptions}
                      getOptionLabel={(option: RoleTypes) => roleLabels[option]}
                      value={values.role}
                      label={inputLabels.role}
                      name="role"
                      onChange={(value) => setFieldValue('role', value)}
                      error={errors.role}
                    />
                  </Grid>
                  <Grid $columns={2}>
                    <Button
                      variant={ButtonColors.TRANSPARENT}
                      onClick={() => navigate(slugs.users)}
                      disabled={isLoading}
                    >
                      {buttonLabels.cancel}
                    </Button>
                    <Button loading={isLoading} disabled={isLoading}>
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

export default UserForm;
