import { useState, useContext, memo, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import { faAngleDown, faAngleUp, faBan, faFont, faImage, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import host from '~/ulties/serverHost';
import styles from './ChatSetting.module.scss';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { SettingContext } from '~/components/Context/SettingContext';
import { SocketContext } from '~/components/Context/SocketContext';
import { UserContext } from '~/components/Context/UserContext';

const cx = classNames.bind(styles);

function Setting({ receiver, darkmode }) {
    // console.log('setting');
    const { currentUser } = useContext(UserContext);
    const { blockStatus, handlSetBlockStatus, handleDisplayThemeList, handleSetBackgroundImage, backgroundImage } =
        useContext(SettingContext);
    const { handleBlockUser, handleUnblockUser } = useContext(SocketContext);
    const Socket = useContext(SocketContext);
    const [displaySelectImageForBackgroun, setDisplaySelectImageForBackgroun] = useState(false);
    const [imageInput, setImageInput] = useState(false);

    const inputRef = useRef();

    const handleBlock = async (e) => {
        if (blockStatus.block) {
            handleUnblockUser({ sender: currentUser._id, receiver: receiver.id });
            const { data } = await axios.post(`${host}/api/unblock-user`, {
                sender: currentUser._id,
                receiver: receiver.id,
            });
            if (!data.status) {
                console.log('loi block-user');
            }
        } else {
            handleBlockUser({ sender: currentUser._id, receiver: receiver.id });
            const { data } = await axios.post(`${host}/api/block-user`, {
                sender: currentUser._id,
                receiver: receiver.id,
            });
            if (!data.status) {
                console.log('loi block-user');
            }
        }
        handlSetBlockStatus({ blocked: blockStatus.blocked, block: !blockStatus.block, receiver: receiver.id });
    };

    const handleDisplayChooseBackgoundUI = (e) => {
        setDisplaySelectImageForBackgroun((pre) => !pre);
        setImageInput(false);
    };

    const handleChooseImage = (e) => {
        const reader = new FileReader();
        if (e.target.files) {
            let file = e.target.files[0];
            // console.log(file);
            reader.readAsDataURL(file);
            reader.onload = () => {
                let base64String = reader.result;
                setImageInput(base64String);
            };
        }
    };

    const handleStoreBackgroundImage = () => {
        if (imageInput) {
            // console.log(receiver);
            axios
                .post(`${host}/api/set/background-image`, {
                    sender: currentUser._id,
                    receiver: receiver.id,
                    image: imageInput,
                })
                .then(({ data }) => {
                    // console.log(data);
                    toast.success('Chọn ảnh nền thành công');
                })
                .catch((err) => console.log('loi doi anh nen'));
            handleDisplayChooseBackgoundUI();
            handleSetBackgroundImage(receiver.id, imageInput);
            Socket.handleSetBackground(currentUser._id, receiver.id, imageInput);
            setImageInput(false);
        }
    };

    const handleDeleteBackgroundImage = () => {
        const userId = receiver.id;
        setImageInput(false);
        inputRef.current.value = '';
        backgroundImage.forEach((item) => {
            if (item.id === userId && item.backgroundImage.length > 0) {
                axios
                    .post(`${host}/api/set/background-image`, {
                        sender: currentUser._id,
                        receiver: receiver.id,
                        image: '',
                    })
                    .then(({ data }) => {
                        // console.log(data);
                        toast.success('Xóa ảnh nền thành công');
                    })
                    .catch((err) => console.log('loi doi anh nen'));

                handleDisplayChooseBackgoundUI();
                handleSetBackgroundImage(receiver.id, '');
                Socket.handleSetBackground(currentUser._id, receiver.id, '');
                setImageInput(false);
            }
        });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('body', { darkmode: darkmode })}>
                <div className={cx('item', { darkmodeItem: darkmode })}>
                    <div className={cx('title')} onClick={handleDisplayThemeList}>
                        <FontAwesomeIcon className={cx('icon')} icon={faEthereum} />
                        <span>Thay đổi chủ đề</span>
                    </div>
                </div>
                <div className={cx('item', { darkmodeItem: darkmode })}>
                    <div className={cx('title')} onClick={handleDisplayChooseBackgoundUI}>
                        <FontAwesomeIcon className={cx('icon')} icon={faImage} />
                        <span>Thay đổi ảnh nền</span>
                    </div>
                    <div className={cx('arrow')}>
                        {displaySelectImageForBackgroun ? (
                            <FontAwesomeIcon className={cx('icon')} icon={faAngleUp} />
                        ) : (
                            <FontAwesomeIcon className={cx('icon')} icon={faAngleDown} />
                        )}
                    </div>
                    {displaySelectImageForBackgroun && (
                        <div className={cx('choose-background', { darkmode })}>
                            <div className={cx('row')}>
                                <input
                                    ref={inputRef}
                                    onChange={handleChooseImage}
                                    className={cx('background-input')}
                                    type="file"
                                    accept="image/*"
                                />
                                <span
                                    className={cx('store-background-btn', { disabled: !imageInput })}
                                    onClick={handleStoreBackgroundImage}
                                >
                                    Lưu
                                </span>
                            </div>
                            <div className={cx('row')}>
                                <span className={cx('remove-background-btn')} onClick={handleDeleteBackgroundImage}>
                                    Xóa ảnh nền
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className={cx('item', { changeNickName: true, darkmodeItem: darkmode })}>
                    <div className={cx('title')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faFont} />
                        <span>Chỉnh sửa biệt danh</span>
                    </div>
                </div>
                <div className={cx('item', { search: true, darkmodeItem: darkmode })}>
                    <div className={cx('title')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faMagnifyingGlass} />
                        <span>Tìm kiếm trong cuộc trò chuyện</span>
                    </div>
                </div>
                <div className={cx('item', { block: true, darkmodeItem: darkmode })} onClick={handleBlock}>
                    <div className={cx('title')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faBan} />
                        {blockStatus.block ? (
                            <span>Bỏ Chặn {receiver.username} </span>
                        ) : (
                            <span>Chặn {receiver.username} </span>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={1500}
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

export default memo(Setting);
