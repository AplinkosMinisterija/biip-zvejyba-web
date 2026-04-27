import styled from 'styled-components';
import { LocationType, PopupContentType } from '../../utils';

import { useContext } from 'react';
import FishingLocationButton, { Variant } from '../buttons/FishingLocationButton';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';

const FishingLocation = () => {
  const { showPopup } = useContext<PopupContextProps>(PopupContext);
  return (
    <>
      <Container>
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
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
          title="Vidaus vandenyse"
          image={'/vidaus_vandens_telkiniai.jpg'}
          onClick={() => {
            showPopup({
              type: PopupContentType.START_FISHING,
              content: { type: LocationType.INLAND_WATERS },
            });
          }}
        />
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
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
