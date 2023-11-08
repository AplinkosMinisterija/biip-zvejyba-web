import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { handleAlert } from '../../utils';
import api from '../../utils/api';
import { FishingToolsType } from '../../utils/constants';
import { device } from '../../utils/theme';
import Button from '../buttons/Button';
import SwitchButton from '../buttons/SwitchButton';
import ToolCardSelectable from '../other/ToolCardSelecetable';

const FishingOptions = [
  { label: 'Atskiras įrankis', value: FishingToolsType.SINGLE },
  { label: 'Įrankių grupė', value: FishingToolsType.GROUP },
];
const BuildTools = ({ onClose, location, coordinates }: any) => {
  const queryClient = useQueryClient();
  const [selectedTools, setSelectedTools] = useState<number[]>([]);
  const [type, setType] = useState<FishingToolsType>(FishingToolsType.SINGLE);
  const [toolType, setToolType] = useState<number | null>(null);

  const { data: availableTools, isLoading: availableToolsLoading } = useQuery(
    ['availableTools'],
    () => api.getAvailableTools(),
  );

  const { mutateAsync: buildToolsMutation, isLoading: buildToolsIsLoading } = useMutation(
    api.buildTools,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('availableTools');
        queryClient.invalidateQueries('builtTools');
        setSelectedTools([]);
        onClose();
      },
      onError: ({ response }: any) => {
        handleAlert(response);
      },
    },
  );

  const handleSelectTool = (toolId: number) => {
    if (selectedTools.includes(toolId)) {
      const filtered = selectedTools.filter((id) => id !== toolId);
      setSelectedTools(filtered);
      if (type === FishingToolsType.GROUP && !filtered.length) {
        setToolType(null);
      }
    } else {
      if (type === FishingToolsType.GROUP) {
        setSelectedTools([...selectedTools, toolId]);
        if (toolType === null) {
          setToolType(toolId);
        }
      } else {
        setSelectedTools([toolId]);
      }
    }
  };

  const handleBuildTools = () => {
    if (coordinates) {
      buildToolsMutation({
        tools: selectedTools,
        location,
        coordinates,
      });
    } else {
      //TODO: display error
    }
  };

  return (
    <>
      <PopupContainer>
        <PopupTitle>Įrankių pridėjimas</PopupTitle>
        <StyledSwitchButton
          options={FishingOptions}
          value={type}
          onChange={(value: FishingToolsType) => {
            setType(value);
            setSelectedTools([]);
            if (value === FishingToolsType.SINGLE) {
              setToolType(null);
            }
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
    </>
  );
};

const PopupTitle = styled.div`
  text-align: center;
  margin: 16px 0 0 16px;
  font-size: 2.4rem;
  font-weight: bold;
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
