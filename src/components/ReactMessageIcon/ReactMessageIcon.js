import { useState, memo, useEffect, useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceGrinWide } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import axios from 'axios';
import styles from './ReactMessageIcon.module.scss';
import sadIcon from '~/assets/images/sad-reaction-icon.png';
import hahaIcon from '~/assets/images/haha-reaction-icon.png';
import heartIcon from '~/assets/images/heart-reaction-icon.png';
import AngryIcon from '~/assets/images/angry-reaction-icon.png';
import surprisedIcon from '~/assets/images/surprised-reaction-icon.png';
import likeIcon from '~/assets/images/like-reaction-icon.png';
import host from '~/ulties/serverHost';
import { SocketContext } from '~/components/Context/SocketContext';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import { UserContext } from '~/components/Context/UserContext';

const cx = classNames.bind(styles);

function ReactMessageIcon({ time, messageBody }) {
    // console.log('reaction-icon');
    const { currentUser } = useContext(UserContext);
    const { handleSetReactionIcon, receiver } = useContext(ChatContentContext);
    const { handleSendMessage } = useContext(SocketContext);
    const [displayReactIcon, setDisplayReactIcon] = useState(false);
    const listIconRef = useRef();

    // set vị trí cho list reaction icon để ko bị mất
    useEffect(() => {
        if (displayReactIcon) {
            let listIconLeft = listIconRef.current.getBoundingClientRect();
            let messagesWrapper = messageBody.current.getBoundingClientRect();
            let overflowLeft = messagesWrapper.left - listIconLeft.left;
            let overflowRight = listIconLeft.right - messagesWrapper.right;
            let overflowTop = listIconLeft.top - messagesWrapper.top;
            if (overflowTop < 0) {
                listIconRef.current.style.top = `2.4rem`;
            }
            if (overflowLeft > 0) {
                listIconRef.current.style.right = `${-overflowLeft}px`;
            } else if (overflowRight > 0) {
                listIconRef.current.style.right = `${overflowRight + 30}px`;
            }
        }
        // eslint-disable-next-line
    }, [displayReactIcon]);

    //  click smile icon để hiện list reaction
    const handleDisplayReactIcon = () => {
        setDisplayReactIcon((pre) => !pre);
    };

    const handleClickIcon = (e) => {
        // console.log(e.target.alt);
        const icon = e.target.alt;
        handleSetReactionIcon({ icon, time });
        handleSendMessage({ icon, time, sender: currentUser._id, receiver }, true);
        axios.post(`${host}/api/send/reaction-icon`, { time, reaction: icon }).then((data) => {
            const data2 = data.data;
            if (data2.status) {
                // console.log('send reaction successcully');
            } else {
                // console.log('send reaction failed');
            }
        });
    };

    return (
        <div className={cx('wrapper')} onClick={handleDisplayReactIcon}>
            <div className={cx('represent-icon-wrapper')}>
                <FontAwesomeIcon className={cx('represent-icon')} icon={faFaceGrinWide} />
            </div>
            {displayReactIcon && (
                <div className={cx('react-icon-list')} ref={listIconRef}>
                    <img className={cx('react-icon')} onClick={handleClickIcon} src={heartIcon} alt="heartIcon" />
                    <img className={cx('react-icon')} onClick={handleClickIcon} src={hahaIcon} alt="hahaIcon" />
                    <img
                        className={cx('react-icon')}
                        onClick={handleClickIcon}
                        src={surprisedIcon}
                        alt="surprisedIcon"
                    />
                    <img className={cx('react-icon')} onClick={handleClickIcon} src={sadIcon} alt="sadIcon" />
                    <img className={cx('react-icon')} onClick={handleClickIcon} src={AngryIcon} alt="angryIcon" />
                    <img className={cx('react-icon')} onClick={handleClickIcon} src={likeIcon} alt="likeIcon" />
                </div>
            )}
        </div>
    );
}

export default memo(ReactMessageIcon);
