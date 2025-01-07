import React, { createContext, useCallback, useState } from 'react';
import { PopupContentType } from '../../utils/constants';
import LocationPermission from '../popups/LocationPermission';

export interface PopupContextProps {
  showPopup: (props: { type: PopupContentType; content: any }) => void;
  hidePopup: () => void;
}

export const defaultPopupContextProps = {
  showPopup: () => {},
  hidePopup: () => {},
};

export const PopupContext = createContext<PopupContextProps>(defaultPopupContextProps);

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visiblePopup, setVisiblePopup] = useState<{ type: PopupContentType; content: any }>();

  const showPopup = useCallback((props: { type: PopupContentType; content: any }) => {
    setVisiblePopup(props);
  }, []);

  const hidePopup = () => {
    setVisiblePopup(undefined);
  };
  // Be aware that these popups are rendered outside of react router scope, so router features (like useParams, navigate etc.) are not available inside popups.
  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {
        // location permission popup
        visiblePopup?.type === PopupContentType.LOCATION_PERMISSION && (
          <LocationPermission content={visiblePopup.content} onClose={hidePopup} />
        )
      }
      {children}
    </PopupContext.Provider>
  );
};
