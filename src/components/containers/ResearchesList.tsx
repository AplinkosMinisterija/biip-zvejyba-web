import { isEmpty } from 'lodash';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { slugs, useInfinityLoad } from '../../utils';
import api from '../../utils/api';
import Button from '../buttons/Button';
import { Grid } from '../other/CommonStyles';
import LoaderComponent from '../other/LoaderComponent';
import { NotFound } from '../other/NotFound';
import ResearchCard from '../other/ResearchCard';

const Researches = () => {
  const observerRef = useRef<any>(null);
  const navigate = useNavigate();

  const {
    data: researches,
    isFetching,
    isLoading,
  } = useInfinityLoad(`researches`, api.getResearches, observerRef);

  const renderContent = () => {
    if (isLoading) return <LoaderComponent />;

    if (isEmpty(researches?.pages?.[0]?.data)) {
      return <NotFound message={'Nėra mokslinių tyrimų'} />;
    }

    return (
      <InnerContainer>
        {researches?.pages.map((page, pageIndex) => {
          return (
            <React.Fragment key={pageIndex}>
              {page.data.map((research: any) => (
                <ResearchCard
                  key={research?.id!}
                  research={research}
                  onClick={() => navigate(slugs.updateResearch(research.id!))}
                />
              ))}
            </React.Fragment>
          );
        })}
        {observerRef && <Invisible ref={observerRef} />}
        {isFetching && <LoaderComponent />}
      </InnerContainer>
    );
  };

  return (
    <Grid $columns={1}>
      <>
        {renderContent()}
        <Button onClick={() => navigate(slugs.newResearch)}>{'Naujas mokslinis tyrimas'}</Button>
      </>
    </Grid>
  );
};

const Invisible = styled.div`
  width: 10px;
  height: 16px;
`;

const InnerContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  height: 700px;
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

export default Researches;
