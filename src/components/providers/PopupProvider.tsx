import React, { createContext, useCallback, useState } from 'react';
import { PopupContentType } from '../../utils/constants';
import LocationPermission from '../popups/LocationPermission';
import { StartFishing } from '../popups/StartFishing';
import { SkipFishing } from '../popups/SkipFishing';
import StartFishingInlandWater from '../popups/StartFishingInlandWater';
import EndFishing from '../popups/EndFishing';
import CaughtFishWeight from '../popups/CaughtFishWeiht';
import ToolGroupAction from '../popups/ToolGroupAction';

export interface PopupContextProps {
  showPopup: (props: { type: PopupContentType; content?: any }) => void;
  hidePopup: () => void;
}

export const defaultPopupContextProps = {
  showPopup: () => {},
  hidePopup: () => {},
};

export const PopupContext = createContext<PopupContextProps>(defaultPopupContextProps);

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visiblePopup, setVisiblePopup] = useState<{ type: PopupContentType; content?: any }>();

  const showPopup = useCallback((props: { type: PopupContentType; content?: any }) => {
    setVisiblePopup(props);
  }, []);

  const hidePopup = () => {
    setVisiblePopup(undefined);
  };
  // Be aware that these popups are rendered outside of react router scope, so router features (like useParams, navigate etc.) are not available inside popups.
  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      <>
        {
          // location permission popup
          visiblePopup?.type === PopupContentType.LOCATION_PERMISSION && (
            <LocationPermission content={visiblePopup.content} onClose={hidePopup} />
          )
        }
        {
          // start fishing
          visiblePopup?.type === PopupContentType.START_FISHING && (
            <StartFishing content={visiblePopup.content} onClose={hidePopup} />
          )
        }
        {
          // start fishing in inland water reservoir
          visiblePopup?.type === PopupContentType.START_FISHING_INLAND_WATERS && (
            <StartFishingInlandWater content={visiblePopup.content} onClose={hidePopup} />
          )
        }
        {
          // start fishing in inland water reservoir
          visiblePopup?.type === PopupContentType.SKIP_FISHING && (
            <SkipFishing content={visiblePopup.content} onClose={hidePopup} />
          )
        }
        {
          // start fishing in inland water reservoir
          visiblePopup?.type === PopupContentType.END_FISHING && (
            <EndFishing content={visiblePopup.content} onClose={hidePopup} />
          )
        }
        {visiblePopup?.type === PopupContentType.CAUGHT_FISH_WEIGHT && (
          <CaughtFishWeight content={visiblePopup.content} onClose={hidePopup} />
        )}
        {visiblePopup?.type === PopupContentType.TOOL_GROUP_ACTION && (
          <ToolGroupAction content={visiblePopup.content} onClose={hidePopup} />
        )}
        {children}
      </>
    </PopupContext.Provider>
  );
};
