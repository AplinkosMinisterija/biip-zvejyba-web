import { isEmpty, map } from 'lodash';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import { device, LocationType, ToolsGroup, useCurrentFishing } from '../utils';
import api from '../utils/api';
import Button, { ButtonColors } from '../components/buttons/Button';
import ToolsGroupCard from '../components/cards/ToolsGroupCard';
import LocationForm from '../components/forms/LocationForm';
import Popup from '../components/layouts/Popup';
import PopUpWithImage from '../components/layouts/PopUpWithImage';
import { Footer, IconContainer } from '../components/other/CommonStyles';
import Icon, { IconName } from '../components/other/Icon';
import LoaderComponent from '../components/other/LoaderComponent';
import { NotFound } from '../components/other/NotFound';
import DefaultLayout from '../components/layouts/DefaultLayout';
import BuildTools from '../components/containers/BuildTools';
import ToolActionsPopup from '../components/containers/ToolActionsPopup';
import LocationInfo from '../components/other/LocationInfo';

const FishingTools = () => {
  const [showBuildTools, setShowBuildTools] = useState(false);
  const { data: currentFishing, isLoading: currentFishingLoading } = useCurrentFishing();
  const locationType = currentFishing?.type;
  const [selectedToolsGroup, setSelectedToolsGroup] = useState<ToolsGroup>();
  const {
    data: location,
    isLoading: locationLoading,
    refetch,
  } = useQuery({
    queryKey: ['location'],
    queryFn: () => {
      console.log(
        'location fetch',
        currentFishing?.type !== LocationType.INLAND_WATERS,
        currentFishing?.type,
      );
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

  const initialValues = { location: '', x: '', y: '' };

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
              onSelect={(toolsGroup) => setSelectedToolsGroup(toolsGroup)}
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
