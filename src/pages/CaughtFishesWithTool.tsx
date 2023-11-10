import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import LoaderComponent from '../components/other/LoaderComponent';
import { BuiltTool, device, getBuiltToolInfo, handleAlert, slugs } from '../utils';
import api from '../utils/api';
import { useAppSelector, useFishTypes, useGetCurrentRoute } from '../utils/hooks';
import DefaultLayout from '../components/layouts/DefaultLayout';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import FishRow from '../components/other/FishRow';
import { useState } from 'react';

export const CaughtFishesWithTool = () => {
  const currentRoute = useGetCurrentRoute();
  const { fishTypes, isLoading } = useFishTypes();
  const coordinates = useAppSelector((state) => state.fishing.coordinates);
  const { toolId, fishingId } = useParams();
  const navigate = useNavigate();

  const [amounts, setAmounts] = useState<{ [key: number]: number }>({});

  const { data: location } = useQuery(
    ['location'],
    () =>
      api.getLocation({
        query: {
          coordinates,
        },
      }),
    {},
  );

  const { data: toolsGroup, isLoading: toolLoading } = useQuery(
    ['builtTool', toolId],
    () => api.getToolsGroup(toolId!),
    {
      onError: () => {
        navigate(slugs.fishingTools(fishingId!));
      },
    },
  );

  const { mutateAsync: weighToolsMutation, isLoading: weighToolsIsLoading } = useMutation(
    (data: any) => api.weighTools(data, toolId!),
    {
      onSuccess: () => {
        navigate(slugs.fishingTools(fishingId!));
      },
      onError: () => {
        handleAlert();
      },
    },
  );

  if (isLoading || toolLoading) return <LoaderComponent />;

  const { label, sealNr } = getBuiltToolInfo(toolsGroup!);

  const updateAmounts = (value: { [key: number]: number }) => {
    setAmounts({ ...amounts, ...value });
  };

  const handleSubmit = () => {
    weighToolsMutation({ data: amounts, coordinates, location });
  };

  return (
    <>
      <DefaultLayout
        title={currentRoute?.title || '--'}
        infoTitle={label}
        infoSubTitle={sealNr}
        back={currentRoute?.back}
      >
        <Container>
          <Heading></Heading>
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
  margin: 40px 0;
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

const Heading = styled.div`
  text-align: center;
  margin: 16px 0 0 16px;
  font-size: 2.4rem;
  font-weight: bold;
`;
