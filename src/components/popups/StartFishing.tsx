import PopUpWithImage from '../layouts/PopUpWithImage';
import { IconName } from '../other/Icon';
import { Grid } from '../other/CommonStyles';
import Button, { ButtonColors } from '../buttons/Button';
import {
  buttonLabels,
  handleErrorToast,
  handleErrorToastFromServer,
  validationTexts,
} from '../../utils';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';

export const StartFishing = ({ content, onClose }: any) => {
  const queryClient = useQueryClient();

  const { isLoading: startLoading, mutateAsync: startFishing } = useMutation(api.startFishing, {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('currentFishing');
    },
    retry: false,
  });

  const { coordinates, locationType, location, getLocation, locationLoading } = content;
  const handleStartFishing = () => {
    if (coordinates && locationType) {
      startFishing({
        type: locationType,
        coordinates,
        uetkCadastralId: location?.id,
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
            // setShowSkipFishing(true);
            //TODO: show skip fishing popup
          }}
        >
          {buttonLabels.cantFishing}
        </Button>
      </Grid>
    </PopUpWithImage>
  );
};
