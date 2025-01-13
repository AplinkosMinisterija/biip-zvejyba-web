import styled from 'styled-components';
import { LocationType, PopupContentType } from '../../utils';

import FishingLocationButton, { Variant } from '../buttons/FishingLocationButton';
import { useContext } from 'react';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';

const FishingLocation = ({ isDisabled }: any) => {
  const { showPopup } = useContext<PopupContextProps>(PopupContext);

  return (
    <>
      <Container>
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
          isDisabled={isDisabled}
          title="Kuršių mariose"
          image={'/marios.jpg'}
          onClick={() => {
            showPopup({
              type: PopupContentType.START_FISHING,
              content: { type: LocationType.ESTUARY },
            });
          }}
        />
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
          isDisabled={isDisabled}
          title="Vidaus vandenyse"
          image={'/vidaus_vandens_telkiniai.jpg'}
          onClick={() => {
            showPopup({ type: PopupContentType.START_FISHING_INLAND_WATERS });
          }}
        />
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
          isDisabled={isDisabled}
          title="Polderiuose"
          image={'/polderiai.jpg'}
          onClick={() => {
            showPopup({
              type: PopupContentType.START_FISHING,
              content: { type: LocationType.POLDERS },
            });
          }}
        />
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-bottom: 40px;
`;

export default FishingLocation;
