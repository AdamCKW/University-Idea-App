import PropTypes from 'prop-types';
import HomeIcon from '@mui/icons-material/Home';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import {
    Button,
    Avatar,
    Badge,
    Box,
    IconButton,
    Stack,
    SvgIcon,
    Tooltip,
    useMediaQuery,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { usePopover } from 'src/hooks/use-popover';
import { AccountPopover } from './account-popover';

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
    const { onNavOpen } = props;
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const accountPopover = usePopover();

    return (
        <>
            <Box
                component="header"
                sx={{
                    backdropFilter: 'blur(6px)',
                    backgroundColor: (theme) =>
                        alpha(theme.palette.background.default, 0.8),
                    position: 'sticky',
                    left: {
                        lg: `${SIDE_NAV_WIDTH}px`,
                    },
                    top: 0,
                    width: {
                        lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
                    },
                    zIndex: (theme) => theme.zIndex.appBar,
                }}
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{
                        minHeight: TOP_NAV_HEIGHT,
                        px: 2,
                    }}
                >
                    <Stack alignItems="center" direction="row" spacing={2}>
                        {!lgUp && (
                            <IconButton onClick={onNavOpen}>
                                <SvgIcon fontSize="small">
                                    <Bars3Icon />
                                </SvgIcon>
                            </IconButton>
                        )}
                    </Stack>

                    <Stack alignItems="center" direction="row" spacing={2}>
                        <Button
                            href="/"
                            color="inherit"
                            endIcon={
                                <SvgIcon fontSize="small">
                                    <HomeIcon />
                                </SvgIcon>
                            }
                            size="small"
                            variant="text"
                        >
                            Home
                        </Button>

                        <Avatar
                            onClick={accountPopover.handleOpen}
                            ref={accountPopover.anchorRef}
                            sx={{
                                cursor: 'pointer',
                                height: 40,
                                width: 40,
                            }}
                        />
                    </Stack>
                </Stack>
            </Box>

            <AccountPopover
                anchorEl={accountPopover.anchorRef.current}
                open={accountPopover.open}
                onClose={accountPopover.handleClose}
            />
        </>
    );
};

TopNav.propTypes = {
    onNavOpen: PropTypes.func,
};
