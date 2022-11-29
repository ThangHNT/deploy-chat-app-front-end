import { useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faVideo } from '@fortawesome/free-solid-svg-icons';
import Image from '~/components/Image';
import Button from '~/components/Button';
import classNames from 'classnames/bind';
import styles from './HeaderChat.module.scss';
import PositiveStatus from '~/components/PositiveStatus';
import { SettingContext } from '~/components/Context/SettingContext';
import { CallContext } from '~/components/Context/CallContext';
import { UserContext } from '~/components/Context/UserContext';
import { ChatContentContext } from '~/components/Context/ChatContentContext';

const cx = classNames.bind(styles);

function HeaderChat({ receiver, onClick, hideSetting }) {
    // console.log('header-chat');
    const { friends } = useContext(UserContext);
    const ChatContent = useContext(ChatContentContext);
    const { darkLightMode } = useContext(SettingContext);
    const { handleDisplayCallVideo, handleSetRecipient } = useContext(CallContext);

    useEffect(() => {
        hideSetting();
        // eslint-disable-next-line
    }, []);

    //ấn vào nút gọi video
    const handleDisplayCallVideoModal = () => {
        handleDisplayCallVideo();
        handleSetRecipient(friends.get(ChatContent.receiver));
    };

    return (
        <div className={cx('wrapper', { darkmode: darkLightMode })}>
            <div className={cx('receiver')}>
                <div>
                    <div className={cx('wrapper-img')}>
                        <Image darkmode={darkLightMode} arounded normal src={receiver.avatar} />
                        <PositiveStatus receiver={receiver.id} />
                    </div>
                </div>
                <div className={cx('info')}>
                    <span>{receiver.username}</span>
                </div>
            </div>
            <div className={cx('action-btns')}>
                <div className={cx('btn-item')}>
                    <Button
                        noTitle
                        leftIcon={<FontAwesomeIcon icon={faVideo} onClick={handleDisplayCallVideoModal} />}
                    ></Button>
                </div>
                <div className={cx('btn-item')}>
                    <Button noTitle leftIcon={<FontAwesomeIcon icon={faCircleInfo} onClick={onClick} />}></Button>
                </div>
            </div>
        </div>
    );
}

export default HeaderChat;
