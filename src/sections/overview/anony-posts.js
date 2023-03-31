import PropTypes from 'prop-types';
import moment from 'moment';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    SvgIcon,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Chart } from 'src/components/chart';

const useChartOptions = (labels) => {
    const theme = useTheme();
    return {
        chart: {
            background: 'transparent',
            zoom: {
                enabled: false,
            },
        },
        colors: ['#e91e63'],
        dataLabels: {
            enabled: false,
        },
        fill: {
            opacity: 1,
            type: 'solid',
        },
        stroke: {
            curve: 'straight',
        },
        theme: {
            mode: theme.palette.mode,
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 2,
        },
        xaxis: {
            axisBorder: {
                color: theme.palette.divider,
                show: true,
            },
            axisTicks: {
                color: theme.palette.divider,
                show: true,
            },
            labels: {
                offsetY: 5,
                style: {
                    colors: theme.palette.text.secondary,
                },
            },
            categories: labels,
        },
        yaxis: {
            labels: {
                formatter: (value) => (value > 0 ? `${value}` : `${value}`),
                offsetX: -10,
                style: {
                    colors: theme.palette.text.secondary,
                },
            },
        },
    };
};

export const AnonymousPosts = (props) => {
    const { chartSeries, labels, sx } = props;
    const chartOptions = useChartOptions(labels);

    const month = moment().format('MMMM');

    return (
        <Card sx={sx}>
            <CardHeader title={`Number Of Anonymous Posts in ${month}`} />
            <CardContent>
                <Chart
                    height={350}
                    series={chartSeries}
                    options={chartOptions}
                    type="line"
                    width="100%"
                />
            </CardContent>
        </Card>
    );
};

AnonymousPosts.protoTypes = {
    chartSeries: PropTypes.array.isRequired,
    sx: PropTypes.object,
    labels: PropTypes.array.isRequired,
};
