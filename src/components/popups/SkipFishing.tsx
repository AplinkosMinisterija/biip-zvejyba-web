import PopUpWithImage from '../layouts/PopUpWithImage';
import { Grid } from '../other/CommonStyles';
import { map } from 'lodash';
import {
  buttonLabels,
  handleErrorToast,
  handleErrorToastFromServer,
  SickReasons,
  skipOptions,
  validationTexts,
} from '../../utils';
import Button, { ButtonColors } from '../buttons/Button';
import styled from 'styled-components';
import { useState } from 'react';
import { useMutation } from 'react-query';
import api from '../../utils/api';

export const SkipFishing = ({ content, onClose }: any) => {
  const [skipReason, setSkipReason] = useState(SickReasons.BAD_WEATHER);

  const { coordinates, locationType } = content;

  const { isLoading: skipLoading, mutateAsync: skipFishing } = useMutation(api.skipFishing, {
    onError: ({ response }: any) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => onClose(),
    retry: false,
  });

  const handleSkipFishing = () => {
    if (locationType && coordinates) {
      skipFishing({ type: locationType, coordinates: coordinates, note: skipReason });
    } else {
      handleErrorToast(validationTexts.mustAllowToSetCoordinates);
    }
  };
  return (
    <PopUpWithImage
      visible={true}
      onClose={onClose}
      title={'Neplaukiu žvejoti'}
      description={'Pasirinkite priežastį, dėl ko negalite žvejoti'}
    >
      <Grid $columns={3}>
        {map(skipOptions, (item, index) => (
          <SelectButton
            $selected={item.value === skipReason}
            key={`skip-reasons-${index}`}
            onClick={() => setSkipReason(item.value)}
          >
            {item.label}
          </SelectButton>
        ))}
      </Grid>
      <Grid $columns={2}>
        <Button loading={skipLoading} disabled={skipLoading} onClick={handleSkipFishing}>
          {buttonLabels.save}
        </Button>
        <Button
          loading={skipLoading}
          disabled={skipLoading}
          variant={ButtonColors.TRANSPARENT}
          onClick={onClose}
        >
          {buttonLabels.cancel}
        </Button>
      </Grid>
    </PopUpWithImage>
  );
};

const SelectButton = styled.button<{ $selected: boolean }>`
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  background-color: ${({ $selected, theme }) =>
    $selected ? '#f5f6fe' : theme.colors.cardBackground.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ $selected, theme }) => ($selected ? theme.colors.primary : 'transparent')};
  cursor: pointer;
  &:hover {
    background-color: #f5f6fe;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;
