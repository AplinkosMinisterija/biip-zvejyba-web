import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { handleErrorToast, handleErrorToastFromServer, useGeolocation } from '../../utils';
import api from '../../utils/api';
import { Location, Tool, ToolType } from '../../utils/types';
import Button from '../buttons/Button';
import ToolCardSelectable from '../cards/ToolCardSelecetable';
import { Footer } from '../other/CommonStyles';
import { NotFound } from '../other/NotFound';

interface BuiltToolsProps {
  onClose: () => void;
  location: Location;
}

const BuildTools = ({ onClose, location }: BuiltToolsProps) => {
  const queryClient = useQueryClient();
  const [selectedTool, setSelectedTool] = useState<number>();
  const { coordinates, loading } = useGeolocation();

  const { data: availableTools } = useQuery(['availableTools'], () => api.getAvailableTools(), {
    retry: false,
  });

  const { mutateAsync: buildToolsMutation, isLoading: buildToolsIsLoading } = useMutation(
    (data: any) => {
      return api.buildTools(data, `${selectedTool}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('availableTools');
        queryClient.invalidateQueries('builtTools');
        setSelectedTool(undefined);
        onClose();
      },
      onError: ({ response }: any) => {
        handleErrorToastFromServer(response);
      },
    },
  );

  const groupedByToolGroup = availableTools?.reduce(
    (tools, currentTool) => {
      const currentToolGroupId = currentTool.toolsGroup?.id;
      if (currentToolGroupId && tools[currentToolGroupId]) {
        tools[currentToolGroupId].tools.push(currentTool);
      } else if (currentToolGroupId) {
        tools[currentToolGroupId] = {
          id: currentToolGroupId,
          isInWater: !!currentTool?.toolsGroup?.buildEvent && !currentTool?.toolsGroup.removeEvent,
          toolType: currentTool.toolType,
          tools: [currentTool],
        };
      }

      return tools;
    },
    {} as { [key: string]: { id: number; tools: Tool[]; toolType: ToolType; isInWater: boolean } },
  );

  const handleSelectTool = (toolId: number) => {
    setSelectedTool(toolId);
  };

  const handleBuildTools = () => {
    const buildToolsCoordinates: any = {
      x: location?.x || coordinates?.x,
      y: location?.y || coordinates?.y,
    };
    if (buildToolsCoordinates.x && buildToolsCoordinates.y) {
      buildToolsMutation({
        tools: selectedTool,
        location,
        coordinates: buildToolsCoordinates,
      });
    } else {
      handleErrorToast('Nenustatyta buvimo vieta');
    }
  };

  return (
    <>
      <PopupContainer>
        <PopupTitle>Įrankių pridėjimas</PopupTitle>

        {isEmpty(availableTools) ? (
          <NotFound message={'Nėra laisvų įrankių sandėlyje'} />
        ) : (
          <>
            {Object.values(groupedByToolGroup || {}).map((currentToolGroup) => (
              <ToolCardSelectable
                key={currentToolGroup.id}
                toolGroupInfo={currentToolGroup}
                selected={selectedTool === currentToolGroup.id}
                onSelect={handleSelectTool}
              />
            ))}
          </>
        )}
        <Footer>
          <StyledButton
            onClick={handleBuildTools}
            loading={buildToolsIsLoading}
            disabled={buildToolsIsLoading || !selectedTool || loading}
          >
            Pastatyti
          </StyledButton>
        </Footer>
      </PopupContainer>
    </>
  );
};

const PopupTitle = styled.div`
  text-align: center;
  font-size: 2.4rem;
  font-weight: bold;
`;

const PopupContainer = styled.div`
  padding-top: 68px;
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

export default BuildTools;
