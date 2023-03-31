import PropTypes from 'prop-types';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
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
            stacked: false,
        },
        colors: [
            theme.palette.secondary.main,
            alpha(theme.palette.secondary.main, 0.25),
        ],
        dataLabels: {
            enabled: false,
        },
        fill: {
            opacity: 1,
            type: 'solid',
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 2,
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        legend: {
            show: false,
        },
        plotOptions: {
            bar: {
                columnWidth: '40px',
                horizontal: 'true',
            },
        },
        stroke: {
            colors: ['transparent'],
            show: true,
            width: 2,
        },
        theme: {
            mode: theme.palette.mode,
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

export const HighestCommentsPerPost = (props) => {
    const { chartSeries, labels, sx } = props;
    const chartOptions = useChartOptions(labels);

    return (
        <Card sx={sx}>
            <CardHeader title="5 Idea Posts With Most Comments" />
            <CardContent>
                <Chart
                    height={350}
                    series={chartSeries}
                    options={chartOptions}
                    type="bar"
                    width="100%"
                />
            </CardContent>
        </Card>
    );
};

HighestCommentsPerPost.protoTypes = {
    chartSeries: PropTypes.array.isRequired,
    sx: PropTypes.object,
    labels: PropTypes.array.isRequired,
};
