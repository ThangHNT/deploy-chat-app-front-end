import { useContext, useLayoutEffect } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import host from '~/ulties/serverHost';
import styles from './Admin.module.scss';
import { UserContext } from '~/components/Context/UserContext';

const cx = classNames.bind(styles);

function Admin() {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            axios
                .post(`${host}/api/check-admin`, { userId: currentUser._id })
                .then(({ data }) => {
                    console.log(data);
                    if (!data.admin) {
                        navigate('/');
                    }
                })
                .catch((err) => console.log('loi kiem tra quyen admin'));
        }
        // eslint-disable-next-line
    }, [currentUser]);

    const handleDelete = async (e) => {
        const target = e.target;
        const type = target.getAttribute('deletetype');
        // console.log(type);
        const { data } = await axios.post(`${host}/api/delete/force`, { type });
        console.log(data);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('item')}>
                <span onClick={handleDelete} deletetype={cx('delete-all-user')}>
                    Xóa tất cả người dùng
                </span>
            </div>
            <div className={cx('item')}>
                <span onClick={handleDelete} deletetype={cx('delete-all-message')}>
                    Xóa tất cả tin nhắn
                </span>
            </div>
            <div className={cx('item')}>
                <span onClick={handleDelete} deletetype={cx('delete-all-setting')}>
                    Xóa tất cả cài đặt
                </span>
            </div>
        </div>
    );
}

export default Admin;
