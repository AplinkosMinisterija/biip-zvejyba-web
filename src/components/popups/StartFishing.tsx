import PopUpWithImage from '../layouts/PopUpWithImage';
import { IconName } from '../other/Icon';
import { Grid } from '../other/CommonStyles';
import Button, { ButtonColors } from '../buttons/Button';
import {
  buttonLabels,
  handleErrorToast,
  handleErrorToastFromServer,
  PopupContentType,
  validationTexts,
} from '../../utils';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';
import { useContext } from 'react';
import { PopupContext, PopupContextProps } from '../providers/PopupProvider';

export const StartFishing = ({ content, onClose }: any) => {
  const queryClient = useQueryClient();
  const { type } = content;
  const { showPopup } = useContext<PopupContextProps>(PopupContext);

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
    const coordinates = window.coordinates;
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
        <Button loading={startLoading} disabled={startLoading} onClick={handleStartFishing}>
          {buttonLabels.startFishing}
        </Button>
        <Button
          loading={startLoading}
          disabled={startLoading}
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
