import { useMemo, useContext, useEffect, useState, useRef, memo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import host from '~/ulties/serverHost';
import classNames from 'classnames/bind';
import styles from './Account.module.scss';
import Input from '~/components/Input';
import { UserContext } from '~/components/Context/UserContext';
import Modal from '~/layouts/Modal';

const cx = classNames.bind(styles);

function Account() {
    const { handleSeCurrenttUser } = useContext(UserContext);
    const [clickChangePwBtn, setClickChangePwBtn] = useState(false);
    const [profile, setProfile] = useState({});
    const [canStoreChange, setCanStoreChange] = useState(false); // có thể ấn nút lưu để lưu

    const currentUser = useMemo(() => {
        return JSON.parse(localStorage.getItem('chat-app-hnt'));
    }, []);

    const inputRef = useRef();
    const imgRef = useRef();
    const preImgRef = useRef(currentUser.avatar);
    // console.log(preImgRef.current);

    // thay đổi ảnh or input sẽ ấn đc nút lưu
    useEffect(() => {
        if (profile.avatar || profile.username || (profile.oldpassword && profile.newpassword)) {
            setCanStoreChange(true);
        } else {
            setCanStoreChange(false);
        }
    }, [profile]);

    // ẩn hiện input password khi ấn vào nút đổi mk
    const hanleClickChangePasswordBtn = () => {
        setClickChangePwBtn((pre) => !pre);
    };

    // xét input khi chọn ảnh
    const handleChooseNewAvatar = (e) => {
        const reader = new FileReader();
        if (e.target.files) {
            let file = e.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                let base64String = reader.result;
                imgRef.current.src = base64String;
                setProfile((pre) => {
                    pre.avatar = base64String;
                    pre.change = true;
                    return { ...pre };
                });
            };
        }
    };

    // xét thay đổi của input
    const handleChangeInput = (e) => {
        const target = e.target;
        setProfile((pre) => {
            pre[target.name] = target.value;
            return {
                ...pre,
            };
        });
    };

    // ấn nút bỏ chọn ảnh
    const handleRemoveChoseAvatar = () => {
        imgRef.current.src = preImgRef.current;
        setProfile((pre) => {
            pre.avatar = undefined;
            return { ...pre };
        });
    };

    // ấn nút lưu và gửi dữ liệu về db
    const handleSubmitForm = async () => {
        if (canStoreChange) {
            preImgRef.current = imgRef.current.src;
            // console.log(profile);
            const newInfo = {
                avatar: profile.avatar ? profile.avatar : currentUser.avatar,
                username: profile.username ? profile.username : currentUser.username,
                account: currentUser.account,
                _id: currentUser._id,
                setting: currentUser.setting,
            };
            handleSeCurrenttUser(newInfo);
            localStorage.setItem('chat-app-hnt', JSON.stringify(newInfo));
            const { data } = await axios.post(`${host}/api/update/my-account`, { userId: currentUser._id, ...profile });
            // console.log(data);
            if (data.status) {
                toast.success(data.msg);
            } else {
                toast.error(data.msg);
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('avatar-wapper')}>
                <img ref={imgRef} className={cx('avatar')} src={currentUser.avatar} alt="avatar" />
                {profile.avatar === undefined ? (
                    <div className={cx('choose-img-btn-wrapper')}>
                        <div className={cx('choose-img-btn')}>Thay Đổi avatar</div>
                        <input
                            ref={inputRef}
                            onChange={handleChooseNewAvatar}
                            className={cx('choose-img-input')}
                            type="file"
                        />
                    </div>
                ) : (
                    <div className={cx('remove-img-selected-btn')} onClick={handleRemoveChoseAvatar}>
                        Bỏ chọn ảnh
                    </div>
                )}
            </div>
            <div className={cx('main-info')}>
                <div className={cx('form-wrapper')}>
                    <div className={cx('form')} method="POST">
                        <div className={cx('info-item')}>
                            <label>Tên Tài Khoản</label>
                            <span>{currentUser.account}</span>
                        </div>
                        <div className={cx('info-item')}>
                            <label>Tên người dùng</label>
                            <Input
                                type="text"
                                name="username"
                                placeholder={currentUser.username}
                                noLabel
                                normal
                                maxLength="20"
                                onChange={handleChangeInput}
                                autoComplete="off"
                            />
                        </div>
                        <div className={cx('info-item', { padding: true })}>
                            <label onClick={hanleClickChangePasswordBtn}>
                                <span className={cx('change-password-btn')}>Đổi Mật Khẩu</span>
                            </label>
                            {clickChangePwBtn && (
                                <div className={cx('change-password')}>
                                    <div className={cx('chang-password-input')}>
                                        <div className={cx('input-password-item')}>
                                            <Input
                                                type="password"
                                                name="oldpassword"
                                                placeholder="Mật khẩu cũ"
                                                noLabel
                                                normal
                                                maxLength="30"
                                                onChange={handleChangeInput}
                                            />
                                        </div>
                                        <div className={cx('input-password-item')}>
                                            <Input
                                                type="password"
                                                name="newpassword"
                                                placeholder="Mật khẩu mới"
                                                noLabel
                                                normal
                                                maxLength="30"
                                                onChange={handleChangeInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={cx('submit-btn', { disabled: !canStoreChange })} onClick={handleSubmitForm}>
                    <span>Lưu</span>
                </div>
            </div>
            <Modal />
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

export default memo(Account);
