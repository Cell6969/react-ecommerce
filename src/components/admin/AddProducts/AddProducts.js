import React, { useState } from 'react'
import styles from './AddProducts.module.scss'
import Card from '../../card/Card'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { db, storage } from '../../../firebase/config'
import { toast } from 'react-toastify'
import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore'
import Loader from '../../loader/Loader'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectProducts } from '../../../redux/slice/productSlice'

const categories = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Electronic' },
    { id: 3, name: 'Fashion' },
    { id: 4, name: 'Phone' },
]

const initialState = {
    name: "",
    imageURL: "",
    price: 0,
    category: "",
    brand: "",
    desc: "",
}

const AddProducts = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const products = useSelector(selectProducts);
    const productEdit = products.find((item) => item.id === id)

    const [product, setProduct] = useState(() => {
        const newState = detectForm(id,
            { ...initialState },
            productEdit
        )
        return newState
    })
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    function detectForm(id, f1, f2) {
        if (!id) {
            return f1;
        }
        return f2;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        const storageRef = ref(storage, `eShop/${Date.now()}${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress)
        },
            (error) => {
                toast.error(error.message)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        setProduct({ ...product, imageURL: downloadURL })
                        toast.success('Image successfully uploaded')
                    })
            }
        )
    }

    const addProducts = async (e) => {
        e.preventDefault()
        console.log(product)
        setIsLoading(true)
        try {
            const docRef = await addDoc(collection(db, 'products'), {
                name: product.name,
                imageURL: product.imageURL,
                price: Number(product.price),
                category: product.category,
                brand: product.brand,
                desc: product.desc,
                createdAt: Timestamp.now().toDate()
            })
            setIsLoading(false)
            setUploadProgress(0)
            setProduct({ ...initialState })
            toast.success('Product successfully added')
        } catch (error) {
            toast.error(error.message)
        }
    };

    const editProduct = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        if (product.imageURL !== productEdit.imageURL) {
            const storageRef = ref(storage, productEdit.imageURL)
            deleteObject(storageRef)
        }
        try {
            await setDoc(doc(db, 'products', id), {
                name: product.name,
                imageURL: product.imageURL,
                price: Number(product.price),
                category: product.category,
                brand: product.brand,
                desc: product.desc,
                createdAt: productEdit.createdAt,
                editedAt: Timestamp.now().toDate()
            });
            setIsLoading(false)
            toast.success('Update Successfully')
            navigate('/admin/all-products')
        } catch (error) {
            setIsLoading(false)
            toast.error(error.message);
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            <div className={styles.product}>
                <h1>{detectForm(id, "Add New Product", "Edit Product")}</h1>
                <Card className={styles.card}>
                    <form onSubmit={detectForm(id, addProducts, editProduct)}>
                        <label>Product name:</label>
                        <input
                            type='text'
                            placeholder='Product name'
                            required
                            name='name'
                            value={product.name}
                            onChange={(e) => handleInputChange(e)}
                        />

                        <label>Product image:</label>
                        <Card cardClass={styles.group}>
                            {uploadProgress === 0 ? null : (
                                <div className={styles.progress}>
                                    <div className={styles['progress-bar']} style={{ width: `${uploadProgress}%` }}>
                                        {uploadProgress < 100 ? `Uploading ${uploadProgress}%` : `Uploading Completed ${uploadProgress}%`}
                                    </div>
                                </div>
                            )}
                            <input
                                type='file'
                                placeholder='Product Image'
                                accept='image/*'
                                name='image'
                                onChange={(e) => handleImageChange(e)}
                            />

                            {product.imageURL === "" ? null : (
                                <input
                                    type='text'
                                    required
                                    name='imageURL'
                                    value={product.imageURL}
                                    disabled
                                />
                            )}
                        </Card>

                        <label>Product Price:</label>
                        <input
                            type='number'
                            placeholder='Product price'
                            required
                            name='price'
                            value={product.price}
                            onChange={(e) => handleInputChange(e)}
                        />

                        <label>Product Category:</label>
                        <select
                            required
                            name='category'
                            value={product.category}
                            onChange={(e) => handleInputChange(e)}
                        >
                            <option value="" disabled>
                                -- Choose product category
                            </option>
                            {categories.map((category) => {
                                return (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                )
                            })}
                        </select>

                        <label>Product Company/Brand:</label>
                        <input
                            type='text'
                            placeholder='Product brand'
                            required
                            name='brand'
                            value={product.brand}
                            onChange={(e) => handleInputChange(e)}
                        />

                        <label>Product description:</label>
                        <textarea
                            name='desc'
                            value={product.desc}
                            cols='30'
                            rows='10'
                            required
                            onChange={(e) => handleInputChange(e)}>

                        </textarea>
                        <button className='--btn --btn-primary' type='submit'>
                            {detectForm(id, "Save Product", "Edit Product")}
                        </button>
                    </form>
                </Card>
            </div>
        </>
    )
}

export default AddProducts