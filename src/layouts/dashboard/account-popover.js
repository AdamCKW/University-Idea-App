import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, useSession, signOut } from 'next-auth/react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
    Link,
    Box,
    Button,
    Divider,
    MenuItem,
    MenuList,
    Popover,
    Typography,
} from '@mui/material';

export const AccountPopover = (props) => {
    const { data: session } = useSession();
    const { anchorEl, onClose, open } = props;
    const handleSignOut = useCallback(() => {
        signOut();
    }, []);

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom',
            }}
            onClose={onClose}
            open={open}
            PaperProps={{ sx: { width: 200 } }}
        >
            <Box
                sx={{
                    py: 1.5,
                    px: 2,
                }}
            >
                <Typography variant="overline">Account</Typography>
                <Typography color="text.secondary" variant="body2">
                    {session?.user?.name}
                </Typography>

                <Link component={NextLink} underline="none" href="/profile">
                    <Typography
                        color="text.secondary"
                        variant="body2"
                        underline="none"
                    >
                        Profile
                    </Typography>
                </Link>
            </Box>
            <Divider />
            <MenuList
                disablePadding
                dense
                sx={{
                    p: '8px',
                    '& > *': {
                        borderRadius: 1,
                    },
                }}
            >
                <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            </MenuList>
        </Popover>
    );
};

AccountPopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
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
