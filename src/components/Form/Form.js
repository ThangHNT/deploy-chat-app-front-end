import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import host from '~/ulties/serverHost';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classNames from 'classnames/bind';
import styles from './Form.module.scss';
import Input from '~/components/Input';
import Button from '~/components/Button';
import { UserContext } from '../Context/UserContext';
// import { authentication } from '~/firebase/config';
// import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';

const cx = classNames.bind(styles);

function Form({ login, signup }) {
    const { handleSeCurrenttUser } = useContext(UserContext);

    // eslint-disable-next-line
    const navigate = useNavigate();

    const [values, setValues] = useState({
        account: '',
        password: '',
        confirmPassword: '',
        email: '',
    });

    // const handleLoginWithFB = async () => {
    //     const provider = new FacebookAuthProvider();
    //     const data = await signInWithPopup(authentication, provider);
    //     console.log(data.user);
    // };

    const checkValues = () => {
        let account = values.account;
        let password = values.password;
        let confirmPassword = values.confirmPassword;

        if (account.length < 3) {
            toast.warning('Độ dài tối thiểu là 3 ký tự');
            return false;
        }
        if (password !== confirmPassword && confirmPassword.length > 0) {
            toast.error('Mật khẩu không trùng khớp');
            return false;
        }
        if (!handleCheckPassword(password)) {
            toast.error('Mật khẩu tối thiểu 8 ký tự, bao gồm chữ cái viết hoa, viết thường, ký tự đặc biệt và số');
            return false;
        }
        return true;
    };

    function handleCheckPassword(password) {
        var strength = 0;
        if (password.match(/[a-z]+/)) {
            strength += 1;
        }
        if (password.match(/[A-Z]+/)) {
            strength += 1;
        }
        if (password.match(/[0-9]+/)) {
            strength += 1;
        }
        if (password.match(/[$@#&!]+/)) {
            strength += 1;
        }
        if (password.length < 8 || strength < 3) {
            return false;
        }
        return true;
    }

    // ấn enter để đăng nhập
    const handlSubmit = async (e) => {
        e.preventDefault();
        if (values.confirmPassword.length > 0) {
            try {
                if (checkValues()) {
                    console.log('register');
                    const { data } = await axios.post(`${host}/register`, values);
                    if (data.status === true) {
                        handleSeCurrenttUser(data.newUser);
                        toast.success('Chuyển hướng đến trang chủ.');
                        localStorage.setItem('chat-app-hnt', JSON.stringify(data.newUser));
                    } else {
                        toast(data.msg);
                    }
                }
            } catch (e) {
                alert('register request failed, start server');
            }
        } else {
            try {
                const { data } = await axios.post(`${host}/login`, values);
                if (data.status === false) {
                    toast(data.msg);
                } else {
                    console.log('login');
                    // console.log(data.user);
                    handleSeCurrenttUser(data.user);
                    toast.success('Chuyển hướng đến trang chủ.');
                    localStorage.setItem('chat-app-hnt', JSON.stringify(data.user));
                }
            } catch (e) {
                console.log('loi log in');
            }
        }
    };

    return (
        <form className={cx('form')} onSubmit={handlSubmit}>
            <div className={cx('wrapper-input')}>
                <Input
                    value={values.account}
                    onInput={(e) => {
                        setValues((pre) => {
                            pre.account = e.target.value.trim();
                            return {
                                ...pre,
                            };
                        });
                    }}
                    type="text"
                    title="Tài khoản"
                    input
                    name="account"
                    autoComplete="off"
                    required
                />
            </div>
            <div className={cx('wrapper-input')}>
                <Input
                    value={values.password}
                    onInput={(e) => {
                        setValues((pre) => {
                            pre.password = e.target.value.trim();
                            return {
                                ...pre,
                            };
                        });
                    }}
                    type="password"
                    input
                    title="Mật khẩu"
                    name="password"
                    autoComplete="off"
                    required
                />
            </div>
            {signup && (
                <div className={cx('wrapper-input')}>
                    <Input
                        value={values.confirmPassword}
                        onInput={(e) => {
                            setValues((pre) => {
                                pre.confirmPassword = e.target.value;
                                return {
                                    ...pre,
                                };
                            });
                        }}
                        type="password"
                        input
                        title="Nhập lại mật khẩu"
                        name="confirm-password"
                        autoComplete="off"
                        required
                    />
                </div>
            )}
            {signup && (
                <div className={cx('wrapper-input')}>
                    <Input
                        value={values.email}
                        onInput={(e) => {
                            setValues((pre) => {
                                pre.email = e.target.value;
                                return {
                                    ...pre,
                                };
                            });
                        }}
                        type="email"
                        input
                        title="Địa chỉ email"
                        name="email"
                        autoComplete="off"
                        required
                    />
                </div>
            )}

            {/* <Button type="button" primary large onClick={handleLoginWithFB}>
                login with fb
            </Button> */}

            <div className={cx('login-btn')}>
                {login && <Button large primary children="Đăng nhập" />}
                {signup && <Button large secondary children="Đăng ký" />}
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
            />
        </form>
    );
}

export default Form;
