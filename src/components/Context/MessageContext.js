import { createContext, useState } from 'react';
const MessageContext = createContext();

function MessageProvider({ children }) {
    const [messages, setMessages] = useState(new Map());
    const [removeMessage, setRemoveMessage] = useState();
    const [lastestMsg, setLastMsg] = useState();
    const [checkGetMessagesFromDB, setCheckGetMessagesFromDB] = useState([]);
    const [deleteChat, setDeleteChat] = useState();
    const [newMsg, setNewMsg] = useState();
    const [sendMsg, setSendMsg] = useState();

    const handleSendMsg = (msg) => {
        setSendMsg(msg);
    };

    const handleSetNewMsg = (msg) => {
        setNewMsg(msg);
    };

    const handleSetCheckGetMessagesFromDB = (userId) => {
        setCheckGetMessagesFromDB((pre) => {
            return [...pre, userId];
        });
    };

    const handleSetLastestMsg = (msg) => {
        setLastMsg(msg);
    };

    const handleSetRemoveMessage = (messageId) => {
        setRemoveMessage(messageId);
    };

    const handleDeleteMessagesChat = (key) => {
        setDeleteChat(key);
        setMessages((pre) => {
            return pre.set(key, []);
        });
    };

    const handleSetMessages = (key, value, time, reaction = false, revoke = false, remove = false, fromDB = false) => {
        const allMessage = messages.get(key);
        if (allMessage) {
            if (revoke) {
                allMessage.forEach((item) => {
                    if (item.time === time) {
                        item.reactionIcon = value;
                        item.type = 'revoked';
                        item.text = 'Tin nhắn đã bị thu hồi';
                        item.file = undefined;
                        item.video = undefined;
                        item.audio = undefined;
                    }
                });
                setMessages((pre) => {
                    return pre.set(key, [...allMessage]);
                });
                return;
            } else if (remove) {
                handleSetRemoveMessage({ time, receiver: key });
                let index = '';
                allMessage.forEach((item, thisIndex) => {
                    if (item.time === time) {
                        index = thisIndex;
                    }
                });
                allMessage.splice(index, 1);
                return;
            }
            if (reaction) {
                allMessage.forEach((item) => {
                    if (item.time === time) {
                        item.reactionIcon = value;
                    }
                });
                setMessages((pre) => {
                    return pre.set(key, [...allMessage]);
                });
                return;
            }
            if (fromDB) {
                setMessages((pre) => {
                    // khi lưu tin nhắn vào database
                    return pre.set(key, [...value]);

                    // return pre.set(key, [...value, ...allMessage]);
                });
                return;
            } else {
                setMessages((pre) => {
                    return pre.set(key, [...allMessage, ...value]);
                });
                return;
            }
        } else {
            setMessages((pre) => {
                return pre.set(key, value);
            });
        }
    };

    const values = {
        messages,
        removeMessage,
        lastestMsg,
        checkGetMessagesFromDB,
        deleteChat,
        handleSetMessages,
        handleSetRemoveMessage,
        handleSetLastestMsg,
        handleSetCheckGetMessagesFromDB,
        handleDeleteMessagesChat,
        newMsg,
        handleSetNewMsg,
        sendMsg,
        handleSendMsg,
    };

    return <MessageContext.Provider value={values}>{children}</MessageContext.Provider>;
}

export { MessageContext, MessageProvider };
