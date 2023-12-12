import React, { useEffect, useState } from 'react'
import styles from './ProductList.module.scss'
import { BsFillGridFill } from 'react-icons/bs'
import { FaListAlt } from 'react-icons/fa'
import Search from '../../search/Search'
import ProductItem from '../productItem/ProductItem'
import { useDispatch, useSelector } from 'react-redux'
import { FILTER_BY_SEARCH, SORT_PRODUCTS, selectFilteredProducts } from '../../../redux/slice/filterSlice'
import Pagination from '../../pagination/Pagination'

const ProductList = ({ products }) => {
    const [grid, setGrid] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("latest");
    const filteredProducts = useSelector(selectFilteredProducts)

    const dispatch = useDispatch()

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(6);
    // Get Current Product
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProduct = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Trigger for search function
    // useEffect(() => {
    //     dispatch(FILTER_BY_SEARCH({ products, search }))
    // }, [dispatch, products, search])

    useEffect(() => {
        dispatch(SORT_PRODUCTS({ products, sort }))
    }, [dispatch, products, sort])

    const searchHanlder = () => {
        dispatch(FILTER_BY_SEARCH({ products, search }))
    };

    return (
        <div className={styles["product-list"]} id='product'>
            <div className={styles.top}>
                <div className={styles.icons}>
                    <BsFillGridFill size={22} color='orangered' onClick={() => setGrid(true)} />
                    <FaListAlt size={24} color='#0066d4' onClick={() => setGrid(false)} />
                    <p>
                        <b>{filteredProducts.length}</b> Products found.
                    </p>
                </div>
                {/* Search Icon */}
                <div className={styles.icons}>
                    <Search value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button className='--btn --btn-primary' onClick={searchHanlder}>Search</button>
                </div>
                {/* Sort icon */}
                <div className={styles.sort}>
                    <label>Sort by:</label>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="latest">Latest</option>
                        <option value="lowest-price">Lowest Price</option>
                        <option value="highest-price">Highest Price</option>
                        <option value="a-z">Ascending</option>
                        <option value="z-a">Descending</option>
                    </select>
                </div>
            </div>

            <div className={grid ? `${styles.grid}` : `${styles.list}`}>
                {filteredProducts.length === 0 ? (
                    <p>No Product Found</p>
                ) : (
                    <>
                        {currentProduct.map((product) => {
                            return (
                                <div key={product.id}>
                                    <ProductItem
                                        {...product}
                                        grid={grid}
                                        product={product}
                                    />
                                </div>
                            )
                        })}
                    </>
                )}
            </div>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                productsPerPage={productsPerPage}
                totalProducts={filteredProducts.length}
            />
        </div>
    )
}

export default ProductList