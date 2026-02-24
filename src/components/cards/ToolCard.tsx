import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { handleErrorToastFromServer } from '../../utils';
import api from '../../utils/api';
import { Tool, ToolType } from '../../utils/types';
import OptionsContainer from '../fields/components/OptionsContainer';
import Icon, { IconName } from '../other/Icon';
import Loader from '../other/Loader';

interface ToolCardProps {
  toolGroupInfo: { id: number; tools: Tool[]; toolType: ToolType; isInWater: boolean };
  onClick: (id: number) => void;
  connectOptions: { tools: Tool[]; toolType: ToolType; isInWater: boolean }[];
}

const ToolCard = ({ toolGroupInfo, onClick, connectOptions }: ToolCardProps) => {
  const queryClient = useQueryClient();
  const [openConnect, setOpenConnect] = useState(false);
  const [openDisconnect, setOpenDisconnect] = useState(false);

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      // setOpenDisconnect(false);
      // setOpenConnect(false);
    }
  };

  const { mutateAsync: connectToolMutation, isLoading: connectToolIsLoading } = useMutation(
    (data: any) => {
      return api.connectTools(data, `${toolGroupInfo.id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tools');
      },
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
    },
  );

  const { mutateAsync: disconnectToolMutation, isLoading: disconnectToolIsLoading } = useMutation(
    (data: any) => {
      return api.disconnectTools(data, `${toolGroupInfo.id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tools');
      },
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
    },
  );

  const isInWater = toolGroupInfo.isInWater;
  const location = isInWater
    ? toolGroupInfo.tools?.[0]?.toolsGroup?.buildEvent?.location
    : undefined;

  const isEstuary = location?.name?.includes('baras');

  const toolLabel = toolGroupInfo?.toolType?.label ?? 'Įrankis';
  const sealNr = toolGroupInfo.tools.map((tool) => `(${tool.sealNr})`);

  const canOpenTool = toolGroupInfo.tools.length === 1;
  const canDisconnect = !isInWater && toolGroupInfo.tools.length > 1;
  const canConnect = !isInWater && connectOptions.length;

  return (
    <Container onClick={() => (canOpenTool ? onClick(toolGroupInfo.tools[0].id) : undefined)}>
      <InnerContainer>
        <IconContainer>
          {!isInWater && <Icon name={IconName.home} />}
          {isEstuary && <BarNumber>{location?.name?.replace(/[^\d]/g, '')}</BarNumber>}
          {isInWater && !isEstuary && <Icon name={IconName.tools} />}
        </IconContainer>
        <div>
          <ToolName>{toolLabel}</ToolName>
          <div> Plombų nr.: {sealNr.join(',')}</div>
        </div>
      </InnerContainer>
      <InnerContainer>
        {canConnect ? (
          <RelativeContainer>
            <IconContainer
              tabIndex={1}
              onBlur={handleBlur}
              onClick={(e) => {
                if (connectToolIsLoading) return;

                e.stopPropagation();
                setOpenConnect(!openConnect);
              }}
            >
              {connectToolIsLoading ? <Loader /> : <Icon name={IconName.connect} />}
            </IconContainer>
            <StyledOptionsContainer
              getOptionLabel={(item) =>
                `${item.toolType.label} Kiekis: ${item.tools.length} Plombų nr: (${item.tools.map(
                  (tool: any) => tool?.sealNr,
                )})`
              }
              values={connectOptions}
              showSelect={openConnect}
              handleClick={(option) => {
                connectToolMutation({ tools: option.tools.map((tool: any) => tool.id) });
                setOpenConnect(false);
              }}
            />
          </RelativeContainer>
        ) : (
          <></>
        )}

        {canDisconnect ? (
          <RelativeContainer>
            <IconContainer
              tabIndex={1}
              onBlur={handleBlur}
              onClick={(e) => {
                if (disconnectToolIsLoading) return;

                e.stopPropagation();
                setOpenDisconnect(!openDisconnect);
              }}
            >
              {disconnectToolIsLoading ? <Loader /> : <Icon name={IconName.disconnect} />}
            </IconContainer>
            <StyledOptionsContainer
              getOptionLabel={(item) => `${item.toolType.label} Plombos nr. ${item.sealNr}`}
              values={toolGroupInfo.tools}
              showSelect={openDisconnect}
              handleClick={(option) => {
                disconnectToolMutation({ tools: [option.id] });
                setOpenDisconnect(false);
              }}
            />
          </RelativeContainer>
        ) : (
          <></>
        )}
      </InnerContainer>
    </Container>
  );
};

const Container = styled.div`
  cursor: pointer;
  width: 100%;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.largeButton.GREY};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  gap: 12px;
  border: 1px solid transparent;
  position: relative;
  flex-wrap: wrap;

  &:hover {
    background-color: #f5f6fe;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const RelativeContainer = styled.div``;

const StyledOptionsContainer = styled(OptionsContainer)`
  position: absolute;
  top: 70px;
  left: 0;
`;

const IconContainer = styled.div`
  background-color: white;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BarNumber = styled.div``;

const ToolName = styled.div`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2px;
`;

export default ToolCard;
