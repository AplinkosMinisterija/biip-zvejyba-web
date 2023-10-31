import styled from 'styled-components';
import { device } from '../../utils';
import Avatar from '../other/Avatar';

export interface FishStockerItemProps {
    fisher: {
        name: string;
        lastName: string;
        email?: string;
        freelancer: boolean;
    };
    onClick: () => void;
    icon?: JSX.Element;
}

const ProfileItem = ({ fisher, onClick }: FishStockerItemProps) => {
    const fullName = `${fisher.name} ${fisher.lastName}`;

    return (
        <Container onClick={() => onClick()}>
            <StatusContainer>
                <StyledAvatar
                    name={fisher.name}
                    surname={fisher.lastName}
                    icon={fisher.freelancer && <BiipIcon src="/b-icon.png" />}
                />
            </StatusContainer>
            <Content>
                <FirstRow>
                    <TenantName>{fullName}</TenantName>
                </FirstRow>
                <SecondRow>
                    <TenantCode>{fisher.email}</TenantCode>
                </SecondRow>
            </Content>
        </Container>
    );
};

const Container = styled.a`
    background: #ffffff 0% 0% no-repeat padding-box;
    cursor: pointer;
    box-shadow: 0px 8px 16px #121a5514;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    opacity: 1;
    width: 100%;
    max-width: 400px;
    display: flex;
    vertical-align: middle;
    padding: 12px 0;
    margin: 8px 0;
    border: 1px solid ${({ theme }) => theme.colors.border};

    @media ${device.mobileL} {
        max-width: 100%;
    }

    &:hover,
    &:focus {
        border: 1px solid #13c9e7;
        box-shadow: 0 0 0 4px rgb(19 201 231 / 20%);
        background: rgb(19 201 231 / 4%);
    }
`;

const StatusContainer = styled.div`
    display: flex;
`;

const StyledAvatar = styled(Avatar)`
    margin: auto 18px auto 15px;
`;

const Content = styled.div`
    flex: 1;
    flex-direction: column;
    margin: auto 0;
    overflow: hidden;
`;

const FirstRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: 16px;
    justify-content: space-between;
`;

const TenantName = styled.span`
    display: inline-block;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-right: 16px;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const SecondRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 22px;
    align-items: center;
    margin-top: 4px;
`;

const TenantCode = styled.div`
    font: normal normal 600 1.4rem/19px;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const BiipIcon = styled.img`
    height: 24px;
    width: 24px;
`;

export default ProfileItem;
