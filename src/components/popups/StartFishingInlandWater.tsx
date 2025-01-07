import { IconName } from '../other/Icon';
import SelectWaterBody from '../forms/SelectWaterBody';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';
import { handleErrorToast, handleErrorToastFromServer, validationTexts } from '../../utils';

const StartFishingInlandWater = ({ content, onClose }: any) => {
  const queryClient = useQueryClient();

  const { coordinates, locationType, location, locationLoading } = content;
  const { isLoading: startLoading, mutateAsync: startFishing } = useMutation(api.startFishing, {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('currentFishing');
    },
    retry: false,
  });
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
      title={'Kur žvejosite?'}
      iconName={IconName.startFishing}
      visible={true}
      onClose={onClose}
    >
      <SelectWaterBody onStartFishing={handleStartFishing} loading={locationLoading} />
    </PopUpWithImage>
  );
};
