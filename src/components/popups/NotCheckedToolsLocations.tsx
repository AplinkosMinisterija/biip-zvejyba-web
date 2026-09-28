import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { buttonLabels, FishingLocationOption } from '../../utils';
import api from '../../utils/api';
import Button, { ButtonColors } from '../buttons/Button';
import PopUpWithTitles from '../layouts/PopUpWithTitle';
import { Grid } from '../other/CommonStyles';
import { IconName } from '../other/Icon';

interface NotCheckedToolsPopupProps {
  locations: FishingLocationOption[];
  onClose: () => void;
}

export const NotCheckedToolsPopup = ({ locations, onClose }: NotCheckedToolsPopupProps) => (
  <PopUpWithTitles
    iconName={IconName.endFishing}
    visible={locations.length > 0}
    title={'Nepatikrinti įrankiai'}
    onClose={onClose}
  >
    <Grid $columns={1}>
      <div>
        Šiose vietose yra nepatikrintų įrankių:{' '}
        <strong>{locations.map((loc) => loc.name).join(', ')}</strong>
      </div>
      <Button variant={ButtonColors.PRIMARY} onClick={onClose}>
        {buttonLabels.close}
      </Button>
    </Grid>
  </PopUpWithTitles>
);

export const NotCheckedToolsLocations = ({ location }: any) => {
  const [notCheckedToolsLocations, setNotCheckedToolsLocations] = useState<
    { id: number; name: string }[]
  >([]);
  const { data = [] } = useQuery(
    ['notCheckedToolsLocations', location],
    () => api.getNotCheckedToolsLocations(),
    {
      retry: false,
    },
  );

  useEffect(() => {
    setNotCheckedToolsLocations(data.filter((item) => item.id !== location?.id));
  }, [location?.id, data.length]);

  return (
    <NotCheckedToolsPopup
      locations={notCheckedToolsLocations}
      onClose={() => setNotCheckedToolsLocations([])}
    />
  );
};

export default NotCheckedToolsLocations;
