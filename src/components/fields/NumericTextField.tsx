import FieldWrapper from './components/FieldWrapper';
import TextFieldInput from './components/TextFieldInput';

export interface NumericTextFieldProps {
  value?: string | number;
  name?: string;
  error?: any;
  showError?: boolean;
  label?: string;
  icon?: JSX.Element;
  className?: string;
  leftIcon?: JSX.Element;
  right?: JSX.Element;
  padding?: string;
  onChange: (option: any) => void;
  ref?: HTMLHeadingElement;
  bottomLabel?: string;
  disabled?: boolean;
  height?: number;
  readOnly?: boolean;
  onInputClick?: () => void;
  placeholder?: string;
  digitsAfterComma?: number;
  secondLabel?: JSX.Element;
  subLabel?: string;
  type?: string;
}

const NumericTextField = ({
  value,
  name,
  error,
  label,
  className,
  leftIcon,
  right: rightIcon,
  padding,
  onChange,
  placeholder,
  type,
  disabled,
  height,
  showError,
  digitsAfterComma,
  bottomLabel,
  onInputClick,
}: NumericTextFieldProps) => {
  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      const inputValue = value?.toString();
      if (inputValue?.endsWith('.')) {
        onChange(inputValue.replaceAll('.', ''));
      }
    }
  };

  const handleChange = (input: string) => {
    const regex = !digitsAfterComma
      ? new RegExp(/^\d*$/)
      : new RegExp(`^(?:\\d+)?(?:[.,]\\d{0,${digitsAfterComma}})?$`);

    if (regex.test(input)) onChange(input.replaceAll(',', '.'));
  };

  return (
    <FieldWrapper
      handleBlur={handleBlur}
      padding={padding}
      className={className}
      bottomLabel={bottomLabel}
      label={label}
      error={error}
      showError={showError}
    >
      <TextFieldInput
        value={value}
        name={name}
        type={type}
        error={error}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        onChange={handleChange}
        disabled={disabled}
        height={height}
        onInputClick={onInputClick}
        placeholder={placeholder}
      />
    </FieldWrapper>
  );
};

export default NumericTextField;
