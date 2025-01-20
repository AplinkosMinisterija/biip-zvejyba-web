import { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  getBuiltToolInfo,
  handleErrorToastFromServer,
  ToolsGroup,
  useFishTypes,
  useGetCurrentRoute,
} from '../utils';
import api from '../utils/api';
import Button from '../components/buttons/Button';
import { Footer } from '../components/other/CommonStyles';
import FishRow from '../components/other/FishRow';
import LoaderComponent from '../components/other/LoaderComponent';
import DefaultLayout from '../components/layouts/DefaultLayout';
import { Form, Formik } from 'formik';
import { useLocation } from 'react-router';

export const CaughtFishesWithTool = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentRoute = useGetCurrentRoute();
  const { fishTypes, fishTypesLoading } = useFishTypes();
  const { toolId } = useParams();
  const navLocation = useLocation();
  const location = navLocation.state?.location;

  const { data: toolsGroup, isLoading: toolsGroupLoading } = useQuery<ToolsGroup | any>(
    ['builtTool', toolId],
    () => api.getBuiltTool(toolId!),
    {
      onError: () => {
        navigate(-1);
      },
      retry: false,
    },
  );

  const { mutateAsync: weighToolsMutation, isLoading: weighToolsIsLoading } = useMutation(
    (data: any) => api.weighTools(data, toolId!),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['builtTool', toolId]);
        navigate(-1);
      },
      onError: () => {
        handleErrorToastFromServer();
      },
    },
  );

  if (fishTypesLoading || toolsGroupLoading) return <LoaderComponent />;

  const { label, sealNr } = getBuiltToolInfo(toolsGroup!);

  const handleSubmit = (data: any) => {
    if (!window.coordinates) return;

    const filteredData = data.filter((fishType: any) => fishType.amount);

    const mappedWeights = filteredData.reduce((obj: any, curr: any) => {
      obj[curr.id] = curr.amount;

      return obj;
    }, {});

    weighToolsMutation({
      data: mappedWeights,
      coordinates: window.coordinates,
      location: JSON.parse(location),
    });
  };

  const initialValues = fishTypes.map((fishType) => ({
    ...fishType,
    preliminaryAmount: '',
    amount: '',
  }));

  return (
    <DefaultLayout>
      <Container>
        <Title>{currentRoute?.title}</Title>
        <Heading>{label}</Heading>
        <SealNumbers>{sealNr}</SealNumbers>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, setFieldValue }) => {
            return (
              <StyledForm>
                {values?.map((value: any, index: number) => (
                  <FishRow
                    key={`fish_type_${value.id}`}
                    fish={value}
                    onChange={(value) => setFieldValue(`${index}.amount`, Number(value))}
                    index={index}
                  />
                ))}
                <Footer>
                  <StyledButton loading={weighToolsIsLoading} disabled={weighToolsIsLoading}>
                    Saugoti pakeitimus
                  </StyledButton>
                </Footer>
              </StyledForm>
            );
          }}
        </Formik>
      </Container>
    </DefaultLayout>
  );
};

export default CaughtFishesWithTool;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledButton = styled(Button)`
  width: 100%;
  border-radius: 28px;
  height: 56px;
  display: block;
  line-height: 56px;
  font-size: 20px;
  font-weight: 600;
  padding: 0;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 16px;
`;

const Heading = styled.div`
  text-align: center;
  font-size: 2.4rem;
  font-weight: bold;
`;

const SealNumbers = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 26px;
  margin-top: 4px;
  font-size: 1.6rem;
  margin-bottom: 32px;
`;

const StyledForm = styled(Form)`
  width: 100%;
  height: fit-content;
`;
