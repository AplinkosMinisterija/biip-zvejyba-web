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
  device,
  handleErrorToastFromServer,
  LocationType,
  useCurrentFishing,
  useGeolocation,
} from '../utils';
import api from '../utils/api';

const FishingTools = () => {
  const [showBuildTools, setShowBuildTools] = useState(false);
  const { data: currentFishing, isLoading: currentFishingLoading } = useCurrentFishing();
  const locationType = currentFishing?.type;
  const [manualLocation, setManualLocation] = useState<any>();
  const { coordinates, loading } = useGeolocation();

  const {
    data: location,
    isFetching: locationLoading,
    refetch,
  } = useQuery({
    queryKey: ['location', currentFishing?.id, coordinates?.x, coordinates?.y],
    queryFn: () => {
      return api.getLocation({
        query: JSON.stringify({
          type: locationType,
          coordinates: coordinates,
        }),
      });
    },
    enabled: !!currentFishing && !!coordinates && !manualLocation,
  });

  const isEstuary = currentFishing?.type === LocationType.ESTUARY;
  // currentLocation drives the title; auto-detected stub shows "Polderiai"
  // until the user picks a specific polder via the LocationForm popup.
  const currentLocation = manualLocation || location;
  // Tools / build button only make sense once a real polder is picked —
  // the auto-detected stub has a non-numeric placeholder id.
  const polderPicked = !!manualLocation?.id;

  const { data: builtTools = [], isFetching: builtToolsFetching } = useQuery(
    ['builtTools', manualLocation?.id, currentFishing?.id],
    () => {
      return api.getBuiltTools({
        locationId: manualLocation?.id,
        locationType: LocationType.POLDERS,
      });
    },
    {
      onError: ({ response }: any) => {
        handleErrorToastFromServer(response);
      },
      retry: false,
      enabled: polderPicked,
    },
  );

  if (currentFishingLoading) {
    return <LoaderComponent />;
  }

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
        locationLoading={locationLoading || loading}
        locationType={LocationType.POLDERS}
        setLocationManually={(picked: any) => {
          // Polder pick by itself only carries id/name/type; the backend's
          // LocationProp also requires `municipality`, which the auto-detect
          // (getPolder) already resolved from the user's coordinates.
          setManualLocation({
            ...picked,
            municipality: picked?.municipality || location?.municipality,
          });
        }}
        renewLocation={refetch}
      />
      {polderPicked && (
        <Container>
          {builtToolsFetching ? (
            <LoaderComponent />
          ) : isEmpty(builtTools) ? (
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
      )}
      {polderPicked && (
        <>
          <Footer>
            <StyledButton disabled={loading} onClick={() => setShowBuildTools(true)}>
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
