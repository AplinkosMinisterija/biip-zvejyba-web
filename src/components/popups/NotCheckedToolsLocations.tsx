import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { buttonLabels } from '../../utils';
import api from '../../utils/api';
import Button, { ButtonColors } from '../buttons/Button';
import PopUpWithTitles from '../layouts/PopUpWithTitle';
import { Grid } from '../other/CommonStyles';
import { IconName } from '../other/Icon';

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
    <PopUpWithTitles
      iconName={IconName.endFishing}
      visible={notCheckedToolsLocations?.length}
      title={'Nepatikrinti įrankiai'}
      onClose={() => setNotCheckedToolsLocations([])}
    >
      <Grid $columns={1}>
        <div>
          Šiose vietose yra nepatikrintų įrankių:{' '}
          <strong>{notCheckedToolsLocations.map((loc) => loc.name).join(', ')}</strong>
        </div>
        <Button variant={ButtonColors.PRIMARY} onClick={() => setNotCheckedToolsLocations([])}>
          {buttonLabels.close}
        </Button>
      </Grid>
    </PopUpWithTitles>
  );
};

export default NotCheckedToolsLocations;
