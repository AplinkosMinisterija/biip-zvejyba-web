import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  buttonLabels,
  handleErrorToast,
  handleErrorToastFromServer,
  handleSuccessToast,
  useGeolocation,
  validationTexts,
} from '../../utils';
import api from '../../utils/api';
import Button, { ButtonColors } from '../buttons/Button';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { Grid } from '../other/CommonStyles';
import { IconName } from '../other/Icon';
import LoaderComponent from '../other/LoaderComponent';

export const EndFishing = ({ onClose }: any) => {
  const queryClient = useQueryClient();

  const { coordinates, loading, refresh: refreshGeolocation } = useGeolocation();

  // Mirrors the server-side `endFishing` validations (shore-weigh
  // requirement + every-tool-type has fish logged) so we disable the
  // button up-front instead of letting the user submit just to get a
  // Lithuanian error toast back.
  const {
    data: canFinishResult,
    isLoading: canFinishLoading,
  } = useQuery(['canFinishFishing'], () => api.canFinishFishing(), {
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { mutateAsync: finishFishing, isLoading: finishFishingLoading } = useMutation(
    api.finishFishing,
    {
      onError: ({ response }) => {
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
    if (coordinates) {
      finishFishing({ coordinates });
      return;
    }
    refreshGeolocation();
    handleErrorToast(validationTexts.mustAllowToSetCoordinates);
  };

  const cannotFinish = canFinishResult ? !canFinishResult.canFinish : false;
  const blockReason = cannotFinish ? canFinishResult?.reason : undefined;

  return (
    <PopUpWithImage
      iconName={IconName.endFishing}
      visible={true}
      onClose={onClose}
      title={'Žvejybos pabaiga'}
      description={'Ar esate tikri, kad norite baigti žvejybą?'}
    >
      {loading || canFinishLoading ? (
        <LoaderComponent />
      ) : (
        <>
          {blockReason && <BlockReason>{blockReason}</BlockReason>}
          <Grid $columns={2}>
            <Button
              loading={finishFishingLoading}
              disabled={finishFishingLoading || cannotFinish}
              onClick={handleFinishFishing}
            >
              {buttonLabels.endFishing}
            </Button>
            <Button
              disabled={finishFishingLoading}
              variant={ButtonColors.SECONDARY}
              onClick={onClose}
            >
              {buttonLabels.cancel}
            </Button>
          </Grid>
        </>
      )}
    </PopUpWithImage>
  );
};

const BlockReason = styled.div`
  color: ${({ theme }) => theme.colors.error || '#c0392b'};
  background-color: ${({ theme }) => theme.colors.cardBackground?.danger || '#fdecea'};
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 1.4rem;
  line-height: 1.4;
`;

export default EndFishing;
