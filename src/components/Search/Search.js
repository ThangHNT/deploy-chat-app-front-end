import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import classNames from 'classnames/bind';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import styles from './Search.module.scss';
import Input from '~/components/Input';
import { useDebounce } from '~/hooks';
import host from '~/ulties/serverHost';
import MessageItem from '~/components/MessageItem';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import { UserContext } from '~/components/Context/UserContext';

const cx = classNames.bind(styles);

function Search({ darkmode = false }) {
    // console.log('Search');
    const { currentUser } = useContext(UserContext);
    const UserChatContent = useContext(ChatContentContext);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const inputRef = useRef();
    const debounce = useDebounce(searchValue, 800);

    useEffect(() => {
        if (!debounce.trim()) return;
        axios
            .get(`${host}/api/search`, { params: { q: debounce, exceptUser: currentUser._id } })
            .then((data) => {
                const data2 = data.data;
                // console.log(data2.listUser);
                if (data2.status) {
                    setSearchResults(data2.listUser);
                    setShowResults(true);
                } else {
                    toast.warning(data2.msg);
                }
            })
            .catch((err) => {
                console.log('loi tim nguoi dung');
            });
        // eslint-disable-next-line
    }, [debounce]);

    const handleType = useCallback((e) => {
        const valueInput = e.target.value;
        if (!valueInput.startsWith(' ')) {
            setSearchValue(valueInput);
        } else {
            setSearchValue('');
            inputRef.current.value = '';
        }
    }, []);

    const handleHideResults = () => {
        setShowResults(false);
    };

    const handleClickMessageItem = (e) => {
        // lấy root element
        const rootdiv = e.currentTarget;
        UserChatContent.handleDisplayChatContent(rootdiv.getAttribute('userid'));
        setShowResults(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div>
                <Tippy
                    interactive
                    placement="bottom"
                    visible={searchResults.length > 0 && showResults}
                    render={(attrs) => (
                        <div
                            className={cx('search-results', { darkmodeBackground: darkmode })}
                            tabIndex="-1"
                            {...attrs}
                        >
                            {searchResults.length > 0 &&
                                searchResults.map((item, index) => (
                                    <div
                                        key={index}
                                        userid={item.userId}
                                        onClick={handleClickMessageItem}
                                        className={cx('wrapper-result')}
                                    >
                                        <MessageItem
                                            searchResult
                                            receiver={item.userId}
                                            avatar={item.avatar}
                                            username={item.username}
                                            darkmode={darkmode}
                                        />
                                    </div>
                                ))}
                        </div>
                    )}
                    onClickOutside={handleHideResults}
                >
                    <div className={cx('wrapper-input')}>
                        <Input
                            ref={inputRef}
                            type="text"
                            noLabel
                            onInput={handleType}
                            arounded
                            darkmode={darkmode}
                            placeholder="Tìm kiếm bạn bè"
                            input
                            name="search"
                            autoComplete="off"
                            onFocus={() => {
                                setShowResults(true);
                            }}
                        />
                    </div>
                </Tippy>
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
        </div>
    );
}

export default Search;
