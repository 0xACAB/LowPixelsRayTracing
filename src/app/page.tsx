import DesktopPage from './desktopPage';
import MobilePage from './mobilePage';
import React from 'react';
import isMobileDevice from '@/lib/responsive';
import Script from 'next/script';

const Page = () => {
    const mobile: boolean = isMobileDevice(); // execute the function
    return (<>
        <Script src="//code.jivo.ru/widget/HLp8wDlGH3" />
        {
            mobile ? <MobilePage /> : <DesktopPage />
        }</>);
};
export default Page;
