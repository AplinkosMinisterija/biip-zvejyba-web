import styled from 'styled-components';
import Popup from './Popup';

const PopUpWithTitles = ({ title, subTitle, children, onClose, visible = true }: any) => {
  return (
    <Popup visible={visible} onClose={onClose}>
      <Title>{title}</Title>
      {subTitle && <Subtitle>{subTitle}</Subtitle>}
      {children}
    </Popup>
  );
};

const Title = styled.div`
  text-align: center;
  margin: 16px 0 32px 16px;
  font-size: 2.4rem;
  font-weight: bold;
`;

const Subtitle = styled.div`
  padding: 4px 0 32px 0;
  text-align: center;
`;

export default PopUpWithTitles;
