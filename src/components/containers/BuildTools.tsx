import { isEmpty, map } from 'lodash';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { Coordinates, handleErrorToastFromServer } from '../../utils';
import api from '../../utils/api';
import { FishingToolsType } from '../../utils/constants';
import { Location } from '../../utils/types';
import Button from '../buttons/Button';
import SwitchButton from '../buttons/SwitchButton';
import ToolCardSelectable from '../cards/ToolCardSelecetable';
import { Footer } from '../other/CommonStyles';
import { NotFound } from '../other/NotFound';

const FishingOptions = [
  { label: 'Atskiras įrankis', value: FishingToolsType.SINGLE },
  { label: 'Įrankių grupė', value: FishingToolsType.GROUP },
];

interface BuiltToolsProps {
  onClose: () => void;
  location: Location;
  coordinates?: Coordinates;
}
const BuildTools = ({ onClose, location, coordinates }: BuiltToolsProps) => {
  const queryClient = useQueryClient();
  const [selectedTools, setSelectedTools] = useState<number[]>([]);
  const [type, setType] = useState<FishingToolsType>(FishingToolsType.SINGLE);
  const [toolType, setToolType] = useState<number | null>(null);

  const { data: availableTools } = useQuery(['availableTools'], () => api.getAvailableTools(), {
    retry: false,
  });

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
        handleErrorToastFromServer(response);
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
        <SwitchButton
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
        {isEmpty(availableTools) ? (
          <NotFound message={'Nėra laisvų įrankių sandėlyje'} />
        ) : (
          <>
            {map(availableTools, (tool: any) => (
              <ToolCardSelectable
                tool={tool}
                selected={selectedTools.includes(tool.id)}
                onSelect={handleSelectTool}
              />
            ))}
          </>
        )}
        <Footer>
          <StyledButton
            onClick={handleBuildTools}
            loading={buildToolsIsLoading}
            disabled={buildToolsIsLoading || !selectedTools.length}
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
