import React, { Component } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Linking, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import styles from './style';
import images from '../../../assets/images';
import { translate } from '../../utilities/i18';
import { getTwitchDataCloudFunction } from '../../services/functions';
import { sendCheers, updateTwitchUsername } from '../../services/database';
import { connect } from 'react-redux';
import QaplaIcon from '../../components/QaplaIcon/QaplaIcon';
import ChatAnimatedDots from '../../components/ChatAnimatedDots/ChatAnimatedDots';

class WriteCheerMessageScreen extends Component {
    textInput = null;

    state = {
        message: '',
        userResponse: '',
        chatResponsePhraseP1: '',
        chatResponsePhraseP2: '',
        cheerStatus: 0,
        skipMessage: false
    };

    updateMessage = (message) => {
        if (this.state.message[this.state.message.length - 1] === '\n' && message[message.length - 1] === '\n') {
            this.setState({ message: this.state.message });
        } else {
            this.setState({ message });
        }
    }

    sendCheersWithMessage = async () => {
        let finalMessage = this.state.message.trim();
        this.setState({ showUserMessage: true, userResponse: this.state.message, message: '', cheerStatus: 1 }, async () => {
            this.textInput.clear();
            if (finalMessage.includes('\n')) {
                finalMessage = finalMessage.replaceAll('\n', '');
            }

            await this.updateTwitchDataAndSaveCheer(finalMessage, this.selectChatResponse);
        });
    }

    updateTwitchDataAndSaveCheer = async (finalMessage, callback) => {
        try {
            let twitchUsername = this.props.twitchUsername;

            try {
                const twitchData = await getTwitchDataCloudFunction(this.props.twitchId);
                await updateTwitchUsername(this.props.uid, twitchData.data.display_name);
                twitchUsername = twitchData.data.display_name;
            } catch (error) {
                console.log(error);
            }

            const qoinsToDonate = this.props.navigation.getParam('qoinsToDonate', 200);
            const streamerData = this.props.navigation.getParam('streamerData', { displayName: '', streamerId: '' });

            let now = new Date();
            await sendCheers(qoinsToDonate, finalMessage, now.getTime(), streamerData.displayName, this.props.uid, this.props.userName, twitchUsername, this.props.userImage, streamerData.streamerId);

            callback();
        } catch (error) {
            this.setState({ cheerStatus: 3, chatResponsePhraseP1: translate('writeCheerMessageScreen.sendCheerError') });
            console.log(error);
        }
    }

    selectChatResponse =  () => {
		let messageLenght = this.state.userResponse.trim().length;

		let typeOfResponse = 'none';
		let chatResponsePhraseP1 = '';
		let chatResponsePhraseP2 = '';
		let emojis = ['🥰', '😉', '❤', '💞', '💓', '💗', '💖'];
		let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

		if (messageLenght > 0 && messageLenght <= 54) typeOfResponse = 'short';
		if (messageLenght > 54 && messageLenght <= 108) typeOfResponse = 'medium';
		if (messageLenght > 108) typeOfResponse = 'long';

		let firsPartArr = Object.values(translate('sendCheersModal.chatResponsePharases.' + typeOfResponse));
		let secondPartArr = Object.values(translate('sendCheersModal.chatResponsePharases.secondPart'));
		let willBeSentArr = Object.values(translate('sendCheersModal.chatResponsePharases.willBeSent'));
		let randomNum = Math.floor(Math.random() * firsPartArr.length);

		if (typeof firsPartArr[0] === 'object') {
			firsPartArr.forEach((element) => {
				let arr = Object.values(element);
				randomNum = Math.floor(Math.random() * arr.length);
				chatResponsePhraseP1 += arr[randomNum];
			});
		} else {
			chatResponsePhraseP1 += firsPartArr[randomNum];
		}

		randomNum = Math.floor(Math.random() * secondPartArr.length);
		chatResponsePhraseP2 += secondPartArr[randomNum] + '\n';
		randomNum = Math.floor(Math.random() * willBeSentArr.length);
		chatResponsePhraseP2 += willBeSentArr[randomNum] + ' ' + randomEmoji;

		this.setState({ chatResponsePhraseP1, chatResponsePhraseP2, cheerStatus: 2 });
	}

    finishCheer = () => {
        this.props.navigation.goBack();
    }

     sendToDiscord = async () => {
        const link = (await remoteConf.getDataFromKey('Discord')).QAPLA_DISCORD_CHANNEL;
        Linking.openURL(link);
    }

