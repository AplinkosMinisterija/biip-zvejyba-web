import styled from 'styled-components';
import LoaderComponent from '../../other/LoaderComponent';

export interface OptionsContainerProps {
  values?: any[];
  disabled?: boolean;
  getOptionLabel: (option: any) => string;
  handleScroll?: (option: any) => any;
  loading?: boolean;
  showSelect: boolean;
  hideNoOptions?: boolean;
  handleClick: (option: any) => any;
}

const OptionsContainer = ({
  values = [],
  disabled = false,
  hideNoOptions = false,
  getOptionLabel,
  handleClick,
  handleScroll,
  showSelect,
  loading,
}: OptionsContainerProps) => {
  if (!showSelect || disabled) {
    return <></>;
  }

  if (values?.length && hideNoOptions) {
    return <></>;
  }

  const renderOptions = () => {
    if (!values?.length)
      return loading ? <LoaderComponent /> : <Option key="no_options">Nėra pasirinkimų</Option>;

    return (
      <>
        {values.map((option, index) => {
          return (
            <Option
              key={JSON.stringify(option) + index}
              onClick={() => {
                handleClick(option);
              }}
            >
              {getOptionLabel && getOptionLabel(option)}
            </Option>
          );
        })}
        {loading && <LoaderComponent />}
      </>
    );
  };

  return (
    <OptionContainer
      onClick={(e) => e.stopPropagation()}
      className="optionContainer"
      onScroll={handleScroll}
    >
      {renderOptions()}
    </OptionContainer>
  );
};

const OptionContainer = styled.div`
  position: absolute;
  z-index: 9;
  width: 100%;
  padding: 10px 0px;
  display: block;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  border: none;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 2px 16px #121a5529;

  > * {
    &:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
  > * {
    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
`;

const Option = styled.div`
  cursor: pointer;
  font-size: 1.6rem;
  line-height: 20px;
  padding: 8px 12px;
  &:hover {
    background: #f3f3f7 0% 0% no-repeat padding-box;
  }
`;

export default OptionsContainer;
