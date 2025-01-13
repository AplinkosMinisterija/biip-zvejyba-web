import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { LocationType, slugs } from '../../utils';
import api from '../../utils/api';
import MenuButton from '../buttons/MenuButton';
import { IconName } from '../other/Icon';
import Popup from '../layouts/Popup';
import styled from 'styled-components';

const ToolActionsPopup = ({ toolGroup, onReturn, visible, location }: any) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
        toolGroup?.id,
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
      visible={visible}
      onClose={onReturn}
      title={toolGroup?.tools[0]?.toolType?.label}
      subTitle={toolGroup?.tools?.map((tool: any) => tool.sealNr).join(', ')}
    >
      <PopupContainer>
        {currentFishing?.type !== LocationType.INLAND_WATERS && (
          <MenuButton
            label="Sverti žuvį laive "
            icon={IconName.scales}
            onClick={() => {
              navigate(slugs.fishingToolCaughtFishes(toolGroup?.id));
            }}
          />
        )}
        <MenuButton
          label="Sugrąžinti į sandėlį "
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

export default ToolActionsPopup;
