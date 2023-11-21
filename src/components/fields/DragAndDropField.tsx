import { map } from 'lodash';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { device, handleAlert } from '../../utils';
import Icon, { IconName } from '../other/Icon';
import LoaderComponent from '../other/LoaderComponent';
import FieldWrapper from './components/FieldWrapper';

export interface FileFieldProps {
  onDelete?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  files: any[] | File[];
  loading?: boolean;
  label: string;
  disabled?: boolean;
  error?: string;
  showError?: boolean;
  multiple?: boolean;
}

const availableMimeTypes = ['application/pdf'];

const availableExtensionsTypes = ['.pdf'];

const bytesToMb = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';

  const sizeArrayIndex = parseInt(`${Math.floor(Math.log(bytes) / Math.log(1024))}`, 10);
  if (sizeArrayIndex === 0) return `${bytes} ${sizes[sizeArrayIndex]})`;
  return `${(bytes / 1024 ** sizeArrayIndex).toFixed(1)} ${sizes[sizeArrayIndex]}`;
};

const validateFileSizes = (files: File[]) => {
  const maxSize = 1500;
  for (let i = 0; i < files.length; i++) {
    const fileSizeToMb = files[i].size / 1024 / 1024;
    if (fileSizeToMb > maxSize) {
      return false;
    }
  }

  return true;
};

const validateFileTypes = (files: File[], availableMimeTypes: string[]) => {
  for (let i = 0; i < files.length; i++) {
    const availableType = availableMimeTypes.find((type) => type == files[i].type);
    if (!availableType) return false;
  }
  return true;
};

const DragAndDropUploadField = ({
  onDelete,
  onUpload,
  multiple = true,
  files,
  label,
  disabled,
  error,
  showError = false,
}: FileFieldProps) => {
  const inputRef = useRef<any>(null);

  const [uploadLoading, setUploadLoading] = useState(false);

  const handleSetFiles = async (currentFiles: File[]) => {
    const isValidFileTypes = validateFileTypes(currentFiles, availableMimeTypes);
    if (!isValidFileTypes) return handleAlert();
    const isValidFileSizes = validateFileSizes(currentFiles);
    if (!isValidFileSizes) return handleAlert();

    if (onUpload) {
      setUploadLoading(true);
      await onUpload(currentFiles);
      setUploadLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files: File[] = Array.from(e.dataTransfer.files);
      handleSetFiles(files);
    }
  };

  const handleChange = (e: any) => {
    if (disabled) return;
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files: File[] = Array.from(e.target.files);
      handleSetFiles(files);
    }
  };

  const onButtonClick = () => {
    if (disabled) return;

    inputRef?.current?.click();
  };

  const handleDelete = (e: any, index: number) => {
    e.stopPropagation();

    if (onDelete) {
      onDelete([...(files?.slice(0, index) || []), ...(files?.slice(index + 1) || [])]);
    }
  };

  return (
    <>
      <FieldWrapper error={error} showError={showError} label={label}>
        {!disabled && (
          <UploadFileContainer
            $error={!!error}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={onButtonClick}
          >
            <Input
              ref={inputRef}
              type="file"
              accept={availableExtensionsTypes.join(', ')}
              multiple={multiple}
              onChange={handleChange}
            />
            <TextRow>
              <BoldText>Paspauskite norėdami </BoldText>
              <Text>įkelti arba įtempkite failus čia</Text>
            </TextRow>
            <Text>PDF (maks. 1500MB)</Text>
          </UploadFileContainer>
        )}
      </FieldWrapper>
      {uploadLoading && <LoaderComponent />}
      {map(files, (file, index) => {
        if (!file) return <></>;

        return (
          <FileContainer key={`${index}-file`}>
            <FileInnerContainer>
              <FileName>{file?.name}</FileName>
              <FileSize>{bytesToMb(file.size)}</FileSize>
            </FileInnerContainer>
            <IconContainer href={file?.url} target="_blank" download={file?.name}>
              <StyledIcon name={IconName.download} />
            </IconContainer>
            {!disabled && (
              <IconContainer
                onClick={(e) => {
                  handleDelete(e, index);
                }}
              >
                <StyledIcon name={IconName.remove} />
              </IconContainer>
            )}
          </FileContainer>
        );
      })}
    </>
  );
};

const IconContainer = styled.a`
  margin-top: auto;
  height: 40px;
  display: flex;
  @media ${device.mobileL} {
    margin-bottom: 0px;
    height: auto;
  }
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 1.8rem;
  color: #9aa4b2;
  margin: auto 0 auto 16px;
  @media ${device.mobileL} {
    margin: 8px 0 16px 0;
  }
`;

const Text = styled.div`
  font-size: 1.1rem;
  color: #697586;
  text-align: center;
`;

const FileName = styled.div`
  font-size: 1.4rem;
  color: #121926;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
`;

const FileInnerContainer = styled.div`
  width: 90%;
`;

const FileSize = styled.div`
  font-size: 1.2rem;
  color: #4b5565;
`;
const BoldText = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #121926;
  margin-right: 4px;
`;

const Input = styled.input`
  display: none;
`;

const FileContainer = styled.div`
  margin-top: 4px;
  position: relative;
  background-color: white;
  border: 1px solid #cdd5df;
  border-radius: 4px;
  padding: 3px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TextRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  @media ${device.mobileL} {
    flex-direction: column;
  }
`;

const UploadFileContainer = styled.div<{ $error: boolean }>`
  cursor: pointer;
  background-color: #eeebe53d;
  border: 2px dashed ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.border)};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 77px;
`;

export default DragAndDropUploadField;
