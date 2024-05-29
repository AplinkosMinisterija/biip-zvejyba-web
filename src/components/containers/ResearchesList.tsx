import { isEmpty } from 'lodash';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { device, slugs, useInfinityLoad } from '../../utils';
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
                  key={research.id!}
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
    <Container>
      <>
        {renderContent()}
        <Footer>
          <Button onClick={() => navigate(slugs.newResearch)}>{'Naujas mokslinis tyrimas'}</Button>
        </Footer>
      </>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  width: 100%;
`;

const Invisible = styled.div`
  width: 10px;
  height: 16px;
`;

const InnerContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 12px;
  flex-direction: column;
  overflow: scroll;
`;

const Footer = styled.div`
  padding: 16px 0;
  @media ${device.desktop} {
    padding: 16px 0 0 0;
  }
`;

export default Researches;
