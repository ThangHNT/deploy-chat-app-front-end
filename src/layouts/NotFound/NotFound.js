import classNames from 'classnames/bind';
import styles from './NotFound.module.scss';

const cx = classNames.bind(styles);

function NotFound() {
    return (
        <div className={cx('wrapper')}>
            <h1>page not found</h1>
            <img
                src="https://hri.com.vn/wp-content/uploads/bfi_thumb/1-1-or1e3o9bq12fwbzekgpmqzl8z58064rkfiu0a9dg9i.jpg"
                alt="page not found"
            />
        </div>
    );
}

export default NotFound;
