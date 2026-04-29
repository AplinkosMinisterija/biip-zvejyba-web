import { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  handleErrorToast,
  handleErrorToastFromServer,
  isShoreOnlyWeighing,
  PopupContentType,
  useGeolocation,
} from '../../utils';
import api from '../../utils/api';
import MenuButton from '../buttons/MenuButton';
import Popup from '../layouts/Popup';
import { IconName } from '../other/Icon';
import LoaderComponent from '../other/LoaderComponent';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';

const ToolGroupAction = ({ onClose, content }: any) => {
  const { toolsGroup, location, showWeightButtons, showCheckButton } = content;
  const { coordinates, loading } = useGeolocation();

  const queryClient = useQueryClient();
  const { showPopup } = useContext<PopupContextProps>(PopupContext);

  const { data: currentFishing, isLoading } = useQuery(
    ['currentFishing'],
    () => api.getCurrentFishing(),
    {
      retry: false,
    },
  );

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

  const handleSubmit = () => {
    if (coordinates?.x && coordinates?.y) {
      const params = {
        data: {},
        coordinates,
        location,
      };
      weighToolsMutation(params);
    } else {
      handleErrorToast(
        'Nepavyko nustatyti jūsų vietos. Pabandykite dar kartą vėliau ir įsitikinkite, kad naršyklėje suteikti vietos nustatymo leidimai.',
      );
    }
  };

  const { mutateAsync: returnToolsMutation, isLoading: removeToolLoading } = useMutation(
    () =>
      api.removeTool(
        {
          location,
          coordinates: coordinates as any,
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
      <PopupContainer>
        {isLoading ? (
          <LoaderComponent />
        ) : (
          <>
            {!isShoreOnlyWeighing(currentFishing?.type) && showWeightButtons && (
              <>
                <MenuButton
                  label="Sverti žuvį laive "
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
          </>
        )}
      </PopupContainer>
    </Popup>
  );
};
const PopupContainer = styled.div`
  padding-top: 68px;
`;

export default ToolGroupAction;
