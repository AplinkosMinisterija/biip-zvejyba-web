import styled from 'styled-components';

interface SwitchFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

// The design-system Switch renders its text in a sibling <label> that is not
// tied to the checkbox, leaving the control without an accessible name.
const SwitchField = ({ label, value, onChange, disabled = false }: SwitchFieldProps) => (
  <Label $disabled={disabled}>
    <Control>
      <Input
        type="checkbox"
        role="switch"
        checked={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <Track aria-hidden="true" />
    </Control>
    {label}
  </Label>
);

const Label = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  user-select: none;
`;

const Control = styled.span`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
`;

const Input = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
  z-index: 1;
`;

const Track = styled.span`
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.border};
  transition: background-color 150ms;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: white;
    transition: transform 150ms;
  }

  ${Input}:checked + & {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  ${Input}:checked + &::after {
    transform: translateX(20px);
  }

  ${Input}:focus-visible + & {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export default SwitchField;
