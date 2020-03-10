import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import { Loading } from './styled';

export default class Repository extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('repository').name,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            navigate: PropTypes.func,
            getParam: PropTypes.func,
        }).isRequired,
    };

    render() {
        const { navigation } = this.props;
        const repository = navigation.getParam('repository');

        return (
            <WebView
                startInLoadingState
                renderLoading={() => {
                    return <Loading />;
                }}
                source={{ uri: repository.svn_url }}
            />
        );
    }
}
