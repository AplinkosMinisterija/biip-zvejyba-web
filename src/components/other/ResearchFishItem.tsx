import styled from 'styled-components';
import { device, FishType, ResearchFish } from '../../utils';
import NumericTextField from '../fields/NumericTextField';
import SelectField from '../fields/SelectField';
import { Grid } from './CommonStyles';
import Icon, { IconName } from './Icon';

export interface PhotoFieldWithNameProps {
  fish: ResearchFish;
  fishTypes: FishType[];
  index: number;
  errors: any;
  onSetFieldValue: any;
  onDelete: (id: number) => void;
  showDelete: boolean;
}

const ResearchFishItem = ({
  fish,
  errors,
  index,
  onSetFieldValue,
  fishTypes,
  onDelete,
  showDelete,
}: PhotoFieldWithNameProps) => {
  const { fishType, abundance, abundancePercentage, biomass, biomassPercentage } = fish;
  return (
    <Container key={`research-fish-${index}`}>
      {showDelete && (
        <TopRow>
          <ButtonRow onClick={() => onDelete(index)}>
            <StyledIcon name={IconName.deleteItem} />
            <ButtonText>{'Trinti'}</ButtonText>
          </ButtonRow>
        </TopRow>
      )}
      <Grid columns={1}>
        <SelectField
          options={fishTypes}
          getOptionLabel={(option) => option?.label}
          value={fishType}
          error={errors?.fishType}
          label={'Žuvų rūšis'}
          name={'fishType'}
          onChange={(value) => onSetFieldValue(`fishes.${index}.fishType`, value)}
        />
      </Grid>
      <Grid columns={2}>
        <NumericTextField
          label={'Gausumas'}
          name="abundance"
          value={abundance}
          error={errors?.abundance}
          onChange={(value) => onSetFieldValue(`fishes.${index}.reportedAmount`, value)}
          digitsAfterComma={1}
        />
        <NumericTextField
          label={'% bendro gausumo'}
          name="abundancePercentage"
          value={abundancePercentage}
          error={errors?.abundancePercentage}
          onChange={(value) => onSetFieldValue(`fishes.${index}.abundancePercentage`, value)}
          digitsAfterComma={1}
        />
        <NumericTextField
          label={'Biomasė'}
          name="biomass"
          value={biomass}
          error={errors?.biomass}
          onChange={(value) => onSetFieldValue(`fishes.${index}.biomass`, value)}
          digitsAfterComma={3}
        />
        <NumericTextField
          label={'% bendros biomasės'}
          name="biomassPercentage"
          value={biomassPercentage}
          error={errors?.biomassPercentage}
          onChange={(value) => onSetFieldValue(`fishes.${index}.biomassPercentage`, value)}
          digitsAfterComma={1}
        />
      </Grid>
    </Container>
  );
};

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.danger};
  margin-right: 8px;
  @media ${device.mobileL} {
    margin: 0;
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f8fafc;
  border-radius: 4px;
  padding: 18px 16px 18px 16px;
`;

const ButtonText = styled.div`
  font-size: 1.4rem;
  line-height: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ButtonRow = styled.div`
  cursor: pointer;
  display: grid;
  align-items: center;
  grid-template-columns: 11px 1fr;
  gap: 11px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export default ResearchFishItem;
