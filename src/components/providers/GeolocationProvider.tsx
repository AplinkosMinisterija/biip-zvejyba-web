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

// Match gps-coordinates.net's behaviour as closely as we can with the
// W3C Geolocation API:
// - `enableHighAccuracy: true` — prefer GNSS over WiFi/cell triangulation.
// - `maximumAge: 0` — never reuse a cached position; field reports of
//   "shifted by kilometres" came from the OS handing back stale fixes
//   from the previous location (angler unlocks phone at home, drives to
//   the dock, the OS reuses the home reading).
// - `timeout: 120000` — give the OS plenty of time to lock onto GNSS
//   before giving up. Cold-start GPS over AGPS can take 30–60 s; first
//   fix on the water with weak cellular can push past 90 s. Better to
//   wait than to short-circuit into a WiFi fallback.
const POSITION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 120000,
  maximumAge: 0,
};

export const GeolocationContext = createContext<GeolocationContextProps>({
  coordinates: null,
  loading: true,
  refresh: () => {},
});

export const GeolocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);

  const loadingToastShownRef = useRef(false);
  const permissionDeniedRef = useRef(false);

  const applyPosition = (position: GeolocationPosition) => {
    setCoordinates({
      x: position.coords.longitude,
      y: position.coords.latitude,
    });
    setLoading(false);
    loadingToastShownRef.current = false;
  };

  const handleGeolocationError = (err: GeolocationPositionError) => {
    if (err.code === 1) {
      permissionDeniedRef.current = true;
      handleErrorToast('Nesuteikti vietos nustatymo leidimai. Patikrinkite naršyklės nustatymus.');
    }
    setLoading(false);
    loadingToastShownRef.current = false;
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

    if (!loadingToastShownRef.current) {
      loadingToastShownRef.current = true;
      handleGeolocationToast(true);
    }

    navigator.geolocation.getCurrentPosition(
      applyPosition,
      handleGeolocationError,
      POSITION_OPTIONS,
    );
  }, []);

  useEffect(() => {
    requestCurrentPosition();
  }, [requestCurrentPosition]);

  return (
    <GeolocationContext.Provider value={{ coordinates, loading, refresh: requestCurrentPosition }}>
      {children}
    </GeolocationContext.Provider>
  );
};
