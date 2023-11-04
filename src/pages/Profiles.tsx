import { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { LoginLayout } from '../components/layouts/Login';
import Icon from '../components/other/Icon';
import Loader from '../components/other/Loader';
import ProfileItem from '../components/other/ProfileItem';
import { RootState } from '../state/store';
import { buttonLabels, device, titles, User } from '../utils';
import { handleSelectProfile } from '../utils/functions';
import { useLogoutMutation } from '../utils/hooks';

const Profiles = () => {
  const user: User = useSelector((state: RootState) => state?.user?.userData);
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = useLogoutMutation();

  const handleSelect = (profileId: string) => {
    setLoading(true);
    handleSelectProfile(profileId);
  };

  if (loading) return <Loader />;

  return (
    <LoginLayout>
      <Container>
        <Title>{titles.selectProfile}</Title>
        {user.profiles?.map((profile: any) => (
          <InnerContainer key={profile?.id}>
            <ProfileItem
              fisher={{
                name: user?.firstName || '',
                lastName: user?.lastName || '',
                email: profile?.freelancer ? user?.email : profile?.name,
                freelancer: profile?.freelancer,
              }}
              onClick={() => handleSelect(profile?.id)}
            />
          </InnerContainer>
        ))}
        <Row onClick={() => mutateAsync()}>
          <StyledIcon name="exit" />
          <BackButton>{buttonLabels.logout}</BackButton>
        </Row>
      </Container>
    </LoginLayout>
  );
};

export default Profiles;

const StyledIcon = styled(Icon)`
  color: rgb(122, 126, 159);
  font-size: 2.2rem;
`;

const BackButton = styled.div`
  font-size: 1.9rem;
  color: rgb(122, 126, 159);
  margin-left: 11px;
`;

const Row = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 12px;
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  margin-top: 50px;
  @media ${device.mobileL} {
    max-width: 100%;
  }
`;

const Title = styled.div`
  font-size: 2rem;
  line-height: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;
