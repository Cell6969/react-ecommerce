import React from 'react'
import styles from './NotFound.module.scss'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className={styles["not-found"]}>
            <div>
                <h2>404</h2>
                <p>Oops, Page not found</p>
                <Link to='/'>
                    <button className='--btn'>&larr; Back to Home</button>
                </Link>
            </div>
        </div>
    )
}

export default NotFound