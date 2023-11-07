import { useState } from 'react';
import styled from 'styled-components';
import { DeleteInfoProps, device } from '../../utils';
import { buttonLabels } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import Modal from '../layouts/Modal';
import Icon, { IconName } from './Icon';

export interface DeleteComponentProps {
  deleteInfo?: DeleteInfoProps;
}

const DeleteComponent = ({ deleteInfo }: DeleteComponentProps) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!deleteInfo?.handleDelete) return <></>;

  const {
    deleteButtonText,
    deleteDescriptionFirstPart,
    deleteDescriptionSecondPart,
    deleteName,
    deleteTitle,
    handleDelete,
  } = deleteInfo;

  const handleDeleteItem = async () => {
    if (!deleteInfo?.handleDelete) return;

    setLoading(true);
    await handleDelete();
    setLoading(false);
  };

  const onClose = () => setShowModal(false);

  return (
    <>
      <DeleteButtonContainer>
        <div onClick={() => setShowModal(true)}>
          <StyledIcon name={IconName.deleteItem} />
        </div>
      </DeleteButtonContainer>
      <Modal onClose={onClose} visible={showModal}>
        <Container tabIndex={0}>
          <IconContainer onClick={() => onClose()}>
            <StyledCloseButton name={'close'} />
          </IconContainer>
          <Title>{deleteTitle}</Title>
          <Description>
            {deleteDescriptionFirstPart} <Name>{deleteName}</Name> {deleteDescriptionSecondPart}
          </Description>
          <BottomRow>
            <Button
              onClick={() => onClose()}
              variant={ButtonColors.TRANSPARENT}
              type="button"
              color="black"
              buttonPadding="6px 8px"
            >
              {buttonLabels.cancel}
            </Button>
            <Button
              type="button"
              onClick={() => handleDeleteItem()}
              variant={ButtonColors.DANGER}
              buttonPadding="6px 8px"
              loading={loading}
              disabled={loading}
            >
              {deleteButtonText || buttonLabels.delete}
            </Button>
          </BottomRow>
        </Container>
      </Modal>
    </>
  );
};

const DeleteButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0;
  @media ${device.mobileL} {
    flex-direction: column;
  }
`;

const DeleteButton = styled(Button)`
  button {
    border-color: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.danger};
  }
  min-width: fit-content;
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.danger};
  margin-right: 8px;
  @media ${device.mobileL} {
    margin: 0;
  }
`;

const Container = styled.div`
  background-color: #ffffff;
  box-shadow: 0px 18px 41px #121a5529;
  border-radius: 10px;
  width: 430px;
  padding: 40px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  position: relative;

  @media ${device.mobileL} {
    padding: 40px 16px 32px 16px;
    width: 100%;
    height: 100%;
    justify-content: center;
    border-radius: 0px;
  }
`;

const StyledCloseButton = styled(Icon)`
  color: rgb(122, 126, 159);
  font-size: 2rem;
  @media ${device.mobileL} {
    display: none;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const IconContainer = styled.div`
  cursor: pointer;
  position: absolute;
  right: 9px;
  top: 9px;
  z-index: 5;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 22px;
  gap: 16px;
  width: 100%;
`;

const Title = styled.div`
  font-size: 2.4rem;
  text-align: center;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.error};
  width: 100%;
`;

const Description = styled.span`
  font-size: 1.6rem;
  color: #4b5565;
  width: 100%;
  text-align: center;
  white-space: pre-line;
`;

const Name = styled.span`
  font-size: 1.6rem;
  font-weight: bold;
  width: 100%;
  color: #4b5565;
`;

export default DeleteComponent;
