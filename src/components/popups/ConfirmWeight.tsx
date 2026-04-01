import Button, { ButtonColors } from '../buttons/Button';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { IconName } from '../other/Icon';

export const ConfirmWeight = ({ content, onClose }: any) => {
  const { submit } = content;

  const handleConfirm = async () => {
    await submit();
    onClose();
  };

  return (
    <PopUpWithImage
      onClose={onClose}
      iconName={IconName.location}
      visible={true}
      title={'Ar tikrai norite išsaugoti žuvų kiekį?'}
      description={'Išsaugojus, žuvų kiekio nebegalėsite redaguoti.'}
    >
      <Button variant={ButtonColors.PRIMARY} onClick={handleConfirm}>
        {'Suprantu ir sutinku'}
      </Button>
    </PopUpWithImage>
  );
};

export default ConfirmWeight;
