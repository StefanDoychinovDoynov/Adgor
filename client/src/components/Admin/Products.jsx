import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        id: '',
        imagePath: '',
        name: '',
        price: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const getProducts = async () => {
            const response = await axios.get(URL + "/products");
            setProducts(response.data);
        };

        getProducts();
    }, []);

    // Handles the change in the input fields for the new product
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    // Handles the image file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Handles the change for editing existing products
    const handleEditProductChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = [...products];
        updatedProducts[index] = { ...updatedProducts[index], [name]: value };
        setProducts(updatedProducts);
    };

    const addProduct = async () => {
        newProduct.id = uuidv4();

        try {
            const formData = new FormData();
            if (selectedFile) {
                formData.append("image", selectedFile);
                const response = await axios.post(URL + "/image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                newProduct.imagePath = URL + "/image?name=" + response.data.image;
                console.log(newProduct.imagePath);

                setProducts([...products, newProduct]);
                setNewProduct({ id: '', imagePath: '', name: '', price: '' });
            } else {
                alert("No file selected for upload.");
            }
        } catch(err) {
            alert(err);
        }
    };

    const saveProducts = async () => {
        try {
            await axios.post(URL + "/products/edit", {
                newProducts: products
            });
            alert("Successfully saved products");
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div>
            <h2>Products</h2>

            <button onClick={saveProducts}>Save</button>
            <br />
            <br />

            {/* Rendering existing products with editable fields */}
            {products.length > 0 ? products.map((item, index) => (
                <div key={index}>
                    <label>
                        Image URL:
                        <input
                            type="text"
                            name="imagePath"
                            value={item.imagePath}
                            onChange={(e) => handleEditProductChange(index, e)}
                        />
                    </label>
                    <br />
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={item.name}
                            onChange={(e) => handleEditProductChange(index, e)}
                        />
                    </label>
                    <br />
                    <label>
                        Price:
                        <input
                            type="text"
                            name="price"
                            value={item.price}
                            onChange={(e) => handleEditProductChange(index, e)}
                        />
                    </label>
                    <br />
                    {item.imagePath && (
                        <img alt={item.name} src={item.imagePath} style={{ width: "100px" }} />
                    )}
                </div>
            )) : <div>No Products</div>}

            {/* Form to add new product */}
            <div>
                <h3>Add New Product</h3>
                <form>
                    <label>
                        Choose Image:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                    <br />
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Price:
                        <input
                            type="text"
                            name="price"
                            value={newProduct.price}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <button type="button" onClick={addProduct}>Add Product</button>
                </form>
            </div>
        </div>
    );
};

export default Products;