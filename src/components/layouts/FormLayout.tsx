import { useNavigate } from 'react-router-dom';
import {
  FormTitle,
  Grid,
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
      <Grid columns={3}>
        <>
          <IconContainer onClick={() => navigate(-1)}>
            <Icon name={IconName.back} />
          </IconContainer>
          <FormTitle>{title}</FormTitle>
          {deleteInfo && <DeleteComponent deleteInfo={deleteInfo} />}
        </>
      </Grid>
      <InfoContainer>
        <InfoTitle>{infoTitle}</InfoTitle>
        <InfoSubTitle>{infoSubTitle}</InfoSubTitle>
      </InfoContainer>
      {children}
    </DefaultLayoutWrapper>
  );
};

export default FormLayout;
