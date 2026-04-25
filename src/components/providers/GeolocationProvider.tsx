import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { handleErrorToast, handleGeolocationToast } from '../../utils/functions';

type Coordinates = {
  x: number;
  y: number;
};

export interface GeolocationContextProps {
  coordinates: Coordinates | null;
  loading: boolean;
  refresh: () => void;
}

const POSITION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 25000,
};

export const GeolocationContext = createContext<GeolocationContextProps>({
  coordinates: null,
  loading: true,
  refresh: () => {},
});

export const GeolocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);

  const watchIdRef = useRef<number | null>(null);
  const resolvedInitialRef = useRef(false);
  const loadingToastShownRef = useRef(false);
  const permissionDeniedRef = useRef(false);

  const finishInitialResolve = () => {
    if (!resolvedInitialRef.current) {
      resolvedInitialRef.current = true;
      setLoading(false);
      loadingToastShownRef.current = false;
    }
  };

  const applyPosition = (position: GeolocationPosition) => {
    setCoordinates((prev) => {
      const next = {
        x: position.coords.longitude,
        y: position.coords.latitude,
      };
      if (prev && prev.x === next.x && prev.y === next.y) return prev;
      return next;
    });
    finishInitialResolve();
  };

  const handleGeolocationError = (err: GeolocationPositionError, isWatch: boolean) => {
    if (err.code === 1) {
      permissionDeniedRef.current = true;
      handleErrorToast('Nesuteikti vietos nustatymo leidimai. Patikrinkite naršyklės nustatymus.');
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    } else if (!isWatch && err.code === 2) {
      handleErrorToast('Nepavyko nustatyti jūsų vietos.');
    } else if (!isWatch && err.code === 3) {
      handleErrorToast('Baigėsi vietos nustatymo laukimo laikas. Bandykite dar kartą.');
    }

    finishInitialResolve();
  };

  const startWatch = () => {
    if (watchIdRef.current !== null || permissionDeniedRef.current) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      applyPosition,
      (err) => handleGeolocationError(err, true),
      POSITION_OPTIONS,
    );
  };

  const requestCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    if (permissionDeniedRef.current) {
      handleErrorToast('Nesuteikti vietos nustatymo leidimai. Patikrinkite naršyklės nustatymus.');
      return;
    }

    setLoading(true);
    resolvedInitialRef.current = false;

    if (!loadingToastShownRef.current) {
      loadingToastShownRef.current = true;
      handleGeolocationToast(true);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyPosition(position);
        startWatch();
      },
      (err) => handleGeolocationError(err, false),
      POSITION_OPTIONS,
    );
  }, []);

  useEffect(() => {
    requestCurrentPosition();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [requestCurrentPosition]);

  return (
    <GeolocationContext.Provider value={{ coordinates, loading, refresh: requestCurrentPosition }}>
      {children}
    </GeolocationContext.Provider>
  );
};
