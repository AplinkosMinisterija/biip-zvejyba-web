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

// Reject any fix worse than this — `enableHighAccuracy: false` initial
// fixes (cell / WiFi triangulation) can be 500–5000 m off in coastal
// Lithuania, which is what the field audit reported as "all points
// raised up" on the admin map. Skipping the position keeps the watch
// running and lets a real GPS fix arrive seconds later. 100 m is well
// inside any bar / polder / lake bucket but tight enough to make
// triangulation fixes unusable.
const MAX_ACCURACY_METERS = 100;

// Safety net: if neither the initial fix nor the watch yields a position
// within this window, flip `loading` to false so consumers can fall back to
// manual location entry / the "Atnaujinti lokaciją" retry button. The watch
// continues running silently in the background, so a fix arriving later still
// populates `coordinates`. Without this timer, a transient watch failure
// followed by a slow initial fix used to flip loading to false with
// `coordinates === null`, causing action popups to fire the
// "mustAllowToSetCoordinates" toast even though GPS was still warming up.
const SETTLE_LOADING_TIMEOUT_MS = 15000;

export const GeolocationContext = createContext<GeolocationContextProps>({
  coordinates: null,
  loading: true,
  refresh: () => {},
});

export const GeolocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);

  const watchIdRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const loadingToastShownRef = useRef(false);
  const permissionDeniedRef = useRef(false);

  const settleLoading = () => {
    setLoading(false);
    loadingToastShownRef.current = false;
    if (settleTimerRef.current !== null) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  };

  const applyPosition = (position: GeolocationPosition) => {
    // Triangulation / coarse fixes report accuracy in the high hundreds or
    // thousands of meters. Holding onto whatever the previous (or no) fix
    // was buys time for the high-accuracy watch to deliver a real GPS fix.
    const accuracy = position.coords.accuracy ?? Infinity;
    if (accuracy > MAX_ACCURACY_METERS) return;

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
    settleLoading();
  };

  const handleGeolocationError = (err: GeolocationPositionError, isWatch: boolean) => {
    if (err.code === 1) {
      permissionDeniedRef.current = true;
      handleErrorToast('Nesuteikti vietos nustatymo leidimai. Patikrinkite naršyklės nustatymus.');
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      settleLoading();
      return;
    }

    // Transient unavailable / timeout. We deliberately do NOT settle loading
    // here, because the watch is continuous and is still trying — flipping
    // loading=false while coordinates is still null tricks consumers into
    // enabling their action buttons, after which the user taps and hits the
    // "mustAllowToSetCoordinates" toast even though GPS was just slow. The
    // safety-net timer in requestCurrentPosition guarantees loading
    // eventually flips so the manual-entry UI isn't blocked forever.
    if (isWatch) return;

    // Initial fast fix failed (often a cold-cache 8s timeout). Stay loading
    // and lean on the continuous watch + safety-net timer.
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

    if (!loadingToastShownRef.current) {
      loadingToastShownRef.current = true;
      handleGeolocationToast(true);
    }

    if (settleTimerRef.current !== null) clearTimeout(settleTimerRef.current);
    settleTimerRef.current = window.setTimeout(() => {
      settleTimerRef.current = null;
      setLoading(false);
      loadingToastShownRef.current = false;
    }, SETTLE_LOADING_TIMEOUT_MS);

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
      if (settleTimerRef.current !== null) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };
  }, [requestCurrentPosition]);

  return (
    <GeolocationContext.Provider value={{ coordinates, loading, refresh: requestCurrentPosition }}>
      {children}
    </GeolocationContext.Provider>
  );
};
