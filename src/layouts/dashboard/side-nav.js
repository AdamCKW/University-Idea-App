import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Divider,
    Drawer,
    Stack,
    SvgIcon,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';
import { getSession, useSession } from 'next-auth/react';

export const SideNav = (props) => {
    const { data: session } = useSession();
    const { open, onClose } = props;
    const pathname = usePathname();
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

    const content = (
        <Scrollbar
            sx={{
                height: '100%',
                '& .simplebar-content': {
                    height: '100%',
                },
                '& .simplebar-scrollbar:before': {
                    background: 'neutral.400',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box
                        component={NextLink}
                        href="/"
                        sx={{
                            display: 'inline-flex',
                            height: 32,
                            width: 32,
                        }}
                    >
                        <Logo />
                    </Box>
                </Box>

                <Divider sx={{ borderColor: 'neutral.700' }} />

                <Box
                    component="nav"
                    sx={{
                        flexGrow: 1,
                        px: 2,
                        py: 3,
                    }}
                >
                    <Stack
                        component="ul"
                        spacing={0.5}
                        sx={{
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                    >
                        {items.map((item) => {
                            const active = item.path
                                ? pathname === item.path
                                : false;

                            const hasPermission = item.permissions.includes(
                                session?.user?.role
                            );

                            if (hasPermission) {
                                return (
                                    <SideNavItem
                                        active={active}
                                        disabled={item.disabled}
                                        external={item.external}
                                        icon={item.icon}
                                        key={item.title}
                                        path={item.path}
                                        title={item.title}
                                    />
                                );
                            }
                        })}
                    </Stack>
                </Box>
                {/* <Divider sx={{ borderColor: 'neutral.700' }} /> */}
            </Box>
        </Scrollbar>
    );

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        backgroundColor: 'neutral.800',
                        color: 'common.white',
                        width: 280,
                    },
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    backgroundColor: 'neutral.800',
                    color: 'common.white',
                    width: 280,
                },
            }}
            sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
            variant="temporary"
        >
            {content}
        </Drawer>
    );
};

SideNav.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
};

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}
