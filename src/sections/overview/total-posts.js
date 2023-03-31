import PropTypes from 'prop-types';
import ComputerDesktopIcon from '@heroicons/react/24/solid/ComputerDesktopIcon';
import DeviceTabletIcon from '@heroicons/react/24/solid/DeviceTabletIcon';
import PhoneIcon from '@heroicons/react/24/solid/PhoneIcon';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Stack,
    SvgIcon,
    Typography,
    useTheme,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import { Chart } from 'src/components/chart';

const useChartOptions = (labels) => {
    const theme = useTheme();

    return {
        chart: {
            background: 'transparent',
        },
        colors: [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.error.main,
            theme.palette.warning.main,
            theme.palette.info.main,
            theme.palette.success.main,
            theme.palette.primary.dark,
            theme.palette.secondary.dark,
            theme.palette.error.dark,
            theme.palette.warning.dark,
            theme.palette.info.dark,
            theme.palette.success.dark,
            theme.palette.primary.light,
            theme.palette.secondary.light,
            theme.palette.error.light,
            theme.palette.warning.light,
            theme.palette.info.light,
            theme.palette.success.light,
        ],
        dataLabels: {
            enabled: false,
        },
        labels,
        legend: {
            show: false,
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
            },
        },
        states: {
            active: {
                filter: {
                    type: 'none',
                },
            },
            hover: {
                filter: {
                    type: 'none',
                },
            },
        },
        stroke: {
            width: 0,
        },
        theme: {
            mode: theme.palette.mode,
        },
        tooltip: {
            fillSeriesColor: false,
        },
    };
};

export const TotalPostsPerDept = (props) => {
    const { chartSeries, labels, sx } = props;
    const chartOptions = useChartOptions(labels);

    return (
        <Card sx={sx}>
            <CardHeader title="Total Posts Per Department" />
            <CardContent>
                <Chart
                    height={300}
                    options={chartOptions}
                    series={chartSeries}
                    type="pie"
                    width="100%"
                />

                <Grid container spacing={2}>
                    {chartSeries.map((item, index) => {
                        const label = labels[index];
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={label}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography sx={{ my: 1 }} variant="h6">
                                        {label}
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        variant="subtitle2"
                                    >
                                        {item}
                                    </Typography>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </CardContent>
        </Card>
    );
};

TotalPostsPerDept.propTypes = {
    chartSeries: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired,
    sx: PropTypes.object,
};
