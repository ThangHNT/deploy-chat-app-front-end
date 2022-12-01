import { useContext, useEffect, useState, useRef, memo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faPhone, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import Peer from 'simple-peer';
import classNames from 'classnames/bind';
import styles from './VideoCall.module.scss';
import { SocketContext } from '~/components/Context/SocketContext';
import { CallContext } from '~/components/Context/CallContext';
import { UserContext } from '~/components/Context/UserContext';
import { ChatContentContext } from '~/components/Context/ChatContentContext';

const cx = classNames.bind(styles);

// var peer1, peer2;

function VideoCall() {
    // console.log('video call');
    const { friends, currentUser } = useContext(UserContext);
    const ChatContent = useContext(ChatContentContext);
    const {
        handleDisplayCallVideo,
        newCall,
        recipient,
        handleSetRecipient,
        endCall,
        handleSetEndCall,
        handleSetNewCall,
        userMedia,
        busyUser,
        handleSetBusyUser,
    } = useContext(CallContext);
    const {
        receiverSignal,
        callerSignal,
        handleCallToUser,
        handleAnswer,
        handleEndCallSocket,
        handlEnableMicroOrCamera,
    } = useContext(SocketContext);
    const [caller, setCaller] = useState({ username: '', avatar: '', notify: '' });
    const [answerCall, setAnswerCall] = useState(false);
    const [micro, setMicro] = useState(true);
    const [camera, setCamera] = useState(true);

    const myVideo = useRef();
    const soundRef = useRef(new Audio('nhac-chuong-cuoc-goi-zalo.mp3'));
    const userVideo = useRef();
    const peer = useRef();

    // khởi tạo cuộc gọi video
    useEffect(() => {
        if (recipient) {
            console.log('init call');
            setCaller((pre) => {
                return { avatar: recipient.avatar, username: recipient.username, notify: 'Đang gọi ....' };
            });

            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    window.localStream = stream;
                    if ('srcObject' in myVideo.current) {
                        myVideo.current.srcObject = window.localStream;
                    } else {
                        myVideo.current.src = URL.createObjectURL(window.localStream);
                    }
                    peer.current = new Peer({
                        initiator: true,
                        trickle: false,
                        stream: stream,
                    });
                    peer.current.on('signal', (data) => {
                        const data2 = {
                            sender: currentUser._id,
                            receiver: ChatContent.receiver,
                            signal: data,
                        };
                        handleCallToUser(data2);
                    });
                    peer.current.on('stream', (stream) => {
                        if ('srcObject' in userVideo.current) {
                            userVideo.current.srcObject = stream;
                        } else {
                            userVideo.current.src = URL.createObjectURL(stream);
                        }
                        userVideo.current.muted = false;
                    });
                })
                .catch((err) => console.log('loi set peer'));
        }

        // eslint-disable-next-line
    }, [recipient]);

    // lấy tín hiệu khi user bắt máy
    useEffect(() => {
        if (receiverSignal && peer.current) {
            peer.current.signal(receiverSignal);
            handleTurnOffRingtone();
        }
        // eslint-disable-next-line
    }, [receiverSignal]);

    // khi có cuộc gọi mới
    useEffect(() => {
        if (newCall) {
            ringtone();
            const caller = friends.get(newCall);
            setCaller({ username: caller.username, avatar: caller.avatar, notify: 'Cuộc gọi đến' });
        }
        // eslint-disable-next-line
    }, [newCall]);

    // mở cam khi ấn trl cuộc gọi
    useEffect(() => {
        if (answerCall) {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    window.localStream = stream;
                    myVideo.current.srcObject = window.localStream;
                    peer.current = new Peer({
                        initiator: false,
                        trickle: false,
                        stream: stream,
                    });
                    peer.current.on('signal', (data) => {
                        handleAnswer({ sender: currentUser._id, receiver: newCall, signal: data });
                    });
                    peer.current.on('stream', (stream) => {
                        if ('srcObject' in userVideo.current) {
                            userVideo.current.srcObject = stream;
                        } else {
                            userVideo.current.src = URL.createObjectURL(stream);
                        }
                        userVideo.current.muted = false;
                    });
                    peer.current.signal(callerSignal);
                })
                .catch((err) => console.log('loi set peer'));
        }
        // eslint-disable-next-line
    }, [answerCall]);

    useEffect(() => {
        let timerId;
        if (endCall) {
            // console.log(endCall);
            if (endCall.sender === newCall || endCall.sender === ChatContent.receiver) {
                setCaller((pre) => {
                    return {
                        username: pre.username,
                        avatar: pre.avatar,
                        notify: endCall.msg,
                    };
                });
                timerId = setTimeout(() => {
                    handleCloseVideoCall();
                    handleSetEndCall(false);
                }, 2000);
            }
        }

        return () => {
            clearTimeout(timerId);
        };
        // eslint-disable-next-line
    }, [endCall]);

    useEffect(() => {
        let timerId;
        if (busyUser) {
            setCaller((pre) => {
                pre.notify = busyUser.msg;
                return { ...pre };
            });
            timerId = setTimeout(() => {
                handleCloseVideoCall();
                handleSetBusyUser(false);
            }, 3000);
        }
        return () => {
            clearTimeout(timerId);
        };
        // eslint-disable-next-line
    }, [busyUser]);

    const ringtone = () => {
        soundRef.current.loop = true;
        soundRef.current.load();
        soundRef.current.play();
    };

    const handleTurnOffRingtone = () => {
        soundRef.current.loop = false;
        soundRef.current.load();
        soundRef.current.muted = true;
    };

    const handleAcceptCall = () => {
        console.log('answer');
        setAnswerCall(true);
        handleTurnOffRingtone();
    };

    const handleClickEndCall = () => {
        console.log('click end call');
        handleTurnOffRingtone();
        let msg, receiver;
        if (recipient) {
            msg = 'Cuộc gọi kết thúc';
            receiver = ChatContent.receiver;
        } else if (newCall && !answerCall) {
            msg = 'Người nhận không bắt máy';
            receiver = newCall;
        } else if (newCall && answerCall) {
            msg = 'Cuộc gọi kết thúc';
            receiver = newCall;
        }
        handleCloseVideoCall();
        handleEndCallSocket({ sender: currentUser._id, receiver, msg });
    };

    const handleCloseVideoCall = useCallback(() => {
        if (answerCall) setAnswerCall(false);
        if (recipient) handleSetRecipient(false);
        if (newCall) handleSetNewCall(false);
        if (window.localStream) {
            window.localStream.getTracks().forEach((track) => {
                track.stop();
            });
        }
        handleDisplayCallVideo();
        // eslint-disable-next-line
    }, []);

    const handleSetMute = () => {
        const data = {
            sender: currentUser._id,
            receiver: newCall || ChatContent.receiver,
            kind: 'micro',
        };
        setMicro((pre) => {
            if (pre) {
                window.localStream.getAudioTracks()[0].enabled = false;
                data.status = false;
                handlEnableMicroOrCamera(data);
            } else {
                window.localStream.getAudioTracks()[0].enabled = true;
                data.status = true;
                handlEnableMicroOrCamera(data);
            }
            return !pre;
        });
    };

    const handleSetCamera = () => {
        const data = {
            sender: currentUser._id,
            receiver: newCall || ChatContent.receiver,
            kind: 'video',
        };
        setCamera((pre) => {
            if (pre) {
                window.localStream.getVideoTracks()[0].enabled = false;
                data.status = false;
                handlEnableMicroOrCamera(data);
            } else {
                window.localStream.getVideoTracks()[0].enabled = true;
                data.status = true;
                handlEnableMicroOrCamera(data);
            }
            return !pre;
        });
    };

    return (
        <div className={cx('wrapper', { boderRadius10: true })}>
            <div className={cx('content')}>
                <div className={cx('main-screen', { boderRadius10: true })}>
                    {((!receiverSignal && !answerCall) || !userMedia.video) && (
                        <div className={cx('user-info', { boderRadius10: true })}>
                            <img className={cx('receiver-avatar')} src={caller.avatar} alt="avatar" />
                            <p className={cx('receiver-name')}>{caller.username}</p>
                            <span className={cx('status')}>
                                {userMedia.video === false ? 'Người dùng tắt camera' : caller.notify}
                            </span>
                        </div>
                    )}
                    {(receiverSignal || answerCall) && (
                        <div className={cx('user-video', { boderRadius10: true })}>
                            <video
                                ref={userVideo}
                                className={cx('video', { boderRadius10: true })}
                                playsInline
                                muted
                                autoPlay
                            ></video>
                            <div className={cx('muted')}>
                                {!userMedia.micro && <FontAwesomeIcon icon={faMicrophoneSlash} />}
                            </div>
                        </div>
                    )}
                </div>
                <div className={cx('sub-screen', { boderRadius10: true })}>
                    <video
                        ref={myVideo}
                        className={cx('my-video', { boderRadius10: true })}
                        playsInline
                        muted
                        autoPlay
                    ></video>
                </div>
                <div className={cx('action-btns')}>
                    <div className={cx('item-btn')} onClick={handleSetMute}>
                        {micro ? (
                            <FontAwesomeIcon className={cx('icon')} icon={faMicrophone} />
                        ) : (
                            <FontAwesomeIcon className={cx('icon')} icon={faMicrophoneSlash} />
                        )}
                    </div>
                    {!answerCall && !recipient && (
                        <div className={cx('item-btn', { accept: true })} onClick={handleAcceptCall}>
                            <FontAwesomeIcon className={cx('icon')} icon={faPhone} />
                        </div>
                    )}
                    {(recipient || newCall) && (
                        <div>
                            <div className={cx('item-btn', { reject: true })} onClick={handleClickEndCall}>
                                <FontAwesomeIcon className={cx('icon')} icon={faPhone} />
                            </div>
                        </div>
                    )}
                    <div className={cx('item-btn')} onClick={handleSetCamera}>
                        {camera ? (
                            <FontAwesomeIcon className={cx('icon')} icon={faVideo} />
                        ) : (
                            <FontAwesomeIcon className={cx('icon')} icon={faVideoSlash} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(VideoCall);
