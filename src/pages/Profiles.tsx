import { useState } from 'react';
import styled from 'styled-components';
import Icon from '../components/other/Icon';
import Loader from '../components/other/Loader';
import ProfileItem from '../components/other/ProfileItem';
import { handleSelectProfile } from '../utils/functions';
import { useLogoutMutation } from '../utils/hooks';
import { RootState } from '../state/store.ts';
import { LoginLayout } from '../components/layouts/Login.tsx';
import { User } from '../utils/types.ts';
import { useSelector } from 'react-redux';

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
        <Title>Pasirinkite paskyrą</Title>
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
          <BackButton>Atsijungti</BackButton>
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
  align-items: center;
  row-gap: 12px;
`;

const Title = styled.div`
  font-size: 2.8rem;
  line-height: 22px;
  font-weight: bold;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.colors.text.primary};
`;
