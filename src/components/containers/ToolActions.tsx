import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';
import MenuButton from '../buttons/MenuButton';
import PopUpWithTitles from '../layouts/PopUpWithTitle';
import { IconName } from '../other/Icon';

const ToolActions = ({ toolGroup, onReturn, visible, coordinates, location }: any) => {
  const queryClient = useQueryClient();

  const { mutateAsync: returnToolsMutation } = useMutation(
    () =>
      api.removeTool(
        {
          location,
          coordinates,
        },
        toolGroup?.id,
      ),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('availableTools');
        queryClient.invalidateQueries('builtTools');
        onReturn();
      },
      onError: ({ response }: any) => {
        //TODO: display error
      },
    },
  );
  return (
    <PopUpWithTitles
      visible={visible}
      onClose={onReturn}
      title={toolGroup?.tools[0]?.toolType?.label}
      subTitle={toolGroup?.tools?.map((tool: any) => tool.sealNr).join(', ')}
    >
      <MenuButton label="Sverti žuvį laive " icon={IconName.scales} onClick={() => {}} />
      <MenuButton label="Sujungti įrankius " icon={IconName.connection} onClick={() => {}} />
      <MenuButton
        label="Sugrąžinti į sandėlį "
        icon={IconName.return}
        onClick={returnToolsMutation}
      />
    </PopUpWithTitles>
  );
};

export default ToolActions;
