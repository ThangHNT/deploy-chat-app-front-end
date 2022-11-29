import classNames from 'classnames/bind';
import styles from './ModalFooter.module.scss';

const cx = classNames.bind(styles);

function ModalFooter({ clickToClose, clickToStore, canStore = false }) {
    const handleClose = () => {
        clickToClose();
    };

    const handleStore = () => {
        clickToStore();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('body')}>
                <span className={cx('cancel-btn')} onClick={handleClose}>
                    Hủy
                </span>
                <span className={cx('store-btn', { canChange: canStore })} onClick={handleStore}>
                    Lưu
                </span>
            </div>
        </div>
    );
}

export default ModalFooter;
