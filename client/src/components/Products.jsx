import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { MenuSections } from './Page';

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const GetProducts = async () => {
            const response = await axios.get(URL + "/products");
            setProducts(response.data);
        }
        
        GetProducts();
    }, []);

    return (
        <div>
            <MenuSections />
            <h1 id='title'>Products</h1>
            {products == false ? <div>Products coming soon</div> : products.map((item) => (
                <div key={item.id}>
                    {item.imagePath && (
                        <img alt="" src={item.imagePath} width="250px"></img>
                    )}
                    {item.name && (
                        <h2>{item.name}</h2>
                    )}
                    {item.price && (
                        <h3>{item.price}</h3>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Products
