import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({
    to,
    href,
    primary = false,
    secondary = false,
    large = false,
    small = false,
    text = false,
    disable = false,
    normal = false,
    circle = false,
    messageItem = false,
    message_sended = false,
    noTitle = false,
    nestInput = false,
    scrollDown = false,
    darkmodeBtn = false,
    darkmodeOptionBtn = false,
    noBorderRadius = false,
    tickBtn = false,
    children,
    onClick,
    leftIcon,
    ...passprops
}) {
    let Btn = 'button';

    const props = {
        onClick,
        ...passprops,
    };

    if (to) {
        Btn = Link;
        props.to = to;
    } else if (href) {
        props.href = href;
        Btn = 'a';
    }
    if (disable) {
        delete props.onClick;
    }

    const classes = cx('wrapper', {
        primary,
        disable,
        large,
        small,
        text,
        secondary,
        messageItem,
        normal,
        circle,
        noTitle,
        message_sended,
        nestInput,
        scrollDown,
        darkmodeBtn,
        darkmodeOptionBtn,
        noBorderRadius,
    });

    return (
        <Btn className={classes} {...props}>
            {leftIcon && <span className={cx('icon', { tickBtn })}>{leftIcon}</span>}
            {!noTitle && !message_sended && <span className={cx('title')}>{children}</span>}
        </Btn>
    );
}

export default Button;
