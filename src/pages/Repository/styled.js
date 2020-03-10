import styled from 'styled-components/native';

export const Loading = styled.ActivityIndicator.attrs({
    color: '#7159c1',
    size: 50,
})`
    position: absolute;
    height: 100%;
    width: 100%;
    background: #eee;
    justify-content: center;
    align-items: center;
`;
