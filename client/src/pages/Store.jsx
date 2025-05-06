import React from 'react'; 
import './Store.css'; 

const Store = () => {
    return (
        <div className="store-container">
            <h1 className="store-title">Paw Printz Store</h1>
            <p className="store-description">Spend your points to unlock goodies for your pet!</p>

            <ul className="store-items">
                <li className="store-item">
                    <span className="item-name">UMBC Background</span>
                    <span className="item-price">500 points</span>
                </li>

                <li className="store-item">
                    <span className="item-name">Forest Background</span>
                    <span className="item-price">750 points</span>
                </li>

                <li className="store-item">
                    <span className="item-name">Chew toy</span>
                    <span className="item-price">1000 points</span>
                </li>
            </ul>
        </div>
    );
};

export default Store;
