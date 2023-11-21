import React from 'react';
import styled from 'styled-components';

export interface AvatarProps {
  firstName: string;
  lastName: string;
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
  icon?: any;
  color?: string;
}

const Avatar = ({
  firstName = ' ',
  lastName = ' ',
  className,
  style = {},
  active,
  color,
  icon,
}: AvatarProps) => {
  const initials = `${firstName[0]?.toUpperCase() || ''} ${lastName[0]?.toUpperCase() || ''}`;
  return (
    <Container $active={active} className={className}>
      <InnerContainer color={color} style={style}>
        {icon ? icon : initials}
      </InnerContainer>
    </Container>
  );
};

const Container = styled.div<{ $active?: boolean }>`
  border: ${({ $active, theme }) => ($active ? ` 2px solid ${theme.colors.secondary}` : 'none')};
  border-radius: 50%;
  height: 49px;
  width: 49px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerContainer = styled.div<{ $color?: string }>`
  cursor: pointer;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  background-color: ${({ theme, $color }) => $color || theme.colors.primary};

  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Avatar;
