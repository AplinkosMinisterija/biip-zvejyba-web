import { IconName } from '../other/Icon';
import { Grid } from '../other/CommonStyles';
import Button, { ButtonColors } from '../buttons/Button';
import PopUpWithImage from '../layouts/PopUpWithImage';

const infoToEnableTheLocationUrl = 'https://zuvys.biip.lt/dokumentacija/zvejyba/lokacija/';

export const LocationPermission = ({ content, onClose }: any) => {
  return (
    <PopUpWithImage
      onClose={onClose}
      iconName={IconName.location}
      visible={true}
      title={'Geografinės vietos leidimas'}
      description={
        'Norint naudotis elektroniniu žvejybos žurnalu, prašome suteikti leidimą naudotis jūsų geografinę vietą.'
      }
    >
      <Grid>
        <Button
          onClick={() => {
            window.location.href = infoToEnableTheLocationUrl;
          }}
        >
          {'Skaityti instrukciją'}
        </Button>
        <Button variant={ButtonColors.SECONDARY} onClick={onClose}>
          {'Žinau kaip suteikti leidimą'}
        </Button>
      </Grid>
    </PopUpWithImage>
  );
};
export default LocationPermission;
