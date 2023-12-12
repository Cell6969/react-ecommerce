import React from 'react'
import styles from './ProductItem.module.scss'
import Card from '../../card/Card'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ADD_TO_CART, CALCULATE_TOTAL_QUANTITY } from '../../../redux/slice/cartSlice'

const ProductItem = ({ product, grid, id, name, price, desc, imageURL }) => {
    const dispatch = useDispatch()

    const addToCart = (product) => {
        dispatch(ADD_TO_CART(product))
        dispatch(CALCULATE_TOTAL_QUANTITY())
    };

    return (
        <Card cardClass={grid ? `${styles.grid}` : `${styles.list}`}>
            <Link to={`/product-details/${id}`}>
                <div className={styles.img}>
                    <img src={imageURL} alt={name} />
                </div>
            </Link>
            <div className={styles.content}>
                <div className={styles.details}>
                    <p>{`${price}$`}</p>
                    <h4>{name}</h4>
                </div>
                {!grid &&
                    <p className={styles.desc}>
                        {desc}
                    </p>}
                <button className='--btn --btn-danger' onClick={() => addToCart(product)}>Add Cart</button>
            </div>
        </Card>
    )
}

export default ProductItem