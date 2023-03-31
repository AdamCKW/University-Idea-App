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
    },
    {
        title: 'Overview',
        path: '/overview',
        icon: (
            <SvgIcon fontSize="small">
                <BarChartIcon />
            </SvgIcon>
        ),
    },
    {
        title: 'Accounts',
        path: '/accounts',
        icon: (
            <SvgIcon fontSize="small">
                <PersonIcon />
            </SvgIcon>
        ),
    },
    {
        title: 'Categories',
        path: '/categories',
        icon: (
            <SvgIcon fontSize="small">
                <CategoryIcon />
            </SvgIcon>
        ),
    },
    {
        title: 'Posts',
        path: '/posts',
        icon: (
            <SvgIcon fontSize="small">
                <EmailIcon />
            </SvgIcon>
        ),
    },
];
