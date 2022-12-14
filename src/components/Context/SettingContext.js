import { createContext, useState, useContext, useLayoutEffect, useEffect } from 'react';
import { UserContext } from '~/components/Context/UserContext';
import { useDebounce } from '~/hooks';
import axios from 'axios';
import host from '~/ulties/serverHost';
const SettingContext = createContext();

const themeList = [
    { type: 'theme0' },
    { type: 'theme1' },
    { type: 'theme2' },
    { type: 'theme3' },
    { type: 'theme4' },
    { type: 'theme5' },
    { type: 'theme6' },
    { type: 'theme7' },
    { type: 'theme8' },
    { type: 'theme9' },
    { type: 'theme10' },
    { type: 'theme11' },
    { type: 'theme12' },
    { type: 'theme13' },
    { type: 'theme14' },
];

function SettingProvider({ children }) {
    // console.log('setting context');
    const { currentUser } = useContext(UserContext);
    const [blockStatus, setBlockStatus] = useState('');
    const [displayTheme, setDisplayTheme] = useState();
    const [theme, setTheme] = useState(new Map());
    const [backgroundImage, setBackgroundImage] = useState([]);
    const [displayRemoveMessageModal, setDisplayRemoveMessageModal] = useState(false);
    const [displayGeneralSetting, setDisplayGeneralSetting] = useState(false);
    const [darkLightMode, setDarkLightMode] = useState();
    const [soundSetting, setSoundSetting] = useState({});

    const debounce = useDebounce(darkLightMode, 2500);

    useLayoutEffect(() => {
        if (currentUser) {
            // console.log(currentUser.setting);
            axios
                .get(`${host}/api/get/general-settings/?userId=${currentUser._id}`)
                .then(({ data }) => {
                    if (data.status) {
                        // console.log(data.setting);
                        const sound = data.setting;
                        handleSetSoundSetting({
                            notify: sound.notificationSound,
                            send: sound.sendMessageSound,
                            textting: sound.texttingSound,
                        });
                        const darkMode = data.setting.darkMode;
                        handleChangeDarkLightMode(true, darkMode);
                    } else {
                        alert('lay cai dat that bai');
                    }
                })
                .catch(() => console.log('lay c??i ?????t chung b??? l???i'));
        }

        // eslint-disable-next-line
    }, [currentUser]);

    useEffect(() => {
        // console.log(debounce);
        if (debounce !== undefined && currentUser) {
            axios
                .post(`${host}/api/change/general-settings`, {
                    type: 'dark mode',
                    value: darkLightMode,
                    userId: currentUser._id,
                })
                .catch(() => console.log('loi thay doi dark mode to data base'));
        }
        // eslint-disable-next-line
    }, [debounce]);

    const handleSetSoundSetting = (setting) => {
        setSoundSetting(setting);
    };

    const handleSetDisplayGeneralSetting = () => {
        setDisplayGeneralSetting((pre) => !pre);
    };

    // hi???n modal x??a tin nh???n
    const handleSetDisplayRemoveMessageModal = (data) => {
        setDisplayRemoveMessageModal((pre) => {
            return pre === false ? data : false;
        });
    };
    // thay ?????i ???nh n???n
    const handleSetBackgroundImage = (key, value) => {
        setBackgroundImage((pre) => {
            const newObj = {
                id: key,
                backgroundImage: value,
            };
            return [...pre, newObj];
        });
    };
    // ch???n theme
    const handleSetTheme = (key, value) => {
        setTheme((pre) => {
            return pre.set(key, value);
        });
    };
    // hi???n th??? ds ch??? ????? theme
    const handleDisplayThemeList = () => {
        setDisplayTheme((pre) => !pre);
    };

    // set t??nh tr???ng ch???n
    const handlSetBlockStatus = (status) => {
        setBlockStatus(status);
    };

    // chuy???n ?????i giao di???n s??ng t???i
    const handleChangeDarkLightMode = (data = false, value) => {
        const html = document.querySelector('html');
        if (data) {
            if (value) {
                html.classList.add('darkmode');
            } else html.classList.remove('darkmode');
            setDarkLightMode(value);
        } else {
            darkLightMode === false ? html.classList.add('darkmode') : html.classList.remove('darkmode');
            setDarkLightMode((pre) => {
                return !pre;
            });
        }
    };

    const values = {
        themeList,
        blockStatus,
        theme,
        displayTheme,
        darkLightMode,
        backgroundImage,
        displayRemoveMessageModal,
        displayGeneralSetting,
        soundSetting,
        handlSetBlockStatus,
        handleChangeDarkLightMode,
        handleDisplayThemeList,
        handleSetTheme,
        handleSetBackgroundImage,
        handleSetDisplayRemoveMessageModal,
        handleSetDisplayGeneralSetting,
        handleSetSoundSetting,
    };
    return <SettingContext.Provider value={values}>{children}</SettingContext.Provider>;
}

export { SettingProvider, SettingContext };
