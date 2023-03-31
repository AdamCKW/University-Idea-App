import { useCallback, useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
        paddingLeft: SIDE_NAV_WIDTH,
    },
}));

const LayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
});

export const Layout = (props) => {
    const { children } = props;
    const router = useRouter();
    const ignore = useRef(false);
    const [checked, setChecked] = useState(false);
    const pathname = usePathname();
    const [openNav, setOpenNav] = useState(false);

    const handlePathnameChange = useCallback(() => {
        if (openNav) {
            setOpenNav(false);
        }
    }, [openNav]);

    useEffect(
        () => {
            handlePathnameChange();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pathname]
    );

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        // Prevent from calling twice in development mode with React.StrictMode enabled
        if (ignore.current) {
            return;
        }

        ignore.current = true;
        setChecked(true);
    }, [router.isReady]);

    if (!checked) {
        return null;
    }

    return (
        <>
            <TopNav onNavOpen={() => setOpenNav(true)} />
            <SideNav onClose={() => setOpenNav(false)} open={openNav} />
            <LayoutRoot>
                <LayoutContainer>{children}</LayoutContainer>
            </LayoutRoot>
        </>
    );
};
