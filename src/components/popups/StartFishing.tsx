import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  buttonLabels,
  handleErrorToast,
  handleErrorToastFromServer,
  PopupContentType,
  useGeolocation,
  validationTexts,
} from '../../utils';
import api from '../../utils/api';
import Button, { ButtonColors } from '../buttons/Button';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { Grid } from '../other/CommonStyles';
import { IconName } from '../other/Icon';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';

export const StartFishing = ({ content, onClose }: any) => {
  const queryClient = useQueryClient();
  const { type } = content;
  const { showPopup } = useContext<PopupContextProps>(PopupContext);
  const { coordinates, loading } = useGeolocation();

  const { isLoading: startLoading, mutateAsync: startFishing } = useMutation(api.startFishing, {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('currentFishing');
      onClose();
    },
    retry: false,
  });

  const handleStartFishing = () => {
    if (coordinates && type) {
      startFishing({
        type: type,
        coordinates,
      });
    } else {
      handleErrorToast(validationTexts.mustAllowToSetCoordinates);
    }
  };

  return (
    <PopUpWithImage
      iconName={IconName.startFishing}
      visible={true}
      onClose={onClose}
      title={'Žvejybos pradžia'}
      description={'Lengvai ir paprastai praneškite apie žvejybos pradžią'}
    >
      <Grid $columns={2}>
        <Button
          loading={startLoading}
          disabled={startLoading || loading}
          onClick={handleStartFishing}
        >
          {buttonLabels.startFishing}
        </Button>
        <Button
          loading={startLoading}
          disabled={startLoading || loading}
          variant={ButtonColors.SECONDARY}
          onClick={() => {
            showPopup({ type: PopupContentType.SKIP_FISHING, content: { locationType: type } });
          }}
        >
          {buttonLabels.cantFishing}
        </Button>
      </Grid>
    </PopUpWithImage>
  );
};
