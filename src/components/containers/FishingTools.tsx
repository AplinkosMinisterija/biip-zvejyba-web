import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../state/store';
import api from '../../utils/api';
import { LocationType } from '../../utils/constants';
import { device } from '../../utils/theme';
import { ToolGroup } from '../../utils/types';
import Button from '../buttons/Button';
import Popup from '../layouts/Popup';
import LoaderComponent from '../other/LoaderComponent';
import ToolsGroupCard from '../other/ToolsGroupCard';
import BuildTools from './BuildTools';
import ToolActions from './ToolActions';

const FishingTools = ({ fishing }: any) => {
  const locationType: LocationType = fishing.type;
  const coordinates = useSelector((state: RootState) => state.fishing.coordinates);
  const [showBuildTools, setShowBuildTools] = useState(false);
  const [selectedToolsGroup, setSelectedToolsGroup] = useState<ToolGroup | null>(null);
  const { data: location, isLoading: locationLoading } = useQuery(
    ['location'],
    () =>
      api.getLocation({
        query: {
          type: locationType,
          coordinates: { y: 54.860114825735025, x: 24.159378652040488 },
        },
      }),
    {
      cacheTime: 0,
      staleTime: 0,
    },
  );

  const { data: builtTools } = useQuery(
    ['builtTools', location?.id],
    () => api.getBuiltTools({ locationId: location?.id }),
    {
      enabled: !!location?.id,
    },
  );

  return (
    <>
      <Container>
        {locationLoading ? (
          <LoaderComponent />
        ) : (
          <>
            <Title>{location.name || 'Vieta nenustatyta'}</Title>
            {builtTools?.map((toolsGroup: any) => (
              <ToolsGroupCard
                key={toolsGroup.id}
                toolsGroup={toolsGroup}
                onSelect={setSelectedToolsGroup}
              />
            ))}
            <Footer>
              <StyledButton onClick={() => setShowBuildTools(true)}>Pastatyti įrankį</StyledButton>
            </Footer>
          </>
        )}
      </Container>
      <Popup visible={showBuildTools} onClose={() => setShowBuildTools(false)}>
        <BuildTools
          coordinates={coordinates}
          location={location}
          onClose={() => setShowBuildTools(false)}
        />
      </Popup>

      <ToolActions
        coordinates={coordinates}
        location={location}
        visible={!!selectedToolsGroup}
        toolGroup={selectedToolsGroup}
        onReturn={() => setSelectedToolsGroup(null)}
      />
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
