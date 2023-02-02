import React, { useState, useEffect, useContext, useCallback, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import axios from 'axios';
import styles from './ChatContent.module.scss';
import Image from '~/components/Image';
import Messages from '~/layouts/Messages';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import SendMessage from '~/layouts/SendMessage';
import host from '~/ulties/serverHost';
import HeaderChat from '~/layouts/HeaderChat';
import Setting from '~/layouts/ChatSetting';
import { SettingContext } from '~/components/Context/SettingContext';
import { SocketContext } from '~/components/Context/SocketContext';
import { UserContext } from '~/components/Context/UserContext';

const cx = classNames.bind(styles);

function ChatContent() {
    // console.log('Chat-content');
    const { currentUser } = useContext(UserContext);
    const { darkLightMode, handleSetTheme, handleSetBackgroundImage } = useContext(SettingContext);
    const Socket = useContext(SocketContext);
    const { handleChangeSetting } = useContext(SocketContext);
    const ChatContent = useContext(ChatContentContext);
    const [receiver, setReceiver] = useState();
    const [loading, setLoading] = useState(false);
    const [setting, setSetting] = useState(false);

    // lấy thông tin ng nhận khi ấn vào user bên sidebar
    useEffect(() => {
        if (ChatContent.receiver) {
            setLoading(true);
            // lấy thông tin ng nhận
            axios
                .get(`${host}/api/receiver/${ChatContent.receiver}`)
                .then((data) => {
                    const data2 = data.data;
                    if (data2.status) {
                        // console.log(data2.data);
                        setReceiver(data2.data);
                    } else {
                        alert(data2.msg);
                    }
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => {
                    console.log('Loi lay ng nhan');
                });

            const checkGetSetting = Socket.getSetting.get(ChatContent.receiver);
            if (!checkGetSetting) {
                handleGetChatSettingData();
            }
        }
        // eslint-disable-next-line
    }, [ChatContent.receiver]);

    // lấy setting data từ db
    const handleGetChatSettingData = async () => {
        const { data } = await axios.post(`${host}/api/get-theme`, {
            sender: currentUser._id,
            receiver: ChatContent.receiver,
        });
        // console.log(data);
        handleSetTheme(ChatContent.receiver, data.setting.theme);
        handleSetBackgroundImage(ChatContent.receiver, data.setting.backgroundImage);
        handleChangeSetting(ChatContent.receiver, true);
    };

    const handleDisplaySetting = useCallback(() => {
        setSetting((pre) => !pre);
    }, []);

    const handleHideSetting = useCallback(() => {
        setSetting(false);
    }, []);

    return (
        <div className={cx('wrapper')}>
            {receiver && !loading && (
                <HeaderChat receiver={receiver} hideSetting={handleHideSetting} onClick={handleDisplaySetting} />
            )}
            {receiver && !loading && (
                <div className={cx('content')}>
                    {/* Nội dung tin nhắn */}
                    <Messages darkmodeMsg={darkLightMode} receiver={receiver} />
                    {setting && (
                        <div className={cx('setting')}>
                            <Setting darkmode={darkLightMode} receiver={receiver} />
                        </div>
                    )}
                </div>
            )}
            {receiver && !loading && (
                <div className={cx('send-message')}>
                    {/* phần soạn tin nhắn send message area */}
                    <SendMessage darkmode={darkLightMode} receiver={receiver} />
                </div>
            )}
            {/* khi chưa chọn messageItem(người nhận) hiện lên ảnh */}
            {!receiver && !loading && (
                <Image noneReceiver src="https://cdn-icons-png.flaticon.com/512/2312/2312512.png" alt="no thing" />
            )}

            {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
        </div>
    );
}

export default memo(ChatContent);
