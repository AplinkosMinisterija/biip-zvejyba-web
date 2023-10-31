import { useState } from 'react';
import styled from 'styled-components';
import { handleSelectProfile } from '../../utils';
import { useAppSelector, useGetCurrentProfile } from '../../utils/hooks';
import Icon, { IconName } from './Icon';

const ProfilesDropdown = () => {
  const user = useAppSelector((state) => state.user.userData);
  const currentProfile = useGetCurrentProfile();
  const [showSelect, setShowSelect] = useState(false);

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
    }
  };

  const handleProfileChange = (profileId: string) => {
    handleSelectProfile(profileId);
  };

  return (
    <Container tabIndex={1} onBlur={handleBlur}>
      <SelectorContainer onClick={() => setShowSelect(!showSelect)}>
        <Info>
          <Name>{currentProfile?.name || '-'}</Name>
          <Email>{currentProfile?.email || user?.email}</Email>
        </Info>
        <DropdownIcon name={IconName.showMore} />
      </SelectorContainer>
      {showSelect && (
        <OptionsContainer>
          {user?.profiles?.map((profile, index) => {
            const isActive = profile.id === currentProfile?.id;
            return (
              <Option
                isActive={isActive}
                key={`profile-${index}`}
                onClick={() => {
                  handleProfileChange(profile.id);
                }}
              >
                <Info>
                  <Name>{profile?.name || '-'}</Name>
                  <Email>{profile?.email || user?.email}</Email>
                </Info>
                {isActive && <SelectedIcon name={IconName.active} />}
              </Option>
            );
          })}
        </OptionsContainer>
      )}
    </Container>
  );
};

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 10px 10px;
  margin-bottom: 4px;
  color: #f8fafc;
  background-color: ${({ theme }) => theme.colors.largeButton.GREY};
  border-radius: 4px;
  cursor: pointer;
  min-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OptionsContainer = styled.div`
  position: absolute;
  z-index: 9;
  width: 100%;
  padding: 9px 6px 11px 6px;
  background-color: ${({ theme }) => theme.colors.largeButton.GREY};
  border-radius: 4px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Option = styled.div<{ isActive: boolean }>`
  padding: 12px;
  font-size: 1.6rem;
  border-radius: 2px;
  display: flex;
  justify-content: space-between;
  gap: 12px;

  &:hover {
    background-color: #f5f6fe;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }

  ${({ isActive, theme }) =>
    isActive &&
    `
    background-color: #f5f6fe;
    border: 1px solid ${theme.colors.primary};
  
  `};

  cursor: pointer;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Container = styled.div`
  position: relative;
  min-width: 200px;
  margin-bottom: 20px;
  &:focus {
    outline: none;
  }
`;

const DropdownIcon = styled(Icon)`
  cursor: pointer;
  color: #102eb1 !important;
  font-size: 2.5rem;
`;

const SelectedIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.primary};
`;

const Name = styled.div`
  font-size: 1.4rem;
  color: #121926;
  line-height: 17px;
`;

const Email = styled.div`
  font-size: 1.2rem;
  color: #4b5565;
`;

export default ProfilesDropdown;
