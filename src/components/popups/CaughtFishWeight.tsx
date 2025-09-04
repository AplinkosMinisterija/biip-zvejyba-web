import styled from 'styled-components';
import Button from '../buttons/Button';
import { Form, Formik } from 'formik';
import FishRow from '../other/FishRow';
import { Footer } from '../other/CommonStyles';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  getBuiltToolInfo,
  handleErrorToast,
  handleErrorToastFromServer,
  useFishTypes,
  useGetCurrentRoute,
} from '../../utils';
import api from '../../utils/api';
import LoaderComponent from '../other/LoaderComponent';
import Popup from '../layouts/Popup';

const CaughtFishWeight = ({ content: { location, toolsGroup }, onClose }: any) => {
  const queryClient = useQueryClient();
  const currentRoute = useGetCurrentRoute();
  const { fishTypes, fishTypesLoading } = useFishTypes();

  const { data: fishingWeights, isLoading: fishingWeightsLoading } = useQuery(
    ['fishingWeights', toolsGroup?.id],
    () => api.getFishingWeights(toolsGroup?.id),
    {
      retry: false,
    },
  );

  const { mutateAsync: weighToolsMutation, isLoading: weighToolsIsLoading } = useMutation(
    (data: any) => {
      return api.weighTools(data, toolsGroup.id);
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['builtTools', location.id]);
        queryClient.invalidateQueries(['fishingWeights']);
        onClose();
      },
      onError: ({ response }: any) => {
        handleErrorToastFromServer(response);
      },
    },
  );

  if (fishTypesLoading || fishingWeightsLoading) return <LoaderComponent />;

  const { label, sealNr } = getBuiltToolInfo(toolsGroup);

  const handleSubmit = (data: any) => {
    const coordinates: any = window.coordinates;
    if (coordinates?.x && coordinates?.y) {
      const filteredData = data.filter((fishType: any) => fishType.amount);

      const mappedWeights = filteredData.reduce((obj: any, curr: any) => {
        obj[curr.id] = curr.amount;
        return obj;
      }, {});

  const params = {
        data: mappedWeights,
        coordinates,
        location,
      };
      weighToolsMutation(params);
    } else {
      handleErrorToast(
        'Nepavyko nustatyti jūsų vietos. Pabandykite dar kartą vėliau ir įsitikinkite, kad naršyklėje suteikti vietos nustatymo leidimai.',
      );
    }
  };

  const initialValues = fishTypes.map((fishType) => {
    const preliminaryAmount = fishingWeights?.preliminary?.[fishType.id];
    return {
      ...fishType,
      amount: preliminaryAmount || '',
    };
  });

  return (
    <Popup visible={true} onClose={onClose}>
      <Title>{currentRoute?.title}</Title>
      <Heading>{label}</Heading>
      <SealNumbers>Plombos Nr. {sealNr}</SealNumbers>
      <Message>Apytikslis svoris, kg</Message>

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
    </Popup>
  );
};

const Message = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
  text-align: center;
  font-size: 2rem;
  margin: 16px 0;
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
  text-align: center;
`;

const StyledForm = styled(Form)`
  width: 100%;
  height: fit-content;
`;

export default CaughtFishWeight;
