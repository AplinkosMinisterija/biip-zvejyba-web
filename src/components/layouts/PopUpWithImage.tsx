import styled from 'styled-components';
import Icon from '../other/Icon';
import Popup from './Popup';

const PopUpWithImage = ({
  title,
  description,
  children,
  onClose,
  visible = true,
  submitLoading,
  rejectLoading,
  iconName,
}: any) => {
  return (
    <Popup visible={visible} onClose={onClose}>
      <PopupWrapper>
        {iconName && <StyledIcon name={iconName} />}
        {title && <Heading>{title}</Heading>}
        {description && <Description>{description}</Description>}
        {children}
      </PopupWrapper>
    </Popup>
  );
};

const StyledIcon = styled(Icon)`
  width: 116px;
  height: 116px;
  color: ${({ theme }) => theme.colors.primary};
`;

const PopupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  gap: 16px;
`;

const Heading = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
  text-align: center;
`;

const Description = styled.div`
  margin-bottom: 40px;
  line-height: 26px;
  text-align: center;
  font-weight: 500;
`;

export default PopUpWithImage;
