import { isEmpty, map } from 'lodash';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { LocationType, useCurrentFishing, handleErrorToastFromServer } from '../utils';
import api from '../utils/api';
import Button from '../components/buttons/Button';
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
  const [manualLocation, setManualLocation] = useState<any>();
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
      if (locationType === LocationType.ESTUARY && window.coordinates && !manualLocation) {
        refetch();
      }
    }, 60000); // 60000ms = 1 minute
    return () => clearInterval(interval);
  }, []);

  const isEstuary = currentFishing?.type === LocationType.ESTUARY;
  const locationId = (manualLocation || location)?.id;
  const {
    data: builtTools,
    isFetching: builtToolsFetching,
  } = useQuery(
    ['builtTools', locationId],
    () => {
      return api.getBuiltTools({ locationId });
    },
    {
      onError: ({ response }: any) => {
        handleErrorToastFromServer(response);
      },
      retry: false,
      enabled: !!locationId,
    },
  );

  if (currentFishingLoading) {
    return <LoaderComponent />;
  }

  const currentLocation = manualLocation || location;
  const showBuildToolsButton = !!currentLocation?.id;

  return (
    <DefaultLayout>
      <LocationInfo
        location={currentLocation}
        locationLoading={locationLoading}
        setLocationManually={setManualLocation}
        locationType={LocationType.ESTUARY}
        renewLocation={refetch}
      />
      <Container>
        {(builtToolsFetching || (builtTools === undefined && !!showBuildToolsButton)) ? (
          <LoaderComponent />
        ) : isEmpty(builtTools) && !!showBuildToolsButton ? (
          <NotFound message={'Nėra pastatytų įrankių'} />
        ) : (
          map(builtTools, (toolsGroup: any) => (
            <ToolsGroupCard
              isEstuary={isEstuary}
              key={toolsGroup.id}
              toolsGroup={toolsGroup}
              location={currentLocation}
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
            <BuildTools
              location={currentLocation}
              onClose={() => { setShowBuildTools(false); refetch(); }}
            />
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
