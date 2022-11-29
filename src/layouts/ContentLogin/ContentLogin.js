import React, { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ContentLogin.module.scss';
import Form from '~/components/Form';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function ContentLogin() {
    const [loginForm, setLoginForm] = useState(true);

    const spanRef = useRef();
    const h2Ref = useRef();

    const handleDisplaySignupForm = () => {
        setLoginForm(false);
        h2Ref.current.innerText = 'Sign up';
        spanRef.current.innerText = 'Đã có tài khoản ?';
    };

    const handleDisplayLoginForm = () => {
        setLoginForm(true);
        h2Ref.current.innerText = 'Log in';
        spanRef.current.innerText = 'Bạn chưa có tài khoản ?';
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper-form')}>
                <h2 ref={h2Ref} className={cx('title')}>
                    Log in
                </h2>
                {loginForm && <Form login />}
                {!loginForm && <Form signup />}
                <div className={cx('switch-form')}>
                    <span ref={spanRef}>Bạn chưa có tài khoản</span>
                    {loginForm && <Button normal children="Đăng ký ngay" onClick={handleDisplaySignupForm} />}
                    {!loginForm && <Button normal children="Đăng nhập" onClick={handleDisplayLoginForm} />}
                </div>
            </div>
        </div>
    );
}

export default ContentLogin;