    sendCheersWithoutMessage = () => {
        this.setState({ skipMessage: true }, async () => {
            try {
                await this.updateTwitchDataAndSaveCheer('', () => {
                    const streamerData = this.props.navigation.getParam('streamerData', { displayName: '', streamerId: '' });
                    this.props.navigation.navigate('CheersSent', { streamerName: streamerData.displayName });
                });
            } catch (error) {
                console.log(error);
            }
        });
    }

    render() {
        const streamerData = this.props.navigation.getParam('streamerData', { displayName: '' });

        return (
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.header}>
                        <Text style={styles.sendAMessageText}>
                            {translate('writeCheerMessageScreen.sendPersonalizedMessage')}
                        </Text>
                        {this.state.cheerStatus === 0 &&
                            <TouchableOpacity style={styles.skipButton}
                                onPress={this.sendCheersWithoutMessage}>
                                {!this.state.skipMessage ?
                                    <Text style={styles.skipButtonText}>
                                        {translate('linkTwitchAccount.skip')}
                                    </Text>
                                    :
                                    <ActivityIndicator color='#00FFDC' />
                                }
                            </TouchableOpacity>
                        }
                    </View>
                    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                        <View style={{ flex: 1 }} />
                        <View>
                            <View style={styles.botInformation}>
                                <Image source={images.png.profileImagePlaceholder5.img} style={{ height: 32, width: 32, borderRadius: 100 }} />
                                <Text style={styles.botName}>
                                    Qaplita
                                </Text>
                            </View>
                            <View style={styles.botMessageBubble}>
                                <Text style={styles.botMessageText}>
                                    {translate('writeCheerMessageScreen.tellUs', { streamerName: streamerData.displayName })}
                                </Text>
                            </View>
                            {this.state.userResponse !== ''  ?
                                <View style={styles.userMessageBubble}>
                                    <Text style={styles.userMessageText}>
                                        {this.state.userResponse}
                                    </Text>
                                </View>
                                :
                                null
                            }
                            {this.state.cheerStatus === 1 &&
                                <View style={styles.botWrittingBubble}>
                                    <ChatAnimatedDots />
                                </View>
                            }
                            {this.state.cheerStatus === 2 &&
                                <View style={styles.botMessageBubble}>
                                    <Text style={styles.botMessageText}>
                                        {this.state.chatResponsePhraseP1}
                                        <Text style={{ color: '#00FFDD' }}>{streamerData.displayName}</Text>
                                        {this.state.chatResponsePhraseP2}
                                    </Text>
                                </View>
                            }
                            {this.state.cheerStatus === 3 &&
                                <View style={styles.botMessageBubble}>
                                    <Text style={styles.botMessageText}>
                                        {this.state.chatResponsePhraseP1}
                                    </Text>
                                    <QaplaIcon onPress={this.sendToDiscord}>
                                        <images.svg.discordSocial  />
                                    </QaplaIcon>
                                </View>
                            }
                        </View>
                    </ScrollView>
                    {this.state.chatResponsePhraseP1 === '' ?
                        <View style={styles.messageContainer}>
                            {!this.state.skipMessage &&
                                <>
                                <TextInput
                                    ref={input => this.textInput = input}
                                    editable={this.state.userResponse === ''}
                                    multiline={true}
                                    onContentSizeChange={(event) => this.setState({ height: event.nativeEvent.contentSize.height })}
                                    onChangeText={this.updateMessage}
                                    style={[styles.messageInput]}
                                    maxLength={280}
                                    value={this.state.message} />
                                <QaplaIcon onPress={this.sendCheersWithMessage}>
                                    <images.svg.sendChat />
                                </QaplaIcon>
                                </>
                            }
                        </View>
                        :
                        <TouchableOpacity onPress={this.finishCheer} style={styles.sendCheersButton}>
                            <Text style={styles.sendCheersText}>
                                {translate('writeCheerMessageScreen.backToProfile', { streamerName: streamerData.displayName })}
                            </Text>
                        </TouchableOpacity>
                    }
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        uid: state.userReducer.user.id,
        userName: state.userReducer.user.userName,
        userImage: state.userReducer.user.photoUrl,
        twitchUsername: state.userReducer.user.twitchUsername
    };
}

export default connect(mapStateToProps)(WriteCheerMessageScreen);