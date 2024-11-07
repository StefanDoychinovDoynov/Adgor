import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MenuSections } from './Page';

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const Vouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedVouchers, setSelectedVouchers] = useState({});
    const [selectedProducts, setSelectedProducts] = useState({});
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const GetVouchers = async () => {
            const response = await axios.get(URL + "/vouchers");
            setVouchers(response.data);
        };

        const GetProducts = async () => {
            const response = await axios.get(URL + "/products");
            setProducts(response.data);
        };
        
        GetVouchers();
        GetProducts();
    }, []);

    const addVoucher = (voucher) => {
        setSelectedVouchers(prev => {
            const newQuantity = (prev[voucher.id]?.quantity || 0) + 1;
            return {
                ...prev,
                [voucher.id]: { ...voucher, quantity: newQuantity }
            };
        });
    };

    const addProduct = (product) => {
        setSelectedProducts(prev => {
            const newQuantity = (prev[product.id]?.quantity || 0) + 1;
            return {
                ...prev,
                [product.id]: { ...product, quantity: newQuantity }
            };
        });
    }

    const handleContinue = () => {
        setShowForm(true);
    };

    return (
        <div>
            <MenuSections />
            <h1 id='title'>Vouchers</h1>
            {vouchers.length === 0 ? <div>Vouchers coming soon</div> : vouchers.map((item) => (
                <div key={item.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
                    {item.imagePath && (
                        <img alt="" src={item.imagePath} width="250px"></img>
                    )}
                    {item.name && (
                        <h2>{item.name}</h2>
                    )}
                    {item.price && (
                        <h3>{item.price}</h3>
                    )}
                    <button onClick={() => addVoucher(item)}>
                        Add
                    </button>
                    {selectedVouchers[item.id]?.quantity > 0 && <p>Quantity: {selectedVouchers[item.id]?.quantity}</p>}
                </div>
            ))}

            <button onClick={handleContinue} style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}>
                Continue
            </button>

            {showForm && (
                <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ccc", backgroundColor: "#f9f9f9" }}>
                    <h2>Checkout Form</h2>
                    <form action="https://api.web3forms.com/submit" method="post">
                        <input type="hidden" name="access_key" value="218421e2-dd98-4307-b489-5748ec4d492e" />

                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" required /><br /><br />
                        
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required /><br /><br />

                        <label htmlFor="phone">Phone Number:</label>
                        <input type="tel" id="phone" name="phone" required /><br /><br />

                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" name="address" required /><br /><br />

                        <h3>Selected Vouchers:</h3>
                        <ul>
                            {Object.keys(selectedVouchers).map(voucherId => {
                                const voucher = selectedVouchers[voucherId];
                                return (
                                    <li key={voucherId}>
                                        {voucher.name} - Quantity: {voucher.quantity}
                                    </li>
                                );
                            })}
                        </ul>

                        <h3>Selected Products:</h3>
                        <ul>
                            {Object.keys(selectedProducts).map(productId => {
                                const product = selectedProducts[productId];
                                return (
                                    <li key={productId}>
                                        {product.name} - Quantity: {product.quantity}
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Hidden inputs to include the selected products in the form submission */}
                        {Object.keys(selectedVouchers).map(voucherId => {
                            const voucher = selectedVouchers[voucherId];
                            return (
                                <div key={voucherId}>
                                    <input type="hidden" name={voucher.name} value={`Quantity: ${voucher.quantity}`} />
                                </div>
                            );
                        })}

                        {/* Hidden inputs to include the selected products in the form submission */}
                        {Object.keys(selectedProducts).map(productId => {
                            const product = selectedProducts[productId];
                            return (
                                <div key={productId}>
                                    <input type="hidden" name={product.name} value={`Quantity: ${product.quantity}`} />
                                </div>
                            );
                        })}

                        {/* Custom Success Page Redirect */}
                        <input type="hidden" name="redirect" value={`${window.location.origin}/success`} />

                        <input type="submit" />
                    </form>
                </div>
            )}

            <h2>You will also like</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {products.map((product) => (
                    <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
                        {product.imagePath && (
                            <img alt="" src={product.imagePath} width="100%" />
                        )}
                        {product.name && (
                            <h3>{product.name}</h3>
                        )}
                        {product.price && (
                            <p>{product.price}</p>
                        )}

                        <button onClick={() => addProduct(product)}>
                            Add
                        </button>
                        {selectedProducts[product.id]?.quantity > 0 && <p>Quantity: {selectedProducts[product.id]?.quantity}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Vouchers;