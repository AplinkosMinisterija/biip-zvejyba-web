import { Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import NumericTextField from '../components/fields/NumericTextField';
import SelectField from '../components/fields/SelectField';
import TextField from '../components/fields/TextField';
import DefaultLayout from '../components/layouts/DefaultLayout';
import PopUpWithTitles from '../components/layouts/PopUpWithTitle';
import { Grid } from '../components/other/CommonStyles';
import Icon, { IconName } from '../components/other/Icon';
import LoaderComponent from '../components/other/LoaderComponent';
import ProfileCard from '../components/other/ProfileCard';
import {
  buttonLabels,
  handleAlert,
  inputLabels,
  roleLabels,
  roleOptions,
  slugs,
  tenantUserSchema,
  theme,
  titles,
} from '../utils';
import api from '../utils/api';
import { intersectionObserverConfig, RoleTypes } from '../utils/constants';
import { useGetCurrentRoute } from '../utils/hooks';

export interface UserProps {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  personalCode?: string;
  role?: string;
}

export const Users = () => {
  const currentRoute = useGetCurrentRoute();
  const [showPopup, setShowPopup] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fetchTenantUsers = async (page: number) => {
    const tenantUsers = await api.getUsers({ page });

    const newUsers = tenantUsers?.rows.map((tenantUser) => {
      return {
        user: tenantUser.user,
        id: tenantUser.id,
        role: tenantUser.role,
      };
    });

    return {
      data: newUsers,
      page: tenantUsers.page < tenantUsers.totalPages ? tenantUsers.page + 1 : undefined,
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery(
    'tenantUsers',
    ({ pageParam }) => fetchTenantUsers(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.page,
      cacheTime: 60000,
    },
  );

  const tenantUsers = data?.pages
    .flat()
    .map((item) => item?.data)
    .flat();

  const observerRef = useRef(null);

  useEffect(() => {
    const currentObserver = observerRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, intersectionObserverConfig);

    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data]);

  const { mutateAsync: createUserMutation, isLoading } = useMutation(
    (values: UserProps) => api.createUser(values),
    {
      onError: () => {
        handleAlert();
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(['tenantUsers']);
        setShowPopup(false);
      },
      retry: false,
    },
  );

  const initialValues: UserProps = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    personalCode: '',
    role: RoleTypes.USER,
  };

  return (
    <>
      <DefaultLayout
        title={currentRoute?.title || ''}
        subtitle={currentRoute?.subtitle || ''}
        back={currentRoute?.back}
      >
        <Container>
          <UsersContainer>
            {tenantUsers?.map((tenantUsers) => {
              const user = tenantUsers.user!;
              return (
                <ProfileCard
                  color={theme.colors.powder}
                  fisher={user}
                  icon={<StyledIcon name={IconName.profile} />}
                  onClick={() => {
                    navigate(slugs.user(tenantUsers?.id!));
                  }}
                />
              );
            })}
          </UsersContainer>
        </Container>
        {observerRef && <Invisible ref={observerRef} />}
        {isFetching && <LoaderComponent />}
        <Button onClick={() => setShowPopup(true)}>{buttonLabels.newMember}</Button>
      </DefaultLayout>
      <PopUpWithTitles
        title={titles.newMember}
        visible={showPopup}
        onClose={() => setShowPopup(false)}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={(values) => createUserMutation(values)}
          validateOnChange={false}
          validationSchema={tenantUserSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <FormContainer>
                <Grid columns={1}>
                  <TextField
                    label={inputLabels.firstName}
                    value={values.firstName}
                    error={errors.firstName}
                    name="firstName"
                    onChange={(phone) => setFieldValue('firstName', phone)}
                  />
                  <TextField
                    label={inputLabels.lastName}
                    name="lastName"
                    value={values.lastName}
                    error={errors.lastName}
                    onChange={(email) => setFieldValue('lastName', email)}
                  />
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
                  <NumericTextField
                    label={inputLabels.personalCode}
                    name="personalCode"
                    value={values.personalCode}
                    error={errors.personalCode}
                    onChange={(email) => setFieldValue('personalCode', email)}
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

                <Button loading={isLoading} disabled={isLoading}>
                  {buttonLabels.addMember}
                </Button>
              </FormContainer>
            );
          }}
        </Formik>
      </PopUpWithTitles>
    </>
  );
};

const Invisible = styled.div`
  width: 10px;
  height: 16px;
`;

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

export default Users;
