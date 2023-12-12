import { useEffect, useState } from 'react'
import styles from './ViewProducts.module.scss'
import { toast } from 'react-toastify'
import { deleteDoc, doc } from 'firebase/firestore'
import { db, storage } from '../../../firebase/config'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import Loader from '../../loader/Loader'
import { deleteObject, ref } from 'firebase/storage'
import Notiflix from 'notiflix'
import { useDispatch, useSelector } from 'react-redux'
import { STORE_PRODUCTS, selectProducts } from '../../../redux/slice/productSlice'
import useFetchCollection from '../../../customHooks/useFetchCollection'
import Search from '../../search/Search'
import { FILTER_BY_SEARCH, selectFilteredProducts } from '../../../redux/slice/filterSlice'
import Pagination from '../../pagination/Pagination'

const ViewProducts = () => {
  const dispatch = useDispatch()

  const [search, setSearch] = useState('')

  const { data, isLoading } = useFetchCollection("products");
  const products = useSelector(selectProducts);
  const filteredProducts = useSelector(selectFilteredProducts);

  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: data,
      })
    )
  }, [dispatch, data])

  const confirmDelete = (id, imageURL) => {
    Notiflix.Confirm.show(
      'Delete Product',
      'Are you sure you want to delete this product?',
      'Delete',
      'Cancel',
      function okCB() {
        deleteProduct(id, imageURL)
      },
      function cancelCB() {
        console.log('Cancelled')
      },
      {
        width: '320px',
        borderRadius: '3px',
        titleColor: 'red',
        okButtonBackground: 'red',
        cssAnimationStyle: 'zoom'
      }
    )
  }

  const deleteProduct = async (id, imageURL) => {
    try {
      await deleteDoc(doc(db, "products", id))
      const storageRef = ref(storage, imageURL)
      await deleteObject(storageRef)
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Handle Function search
  useEffect(() => {
    dispatch(FILTER_BY_SEARCH({ products, search }));
  }, [dispatch, products, search]);

  // Pagination
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(3);
  // Get Current Product
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProduct = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.table}>
        <h2>All Products</h2>
        <div className={styles.search}>
          <p>
            <b>5</b> Product found
          </p>
          <div className={styles.icons}>
            <Search value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        {currentProduct.length === 0 ? (
          <p>No Products Found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProduct.map((product, index) => {
                const { id, name, price, imageURL, category, } = product;
                return (
                  <tr key={id}>
                    <td>
                      {index + 1}
                    </td>
                    <td>
                      <img src={imageURL} alt={name} style={{ width: '100px' }} />
                    </td>
                    <td>
                      {name}
                    </td>
                    <td>
                      {category}
                    </td>
                    <td>
                      {`$${price}`}
                    </td>
                    <td className={styles.icons}>
                      <Link to={`/admin/add-products/${id}`}>
                        <FaEdit size={20} color="green" />
                      </Link>
                      &nbsp;
                      <FaTrashAlt size={18} color='red' onClick={() => confirmDelete(id, imageURL)} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
        />
      </div>
    </>
  )
}

export default ViewProducts