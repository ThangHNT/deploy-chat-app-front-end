import React, { memo, useContext, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import 'tippy.js/dist/tippy.css';
import styles from './Menu.module.scss';
import { SettingContext } from '~/components/Context/SettingContext';

const cx = classNames.bind(styles);

function Menu({ sender, receiver, menu = [] }) {
    const { darkLightMode } = useContext(SettingContext);

    const [catalog, setCatalog] = useState([{ data: menu }]);
    const currentCatalog = catalog[catalog.length - 1];

    const renderItems = () => {
        return currentCatalog.data.map((item, index) => {
            let setIcon;
            if (item.type) {
                if (item.type === 'turn-on' && darkLightMode) {
                    setIcon = item.icon;
                } else if (item.type === 'turn-off' && !darkLightMode) {
                    setIcon = item.icon;
                } else setIcon = undefined;
            } else setIcon = item.icon;
            return (
                <Button
                    key={index}
                    darkmodeBtn={darkLightMode}
                    text
                    leftIcon={setIcon}
                    tickBtn={item.type}
                    children={item.text}
                    href={item.href}
                    to={item.to}
                    noBorderRadius
                    onClick={() => {
                        const isParent = !!item.children;
                        if (isParent) {
                            setCatalog((pre) => [...pre, item.children]);
                            return;
                        } else {
                            if (item.onClick) {
                                if (item.type === 'turn-on') {
                                    item.onClick(true, true);
                                } else if (item.type === 'turn-off') {
                                    item.onClick(true, false);
                                } else item.onClick();
                            } else return () => {};
                        }
                    }}
                />
            );
        });
    };

    const handleOpenPreCatalog = (e) => {
        setCatalog((pre) => pre.slice(0, pre.length - 1));
    };

    return (
        <div className={cx('wrapper')}>
            {catalog.length > 1 && (
                <div className={cx('header', { darkmode: darkLightMode })} onClick={handleOpenPreCatalog}>
                    <FontAwesomeIcon icon={faChevronLeft} className={cx('arrow-left')} />
                    <span>{currentCatalog.text}</span>
                </div>
            )}
            <div className={cx('menu-btns')}>{renderItems()}</div>
        </div>
    );
}

export default memo(Menu);
