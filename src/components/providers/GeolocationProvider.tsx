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

// Continuous high-accuracy watch — used once the angler is on the water.
const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 25000,
};

// Initial fast fix using whatever the device has handy (cell / wifi cache).
// Boat-side GPS warm-ups can take 10s+, which is why ~50% of users were
// hitting the timeout error toast on first load.
const INITIAL_FIX_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 8000,
  maximumAge: 60000,
};

// On a moving boat the GPS can fire several times per second with
// sub-meter drift. Without a threshold every tick produced a new
// coordinates object → React Query refetched the location lookup,
// downstream components re-rendered, and the screen "shook".
// 0.0005° ≈ 50 m at Lithuania's latitude — fine-grained enough for a
// build-event geom yet coarse enough to keep fishing-tools queries
// from firing on every GPS tick (a polder / bar / lake spans hundreds
// of meters, so 50 m is well within the same bucket).
const MIN_COORDINATE_DELTA = 0.0005;

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
      if (
        prev &&
        Math.abs(prev.x - next.x) < MIN_COORDINATE_DELTA &&
        Math.abs(prev.y - next.y) < MIN_COORDINATE_DELTA
      ) {
        // Same reference → consumers' query keys stay equal, no refetch.
        return prev;
      }
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
    }
    // Silent on unavailable / timeout — the continuous watch is running and
    // will recover on its own. Surfacing a toast for every transient GPS
    // hiccup spammed users on a moving boat.

    finishInitialResolve();
  };

  const startWatch = () => {
    if (watchIdRef.current !== null || permissionDeniedRef.current) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      applyPosition,
      (err) => handleGeolocationError(err, true),
      WATCH_OPTIONS,
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

    // Start the continuous watch immediately so we don't depend on a single
    // getCurrentPosition succeeding — boat GPS often takes 10s+ for the first
    // fix, and the previous flow left the user with no coordinates at all if
    // that initial call timed out.
    startWatch();

    navigator.geolocation.getCurrentPosition(
      applyPosition,
      (err) => handleGeolocationError(err, false),
      INITIAL_FIX_OPTIONS,
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
