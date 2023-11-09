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

const FormLayout = ({
  children,
  title,
  infoTitle,
  infoSubTitle,
  back,
  deleteInfo,
  onEdit,
}: any) => {
  const navigate = useNavigate();
  const showInfoContainer = infoTitle || infoSubTitle;
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
            <TitleGridRow widthEdit={!!onEdit}>
              <GridItem justify={'center'}>
                <FormTitle>{title}</FormTitle>
              </GridItem>
              {onEdit && (
                <IconContainer onClick={() => onEdit()}>
                  <EditIcon name={IconName.edit} />
                </IconContainer>
              )}
            </TitleGridRow>
          </GridItem>
          {deleteInfo && (
            <GridItem justify={'end'}>
              <DeleteComponent deleteInfo={deleteInfo} />
            </GridItem>
          )}
        </>
      </FormTitleGrid>
      {showInfoContainer && (
        <InfoContainer>
          <InfoTitle>{infoTitle}</InfoTitle>
          <InfoSubTitle>{infoSubTitle}</InfoSubTitle>
        </InfoContainer>
      )}
      {children}
    </DefaultLayoutWrapper>
  );
};

export const TitleGridRow = styled.div<{ widthEdit: boolean }>`
  display: grid;
  grid-template-columns: 1fr ${({ widthEdit }) => (widthEdit ? '30px' : '')};
  gap: 16px;
`;

const EditIcon = styled(Icon)`
  font-size: 1.7em;
`;

const FormTitleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 16px;
  margin: 16px 0;
  width: 100%;
`;

const GridItem = styled.div<{ justify: string }>`
  display: grid;
  align-items: center;
  justify-items: ${({ justify }) => justify};
  width: 100%;
`;

export default FormLayout;
