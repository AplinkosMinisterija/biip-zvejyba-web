import { isEmpty, map } from 'lodash';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { actions } from '../../state/fishing/reducer';
import {
  device,
  getBars,
  handleErrorToast,
  LocationType,
  ToolsGroup,
  useAppSelector,
  validationTexts,
} from '../../utils';
import api from '../../utils/api';
import Button, { ButtonColors } from '../buttons/Button';
import ToolsGroupCard from '../cards/ToolsGroupCard';
import LocationForm from '../forms/LocationForm';
import Popup from '../layouts/Popup';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { Footer, IconContainer } from '../other/CommonStyles';
import Icon, { IconName } from '../other/Icon';
import LoaderComponent from '../other/LoaderComponent';
import { NotFound } from '../other/NotFound';
import BuildTools from './BuildTools';
import ToolActions from './ToolActions';

const FishingTools = ({ coordinates, isDisabled }: { coordinates: any; isDisabled: boolean }) => {
  const dispatch = useDispatch();
  const [showBuildTools, setShowBuildTools] = useState(false);
  const [showLocationPopUp, setShowLocationPopUp] = useState(false);
  const [selectedToolsGroup, setSelectedToolsGroup] = useState<ToolsGroup>();
  const location = useAppSelector((state) => state.fishing.location);

  const { data: currentFishing } = useQuery(['currentFishing'], () => api.getCurrentFishing(), {
    retry: false,
  });
  const locationType: LocationType = currentFishing?.type;
  const isEstuary = locationType === LocationType.ESTUARY;

  const { mutateAsync: getLocationMutation, isLoading: locationMutationLoading } = useMutation(
    (coordinates: any) =>
      api.getLocation({
        query: {
          type: locationType,
          coordinates,
        },
      }),
    {
      onSuccess: (value) => {
        if (value) {
          dispatch(actions.setLocation(value));
          return;
        }

        handleErrorToast(validationTexts.failedToSetLocation);
      },
    },
  );

  const { isFetching: locationFetching } = useQuery(
    ['location'],
    () =>
      api.getLocation({
        query: {
          type: locationType,
          coordinates,
        },
      }),
    {
      onSuccess: (value) => {
        if (value) dispatch(actions.setLocation(value));
      },
      enabled: !isDisabled || coordinates || !location,
      retry: false,
    },
  );

  const { data: bars } = useQuery(['bars'], async () => getBars(), {
    enabled: isEstuary,
    retry: false,
  });

  const { data: builtTools } = useQuery(
    ['builtTools', location?.id],
    () => api.getBuiltTools({ locationId: location?.id }),
    {
      retry: false,
      enabled: !!location?.id,
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

  const showEditIcon = location?.name && location.type !== LocationType.POLDERS;

  return (
    <>
      {!locationFetching && (
        <TitleWrapper>
          <Title>{location?.name || 'Nenustatytas vandens telkinys'}</Title>
          {showEditIcon && (
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
                  disabled={locationMutationLoading || isDisabled}
                  onClick={() => {
                    setShowLocationPopUp(true);
                  }}
                >
                  {'Nustatyti rankiniu būdu'}
                </Button>
                <Button
                  loading={locationMutationLoading}
                  disabled={locationMutationLoading || isDisabled}
                  variant={ButtonColors.SECONDARY}
                  onClick={() => getLocationMutation(coordinates)}
                >
                  {'Atnaujinti lokaciją'}
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
      {location?.name && (
        <>
          <Footer>
            <StyledButton disabled={isDisabled} onClick={() => setShowBuildTools(true)}>
              Pastatyti įrankį
            </StyledButton>
          </Footer>
          <Popup visible={showBuildTools} onClose={() => setShowBuildTools(false)}>
            <BuildTools
              coordinates={coordinates || undefined}
              location={location}
              onClose={() => setShowBuildTools(false)}
            />
          </Popup>
        </>
      )}

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
