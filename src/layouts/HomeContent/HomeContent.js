import { memo } from 'react';
import classNames from 'classnames/bind';
import ChatContent from '~/layouts/ChatContent';
import Sidebar from '~/layouts/Sidebar';
import styles from './HomeContent.module.scss';
import Modal from '~/layouts/Modal';

const cx = classNames.bind(styles);

function HomeContent() {
    // console.log('home-content');

    return (
        <div className={cx('wrapper')}>
            <Sidebar className={cx('sidebar')} />
            <ChatContent className={cx('chat-content')} />
            <Modal />
        </div>
    );
}

export default memo(HomeContent);
