import { useMutation, useQuery, useQueryClient } from 'react-query';
import { LocationType, PopupContentType } from '../../utils';
import api from '../../utils/api';
import MenuButton from '../buttons/MenuButton';
import { IconName } from '../other/Icon';
import Popup from '../layouts/Popup';
import styled from 'styled-components';
import { useContext } from 'react';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';
import LoaderComponent from '../other/LoaderComponent';

const ToolGroupAction = ({ onClose, content }: any) => {
  const { toolsGroup, location } = content;

  const queryClient = useQueryClient();
  const { showPopup } = useContext<PopupContextProps>(PopupContext);

  const { data: currentFishing, isLoading } = useQuery(
    ['currentFishing'],
    () => api.getCurrentFishing(),
    {
      retry: false,
    },
  );

  const { mutateAsync: returnToolsMutation, isLoading: removeToolLoading } = useMutation(
    () =>
      api.removeTool(
        {
          location,
          coordinates: window.coordinates as any,
        },
        toolsGroup?.id,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('availableTools');
        queryClient.invalidateQueries('builtTools');
        onClose();
      },
      onError: () => {
        //TODO: display error
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
            {currentFishing?.type !== LocationType.INLAND_WATERS && (
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
            )}
            <MenuButton
              label="Sugrąžinti į sandėlį"
              icon={IconName.return}
              onClick={returnToolsMutation}
              loading={removeToolLoading}
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
