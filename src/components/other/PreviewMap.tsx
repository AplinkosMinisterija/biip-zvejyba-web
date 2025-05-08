import { useRef, useState } from 'react';
import styled from 'styled-components';
import { device, Url } from '../../utils';
import Button from '../buttons/Button';
import Icon, { IconName } from './Icon';

type FeatureCollection = {
  type: 'FeatureCollection';
  features: Feature[];
};

type GenericObject = {
  [key: string]: any;
};

type Feature = {
  type: 'Feature';
  geometry: Geometry;
  properties?: GenericObject;
};

type Geometry = {
  type: string;
  coordinates: CoordinatesTypes;
};
type CoordinatesPoint = number[];
type CoordinatesMultiPoint = CoordinatesPoint[];
type CoordinatesLineString = CoordinatesPoint[];
type CoordinatesMultiLineString = CoordinatesLineString[];
type CoordinatesPolygon = CoordinatesLineString[];
type CoordinatesMultiPolygon = CoordinatesPolygon[];

type CoordinatesTypes =
  | CoordinatesPoint
  | CoordinatesLineString
  | CoordinatesPolygon
  | CoordinatesMultiPoint
  | CoordinatesMultiLineString
  | CoordinatesMultiPolygon;

interface MapProps {
  height?: string;
  value?: FeatureCollection;
}

const PreviewMap = ({ height = '270px', value }: MapProps) => {
  const iframeRef = useRef<any>(null);
  const [showModal, setShowModal] = useState(false);

  const src = `${Url.EDIT}?hideToolbar=1&preview=1`;

  const handleLoadMap = () => {
    if (!value) return;
    iframeRef?.current?.contentWindow?.postMessage({ geom: value }, '*');
  };

  return (
    <Container $showModal={showModal}>
      <InnerContainer $showModal={showModal}>
        <StyledButton
          $popup={showModal}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(!showModal);
          }}
        >
          <StyledIconContainer>
            <StyledIcon name={showModal ? IconName.exitFullScreen : IconName.fullscreen} />
          </StyledIconContainer>
        </StyledButton>
        <StyledIframe
          allow="geolocation *"
          ref={iframeRef}
          src={src}
          $width={'100%'}
          $height={showModal ? '100%' : height}
          style={{ border: 0 }}
          allowFullScreen={true}
          onLoad={handleLoadMap}
          aria-hidden="false"
          tabIndex={1}
        />
      </InnerContainer>
    </Container>
  );
};

const Container = styled.div<{
  $showModal: boolean;
}>`
  width: 100%;
  ${({ $showModal }) =>
    $showModal &&
    `
  height: 100%;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #0b1b607a;
  overflow-y: auto;
  z-index: 1002;
  `}
`;

const InnerContainer = styled.div<{
  $showModal: boolean;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ $showModal }) =>
    $showModal &&
    `
    position: fixed;
    padding: 16px;
  `}

  @media ${device.mobileL} {
    padding: 0;
  }
`;

const StyledIframe = styled.iframe<{
  $height: string;
  $width: string;
}>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
`;

const StyledButton = styled(Button)<{ $popup: boolean }>`
  position: absolute;
  z-index: 3000;
  right: ${({ $popup }) => ($popup ? 28 : 11)}px;
  top: ${({ $popup }) => ($popup ? 28 : 15)}px;
  width: 28px;
  background-color: white;
  height: 28px;
  padding: 0;
  border-radius: 4px;
  border: 0;
  :hover {
    background-color: ${({ theme }) => theme.colors.cardBackground.primary};
    border-radius: 4px;
  }
  @media ${device.mobileL} {
    top: 10px;
    right: 10px;
  }
  button {
    border-color: #e5e7eb;
    background-color: white !important;
    width: 28px;
    height: 28px;
    box-shadow: 1px 18px 41px #121a5529;
  }
`;

const StyledIcon = styled(Icon)`
  font-size: 3rem;
  color: #6b7280;
`;

const StyledIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default PreviewMap;
