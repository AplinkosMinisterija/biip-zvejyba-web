import PopUpWithImage from '../layouts/PopUpWithImage';
import { IconName } from '../other/Icon';
import { Grid } from '../other/CommonStyles';
import Button, { ButtonColors } from '../buttons/Button';
import {
  buttonLabels,
  handleErrorToast,
  handleErrorToastFromServer,
  handleSuccessToast,
  validationTexts,
} from '../../utils';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';

export const EndFishing = ({ content, onClose }: any) => {
  const queryClient = useQueryClient();

  const { mutateAsync: finishFishing, isLoading: finishFishingLoading } = useMutation(
    api.finishFishing,
    {
      onError: ({ response }) => {
        console.log('finishFishing', response?.data?.message);
        handleErrorToastFromServer(response);
      },
      onSuccess: () => {
        handleSuccessToast(validationTexts.fishingFinished);
        queryClient.invalidateQueries('currentFishing');
        onClose();
      },
      retry: false,
    },
  );
  const handleFinishFishing = () => {
    const coordinates = window.coordinates;
    if (coordinates) {
      finishFishing({ coordinates });
    } else {
      handleErrorToast(validationTexts.mustAllowToSetCoordinates);
    }
  };
  return (
    <PopUpWithImage
      iconName={IconName.endFishing}
      visible={true}
      onClose={onClose}
      title={'Žvejybos pabaiga'}
      description={'Ar esate tikri, kad norite baigti žvejybą?'}
    >
      <Grid $columns={2}>
        <Button
          loading={finishFishingLoading}
          disabled={finishFishingLoading}
          onClick={handleFinishFishing}
        >
          {buttonLabels.endFishing}
        </Button>
        <Button disabled={finishFishingLoading} variant={ButtonColors.SECONDARY} onClick={onClose}>
          {buttonLabels.cancel}
        </Button>
      </Grid>
    </PopUpWithImage>
  );
};

export default EndFishing;
