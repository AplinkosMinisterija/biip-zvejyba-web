import React from 'react';
import styled from 'styled-components';
import Loader from '../other/Loader';
import { theme } from '../../utils/theme.ts';

export enum ButtonColors {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    TERTIARY = 'tertiary',
    DANGER = 'danger',
    SUCCESS = 'success',
    TRANSPARENT = 'transparent',
}

const buttonColors = {
    [ButtonColors.PRIMARY]: theme.colors.primary,
    [ButtonColors.SECONDARY]: 'white',
    [ButtonColors.TERTIARY]: theme.colors.tertiary,
    [ButtonColors.DANGER]: theme.colors.error,
    [ButtonColors.SUCCESS]: theme.colors.success,
    [ButtonColors.TRANSPARENT]: 'transparent',
};

const buttonTextColors = {
    [ButtonColors.PRIMARY]: 'white',
    [ButtonColors.SECONDARY]: theme.colors.text.primary,
    [ButtonColors.TERTIARY]: 'white',
    [ButtonColors.DANGER]: 'white',
    [ButtonColors.SUCCESS]: 'white',
    [ButtonColors.TRANSPARENT]: theme.colors.text.primary,
};
export interface ButtonProps {
    variant?: ButtonColors;
    route?: string;
    children?: JSX.Element | string;
    leftIcon?: JSX.Element | string;
    rightIcon?: JSX.Element | string;
    height?: number;
    type?: string;
    loading?: boolean;
    padding?: string;
    buttonPadding?: string;
    signature?: boolean;
    disabled?: boolean;
    color?: string;
    fontWeight?: string;
    radius?: string;
}

const Button = ({
    variant = ButtonColors.PRIMARY,
    route,
    children,
    height,
    padding,
    leftIcon,
    buttonPadding,
    rightIcon,
    color,
    type,
    loading = false,
    className,
    disabled = false,
    fontWeight = 'normal',
    ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <StyledButton
            className={className}
            padding={buttonPadding}
            fontWeight={fontWeight}
            variant={variant}
            height={height || 40}
            type={type}
            disabled={disabled}
            {...rest}
        >
            {leftIcon}
            {loading ? <Loader color="white" /> : children}
            {rightIcon}
        </StyledButton>
    );
};

// const Wrapper = styled.div<{
//     padding: string;
//     signature?: boolean;
//     disabled: boolean;
// }>`
//     opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
//     cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
//     padding: ${({ padding }) => (padding ? padding : 0)};
//     min-width: 130px;
// `;

const StyledButton = styled.button<{
    variant: ButtonColors;
    height: number;
    padding?: string;
    fontWeight?: string;
    $radius?: string;
}>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${({ height }) => (height ? height + 'px' : '40px')};
    border-radius: ${({ $radius }) => ($radius ? $radius : '4px')};
    padding: ${({ padding }) => (padding ? padding : '11px 20px;')};
    background-color: ${({ variant }) => buttonColors[variant]};
    color: ${({ variant }) => buttonTextColors[variant]};
    border: ${({ variant }) => (variant === ButtonColors.TRANSPARENT ? '1.4px' : '1px')} solid
        ${({ variant }) => (variant !== ButtonColors.TRANSPARENT ? 'transparent' : ' rgb(35, 31, 32)')};
    font-weight: ${({ fontWeight }) => fontWeight};
    font-size: 1.4rem;
    :hover {
        background-color: ${({ variant, theme }) => theme.colors.hover[variant]};
    }
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    width: 100%;
`;

Button.colors = ButtonColors;

export default Button;
