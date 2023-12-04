import styled from 'styled-components';
import { device } from '../../utils';
import Icon from '../other/Icon';
import Modal from './Modal';

const Popup = ({ children, onClose, visible = false }: any) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <Container>
        <IconContainer onClick={onClose}>
          <StyledIcon name="close" />
        </IconContainer>
        {children}
      </Container>
    </Modal>
  );
};

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2.4rem;
`;

const Container = styled.div<{ width?: string; $backgroundImg?: boolean }>`
  background-color: white;
  position: relative;
  width: 100%;
  height: 100%;
  ${({ $backgroundImg }) =>
    $backgroundImg
      ? ` background-image: url('/empty-bg.svg');
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: cover;`
      : ''}
  padding: 0 16px;
  overflow-y: auto;
  @media ${device.desktop} {
    max-width: 700px;
    padding: 40px;
    flex-basis: auto;
    border-radius: 16px;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  top: 20px;
  right: 20px;
  opacity: 0.8;
  transition: all 200ms;
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
`;

export default Popup;
