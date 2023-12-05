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
  rightIcon?: JSX.Element;
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
}

const NumericTextField = ({
  value,
  name,
  error,
  label,
  className,
  leftIcon,
  rightIcon,
  padding,
  onChange,
  placeholder,
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
  const preventNumInputFromScrolling = (e: any) =>
    e.target.addEventListener(
      'wheel',
      function (e: any) {
        e.preventDefault();
      },
      { passive: false },
    );

  const handleChange = (input: string) => {
    const regex = !digitsAfterComma
      ? new RegExp(/^\d*$/)
      : new RegExp(`^(?:\\d+)?(?:[.,]\\d{0,${digitsAfterComma}})?$`);

    console.log(regex.test(input), 'input', input);

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
        type={'number'}
        inputMode="decimal"
        error={error}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        onChange={handleChange}
        disabled={disabled}
        height={height}
        onInputClick={onInputClick}
        placeholder={placeholder}
        onFocus={preventNumInputFromScrolling}
      />
    </FieldWrapper>
  );
};

export default NumericTextField;
