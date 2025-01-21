import { buttonLabels, device } from '../../utils';
import styled from 'styled-components';
import Button, { ButtonColors } from '../buttons/Button';
import Popup from '../layouts/Popup';
import PopUpWithImage from '../layouts/PopUpWithImage';
import { IconName } from '../other/Icon';

interface Props {
  onClose: () => void;
  content: {
    onConfirm: () => void;
    onCancel?: () => void;
    icon: string;
    title: string;
    subtitle: string;
    showCancel?: boolean;
  };
}

const Confirm = ({ content, onClose }: Props) => {
  const { onConfirm, onCancel, title, icon, subtitle, showCancel } = content;

  return (
    <PopUpWithImage visible={true} onClose={onClose} iconName={icon}>
      <Container>
        {title && <Title>{title}</Title>}
        {subtitle && <Description>{subtitle}</Description>}
        <BottomRow>
          {onConfirm && (
            <Button
              onClick={() => {
                onClose();
                if (onConfirm) onConfirm();
              }}
            >
              {buttonLabels.confirm}
            </Button>
          )}
          {showCancel && (
            <Button
              variant={ButtonColors.TRANSPARENT}
              onClick={() => {
                onClose();
                if (onCancel) onCancel();
              }}
            >
              {buttonLabels.cancel}
            </Button>
          )}
        </BottomRow>
      </Container>
    </PopUpWithImage>
  );
};

const Title = styled.div`
  font-size: 2.4rem;
  text-align: center;
  font-weight: bold;
  margin-bottom: 8px;
  width: 100%;
`;

const Description = styled.span`
  font-size: 1.6rem;
  width: 100%;
  text-align: center;
  white-space: pre-line;
`;

const Container = styled.div`
  border-radius: 10px;
  padding: 0px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  position: relative;
  @media ${device.mobileL} {
    padding: 0px 16px 32px 16px;
    justify-content: center;
  }
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  margin-top: 22px;
  gap: 16px;
  width: 100%;
  div {
    width: 100%;
  }
`;

export default Confirm;
