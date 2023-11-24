import { Footer, IconContainer } from '../other/CommonStyles';
import Icon, { IconName } from '../other/Icon';
import LoaderComponent from '../other/LoaderComponent';
import { isEmpty, map } from 'lodash';
import { NotFound } from '../other/NotFound';
import ToolsGroupCard from '../cards/ToolsGroupCard';
import Button, { ButtonColors } from '../buttons/Button';
import Popup from '../layouts/Popup';
import BuildTools from './BuildTools';
import PopUpWithImage from '../layouts/PopUpWithImage';
import LocationForm from '../forms/LocationForm';
import ToolActions from './ToolActions';
import { device, getBars, handleAlert, LocationType, ToolsGroup } from '../../utils';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import api from '../../utils/api';
import { actions } from '../../state/fishing/reducer';
import styled from 'styled-components';

const FishingTools = ({
  setLocation,
  location,
  coordinates,
}: {
  setLocation: (location: any) => void;
  location: any;
  coordinates: any;
}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [showBuildTools, setShowBuildTools] = useState(false);
  const [showLocationPopUp, setShowLocationPopUp] = useState(false);
  const [selectedToolsGroup, setSelectedToolsGroup] = useState<ToolsGroup>();

  const { data: currentFishing } = useQuery(['currentFishing'], () => api.getCurrentFishing(), {
    retry: false,
  });
  const locationType: LocationType = currentFishing?.type;
  const isEstuary = locationType === LocationType.ESTUARY;

  const { mutateAsync: getLocationMutation } = useMutation(
    (coordinates: any) => {
      return api.getLocation({
        query: {
          type: locationType,
          coordinates,
        },
      });
    },
    {
      onSuccess: (value) => {
        console.log('set location2', value);
        setLocation(value);
        // queryClient.setQueryData('location', value);
      },
      onError: () => {
        handleAlert();
      },
    },
  );

  const { isFetching: locationFetching } = useQuery(
    ['location'],
    () =>
      api.getLocation({
        query: {
          coordinates,
        },
      }),
    {
      onSuccess: (data) => {
        console.log('set location1', data);
        if (data && !location) setLocation(data);
        // dispatch(actions.setLocation(data));
      },
      retry: false,
    },
  );

  const { data: bars } = useQuery(['bars'], async () => getBars(), {
    enabled: isEstuary,
    retry: false,
  });

  const { data: builtTools } = useQuery(
    ['builtTools', location?.id],
    () => (location?.id ? api.getBuiltTools({ locationId: location?.id }) : {}),
    {
      retry: false,
    },
  );

  const initialValues = { location: '', x: '', y: '' };
  const handleRefreshLocation = () => {
    const data = queryClient.fetchQuery(
      ['location'],
      () =>
        api.getLocation({
          query: {
            coordinates,
          },
        }),
      {
        retry: false,
      },
    );
    dispatch(actions.setLocation(data));
  };
  const handleSetLocationManually = (values: any) => {
    const { location, x, y } = values;
    if (location) {
      getLocationMutation({ x: location.x, y: location.y });
    } else {
      getLocationMutation({ x, y });
    }
    setShowLocationPopUp(false);
  };
  return (
    <>
      {!locationFetching && (
        <TitleWrapper>
          <Title>{location?.name || 'Nenustatytas vandens telkinys'}</Title>
          {location?.name && (
            <IconContainer onClick={() => setShowLocationPopUp(true)}>
              <EditIcon name={IconName.edit} />
            </IconContainer>
          )}
        </TitleWrapper>
      )}
      <Container>
        {locationFetching ? (
          <LoaderComponent />
        ) : (
          <>
            {location?.name ? (
              <>
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
              </>
            ) : (
              <div>
                <Message>
                  Nepavyko nustatyti jūsų buvimo vietos. Nustatykite rankiniu būdu arba nuplaukite į
                  žvejybos vietą ir atnaujinkite inofrmaciją.
                </Message>
                <Button
                  disabled={locationFetching}
                  onClick={() => {
                    setShowLocationPopUp(true);
                  }}
                >
                  {'Nustatyti rankiniu būdu'}
                </Button>
                <Button
                  loading={locationFetching}
                  disabled={locationFetching}
                  variant={ButtonColors.SECONDARY}
                  onClick={handleRefreshLocation}
                >
                  {'Atnaujinti lokaciją'}
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
      {location?.name && (
        <Footer>
          <StyledButton onClick={() => setShowBuildTools(true)}>Pastatyti įrankį</StyledButton>
        </Footer>
      )}
      <Popup visible={showBuildTools} onClose={() => setShowBuildTools(false)}>
        <BuildTools
          coordinates={coordinates || undefined}
          location={location}
          onClose={() => setShowBuildTools(false)}
        />
      </Popup>
      <PopUpWithImage visible={showLocationPopUp} onClose={() => setShowLocationPopUp(false)}>
        <LocationForm
          initialValues={initialValues}
          handleSetLocationManually={handleSetLocationManually}
          isEstuary={isEstuary}
          bars={bars}
          onClose={() => setShowLocationPopUp(false)}
        />
      </PopUpWithImage>
      <ToolActions
        coordinates={coordinates}
        location={location}
        visible={!!selectedToolsGroup}
        toolGroup={selectedToolsGroup}
        onReturn={() => setSelectedToolsGroup(undefined)}
      />
    </>
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

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
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

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const EditIcon = styled(Icon)`
  font-size: 2.4rem;
`;
