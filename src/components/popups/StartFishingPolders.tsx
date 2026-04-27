import { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  buttonLabels,
  handleErrorToast,
  handleErrorToastFromServer,
  LocationType,
  PopupContentType,
  Polder,
  useGeolocation,
  validationTexts,
} from '../../utils';
import api from '../../utils/api';
import Button, { ButtonColors } from '../buttons/Button';
import SelectField from '../fields/SelectField';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { Grid } from '../other/CommonStyles';
import { IconName } from '../other/Icon';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';

const StartFishingPolders = ({ onClose }: any) => {
  const queryClient = useQueryClient();
  const { showPopup } = useContext<PopupContextProps>(PopupContext);
  const [polder, setPolder] = useState<Polder | null>(null);
  const { coordinates, loading: geoLoading } = useGeolocation();

  const { data: polders = [], isLoading: poldersLoading } = useQuery<Polder[]>(
    ['polders'],
    () => api.getPolders(),
    { retry: false, refetchOnWindowFocus: false },
  );

  const { isLoading: startLoading, mutateAsync: startFishing } = useMutation(api.startFishing, {
    onError: ({ response }: any) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('currentFishing');
      onClose();
    },
    retry: false,
  });

  const handleStartFishing = () => {
    if (!polder) return;
    if (!coordinates) {
      handleErrorToast(validationTexts.mustAllowToSetCoordinates);
      return;
    }
    startFishing({
      type: LocationType.POLDERS,
      polderId: polder.id,
      coordinates,
    });
  };

  return (
    <PopUpWithImage
      title={'Žvejyba polderyje'}
      description={'Pasirinkite polderį, kuriame žvejosite'}
      iconName={IconName.startFishing}
      visible={true}
      onClose={onClose}
    >
      <Container>
        <StyledSelectField
          name={'polder'}
          value={polder}
          label={'Polderis'}
          options={polders}
          onChange={(value: Polder) => setPolder(value)}
          getOptionLabel={(option: Polder) => option?.name}
        />
        <Grid $columns={2}>
          <Button
            loading={startLoading}
            disabled={startLoading || poldersLoading || geoLoading || !polder}
            onClick={handleStartFishing}
          >
            {buttonLabels.startFishing}
          </Button>
          <Button
            loading={startLoading}
            disabled={startLoading}
            variant={ButtonColors.SECONDARY}
            onClick={() => {
              showPopup({
                type: PopupContentType.SKIP_FISHING,
                content: { locationType: LocationType.POLDERS, polderId: polder?.id },
              });
            }}
          >
            {buttonLabels.cantFishing}
          </Button>
        </Grid>
      </Container>
    </PopUpWithImage>
  );
};

const Container = styled.div`
  width: 100%;
`;

const StyledSelectField = styled(SelectField)`
  margin-bottom: 16px;
`;

export default StartFishingPolders;
