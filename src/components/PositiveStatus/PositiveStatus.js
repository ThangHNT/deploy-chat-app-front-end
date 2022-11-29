import { useEffect, useContext, useState, memo } from 'react';
import { SocketContext } from '~/components/Context/SocketContext';
import classNames from 'classnames/bind';
import styles from './PositiveStatus.module.scss';
const cx = classNames.bind(styles);

function PositiveStatus({ receiver }) {
    // console.log('online-status');
    const { userList, userDisconnect, newUser, handleSetUserList } = useContext(SocketContext);
    const [positive, setPositive] = useState(false);

    // console.log(receiver);

    useEffect(() => {
        if (newUser) {
            setPositive(receiver === newUser.userId);
        }
        // eslint-disable-next-line
    }, [newUser]);

    useEffect(() => {
        if (userDisconnect) {
            let userId = '';
            let arr = [];
            userList.forEach((user) => {
                if (user.socketId === userDisconnect) {
                    userId = user.userId;
                } else {
                    arr.push(user);
                }
            });
            handleSetUserList([...arr]);
            if (userId === receiver) setPositive(false);
        }
        // eslint-disable-next-line
    }, [userDisconnect]);

    // console.log(userList);
    useEffect(() => {
        if (userList.length > 0) {
            setPositive(
                userList.some((user) => {
                    return receiver === user.userId;
                }),
            );
        }
        // eslint-disable-next-line
    }, [userList]);

    return <div className={cx('wrapper')}>{positive && <span className={cx('online')}></span>}</div>;
}

export default memo(PositiveStatus);
