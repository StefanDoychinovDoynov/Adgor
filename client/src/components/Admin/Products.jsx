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

    // Empty function for save button, you can fill it later with the save logic
    const addProduct = async () => {
        newProduct.id = uuidv4();
        setProducts([...products, newProduct]);
        setNewProduct({id: '', imagePath: '', name: '', price: ''});
    };
    
    const saveProducts = async () => {
        try {
            await axios.post(URL + "/products/edit", {
                newProducts: products
            });

            alert("Successfully saved products");
        } catch(err) {
            alert(err);
        }
    }

    return (
        <div>
            <h2>Products</h2>

            <button onClick={saveProducts}>Save</button>
            <br />
            <br />

            {/* Rendering existing products */}
            {products.length > 0 ? products.map((item, index) => (
                <div key={index}>
                    {item.imagePath && (
                        <img alt={item.name} src={item.imagePath} style={{ width: "100px" }} />
                    )}
                    {item.name && (
                        <h3>{item.name}</h3>
                    )}
                    {item.price && (
                        <h4>{item.price} lv</h4>
                    )}
                </div>
            )) : <div>No Products</div>}

            {/* Form to add new product */}
            <div>
                <h3>Add New Product</h3>
                <form>
                    <label>
                        Image URL:
                        <input
                            type="text"
                            name="imagePath"
                            value={newProduct.imagePath}
                            onChange={handleInputChange}
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
                    <button type="button" onClick={addProduct}>Save Product</button>
                </form>
            </div>
        </div>
    );
};

export default Products;