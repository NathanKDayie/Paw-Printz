import React, { useState, useEffect } from 'react';
import './Store.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get, set, update } from "firebase/database";
import { database } from "../firebaseConfig";
import goldCoin from '../assets/goldcoin.png';
import forestbg from '../assets/forestbg.png';
import umbcbg from '../assets/umbcbg.png';

const backgroundImages = {
  'forestbg.png': forestbg,
  'umbcbg.png': umbcbg
};

const Store = () => {
  const [coins, setCoins] = useState(0);
  const [user, setUser] = useState(null);
  const [background, setBackground] = useState(null);
  const [ownedItems, setOwnedItems] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      if (currUser) {
        setUser(currUser);
        const uid = currUser.uid;
        const userRef = ref(database, `users/${uid}`);
        const snap = await get(userRef);
        if (snap.exists()) {
          const data = snap.val();
          setCoins(data.coins || 0);
          setBackground(data.background || null);
          setOwnedItems(data.ownedBackgrounds || []);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handlePurchase = async (bg, cost) => {
    if (coins < cost) return alert("Not enough coins.");
    const updatedCoins = coins - cost;
    const newOwned = [...ownedItems, bg];
    await update(ref(database, `users/${user.uid}`), {
      coins: updatedCoins,
      ownedBackgrounds: newOwned,
      background: bg
    });
    setCoins(updatedCoins);
    setOwnedItems(newOwned);
    setBackground(bg);
    alert(`Purchased and equipped ${bg}`);
  };

  const handleEquip = async (bg) => {
    await set(ref(database, `users/${user.uid}/background`), bg);
    setBackground(bg);
    alert(`Equipped ${bg}`);
  };

  const handleRemove = async () => {
    await set(ref(database, `users/${user.uid}/background`), null);
    setBackground(null);
    alert("Background removed.");
  };

  return (
    <div className="store-container">
      <h1>Paw Printz Store</h1>
      <div className="user-coins">
        <img src={goldCoin} alt="coins" style={{ width: "30px" }} />
        <span>{coins}</span>
      </div>

      <ul className="store-items">
        {[
          { name: "UMBC Background", price: 500, file: "umbcbg.png" },
          { name: "Forest Background", price: 750, file: "forestbg.png" }
        ].map(({ name, price, file }) => (
          <li key={file} className="store-item">
            <span>{name}</span>
            <span>{price} coins</span>
            {ownedItems.includes(file) ? (
              background === file
                ? <button disabled>Equipped</button>
                : <button onClick={() => handleEquip(file)}>Equip</button>
            ) : (
              <button disabled={coins < price} onClick={() => handlePurchase(file, price)}>Buy & Equip</button>
            )}
          </li>
        ))}
        <li className="store-item">
          <span>Remove Background</span>
          <span>Free</span>
          <button onClick={handleRemove}>Remove</button>
        </li>
      </ul>

      {ownedItems.length > 0 && (
        <div>
          <h3>Inventory</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {ownedItems.map(bg => (
              <img key={bg} src={backgroundImages[bg]} alt={bg} style={{ width: '80px', borderRadius: '8px' }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
