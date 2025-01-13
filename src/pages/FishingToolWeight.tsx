import { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  FishingTypeRoute,
  getBuiltToolInfo,
  handleErrorToastFromServer,
  slugs,
  ToolsGroup,
  useAppSelector,
  useFishTypes,
  useGetCurrentRoute,
} from '../utils';
import api from '../utils/api';
import Button from '../components/buttons/Button';
import { Footer } from '../components/other/CommonStyles';
import FishRow from '../components/other/FishRow';
import LoaderComponent from '../components/other/LoaderComponent';
import DefaultLayout from '../components/layouts/DefaultLayout';

export const CaughtFishesWithTool = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentRoute = useGetCurrentRoute();
  const { fishTypes, isLoading } = useFishTypes();
  const { toolId } = useParams();
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});

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
    if (!window.coordinates) return;

    const mappedWeights = Object.keys(amounts).reduce(
      (obj: { [key: string]: number | undefined }, curr: string) => {
        obj[curr] = Number(amounts[curr]) || undefined;

        return obj;
      },
      {},
    );

    weighToolsMutation({
      data: mappedWeights,
      coordinates: window.coordinates,
      location,
    });
  };

  return (
    <DefaultLayout>
      <Container>
        <Title>{currentRoute?.title}</Title>
        <Heading>{label}</Heading>
        <SealNumbers>{sealNr}</SealNumbers>
        {fishTypes?.map((fishType: any) => (
          <FishRow
            key={`fish_type_${fishType.id}`}
            fish={{ ...fishType, amount: amounts[fishType.id] || 0 }}
            onChange={(value: any) => {
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
