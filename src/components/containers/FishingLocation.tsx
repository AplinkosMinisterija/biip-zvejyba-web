import styled from 'styled-components';
import { LocationType } from '../../utils';

import FishingLocationButton, { Variant } from '../buttons/FishingLocationButton';
import { useContext } from 'react';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';

const FishingLocation = ({ isDisabled }: any) => {
  const { showPopup } = useContext<PopupContextProps>(PopupContext);
  const handleSelectLocation = (type: LocationType) => () => {
    if (type === LocationType.INLAND_WATERS) {
      showPopup({});
    } else {
      showPopup({});
    }
  };

  return (
    <>
      <Container>
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
          isDisabled={isDisabled}
          title="Kuršių mariose"
          image={'/marios.png'}
          onClick={handleSelectLocation(LocationType.ESTUARY)}
        />
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
          isDisabled={isDisabled}
          title="Vidaus vandenyse"
          image={'/vidaus_vandens_telkiniai.png'}
          onClick={handleSelectLocation(LocationType.INLAND_WATERS)}
        />
        <FishingLocationButton
          variant={Variant.GHOST_WHITE}
          isDisabled={isDisabled}
          title="Polderiuose"
          image={'/polderiai.png'}
          onClick={handleSelectLocation(LocationType.POLDERS)}
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
