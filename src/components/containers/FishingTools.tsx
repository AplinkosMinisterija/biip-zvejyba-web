import styled from 'styled-components';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '../../utils/api';
import { useSelector } from 'react-redux';
import { LocationType } from '../../utils/constants';
import { RootState } from '../../state/store';
import LoaderComponent from '../other/LoaderComponent';
import Button from '../buttons/Button';
import Popup from '../layouts/Popup';
import { useState } from 'react';
import ToolCardSelectable from '../other/ToolCardSelecetable';
import SwitchButton from '../buttons/SwitchButton';
import ToolsGroupCard from '../other/ToolsGroupCard';
import { device } from '../../utils/theme.ts';
import { ToolGroup } from '../../utils/types.ts';
import MenuButton from '../buttons/MenuButton.tsx';
import { IconName } from '../other/Icon.tsx';

export enum FishingToolsType {
    GROUP = 'GROUP',
    SINGLE = 'SINGLE',
}

const FishingOptions = [
    { label: 'Atskiras įrankis', value: FishingToolsType.SINGLE },
    { label: 'Įrankių grupė', value: FishingToolsType.GROUP },
];
const FishingTools = ({ fishing }: any) => {
    const queryClient = useQueryClient();
    const locationType: LocationType = fishing.type;
    const coordinates = useSelector((state: RootState) => state.fishing.coordinates);
    const [showBuildTools, setShowBuildTools] = useState(false);
    const [selectedTools, setSelectedTools] = useState<number[]>([]);
    const [toolsType, setToolsType] = useState<FishingToolsType>(FishingToolsType.SINGLE);
    const [selectedToolsGroup, setSelectedToolsGroup] = useState<ToolGroup | null>(null);
    console.log('selectedToolsGroup', selectedToolsGroup);
    const { data: location, isLoading: locationLoading } = useQuery(
        ['location'],
        () =>
            api.getLocation({
                query: {
                    type: locationType,
                    coordinates: JSON.stringify(coordinates),
                },
            }),
        {
            cacheTime: 0,
            staleTime: 0,
        }
    );

    const { data: availableTools, isLoading: availableToolsLoading } = useQuery(
        ['availableTools'],
        () => api.getAvailableTools()
    );

    const { data: builtTools, isLoading: builtToolsLoading } = useQuery(
        ['builtTools', location?.id],
        () => api.getBuiltTools({ locationId: location?.id })
    );

    const { mutateAsync: buildToolsMutation, isLoading: buildToolsIsLoading } = useMutation(
        api.buildTools,
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries('availableTools');
                queryClient.invalidateQueries('builtTools');
                setSelectedTools([]);
                setShowBuildTools(false);
            },
            onError: ({ response }: any) => {
                //TODO: display error
            },
        }
    );

    const { mutateAsync: returnToolsMutation, isLoading: returnToolsIsLoading } = useMutation(
        api.returnTools,
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries('availableTools');
                queryClient.invalidateQueries('builtTools');
                setSelectedToolsGroup(null);
            },
            onError: ({ response }: any) => {
                //TODO: display error
            },
        }
    );

    const handleSelectTool = (toolId: number) => {
        if (selectedTools.includes(toolId)) {
            setSelectedTools(selectedTools.filter((id) => id !== toolId));
        } else {
            if (toolsType === FishingToolsType.GROUP) {
                setSelectedTools([...selectedTools, toolId]);
            } else {
                setSelectedTools([toolId]);
            }
        }
    };

    const handleBuildTools = () => {
        if (coordinates) {
            buildToolsMutation({
                tools: selectedTools,
                location: location.id,
                locationName: location.name,
                coordinates,
            });
        } else {
            //TODO: display error
        }
    };

    return (
        <>
            <Container>
                {locationLoading ? (
                    <LoaderComponent />
                ) : (
                    <>
                        <Title>{location?.name ? location.name : 'Vieta nenustatyta'}</Title>
                        {builtTools?.map((toolsGroup: any) => (
                            <ToolsGroupCard
                                key={toolsGroup.id}
                                toolsGroup={toolsGroup}
                                onSelect={setSelectedToolsGroup}
                            />
                        ))}
                        <Footer>
                            <StyledButton onClick={() => setShowBuildTools(true)}>
                                Pastatyti įrankį
                            </StyledButton>
                        </Footer>
                    </>
                )}
            </Container>
            <Popup visible={showBuildTools} onClose={() => setShowBuildTools(false)}>
                <PopupContainer>
                    <PopupTitle>Įrankių pridėjimas</PopupTitle>
                    <StyledSwitchButton
                        options={FishingOptions}
                        value={toolsType}
                        onChange={(value: FishingToolsType) => {
                            setToolsType(value);
                            setSelectedTools([]);
                        }}
                    />
                    {availableTools?.map((tool: any) => (
                        <ToolCardSelectable
                            tool={tool}
                            selected={selectedTools.includes(tool.id)}
                            onSelect={handleSelectTool}
                        />
                    ))}
                    <Footer>
                        <StyledButton
                            onClick={handleBuildTools}
                            loading={buildToolsIsLoading}
                            disabled={buildToolsIsLoading}
                        >
                            Pastatyti
                        </StyledButton>
                    </Footer>
                </PopupContainer>
            </Popup>

            <Popup visible={!!selectedToolsGroup} onClose={() => setSelectedToolsGroup(null)}>
                <PopupContainer>
                    <PopupTitle>{selectedToolsGroup?.tools[0]?.toolType?.label}</PopupTitle>
                    <PopupSubtitle>
                        {selectedToolsGroup?.tools?.map((tool: any) => tool.sealNr).join(', ')}
                    </PopupSubtitle>
                    <MenuButton
                        label="Sverti žuvį laive "
                        icon={IconName.scales}
                        onClick={() => {}}
                    />
                    <MenuButton
                        label="Sugrąžinti į sandėlį "
                        icon={IconName.return}
                        onClick={() =>
                            selectedToolsGroup?.id
                                ? returnToolsMutation(selectedToolsGroup?.id)
                                : {}
                        }
                    />
                </PopupContainer>
            </Popup>
        </>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Title = styled.div`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 3.2rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 40px;
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

const StyledSwitchButton = styled(SwitchButton)`
    padding: 32px 0 16px 0;
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

export default FishingTools;
