import { forwardRef, memo } from 'react';
import defaultImg from '~/assets/images/No-Image-Placeholder.svg.png';
import classNames from 'classnames/bind';
import styles from './Image.module.scss';

const cx = classNames.bind(styles);

const Image = forwardRef(
    (
        {
            src,
            alt,
            logo,
            online = false,
            small = false,
            arounded = false,
            noneReceiver = false,
            pasted = false,
            darkmode = false,
            large = false,
            normal = false,
            avatar,
            className,
            onClick,
            handleRemove,
            ...passprops
        },
        ref,
    ) => {
        const props = {
            onClick,
            ...passprops,
        };

        return (
            <div className={cx('wrapper')}>
                <img
                    ref={ref}
                    src={src || defaultImg}
                    alt={alt}
                    className={cx(className, {
                        arounded,
                        logo,
                        avatar,
                        online,
                        small,
                        normal,
                        large,
                        pasted,
                        noneReceiver,
                        darkmode,
                    })}
                    {...props}
                />
            </div>
        );
    },
);

export default memo(Image);
