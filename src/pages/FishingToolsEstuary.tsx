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

const FishingToolsEstuary = () => {
  const [showBuildTools, setShowBuildTools] = useState(false);
  const { data: currentFishing, isLoading: currentFishingLoading } = useCurrentFishing();
  const { coordinates } = useGeolocation();

  const locationType = currentFishing?.type;
  const [manualLocation, setManualLocation] = useState<any>();
  const {
    data: location,
    isLoading: locationLoading,
    refetch,
  } = useQuery({
    // Coordinates intentionally NOT in the queryKey — a moving boat would
    // otherwise re-fire this query on every GPS tick and put the page back
    // into the fetching state, blocking tool placement. The queryFn closure
    // still uses the latest `coordinates` value, and the user can force a
    // re-detect via the "Atnaujinti lokaciją" button (`refetch`).
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
    enabled:
      !!currentFishing &&
      !!coordinates &&
      currentFishing?.type !== LocationType.INLAND_WATERS &&
      !manualLocation,
  });

  const isEstuary = currentFishing?.type === LocationType.ESTUARY;
  const locationId = (manualLocation || location)?.id;
  const { data: builtTools = [], isFetching: builtToolsFetching } = useQuery(
    ['builtTools', locationId, currentFishing?.id],
    () => {
      return api.getBuiltTools({ locationId, locationType: LocationType.ESTUARY });
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

  const { toolTypesCounts, checkedToolTypesCounts } = builtTools.reduce(
    (acc, tool) => {
      const id = tool.tools?.[0]?.toolType?.id;
      if (!id) return acc;

      acc.toolTypesCounts[id] = (acc.toolTypesCounts[id] ?? 0) + 1;

      if (tool.weightEvent) {
        acc.checkedToolTypesCounts[id] = (acc.checkedToolTypesCounts[id] ?? 0) + 1;
      }

      return acc;
    },
    {
      checkedToolTypesCounts: {} as Record<string, number>,
      toolTypesCounts: {} as Record<string, number>,
    },
  );

  const hasAnyChecked = Object.keys(checkedToolTypesCounts).length > 0;

  const notCompletedToolType = hasAnyChecked
    ? Object.keys(toolTypesCounts).find(
        (key) =>
          (checkedToolTypesCounts[key] ?? 0) > 0 &&
          checkedToolTypesCounts[key] < toolTypesCounts[key],
      )
    : undefined;

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
        {builtToolsFetching || (builtTools === undefined && !!showBuildToolsButton) ? (
          <LoaderComponent />
        ) : isEmpty(builtTools) && !!showBuildToolsButton ? (
          <NotFound message={'Nėra pastatytų įrankių'} />
        ) : (
          map(builtTools, (toolsGroup: any) => {
            const toolTypeId = toolsGroup.tools[0].toolType.id;
            const disableTool =
              !!notCompletedToolType && notCompletedToolType !== toolTypeId.toString();

            const showCheckButton =
              toolTypesCounts[toolTypeId] - (checkedToolTypesCounts?.[toolTypeId] || 0) > 1;

            return (
              <ToolsGroupCard
                isEstuary={isEstuary}
                key={toolsGroup.id}
                toolsGroup={toolsGroup}
                location={currentLocation}
                showCheckButton={showCheckButton}
                isDisabled={disableTool}
              />
            );
          })
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
              onClose={() => {
                setShowBuildTools(false);
                refetch();
              }}
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
