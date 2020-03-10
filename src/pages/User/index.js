import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
    Loading,
} from './styles';

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').login,
    });

    state = {
        stars: [],
        loading: true,
        page: 1,
    };

    static propTypes = {
        navigation: PropTypes.shape({
            navigate: PropTypes.func,
            getParam: PropTypes.func,
        }).isRequired,
    };

    async componentDidMount() {
        this.load();
    }

    load = async (page = 1) => {
        const { stars } = this.state;
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        const response = await api.get(`/users/${user.login}/starred`, {
            params: { page },
        });

        this.setState({
            stars: page >= 2 ? [...stars, ...response.data] : response.data,
            loading: false,
            page,
        });
    };

    loadMore = () => {
        const { page } = this.state;
        const nextPage = page + 1;
        this.load(nextPage);
    };

    handleNavigate = repository => {
        const { navigation } = this.props;
        navigation.navigate('Repository', { repository });
    };

    render() {
        const { navigation } = this.props;
        const { stars, loading } = this.state;
        const user = navigation.getParam('user');

        return (
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>
                {loading ? (
                    <Loading />
                ) : (
                    <Stars
                        data={stars}
                        keyExtractor={star => String(star.id)}
                        onEndReachedThreshold={0.2}
                        onEndReached={this.loadMore}
                        renderItem={({ item }) => (
                            <Starred onPress={() => this.handleNavigate(item)}>
                                <OwnerAvatar
                                    source={{ uri: item.owner.avatar_url }}
                                />
                                <Info>
                                    <Title>{item.name}</Title>
                                    <Author>{item.owner.login}</Author>
                                </Info>
                            </Starred>
                        )}
                    />
                )}
            </Container>
        );
    }
}
