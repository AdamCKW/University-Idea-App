import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import EmailIcon from '@mui/icons-material/Email';
import { SvgIcon } from '@mui/material';

export const items = [
    {
        title: 'Home',
        path: '/',
        icon: (
            <SvgIcon fontSize="small">
                <HomeIcon />
            </SvgIcon>
        ),
        permissions: ['admin', 'qaManager', 'qaCoordinator', 'staff'],
    },
    {
        title: 'Overview',
        path: '/overview',
        icon: (
            <SvgIcon fontSize="small">
                <BarChartIcon />
            </SvgIcon>
        ),
        permissions: ['admin', 'qaManager', 'qaCoordinator'],
    },
    {
        title: 'Accounts',
        path: '/accounts',
        icon: (
            <SvgIcon fontSize="small">
                <PersonIcon />
            </SvgIcon>
        ),
        permissions: ['admin'],
    },
    {
        title: 'Categories',
        path: '/categories',
        icon: (
            <SvgIcon fontSize="small">
                <CategoryIcon />
            </SvgIcon>
        ),
        permissions: ['admin', 'qaManager', 'qaCoordinator'],
    },
    {
        title: 'Posts',
        path: '/posts',
        icon: (
            <SvgIcon fontSize="small">
                <EmailIcon />
            </SvgIcon>
        ),
        permissions: ['admin', 'qaManager', 'qaCoordinator'],
    },
];
