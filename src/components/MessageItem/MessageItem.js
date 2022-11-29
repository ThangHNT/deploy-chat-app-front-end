import { useEffect, useState, useRef, memo, useContext, useCallback } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import host from '~/ulties/serverHost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faFloppyDisk, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from './MessageItem.module.scss';
import Image from '~/components/Image';
import Menu from '~/components/Menu';
import PositiveStatus from '~/components/PositiveStatus';
import { SocketContext } from '~/components/Context/SocketContext';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import { MessageContext } from '~/components/Context/MessageContext';
import { UserContext } from '~/components/Context/UserContext';
import { SettingContext } from '~/components/Context/SettingContext';

const cx = classNames.bind(styles);

function MessageItem({ receiver, darkmode = false, avatar, username, searchResult = false }) {
    // console.log('message-item');
    const { currentUser } = useContext(UserContext);
    const { soundSetting } = useContext(SettingContext);
    const { lastestMsg, handleDeleteMessagesChat } = useContext(MessageContext);
    const { messages, handleDisplayChatContent } = useContext(ChatContentContext);
    const ChatContent = useContext(ChatContentContext);
    const { newMessage } = useContext(SocketContext);
    const [lastestMessage, setlastestMessage] = useState();
    const [menuMessageItem, setmenuMessageItem] = useState(false);
    const [messageNotify, setMessageNotify] = useState(false);

    const btnRef = useRef();
    const messageSound = new Audio('messenger-sound.mp3');

    useEffect(() => {
        if (lastestMsg) {
            if (lastestMsg.receiver === receiver) {
                const { yourMsg, message } = lastestMsg;
                // console.log(yourMsg);
                setlastestMessage(handleSetLastestMessage(yourMsg, message.type, message.text));
            }
        }
        // eslint-disable-next-line
    }, [lastestMsg]);

    // nhận tin nhắn mới nhất từ socket và hiển thị bên sidebar
    useEffect(() => {
        if (newMessage) {
            if (newMessage.sender === receiver) {
                // console.log(newMessage);
                if (soundSetting.notify) {
                    messageSound.play();
                }
                if (ChatContent.receiver !== receiver) {
                    setMessageNotify(true);
                }
                const newestMessage = newMessage.content[newMessage.content.length - 1];
                if (newestMessage.type === 'text') {
                    setlastestMessage(newestMessage.text);
                } else if (newestMessage.type === 'img') {
                    setlastestMessage('Ban nhan dc 1 anh');
                } else {
                    setlastestMessage('Ban nhan dc 1 file');
                }
            }
        }
        // eslint-disable-next-line
    }, [newMessage]);

    //  hiển thị tin nhắn mới nhất khi vừa ấn enter
    useEffect(() => {
        if (messages) {
            if (messages.receiver === receiver) {
                // console.log(messages);
                let lastestMessage = messages.content[messages.content.length - 1];
                setlastestMessage(handleSetLastestMessage(true, lastestMessage.type, lastestMessage.text));
            }
        }
        // eslint-disable-next-line
    }, [messages]);

    // lấy tin nhắn mới nhất từ db
    useEffect(() => {
        if (!searchResult) {
            axios
                .post(`${host}/api/lastest-message`, {
                    receiver: receiver,
                    sender: currentUser._id,
                })
                .then((data) => {
                    const data2 = data.data;
                    // console.log(data2);
                    if (data2.message) {
                        let typeMsg = data2.message.type;
                        setlastestMessage(
                            handleSetLastestMessage(
                                data2.message.sender === currentUser._id,
                                typeMsg,
                                data2.message.text,
                            ),
                        );
                    }
                })
                .catch((error) => {
                    console.log('loi lay tin nhan gan nhat');
                });
        }

        // eslint-disable-next-line
    }, []);

    // ẩn menu messageItem khi click chỗ khác
    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (btnRef.current) {
                if (!btnRef.current.contains(e.target)) {
                    setmenuMessageItem(false);
                }
            }
        });

        return () => {
            document.removeEventListener('click', (e) => {});
            messageSound.remove();
        };
        // eslint-disable-next-line
    }, []);

    const handleSetLastestMessage = (sender, type, text) => {
        if (sender) {
            if (type === 'text') return `Ban: ${text}`;
            else if (type === 'img') {
                return 'Ban gui 1 anh';
            } else if (type === 'revoked') {
                return 'Tin nhan bi thu hoi';
            } else {
                return 'Ban gui 1 file';
            }
        } else {
            if (type === 'text') return text;
            else if (type === 'img') {
                return 'Ban nhan 1 anh';
            } else if (type === 'revoked') {
                return 'Tin nhan bi thu hoi';
            } else {
                return 'Ban nhan 1 file';
            }
        }
    };

    // display menu-action
    const handleDisplayMenu = (e) => {
        setmenuMessageItem(!menuMessageItem);
    };

    // click để hiện ra đoạn chat và tắt thông báo tin nhắn mới
    const handleClick = async () => {
        setMessageNotify(false);
        handleDisplayChatContent(receiver);
        if (newMessage) {
            // console.log(newMessage);
            if (newMessage.sender === receiver) {
                document.title = 'Chap App';
            }
        }
    };

    const handleDeleteChat = async () => {
        const { data } = await axios.post(`${host}/api/delete/chat`, { sender: currentUser._id, receiver });
        // console.log(data);
        handleDeleteMessagesChat(receiver);
        setlastestMessage('');
        // eslint-disable-next-line
    };

    const handleDeleteAllMessageFromDB = useCallback(() => {
        alert('Chuc nang dag phat trien');
    }, []);

    const actionsMessageItem = [
        {
            text: 'Xóa đoạn chat',
            icon: <FontAwesomeIcon icon={faTrashCan} />,
            onClick: handleDeleteChat,
        },
        {
            text: 'Lưu trữ đoạn chat',
            icon: <FontAwesomeIcon icon={faFloppyDisk} />,
            onClick: handleDeleteAllMessageFromDB,
        },
    ];

    return (
        <div className={cx('wrapper', { searchResult, darkBackground: darkmode })} onClick={handleClick}>
            <div className={cx('avatar')}>
                <Image small={searchResult ? true : false} src={avatar} avatar alt="avatar" />
                {!searchResult && <PositiveStatus receiver={receiver} />}
            </div>
            <div className={cx('info')}>
                <span className={cx('username')}>{username}</span>
                {!searchResult && <p className={cx('message')}>{lastestMessage}</p>}
            </div>
            {messageNotify && <div className={cx('message-notification')}></div>}
            {!searchResult && (
                <div className={cx('action-btns')}>
                    <div className={cx('wrapper-btn')} ref={btnRef} onClick={handleDisplayMenu}>
                        <div className={cx('btn')}>
                            <FontAwesomeIcon icon={faEllipsis} />
                        </div>
                    </div>
                    {menuMessageItem && (
                        <div className={cx('message-item-action-menu')}>
                            <Menu sender={currentUser._id} receiver={receiver} menu={actionsMessageItem} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default memo(MessageItem);
