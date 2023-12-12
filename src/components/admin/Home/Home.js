import React, { useEffect } from 'react'
import styles from './Home.module.scss'
import InfoBox from '../../infoBox/InfoBox'
import { AiFillDollarCircle } from 'react-icons/ai'
import { BsCart4 } from 'react-icons/bs'
import { FaCartArrowDown } from 'react-icons/fa'
import useFetchCollection from '../../../customHooks/useFetchCollection'
import { useDispatch, useSelector } from 'react-redux'
import { STORE_PRODUCTS, selectProducts } from '../../../redux/slice/productSlice'
import { CALC_TOTAL_ORDER_AMOUNT, STORE_ORDERS, selectOrderHistory, selectTotalOrderAmount } from '../../../redux/slice/orderSlice'
import Chart from '../../chart/Chart'


// Icons
const earningIcons = <AiFillDollarCircle size={30} color='#b624ff' />
const productIcon = <BsCart4 size={30} color='#1f93ff' />
const orderIcon = <FaCartArrowDown size={30} color='orangered' />

const Home = () => {
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrderHistory);
  const totalOrderAmount = useSelector(selectTotalOrderAmount);

  const fbProducts = useFetchCollection("products");
  const fbOrders = useFetchCollection("orders");

  useEffect(() => {
    dispatch(STORE_PRODUCTS({
      products: fbProducts.data
    }))

    dispatch(STORE_ORDERS(fbOrders.data))

    dispatch(CALC_TOTAL_ORDER_AMOUNT())

  }, [dispatch, fbOrders.data, fbProducts.data])

  return (
    <div className={styles.home}>
      <h2>Admin Home</h2>
      <div className={styles["info-box"]}>
        <InfoBox
          cardClass={`${styles.card} ${styles.card1}`}
          title={"Earnings"}
          count={`$${totalOrderAmount}`}
          icon={earningIcons}

        />
        <InfoBox
          cardClass={`${styles.card} ${styles.card2}`}
          title={"Products"}
          count={products.length}
          icon={productIcon}

        />
        <InfoBox
          cardClass={`${styles.card} ${styles.card3}`}
          title={"Orders"}
          count={orders.length}
          icon={orderIcon}
        />
      </div>
      <div>
        <Chart />
      </div>
    </div>
  )
}

export default Home