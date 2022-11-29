import React, { forwardRef, useContext, memo, useImperativeHandle, useRef } from 'react';
import classNames from 'classnames/bind';
import { ChatContentContext } from '~/components/Context/ChatContentContext';
import styles from './Input.module.scss';

const cx = classNames.bind(styles);

const Input = forwardRef(
    (
        {
            type,
            title = ' ',
            name,
            arounded,
            placeholder = ' ',
            noLabel = false,
            input = false,
            chat = false,
            file = false,
            darkmode = false,
            normal = false,
            onInput,
            onFocus,
            onKeyDown,
            onPaste,
            handleType,
            value,
            maxLength = '100',
            ...passprops
        },
        ref,
    ) => {
        const ChatContent = useContext(ChatContentContext);
        const inputRef = useRef();
        useImperativeHandle(ref, () => ({
            focus() {
                inputRef.current.focus();
            },
            setHeight(height) {
                inputRef.current.style.height = `${height}px`;
            },
        }));

        const handleChange = (e) => {
            if (chat) {
                let value = e.target.value;
                if (value === ' ' || value === '' || value === '\n') {
                    e.target.style.height = '34px';
                }
                let height = e.target.scrollHeight;
                e.target.style.height = `${height + 2}px`;
            } else {
                const reader = new FileReader();
                if (e.target.files) {
                    let file = e.target.files[0];
                    // console.log(file);
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        let base64String = reader.result;
                        // console.log(base64String);
                        ChatContent.handleGetFileInput({
                            content: base64String,
                            filename: file.name,
                            size: file.size,
                            type: file.type,
                        });
                    };
                }
            }
        };

        let Input = 'input';
        const props = {
            ...passprops,
            onInput,
            onFocus,
            onPaste,
            onKeyDown,
            value,
        };

        if (chat) {
            Input = 'textarea';
            props.maxLength = '2000';
        }

        const classnames = cx('wrapper', {
            input,
            chat,
            arounded,
            file,
            darkmode,
            normal,
        });

        return (
            <div className={cx('wrapper-input')}>
                <Input
                    ref={inputRef}
                    className={classnames}
                    name={name}
                    title={title}
                    type={type}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    onChange={handleChange}
                    onInput={handleType}
                    {...props}
                />
                {!noLabel && (
                    <label className={cx(`label`)} htmlFor={name}>
                        {name}
                    </label>
                )}
            </div>
        );
    },
);

export default memo(Input);
