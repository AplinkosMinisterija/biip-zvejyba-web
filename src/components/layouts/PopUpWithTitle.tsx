import styled from 'styled-components';
import Popup from './Popup';

const PopUpWithTitle = ({ title, children, onClose, visible = true }: any) => {
  return (
    <Popup visible={visible} onClose={onClose}>
      <FormTitle>{title}</FormTitle>
      {children}
    </Popup>
  );
};

const FormTitle = styled.div`
  text-align: center;
  margin: 16px 0 32px 16px;
  font-size: 2.4rem;
  font-weight: bold;
`;

export default PopUpWithTitle;
