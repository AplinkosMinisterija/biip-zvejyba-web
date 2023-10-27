import MenuButton from '../buttons/MenuButton.tsx';
import { IconName } from '../other/Icon.tsx';
import styled from 'styled-components';
import Button from '../buttons/Button.tsx';
import SwitchButton from '../buttons/SwitchButton.tsx';
import { device } from '../../utils/theme.ts';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api.ts';

const ToolActions = ({ toolGroup, onReturn }: any) => {
    const queryClient = useQueryClient();

    const { mutateAsync: returnToolsMutation, isLoading: returnToolsIsLoading } = useMutation(
        api.returnTools,
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries('availableTools');
                queryClient.invalidateQueries('builtTools');
                onReturn();
            },
            onError: ({ response }: any) => {
                //TODO: display error
            },
        }
    );
    return (
        <PopupContainer>
            <PopupTitle>{toolGroup?.tools[0]?.toolType?.label}</PopupTitle>
            <PopupSubtitle>
                {toolGroup?.tools?.map((tool: any) => tool.sealNr).join(', ')}
            </PopupSubtitle>
            <MenuButton label="Sverti žuvį laive " icon={IconName.scales} onClick={() => {}} />
            <MenuButton
                label="Sugrąžinti į sandėlį "
                icon={IconName.return}
                onClick={() => (toolGroup?.id ? returnToolsMutation(toolGroup?.id) : {})}
            />
        </PopupContainer>
    );
};

const PopupTitle = styled.div`
    text-align: center;
    margin: 16px 0 0 16px;
    font-size: 2.4rem;
    font-weight: bold;
`;

const PopupSubtitle = styled.div`
    padding: 4px 0 32px 0;
    text-align: center;
`;

const PopupContainer = styled.div`
    padding-top: 68px;
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

export default ToolActions;
