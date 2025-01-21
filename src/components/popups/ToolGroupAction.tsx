import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { LocationType, PopupContentType } from '../../utils';
import api from '../../utils/api';
import MenuButton from '../buttons/MenuButton';
import { IconName } from '../other/Icon';
import Popup from '../layouts/Popup';
import styled from 'styled-components';
import { useContext } from 'react';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';

const ToolGroupAction = ({ onClose, content }: any) => {
  const { toolsGroup, onReturn, location } = content;

  const queryClient = useQueryClient();
  const { showPopup } = useContext<PopupContextProps>(PopupContext);

  const { data: currentFishing } = useQuery(['currentFishing'], () => api.getCurrentFishing(), {
    retry: false,
  });

  const { mutateAsync: returnToolsMutation } = useMutation(
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
        onReturn();
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
        />
      </PopupContainer>
    </Popup>
  );
};
const PopupContainer = styled.div`
  padding-top: 68px;
`;

export default ToolGroupAction;
