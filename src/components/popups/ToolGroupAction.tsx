import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  handleErrorToast,
  handleErrorToastFromServer,
  LocationType,
  PopupContentType,
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
  const { toolsGroup, location, showWeightButtons, showCheckButton } = content;
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
    if (coordinates?.x && coordinates?.y) {
      const params = {
        data: {},
        coordinates,
        location,
        locationManual,
      };
      weighToolsMutation(params);
      return;
    }
    refreshGeolocation();
    handleErrorToast(
      'Nepavyko nustatyti jūsų vietos. Pabandykite dar kartą vėliau ir įsitikinkite, kad naršyklėje suteikti vietos nustatymo leidimai.',
    );
  };

  const { mutateAsync: returnToolsMutation, isLoading: removeToolLoading } = useMutation(
    () =>
      api.removeTool(
        {
          location,
          coordinates: coordinates as any,
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
          <MenuButton
            label="Sugrąžinti į sandėlį"
            icon={IconName.return}
            onClick={returnToolsMutation}
            loading={removeToolLoading || loading}
            isActive={!removeToolLoading}
          />
        </PopupContainer>
      )}
    </Popup>
  );
};
const PopupContainer = styled.div`
  padding-top: 68px;
`;

export default ToolGroupAction;
