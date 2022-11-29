import { useContext, useState, useLayoutEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import classNames from 'classnames/bind';
import axios from 'axios';
import host from '~/ulties/serverHost';
import ModalHeader from '../ModalHeader';
import styles from './Setting.module.scss';
import { SettingContext } from '~/components/Context/SettingContext';
import { UserContext } from '~/components/Context/UserContext';
import ModalFooter from '../ModalFooter';

const cx = classNames.bind(styles);

function Setting() {
    const { currentUser } = useContext(UserContext);
    const { darkLightMode, handleSetDisplayGeneralSetting, soundSetting, handleSetSoundSetting } =
        useContext(SettingContext);

    const [sound, setSound] = useState({ ...soundSetting }); // pre setting sound
    const [currentSound, setCurrentSound] = useState({ ...soundSetting }); // current setting sound

    const inputRef = useRef();
    const inputRef2 = useRef();
    const inputRef3 = useRef();

    // set checked của input khi mở setting
    useLayoutEffect(() => {
        // console.log(soundSetting);
        inputRef.current.checked = soundSetting.notify;
        inputRef2.current.checked = soundSetting.textting;
        inputRef3.current.checked = soundSetting.send;
        // eslint-disable-next-line
    }, []);

    // xử lý thay đổi khi ấn nút
    const handleGetChangeSetting = (e) => {
        const target = e.currentTarget;
        const checked = target.checked;
        const type = target.getAttribute('sound');
        if (checked) {
            setCurrentSound((pre) => {
                pre[type] = true;
                return { ...pre };
            });
        } else {
            setCurrentSound((pre) => {
                pre[type] = false;
                return { ...pre };
            });
        }
    };

    // khi có thay đổi mới sẽ bấm đc nút lưu
    const handleStoreSetting = async () => {
        if (
            sound.send !== currentSound.send ||
            sound.textting !== currentSound.textting ||
            sound.notify !== currentSound.notify
        ) {
            setSound({ ...currentSound });
            handleSetSoundSetting({ ...currentSound });
            const { data } = await axios.post(`${host}/api/change/general-settings`, {
                type: 'sound',
                value: currentSound,
                userId: currentUser._id,
            });
            if (data.status) {
                toast.success('Thay đổi cài đặt thành công.');
            } else {
                toast.error('Thay đổi cài đặt thất bại.');
            }
        }
    };

    return (
        <div className={cx('wrapper', { darkmode: darkLightMode })}>
            <div className={cx('header')}>
                <ModalHeader title="Cài đặt" onClick={handleSetDisplayGeneralSetting} />
            </div>
            <div className={cx('body')}>
                <div className={cx('item')}>
                    <div className={cx('title')}>Âm thanh thông báo</div>
                    <div className={cx('selection')}>
                        <input
                            ref={inputRef}
                            type="checkbox"
                            sound="notify"
                            className={cx('switch-btn')}
                            onClick={handleGetChangeSetting}
                        ></input>
                    </div>
                </div>
                <div className={cx('item')}>
                    <div className={cx('title')}>Âm thanh soạn tin nhắn</div>
                    <div className={cx('selection')}>
                        <input
                            ref={inputRef2}
                            type="checkbox"
                            sound="textting"
                            className={cx('switch-btn')}
                            onClick={handleGetChangeSetting}
                        ></input>
                    </div>
                </div>
                <div className={cx('item')}>
                    <div className={cx('title')}>Âm thanh gửi tin nhắn</div>
                    <div className={cx('selection')}>
                        <input
                            ref={inputRef3}
                            type="checkbox"
                            sound="send"
                            className={cx('switch-btn')}
                            onClick={handleGetChangeSetting}
                        ></input>
                    </div>
                </div>
            </div>
            <div className={cx('footer')}>
                <ModalFooter
                    clickToClose={handleSetDisplayGeneralSetting}
                    clickToStore={handleStoreSetting}
                    canStore={
                        sound.send !== currentSound.send ||
                        sound.textting !== currentSound.textting ||
                        sound.notify !== currentSound.notify
                    }
                />
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
            />
        </div>
    );
}

export default Setting;
