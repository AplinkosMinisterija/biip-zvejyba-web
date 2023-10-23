import styled from 'styled-components';

const ToolTypeButton = ({ label, icon, active, onClick }: any) => {
    return (
        <Container onClick={onClick} $active={active}>
            <StyledImage src={icon} $active={active} />
            <Title>{label}</Title>
        </Container>
    );
};

const Container = styled.div<{ $active: boolean }>`
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 16px;
    background-color: ${({ theme, $active }) =>
        $active ? '#f5f6fe' : theme.colors.largeButton.GREY};
    border: ${({ theme, $active }) => ($active ? `1px solid ${theme.colors.primary}` : 'none')};
    align-items: center;
    gap: 12px;
    flex-grow: inherit;
`;

const Title = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    display: flex;
    align-items: start;
    justify-content: space-between;
`;

const StyledImage = styled.img<{ $active: boolean }>`
    width: 4.8rem;
    height: 4.8rem;
    ${({ $active }) =>
        $active
            ? 'filter: invert(15%) sepia(56%) saturate(5078%) hue-rotate(226deg) brightness(92%) contrast(97%)'
            : ''};
`;

export default ToolTypeButton;
