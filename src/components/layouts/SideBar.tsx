import { matchPath, useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import { buttonLabels, useLogoutMutation, useMenuRouters } from '../../utils';
import Icon, { IconName } from '../other/Icon';
import ProfilesDropdown from '../other/ProfileDropdown';

const SideBar = () => {
  const routes = useMenuRouters();
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const { mutateAsync } = useLogoutMutation();

  return (
    <Container>
      <StyledISideBarLogo name={IconName.sidebarLogo} />

      <ProfilesDropdown />

      {routes.map((route, index) => {
        return (
          <Item
            key={`sidebar_btn_${route.slug}_${index}`}
            onClick={() => navigate(route.slug)}
            $isActive={!!matchPath({ path: route.slug, end: false }, currentLocation.pathname)}
          >
            <StyledIcon name={route.iconName!} />
            <Label>{route.title}</Label>
          </Item>
        );
      })}
      <Divider />

      <Item onClick={() => mutateAsync()} $isActive={false}>
        <StyledIcon name={IconName.logout} />
        <Label>{buttonLabels.logout}</Label>
      </Item>
    </Container>
  );
};

const StyledISideBarLogo = styled(Icon)`
  cursor: pointer;
  height: 28px;
  margin: 20px 0 30px -90px;
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2.4rem;
  svg {
    stroke: ${({ theme }) => theme.colors.primary};
  }
  rect {
    stroke: ${({ theme }) => theme.colors.primary};
  }
  path {
    stroke: ${({ theme }) => theme.colors.primary};
  }
  circle {
    stroke: ${({ theme }) => theme.colors.primary};
  }
  polyline {
    stroke: ${({ theme }) => theme.colors.primary};
  }
  line {
    stroke: ${({ theme }) => theme.colors.primary};
  }
`;
const Label = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
`;

const Container = styled.nav`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 32px;
  height: 100%;
  min-width: 320px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.02);
  gap: 4px;
`;

const Item = styled.div<{ $isActive: boolean }>`
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 8px;
  border-radius: 5px;
  transition: all 0.2s ease-out;
  color: ${({ theme }) => theme.colors.text.retroBlack};

  ${({ $isActive, theme }) =>
    $isActive &&
    `
${Label} {
    color: white;
  }

 ${StyledIcon} {
    rect {
      stroke: white;
    }
    path {
      stroke: white;
    }
    circle {
      stroke: white;
    }
    polyline {
      stroke: white;
    }
    line {
      stroke: white;
    }
  }

    background-color: ${theme.colors.text.retroBlack};
  
  
  `};

  &:hover ${Label} {
    color: white;
  }

  &:hover ${StyledIcon} {
    rect {
      stroke: white;
    }
    path {
      stroke: white;
    }
    circle {
      stroke: white;
    }
    polyline {
      stroke: white;
    }
    line {
      stroke: white;
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.text.retroBlack};
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #d4d5de;
  margin: 16px 0;
`;

export default SideBar;
