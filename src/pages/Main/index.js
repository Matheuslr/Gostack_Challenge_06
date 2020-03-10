import React, { Component } from 'react';
import { keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
    Container,
    Form,
    Input,
    SubmitButton,
    List,
    User,
    Avatar,
    Name,
    Bio,
    ProfileButton,
    ProfileButtonText,
} from './styles';

export default class Main extends Component {
    static propTypes = {
        navigation: PropTypes.shape({
            navigate: PropTypes.func,
        }).isRequired,
    };

    state = {
        newUser: '',
        users: [],
        loading: false,
        error: null,

    };

    async componentDidMount() {
        const users = await AsyncStorage.getItem('users');
        if (users) {
            this.setState({
                users: JSON.parse(users),
            });
        }
    }

    async componentDidUpdate(_, prevState) {
        const { users } = this.state;
        if (prevState.users !== users) {
            await AsyncStorage.setItem('users', JSON.stringify(users));
        }
    }

    handleAddUser = async () => {
        const { users, newUser } = this.state;
        this.setState({ loading: true });

        try {
            const isInUsers = users.find(
                user => user.login.toUpperCase() === newUser.toUpperCase()
            );
            if (newUser === '') {
                throw new Error('You need to sent a user');
            }
            if (isInUsers) {
                throw new Error('User in users');
            }
            const response = await api.get(`/users/${newUser}`);
            const data = {
                name: response.data.name,
                login: response.data.login,
                bio: response.data.bio,
                avatar: response.data.avatar_url,
            };

            this.setState({
                users: [...users, data],
                newUser: '',
                loading: false,
                error: false,
            });
        } catch (err) {
            this.setState({ loading: false, error: true, newUser: '' });
        } finally {
            keyboard.dismiss();
        }
    };

    handleNavigate = user => {
        const { navigation } = this.props;
        navigation.navigate('User', { user });
    };

    static navigationOptions = {
        title: 'Usuários',
    };

    render() {
        const { users, newUser, loading, error } = this.state;
        return (
            <Container>
                <Form>
                    <Input
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Adicionar Usuário"
                        value={newUser}
                        onChangeText={text => this.setState({ newUser: text })}
                        returnKeyType="send"
                        onSubmitEditing={this.handleAddUser}
                        error={error}
                    />
                    <SubmitButton
                        loading={loading}
                        onPress={this.handleAddUser}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Icon name="add" size={20} color="#FFF" />
                        )}
                    </SubmitButton>
                </Form>
                <List
                    data={users}
                    keyExtractor={user => user.login}
                    renderItem={({ item }) => (
                        <User>
                            <Avatar source={{ uri: item.avatar }} />
                            <Name>{item.name}</Name>
                            <Bio>{item.bio}</Bio>

                            <ProfileButton
                                onPress={() => this.handleNavigate(item)}
                            >
                                <ProfileButtonText>
                                    Ver perfil
                                </ProfileButtonText>
                            </ProfileButton>
                        </User>
                    )}
                />
            </Container>
        );
    }
}
