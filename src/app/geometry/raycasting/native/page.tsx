import DesktopPage from './desktopPage';
import MobilePage from './mobilePage';
import React from 'react';
import isMobileDevice from '@/lib/responsive';

function Page() {
	const mobile: boolean = isMobileDevice(); // execute the function
	return (<>{mobile ? <MobilePage /> : <DesktopPage />}</>);
}

export default Page;
