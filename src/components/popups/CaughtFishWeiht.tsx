import styled from 'styled-components';
import Button from '../buttons/Button';
import { Form, Formik } from 'formik';
import FishRow from '../other/FishRow';
import { Footer } from '../other/CommonStyles';
import { useMutation, useQueryClient } from 'react-query';
import {
  getBuiltToolInfo,
  handleErrorToastFromServer,
  PopupContentType,
  useFishTypes,
  useGetCurrentRoute,
} from '../../utils';
import api from '../../utils/api';
import LoaderComponent from '../other/LoaderComponent';
import Popup from '../layouts/Popup';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';
import { useContext } from 'react';

const CaughtFishWeight = ({ content: { location, toolsGroup }, onClose }: any) => {
  const queryClient = useQueryClient();
  const currentRoute = useGetCurrentRoute();
  const { fishTypes, fishTypesLoading } = useFishTypes();

  const { mutateAsync: weighToolsMutation, isLoading: weighToolsIsLoading } = useMutation(
    (data: any) => {
      return api.weighTools(data, toolsGroup.id);
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['builtTools', location.id]);
        onClose();
      },
      onError: () => {
        handleErrorToastFromServer();
      },
    },
  );

  if (fishTypesLoading) return <LoaderComponent />;

  const { label, sealNr } = getBuiltToolInfo(toolsGroup);

  const handleSubmit = (data: any) => {
    if (!window.coordinates) return;

    const filteredData = data.filter((fishType: any) => fishType.amount);

    const mappedWeights = filteredData.reduce((obj: any, curr: any) => {
      obj[curr.id] = curr.amount;
      return obj;
    }, {});

    const params = {
      data: mappedWeights,
      coordinates: window.coordinates,
      location,
    };
    weighToolsMutation(params);
  };

  const initialValues = fishTypes.map((fishType) => ({
    ...fishType,
    preliminaryAmount: '',
    amount: '',
  }));

  return (
    <Popup visible={true} onClose={onClose}>
      <PopupContainer>
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
      </PopupContainer>
    </Popup>
  );
};

const PopupContainer = styled.div`
  padding-top: 68px;
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

export default CaughtFishWeight;
