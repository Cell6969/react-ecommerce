import React from 'react'
import styles from './Chart.module.scss'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Card from '../card/Card';
import { useSelector } from 'react-redux';
import { selectOrderHistory } from '../../redux/slice/orderSlice';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        },
        // title: {
        //     display: true,
        //     text: 'Chart.js Bar Chart',
        // },
    },
};

const Chart = () => {
    const orders = useSelector(selectOrderHistory);
    // separate status order
    const array = [];
    orders.map((item) => {
        const { orderStatus } = item;
        array.push(orderStatus);
    });

    const getOrderCount = (arr, value) => {
        return arr.filter((n) => n === value).length;
    }

    const placed = getOrderCount(array, 'Order Placed...');
    const processing = getOrderCount(array, 'Processing...');
    const shipped = getOrderCount(array, 'Shipped...');
    const delivered = getOrderCount(array, 'Delivered');

    const data = {
        labels: ["Placed Orders", "Processing", "Shipped", "Delivered"],
        datasets: [
            {
                label: 'Order Count',
                data: [placed, processing, shipped, delivered],
                backgroundColor: 'rgba(60, 247, 30, 0.8)',
            },
        ],
    };

    return (
        <div className={styles.charts}>
            <Card cardClass={styles.card}>
                <h3>Order Status Chart</h3>
                <Bar options={options} data={data} />
            </Card>
        </div>
    )
}

export default Chart