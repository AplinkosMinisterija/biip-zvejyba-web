import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import LoaderComponent from '../components/other/LoaderComponent';
import api from '../utils/api';
import {
  useAppSelector,
  useFishTypes,
  useGetCurrentRoute,
  device,
  getBuiltToolInfo,
  handleAlert,
  slugs,
  useGeolocationWatcher,
} from '../utils';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import FishRow from '../components/other/FishRow';
import { useEffect, useState } from 'react';
import DefaultLayout from '../components/layouts/DefaultLayout';

export const CaughtFishesWithTool = () => {
  useGeolocationWatcher();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentRoute = useGetCurrentRoute();
  const { fishTypes, isLoading } = useFishTypes();
  const coordinates = useAppSelector((state) => state.fishing.coordinates);
  const location = useAppSelector((state) => state.fishing.location);

  const { toolId } = useParams();
  const [amounts, setAmounts] = useState<{ [key: number]: number }>({});

  const { data: toolsGroup, isLoading: toolsGroupLoading } = useQuery(
    ['builtTool', toolId],
    () => api.getBuiltTool(toolId!),
    {
      onError: () => {
        navigate(slugs.fishingTools);
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
        handleAlert();
      },
    },
  );

  useEffect(() => {
    if (toolsGroup?.weightEvent?.data && !Object.keys(amounts).length) {
      setAmounts(toolsGroup?.weightEvent?.data as { [key: number]: number });
    }
  }, [toolsGroup]);

  if (isLoading || toolsGroupLoading) return <LoaderComponent />;

  const { label, sealNr } = getBuiltToolInfo(toolsGroup!);

  const updateAmounts = (value: { [key: number]: number }) => {
    setAmounts({ ...amounts, ...value });
  };

  const handleSubmit = () => {
    weighToolsMutation({ data: amounts, coordinates, location });
  };

  return (
    <>
      <DefaultLayout back={currentRoute?.back}>
        <Container>
          <Title>{currentRoute?.title}</Title>
          <Heading>{label}</Heading>
          <SealNumbers>{sealNr}</SealNumbers>
          {fishTypes?.map((fishType: any) => (
            <FishRow
              key={`fish_type_${fishType.id}`}
              fish={{ ...fishType, amount: amounts[fishType.id] || 0 }}
              onChange={(value) => {
                updateAmounts({ [fishType.id]: value || undefined });
              }}
            />
          ))}
        </Container>
        <Footer>
          <StyledButton
            loading={weighToolsIsLoading}
            disabled={weighToolsIsLoading}
            onClick={handleSubmit}
          >
            Saugoti pakeitimus
          </StyledButton>
        </Footer>
      </DefaultLayout>
    </>
  );
};

export default CaughtFishesWithTool;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Footer = styled.div`
  display: block;
  position: sticky;
  bottom: 0;
  cursor: pointer;
  padding: 16px 0;
  text-decoration: none;
  width: 100%;
  background-color: white;
  @media ${device.desktop} {
    padding: 16px 0 0 0;
  }
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
