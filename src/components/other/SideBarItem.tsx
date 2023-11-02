import { useMatch } from 'react-router';
import styled from 'styled-components';
import { RouteType } from '../../utils';
import Icon from './Icon';

const SideBarItem = ({ route }: { route: RouteType }) => {
  const isActive = useMatch(route.slug);

  return (
    <Item isActive={false}>
      <StyledIcon name={route.iconName!} />
      <Label>{route.title}</Label>
    </Item>
  );
};

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

const Item = styled.div<{ isActive: boolean }>`
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 8px;
  border-radius: 5px;
  transition: all 0.2s ease-out;
  color: ${({ theme }) => theme.colors.text.retroBlack};

  ${({ isActive, theme }) =>
    isActive &&
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

export default SideBarItem;
