import { isEmpty, map } from 'lodash';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import { device, LocationType, ToolsGroup, useCurrentFishing } from '../utils';
import api from '../utils/api';
import Button, { ButtonColors } from '../components/buttons/Button';
import ToolsGroupCard from '../components/cards/ToolsGroupCard';
import Popup from '../components/layouts/Popup';
import { Footer } from '../components/other/CommonStyles';
import LoaderComponent from '../components/other/LoaderComponent';
import { NotFound } from '../components/other/NotFound';
import DefaultLayout from '../components/layouts/DefaultLayout';
import BuildTools from '../components/containers/BuildTools';
import LocationInfo from '../components/other/LocationInfo';

const FishingToolsEstuary = () => {
  const [showBuildTools, setShowBuildTools] = useState(false);
  const { data: currentFishing, isLoading: currentFishingLoading } = useCurrentFishing();
  const locationType = currentFishing?.type;
  const {
    data: location,
    isLoading: locationLoading,
    refetch,
  } = useQuery({
    queryKey: ['location'],
    queryFn: () => {
      return api.getLocation({
        query: JSON.stringify({
          type: locationType,
          coordinates: window.coordinates,
        }),
      });
    },
    retry: false,
    enabled: !!currentFishing && currentFishing?.type !== LocationType.INLAND_WATERS,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (locationType === LocationType.ESTUARY && window.coordinates) {
        refetch();
      }
    }, 60000); // 60000ms = 1 minute
    return () => clearInterval(interval);
  }, []);

  const isEstuary = currentFishing?.type === LocationType.ESTUARY;

  const { data: builtTools, isLoading: builtToolsLoading } = useQuery(
    ['builtTools', location?.id],
    () => api.getBuiltTools({ locationId: location?.id }),
    {
      retry: false,
      enabled: !!location?.id,
    },
  );

  if (currentFishingLoading) {
    return <LoaderComponent />;
  }

  const showEditIcon = location?.name && location.type !== LocationType.POLDERS;
  const showBuildToolsButton =
    locationType === LocationType.INLAND_WATERS
      ? !!currentFishing?.location?.name
      : !!location?.name;

  return (
    <DefaultLayout>
      <LocationInfo
        location={locationType === LocationType.INLAND_WATERS ? currentFishing?.location : location}
        locationLoading={locationLoading}
        showEditIcon={showEditIcon}
        isEstuary={isEstuary}
      />
      <Container>
        {isEmpty(builtTools) ? (
          <NotFound message={'Nėra pastatytų įrankių'} />
        ) : (
          map(builtTools, (toolsGroup: any) => (
            <ToolsGroupCard
              isEstuary={isEstuary}
              key={toolsGroup.id}
              toolsGroup={toolsGroup}
              location={location}
            />
          ))
        )}
      </Container>
      {showBuildToolsButton && (
        <>
          <Footer>
            <StyledButton onClick={() => setShowBuildTools(true)}>Pastatyti įrankį</StyledButton>
          </Footer>
          <Popup visible={showBuildTools} onClose={() => setShowBuildTools(false)}>
            <BuildTools location={location} onClose={() => setShowBuildTools(false)} />
          </Popup>
        </>
      )}
    </DefaultLayout>
  );
};

export default FishingToolsEstuary;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
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
