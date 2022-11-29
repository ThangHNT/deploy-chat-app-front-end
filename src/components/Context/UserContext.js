import { useState, createContext, useEffect } from 'react';
// import axios from 'axios';
// import host from '~/ulties/serverHost';
const UserContext = createContext();

function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [friends, setFriends] = useState();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('chat-app-hnt'));
        if (user) {
            setCurrentUser(user);
            // axios
            //     .post(`${host}/api/check-account`, { userId: user._id })
            //     .then(({ data }) => {
            //         if (data.exist) {
            //             setCurrentUser(user);
            //         } else {
            //             localStorage.removeItem('chat-app-hnt');
            //         }
            //     })
            //     .catch((err) => console.log('loi kiem tra tai khoan'));
        }
    }, []);

    const handleGetListFriend = (friendList) => {
        const map = new Map();
        friendList.forEach((item) => {
            map.set(item.id, { avatar: item.avatar, username: item.username });
        });
        setFriends(map);
    };

    const handleSeCurrenttUser = (user) => {
        setCurrentUser(user);
    };

    const values = {
        currentUser,
        friends,
        handleSeCurrenttUser,
        handleGetListFriend,
    };

    return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };
