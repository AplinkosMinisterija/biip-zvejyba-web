import { isEmpty, map } from 'lodash';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Button, { ButtonColors } from '../components/buttons/Button';
import BuildTools from '../components/containers/BuildTools';
import ToolActions from '../components/containers/ToolActions';
import Popup from '../components/layouts/Popup';
import PopUpWithImage from '../components/layouts/PopUpWithImage';
import LoaderComponent from '../components/other/LoaderComponent';
import { NotFound } from '../components/other/NotFound';
import ToolsGroupCard from '../components/cards/ToolsGroupCard';
import { RootState } from '../state/store';
import { getBars, handleAlert, useGetCurrentRoute } from '../utils';
import api from '../utils/api';
import { LocationType } from '../utils';
import { device } from '../utils';
import { ToolGroup } from '../utils';
import LocationForm from '../components/forms/LocationForm';
import DefaultLayout from '../components/layouts/DefaultLayout';
import { IconContainer } from '../components/other/CommonStyles';
import Icon, { IconName } from '../components/other/Icon';
import { actions } from '../state/fishing/reducer';

const CurrentFishingTools = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const coordinates = useSelector((state: RootState) => state.fishing.coordinates);
  const [showBuildTools, setShowBuildTools] = useState(false);
  const [showLocationPopUp, setShowLocationPopUp] = useState(false);
  const [selectedToolsGroup, setSelectedToolsGroup] = useState<ToolGroup | null>(null);

  const { data: currentFishing } = useQuery(['currentFishing'], () => api.getCurrentFishing(), {
    retry: false,
  });
  const locationType: LocationType = currentFishing?.type;
  const currentRoute = useGetCurrentRoute();
  const isEstuary = locationType === LocationType.ESTUARY;

  const { mutateAsync: getLocationMutation } = useMutation(
    (coordinates: any) =>
      api.getLocation({
        query: {
          type: locationType,
          coordinates,
        },
      }),
    {
      onSuccess: (value) => {
        dispatch(actions.setLocation(value));
        queryClient.setQueryData('location', value);
      },
      onError: () => {
        handleAlert();
      },
    },
  );

  const {
    data: location,
    isLoading: locationLoading,
    isFetching: locationFetching,
  } = useQuery(
    ['location'],
    () =>
      api.getLocation({
        query: {
          coordinates,
        },
      }),
    {
      onSuccess: (data) => {
        dispatch(actions.setLocation(data));
      },
      retry: false,
      cacheTime: 60000,
      staleTime: 60000,
    },
  );

  const { data: bars } = useQuery(['bars'], async () => getBars(), {
    enabled: isEstuary,
    retry: false,
  });

  const handleRefreshLocation = () => {
    queryClient.invalidateQueries('location');
  };

  const { data: builtTools } = useQuery(
    ['builtTools', location?.id],
    () => api.getBuiltTools({ locationId: location?.id }),
    {
      retry: false,
    },
  );

  const initialValues = { location: '', x: '', y: '' };
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
    <DefaultLayout onEdit={() => setShowLocationPopUp(true)} back={currentRoute?.back}>
      {!locationLoading && (
        <TitleWrapper>
          <Title>{location.name || 'Nenustatytas vandens telkinys'}</Title>
          {location.name && (
            <IconContainer onClick={() => setShowLocationPopUp(true)}>
              <EditIcon name={IconName.edit} />
            </IconContainer>
          )}
        </TitleWrapper>
      )}
      <Container>
        {locationLoading ? (
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
                      onSelect={setSelectedToolsGroup}
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
          coordinates={coordinates}
          location={location}
          onClose={() => setShowBuildTools(false)}
        />
      </Popup>

      <PopUpWithImage
        visible={showLocationPopUp}
        onClose={() => setShowLocationPopUp(false)}
        title={'Esate kitur?'}
        description={
          'Prašome pasirinkti iš sąrašo telkinio pavadinimą/baro numerį arba įrašykite koordinates.'
        }
      >
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
        onReturn={() => setSelectedToolsGroup(null)}
      />
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

export default CurrentFishingTools;
