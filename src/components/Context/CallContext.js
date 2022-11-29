import { createContext, useState } from 'react';

const CallContext = createContext();

function CallProvider({ children }) {
    const [displayCallVideo, setDisplayCallVideo] = useState();
    const [recipient, setRecipient] = useState(false);
    const [newCall, setNewCall] = useState(false);
    const [endCall, setEndCall] = useState(false);
    const [userMedia, setUserMedia] = useState({ video: true, micro: true });
    const [busyUser, setBusyUser] = useState();

    const handleSetBusyUser = (value) => {
        setBusyUser(value);
    };

    const handleSetUserMedia = (value) => {
        setUserMedia(value);
    };

    const handleSetEndCall = (value) => {
        setEndCall(value);
    };

    const handleSetRecipient = (value) => {
        setRecipient(value);
    };

    const handleSetNewCall = (user) => {
        setNewCall(user);
    };

    const handleDisplayCallVideo = (data = false, value) => {
        if (data) {
            setDisplayCallVideo(value);
        } else {
            setDisplayCallVideo((pre) => !pre);
        }
    };

    const values = {
        displayCallVideo,
        recipient,
        newCall,
        endCall,
        userMedia,
        busyUser,
        handleDisplayCallVideo,
        handleSetRecipient,
        handleSetNewCall,
        handleSetEndCall,
        handleSetUserMedia,
        handleSetBusyUser,
    };

    return <CallContext.Provider value={values}>{children}</CallContext.Provider>;
}

export { CallContext, CallProvider };
