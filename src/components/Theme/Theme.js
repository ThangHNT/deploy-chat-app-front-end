import { useContext, useState, memo, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import classNames from 'classnames/bind';
import styles from './Theme.module.scss';
import host from '~/ulties/serverHost';
import { SettingContext } from '~/components/Context/SettingContext';
import { SocketContext } from '~/components/Context/SocketContext';
import { UserContext } from '~/components/Context/UserContext';
import ModalHeader from '~/layouts/ModalHeader';
import ModalFooter from '~/layouts/ModalFooter';

const cx = classNames.bind(styles);

function Theme({ receiver }) {
    // console.log('theme');
    const { currentUser } = useContext(UserContext);
    const Socket = useContext(SocketContext);
    const [theme, setTheme] = useState(false);
    const { handleDisplayThemeList, themeList, handleSetTheme, darkLightMode } = useContext(SettingContext);
    const Setting = useContext(SettingContext);

    const handleSetDisplayThemeList = useCallback(() => {
        handleDisplayThemeList();
        setTheme(false);
        // eslint-disable-next-line
    }, []);

    // thay đổi background color theme-item khi click vào
    const handleGetTheme = (e) => {
        const target = e.currentTarget;
        if (Setting.theme.get(receiver) !== target.id) {
            target.style.backgroundColor = 'rgba(170, 170, 170,0.6)';
            setTheme(target.id);
        } else {
            setTheme(false);
        }
        themeList.forEach((item, index) => {
            if (index !== Number(target.id)) {
                document.getElementById(index).style.backgroundColor = 'transparent';
            }
        });
    };

    const handleChangeTheme = async (e) => {
        if (theme) {
            await handleSetTheme(receiver, theme);
            toast.success('Thay đổi chủ đề thành công');
            const data = await axios.post(`${host}/api/change-theme`, {
                sender: currentUser._id,
                receiver: receiver,
                theme,
            });
            // console.log(theme);
            Socket.handleChangeTheme(currentUser._id, receiver, theme);
            if (!data.status) {
                console.log('yeu cau doi theme that bai');
                if (!data.data.status) {
                    console.log('doi theme loi');
                }
            }
            handleSetDisplayThemeList();
        }
    };

    return (
        <div className={cx('wrapper', { darkmode: darkLightMode })}>
            <div className={cx('theme-header', { darkmode: darkLightMode })}>
                <ModalHeader title="Chủ đề" onClick={handleDisplayThemeList} />
            </div>
            <div className={cx('theme-list')}>
                {themeList.map((item, index) => {
                    return (
                        <div
                            key={index}
                            id={`${index}`}
                            className={cx('theme-item', {
                                active: Setting.theme.get(receiver) === String(index),
                            })}
                            onClick={handleGetTheme}
                        >
                            <div className={cx(`${item.type}`)}></div>
                        </div>
                    );
                })}
            </div>
            <div className={cx('theme-footer')}>
                <ModalFooter
                    clickToClose={handleSetDisplayThemeList}
                    clickToStore={handleChangeTheme}
                    canStore={theme}
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

export default memo(Theme);
