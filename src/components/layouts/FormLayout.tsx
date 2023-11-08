import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FormTitle,
  IconContainer,
  InfoContainer,
  InfoSubTitle,
  InfoTitle,
} from '../other/CommonStyles';
import DeleteComponent from '../other/DeleteComponent';
import Icon, { IconName } from '../other/Icon';
import DefaultLayoutWrapper from './DefaultLayoutWrapper';

const FormLayout = ({ children, title, infoTitle, infoSubTitle, back, deleteInfo }: any) => {
  const navigate = useNavigate();
  return (
    <DefaultLayoutWrapper back={back}>
      <FormTitleGrid>
        <>
          <GridItem justify={'start'}>
            <IconContainer onClick={() => navigate(-1)}>
              <Icon name={IconName.back} />
            </IconContainer>
          </GridItem>
          <GridItem justify={'center'}>
            <FormTitle>{title}</FormTitle>
          </GridItem>
          {deleteInfo && (
            <GridItem justify={'end'}>
              <DeleteComponent deleteInfo={deleteInfo} />
            </GridItem>
          )}
        </>
      </FormTitleGrid>
      <InfoContainer>
        <InfoTitle>{infoTitle}</InfoTitle>
        <InfoSubTitle>{infoSubTitle}</InfoSubTitle>
      </InfoContainer>
      {children}
    </DefaultLayoutWrapper>
  );
};

export const FormTitleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 16px 0;
  width: 100%;
`;

export const GridItem = styled.div<{ justify: string }>`
  display: grid;
  align-items: center;
  justify-items: start;
  justify-items: ${({ justify }) => justify};
  width: 100%;
`;

export default FormLayout;
