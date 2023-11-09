import styled from 'styled-components';
import Icon from '../other/Icon';

const InfoWithImage = ({ title, description, iconName }: any) => {
  return (
    <Container>
      {iconName && <StyledIcon name={iconName} />}
      <Heading>{title}</Heading>
      <Description>{description}</Description>
    </Container>
  );
};

const StyledIcon = styled(Icon)`
  width: 116px;
  height: 116px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Container = styled.div`
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

export default InfoWithImage;
