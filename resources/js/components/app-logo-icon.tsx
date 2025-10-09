import { HTMLAttributes } from 'react';

export default function AppLogoIcon(props: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/150px-Logo-baru_UHO.png"
            alt="Logo Ikatan Alumni Psikologi Universitas Halu Oleo"
            className={`${props.className || ''} object-contain`}
        />
    );
}
