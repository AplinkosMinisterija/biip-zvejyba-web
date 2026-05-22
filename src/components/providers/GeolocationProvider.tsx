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

  const watchIdRef = useRef<number | null>(null);
  const loadingToastShownRef = useRef(false);
  const permissionDeniedRef = useRef(false);

  const applyPosition = (position: GeolocationPosition) => {
    const next = {
      x: position.coords.longitude,
      y: position.coords.latitude,
    };
    setCoordinates((prev) => {
      // Skip byte-identical fixes to avoid pointless re-renders. GNSS
      // produces sub-meter drift on every tick (the trailing float
      // digits always change), so a real GNSS fix is never byte-equal
      // to the previous one. WiFi/cell triangulation often returns the
      // same rounded fix repeatedly — this filters those duplicates
      // without rejecting better fixes (no distance threshold).
      if (prev && prev.x === next.x && prev.y === next.y) return prev;
      return next;
    });
    setLoading(false);
    loadingToastShownRef.current = false;
  };

  const handleGeolocationError = (err: GeolocationPositionError, isWatch: boolean) => {
    if (err.code === 1) {
      permissionDeniedRef.current = true;
      handleErrorToast('Nesuteikti vietos nustatymo leidimai. Patikrinkite naršyklės nustatymus.');
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setLoading(false);
      return;
    }
    // Transient errors on the watch are fine — it keeps running and a
    // later tick will succeed. Only settle loading on the initial fix
    // failure so consumers can fall back to manual entry.
    if (!isWatch) {
      setLoading(false);
      loadingToastShownRef.current = false;
    }
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

    if (!loadingToastShownRef.current) {
      loadingToastShownRef.current = true;
      handleGeolocationToast(true);
    }

    // Continuous watch with the same options keeps the GPS chip warm
    // and feeds fresh coordinates as the boat moves between spots, so
    // the user doesn't have to mash "Atnaujinti lokaciją" before each
    // tap. Each tick is equivalent to a fresh `getCurrentPosition`
    // call with `maximumAge: 0`, so accuracy is identical.
    startWatch();

    // One-shot initial fix in parallel — sometimes succeeds before the
    // watch's first tick on warm GPS.
    navigator.geolocation.getCurrentPosition(
      applyPosition,
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
