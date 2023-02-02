import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ModalHeader.module.scss';
import { SettingContext } from '~/components/Context/SettingContext';

const cx = classNames.bind(styles);

function ModalHeader({ title, onClick }) {
    const { darkLightMode } = useContext(SettingContext);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('body', { darkmode: darkLightMode })}>
                <span>{title}</span>
                <FontAwesomeIcon
                    icon={faXmark}
                    className={cx('close-icon', { darkmodeCloseBtn: darkLightMode })}
                    onClick={onClick}
                />
            </div>
        </div>
    );
}

export default ModalHeader;
