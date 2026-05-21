import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  handleErrorToastFromServer,
  LocationType,
  PopupContentType,
  requireCoordinates,
  useCurrentFishing,
  useGeolocation,
} from '../../utils';
import api from '../../utils/api';
import MenuButton from '../buttons/MenuButton';
import Popup from '../layouts/Popup';
import { IconName } from '../other/Icon';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';
import LoaderComponent from '../other/LoaderComponent';

const ToolGroupAction = ({ onClose, content }: any) => {
  const {
    toolsGroup,
    location,
    showWeightButtons,
    showCheckButton,
    canReturnToWarehouse = true,
  } = content;
  const { coordinates, loading, refresh: refreshGeolocation } = useGeolocation();
  const { data: currentFishing, isFetching: currentFishingLoading } = useCurrentFishing();

  const queryClient = useQueryClient();
  const { showPopup } = useContext<PopupContextProps>(PopupContext);

  const { mutateAsync: weighToolsMutation, isLoading: weighToolsIsLoading } = useMutation(
    (data: any) => {
      return api.weighTools(data, toolsGroup.id);
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['builtTools', location?.id]);
        queryClient.invalidateQueries(['fishingWeights', toolsGroup?.id]);
        onClose();
      },
      onError: ({ response }: any) => {
        handleErrorToastFromServer(response);
      },
    },
  );

  // Set in LocationForm when the user types WGS coordinates — admin uses
  // this to render a warning on the affected events.
  const locationManual = !!location?.manual;

  const handleSubmit = () => {
    const coords = requireCoordinates({ coordinates, loading, refresh: refreshGeolocation });
    if (!coords) return;
    weighToolsMutation({
      data: {},
      coordinates: coords,
      location,
      locationManual,
    });
  };

  const handleReturnTools = () => {
    const coords = requireCoordinates({ coordinates, loading, refresh: refreshGeolocation });
    if (!coords) return;
    returnToolsMutation({ coordinates: coords });
  };

  const { mutateAsync: returnToolsMutation, isLoading: removeToolLoading } = useMutation(
    ({ coordinates: coords }: { coordinates: { x: number; y: number } }) =>
      api.removeTool(
        {
          location,
          coordinates: coords,
          locationManual,
        },
        toolsGroup?.id,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('availableTools');
        queryClient.invalidateQueries('builtTools');
        onClose();
      },
    },
  );
  return (
    <Popup
      visible={true}
      onClose={onClose}
      title={toolsGroup?.tools[0]?.toolType?.label}
      subTitle={toolsGroup?.tools?.map((tool: any) => tool.sealNr).join(', ')}
    >
      {currentFishingLoading ? (
        <LoaderComponent />
      ) : (
        <PopupContainer>
          {showWeightButtons && (
            <>
              <MenuButton
                label={
                  currentFishing?.type === LocationType.ESTUARY
                    ? 'Sverti žuvį laive'
                    : 'Apytikslis svoris'
                }
                icon={IconName.scales}
                onClick={() => {
                  showPopup({
                    type: PopupContentType.CAUGHT_FISH_WEIGHT,
                    content: {
                      location,
                      toolsGroup,
                    },
                  });
                }}
              />
              {showCheckButton && (
                <MenuButton
                  label="Patikrinta"
                  icon={IconName.check}
                  onClick={handleSubmit}
                  loading={weighToolsIsLoading}
                />
              )}
            </>
          )}
          {canReturnToWarehouse && (
            <MenuButton
              label="Sugrąžinti į sandėlį"
              icon={IconName.return}
              onClick={handleReturnTools}
              loading={removeToolLoading || loading}
              isActive={!removeToolLoading}
            />
          )}
        </PopupContainer>
      )}
    </Popup>
  );
};
const PopupContainer = styled.div`
  padding-top: 68px;
`;

export default ToolGroupAction;
