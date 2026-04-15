import { isEmpty, map } from 'lodash';
import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import ToolsGroupCard from '../components/cards/ToolsGroupCard';
import BuildTools from '../components/containers/BuildTools';
import DefaultLayout from '../components/layouts/DefaultLayout';
import Popup from '../components/layouts/Popup';
import { Footer } from '../components/other/CommonStyles';
import LoaderComponent from '../components/other/LoaderComponent';
import LocationInfo from '../components/other/LocationInfo';
import { NotFound } from '../components/other/NotFound';
import {
  handleErrorToastFromServer,
  LocationType,
  useCurrentFishing,
  useGeolocation,
} from '../utils';
import api from '../utils/api';

const FishingTools = () => {
  const [showBuildTools, setShowBuildTools] = useState(false);
  const { data: currentFishing, isLoading: currentFishingLoading } = useCurrentFishing();
  const isEstuary = currentFishing?.type === LocationType.ESTUARY;
  const locationType = currentFishing?.type;
  const [manualLocation, setManualLocation] = useState<any>();
  const { coordinates, loading } = useGeolocation();

  const {
    data: location,
    isFetching: locationLoading,
    refetch,
  } = useQuery({
    queryKey: ['location', currentFishing?.id],
    queryFn: () => {
      return api.getLocation({
        query: JSON.stringify({
          type: locationType,
          coordinates: coordinates,
        }),
      });
    },
    retry: false,
    enabled: !!currentFishing,
  });

  const currentLocation = manualLocation || location;
  const showBuildToolsButton = !!currentLocation?.id;

  const locationId = (manualLocation || location)?.id;

  const { data: builtTools, isFetching: builtToolsFetching } = useQuery(
    ['builtTools', location?.id, currentFishing?.id],
    () => {
      return api.getBuiltTools({ locationId: locationId });
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

  return (
    <DefaultLayout>
      <LocationInfo
        locationType={LocationType.INLAND_WATERS}
        location={currentLocation}
        locationLoading={locationLoading || loading}
        setLocationManually={setManualLocation}
        renewLocation={refetch}
      />
      <Container>
        {builtToolsFetching || (builtTools === undefined && !!showBuildToolsButton) ? (
          <LoaderComponent />
        ) : isEmpty(builtTools) ? (
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
      {currentLocation?.name && (
        <>
          <Footer>
            <StyledButton
              disabled={!currentLocation || loading}
              onClick={() => setShowBuildTools(true)}
            >
              Pastatyti įrankį
            </StyledButton>
          </Footer>
          <Popup visible={showBuildTools} onClose={() => setShowBuildTools(false)}>
            <BuildTools location={currentLocation} onClose={() => setShowBuildTools(false)} />
          </Popup>
        </>
      )}
    </DefaultLayout>
  );
};

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

export default FishingTools;
