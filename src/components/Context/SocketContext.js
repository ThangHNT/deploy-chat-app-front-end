import { createContext, useEffect, useState, useContext } from 'react';
import { MessageContext } from './MessageContext';
import { CallContext } from './CallContext';

const SocketContext = createContext();

function SocketContextProvider({ children }) {
    // console.log('socket-context');
    const { handleSetMessages } = useContext(MessageContext);
    const { handleSetNewCall, handleDisplayCallVideo, handleSetEndCall, handleSetUserMedia, handleSetBusyUser } =
        useContext(CallContext);
    const [userList, setUserList] = useState([]);
    const [socket, setSocket] = useState();
    const [newMessage, setNewMessage] = useState();
    const [blockStatus, setBlockStatus] = useState(new Map());
    const [newUser, setNewUser] = useState();
    const [userDisconnect, setUserDisconnect] = useState();
    const [newReaction, setNewReaction] = useState();
    const [preventation, setPreventation] = useState();
    const [reactionRemoved, setReactionRemoved] = useState({});
    const [newTheme, setNewTheme] = useState();
    const [newBackgroundImage, setNewBackgroundImage] = useState();
    const [getSetting, setGetSetting] = useState(new Map());
    const [revokeMessage, SetRevokeMessage] = useState();
    const [callerSignal, setCallerSignal] = useState();
    const [receiverSignal, setReceiverSignal] = useState();

    // lắng nghe event từ socket
    useEffect(() => {
        if (socket) {
            socket.on('users', (users) => {
                // console.log('get all users');
                setUserList(users);
            });
            socket.on('user just connected', (user) => {
                // console.log('new user');
                setNewUser(user);
                setUserList((pre) => [...pre, user]);
            });
            socket.on('private message', async (data) => {
                // console.log(data);
                document.title = 'Co tin nhan moi';
                handleSetNewMessage(data.sender, data.content);
                handleSetMessages(data.sender, data.content);
            });
            socket.on('private reaction message', (data) => {
                // console.log('new icon', data);
                setNewReaction(data);
                handleSetMessages(data.sender, data.icon, data.time, true);
            });
            socket.on('user is blocked', ({ receiver, sender }) => {
                // console.log(sender);
                setPreventation({ receiver, sender, block: true });
            });
            socket.on('user is unblocked', ({ receiver, sender }) => {
                // console.log(sender);
                setPreventation({ receiver, sender, unblock: true });
            });
            socket.on('remove reaction icon private', ({ receiver, time, sender }) => {
                console.log('remove raction icon');
                setReactionRemoved({ time, sender, receiver });
            });
            socket.on('change theme private', (data) => {
                // console.log(data);
                setNewTheme(data);
            });
            socket.on('change background private', (data) => {
                // console.log(data);
                setNewBackgroundImage(data);
            });
            socket.on('revoke message private', (data) => {
                // console.log(data);
                handleRevokeMessage(data.sender, data.time, true);
            });
            socket.on('user disconnected', (socketId) => {
                setUserDisconnect(socketId);
            });

            socket.on('callUser', (data) => {
                setCallerSignal(data.signal);
                handleSetNewCall(data.sender);
                handleDisplayCallVideo();
            });

            socket.on('callAccepted', (signal) => {
                setReceiverSignal(signal);
            });

            socket.on('end call', ({ sender, msg }) => {
                console.log('end call');
                handleSetEndCall({ sender, msg });
                setReceiverSignal(false);
            });

            socket.on('change media', (data) => {
                // console.log(data);
                handleSetUserMedia((pre) => {
                    pre[data.kind] = data.status;
                    return { ...pre };
                });
            });

            socket.on('user busy', (data) => {
                console.log('user ban');
                handleSetBusyUser(data);
            });
        }
        // eslint-disable-next-line
    }, [socket]);

    const handlEnableMicroOrCamera = ({ receiver, sender, kind, status }) => {
        const to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('change media', { sender, from: socket.id, to, kind, status });
    };

    const handleEndCallSocket = ({ sender, receiver, msg }) => {
        const to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('end call', { sender, receiver, from: socket.id, to, msg });
    };

    const handleAnswer = ({ sender, receiver, signal }) => {
        const to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('answerCall', { sender, from: socket.id, to, signal });
    };

    const handleCallToUser = ({ sender, receiver, signal }) => {
        const to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('callUser', { sender, receiver, from: socket.id, to, signal });
    };

    // khoi tao socket
    const handleInitSocket = (socket) => {
        setSocket(socket);
    };

    // listen event revoke or remove msg from socket
    const handleRevokeMessage = (sender, time, revoke = false) => {
        if (revoke) {
            SetRevokeMessage({ sender, time });
        } else {
            SetRevokeMessage(undefined);
        }
    };

    // emit event revoke or remove message
    const handleEmitRevokeMsgEvent = (sender, receiver, time) => {
        const to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('revoke message', { to, from: socket.id, sender, time });
    };

    const handleSetNewMessage = (sender, content, remove = false) => {
        if (!remove) {
            setNewMessage({ sender, content });
        } else {
            setNewMessage(undefined);
        }
    };

    // phát sự kiện thay đổi setting (lấy setting lần đầu từ db)
    const handleChangeSetting = (key, value) => {
        if (key && value) {
            setGetSetting((pre) => {
                return pre.set(key, value);
            });
        }
    };

    // bỏ event thay đổi chủ đề và ảnh nền
    const handleRemoveSocketEvent = (theme = false, backgroundImage = false) => {
        if (theme) {
            setNewTheme(undefined);
        }
        if (backgroundImage) {
            setNewBackgroundImage(undefined);
        }
    };

    const handleSetBackground = (sender, receiver, background) => {
        let to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('change background', { from: socket.id, to, sender, background });
    };

    // phát sự kiện thay đổi chủ đề
    const handleChangeTheme = (sender, receiver, theme) => {
        let to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('change theme', { from: socket.id, to, sender, theme });
    };

    // set tình trạng chặn
    const handleSetBlockStatus = (key, value) => {
        const checkKey = blockStatus.has(key);
        if (!checkKey) {
            blockStatus.set(key, { value });
        } else {
            const oldData = blockStatus.get(key);
            setBlockStatus(() => {
                return blockStatus.set(key, [...oldData, ...value]);
            });
        }
    };
    // phát sự kiện xóa bỏ reaction icon
    const handleRemoveReactionIcon = ({ receiver, time, sender }) => {
        // console.log(sender);
        let to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('remove reaction icon', { from: socket.id, to, sender, receiver, time });
    };

    // thay đổi ds người online
    const handleSetUserList = (newUserList) => {
        setUserList(newUserList);
    };

    // set reaction icon mới
    const handleSetNewReaction = (reaction) => {
        setNewReaction(reaction);
    };

    // lấy socketId từ receiver id
    const getSocketIdFromReceiverId = (users, receiver) => {
        let to = '';
        for (let i = 0; i < users.length; i++) {
            if (users[i].userId === receiver) {
                to = users[i].socketId;
                break;
            }
        }
        return to;
    };

    // phát sự kiện chặn ng dùng
    const handleBlockUser = ({ sender, receiver }) => {
        // console.log(sender, receiver);
        let to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('block-user', { from: socket.id, to, sender, receiver });
    };

    // phát sự kiện bỏ chặn ng dùng
    const handleUnblockUser = ({ sender, receiver }) => {
        let to = getSocketIdFromReceiverId(userList, receiver);
        socket.emit('unblock-user', { from: socket.id, to, sender, receiver });
    };

    // gửi tin nhắn
    const handleSendMessage = (data, reactionIcon = false) => {
        if (userList.length > 0) {
            const { receiver, content, icon, time, sender } = data;
            let to = getSocketIdFromReceiverId(userList, receiver);
            let message;
            if (reactionIcon) {
                // khi gửi reaction icon
                message = {
                    sender,
                    to,
                    from: socket.id,
                    icon,
                    receiver,
                    time,
                };
                socket.emit('send reaction icon', message);
                return;
            } else {
                message = {
                    sender,
                    to,
                    from: socket.id,
                    content,
                    receiver,
                };
            }
            socket.emit('send message', message);
        }
    };

    const values = {
        preventation,
        blockStatus,
        userDisconnect,
        newUser,
        socket,
        userList,
        newMessage,
        newReaction,
        reactionRemoved,
        newTheme,
        newBackgroundImage,
        getSetting,
        revokeMessage,
        callerSignal,
        receiverSignal,
        handleSendMessage,
        handleSetNewMessage,
        handleInitSocket,
        handleSetNewReaction,
        handleSetUserList,
        handleSetBlockStatus,
        handleBlockUser,
        handleUnblockUser,
        handleRemoveReactionIcon,
        handleChangeTheme,
        handleSetBackground,
        handleChangeSetting,
        handleRemoveSocketEvent,
        handleRevokeMessage,
        handleEmitRevokeMsgEvent,
        handleCallToUser,
        handleAnswer,
        handleEndCallSocket,
        handlEnableMicroOrCamera,
    };

    return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
}

export { SocketContextProvider, SocketContext };
