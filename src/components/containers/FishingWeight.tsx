import styled from 'styled-components';
import LargeButton from '../buttons/LargeButton.tsx';
import { Variant } from '../buttons/FishingLocationButton.tsx';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '../../utils/api.ts';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions } from '../../state/fishing/reducer.ts';
import fishingLocation from './FishingLocation.tsx';

const FishingWeight = ({ fishing }: any) => {
    return (
        <>
            <Container>Fishing weight</Container>
        </>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    margin-bottom: 40px;
`;

export default FishingWeight;
