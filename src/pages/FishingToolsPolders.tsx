import { isEmpty, map } from 'lodash';
import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { device, LocationType, useCurrentFishing } from '../utils';
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

const FishingTools = () => {
  const [showBuildTools, setShowBuildTools] = useState(false);
  const { data: currentFishing, isLoading: currentFishingLoading } = useCurrentFishing();
  const locationType = currentFishing?.type;
  const { data: location, isLoading: locationLoading } = useQuery({
    queryKey: ['location'],
    queryFn: () => {
      return api.getLocation({
        query: JSON.stringify({
          type: locationType,
          coordinates: window.coordinates,
        }),
      });
    },
    enabled: !!currentFishing,
  });

  const isEstuary = currentFishing?.type === LocationType.ESTUARY;

  const { data: builtTools, isLoading: builtToolsLoading } = useQuery(
    ['builtTool', location?.id],
    () => api.getBuiltTools({ locationId: location?.id }),
    {
      retry: false,
      enabled: !!location?.id,
    },
  );

  if (currentFishingLoading) {
    return <LoaderComponent />;
  }

  return (
    <DefaultLayout>
      <LocationInfo
        location={location}
        locationLoading={locationLoading}
        locationType={LocationType.POLDERS}
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
      {location?.name && (
        <>
          <Footer>
            <StyledButton disabled={!location} onClick={() => setShowBuildTools(true)}>
              Pastatyti įrankį
            </StyledButton>
          </Footer>
          <Popup visible={showBuildTools} onClose={() => setShowBuildTools(false)}>
            <BuildTools location={location} onClose={() => setShowBuildTools(false)} />
          </Popup>
        </>
      )}
    </DefaultLayout>
  );
};

export default FishingTools;

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

const Message = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  height: 100%;
  width: 100%;
  text-align: center;
  font-size: 2rem;
  margin: 16px 0;
  @media ${device.mobileL} {
    width: 100%;
  }
`;
