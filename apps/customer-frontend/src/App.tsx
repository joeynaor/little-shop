import React, { useState } from 'react';
import './App.css';

interface Item {
  id?: number;
  name: string;
  price: number;
}

interface BoughtItem {
  username: string;
  userId: string;
  price: number;
  timestamp: string;
  itemName: string;
}

  function App() {
  const [boughtItems, setBoughtItems] = useState<BoughtItem[]>([]);
  const username = 'testuser';
  const userId = 'user123';
  const [showBoughtItemsTable, setShowBoughtItemsTable] = useState<boolean>(false);
  const items: Item[] = [
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 75 },
  ];

  const handleBuy = async (item: Item) => {
    const timestamp = new Date().toISOString();
    const purchaseData = {
      username,
      userId,
      price: item.price,
      timestamp,
      itemName: item.name,
    };

    try {
      const response = await fetch('http://localhost:3001/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });

      if (response.ok) {
        alert(`Successfully bought ${item.name}!`);
      } else {
        alert(`Failed to buy ${item.name}.`);
      }
    } catch (error) {
      console.error('Error buying item:', error);
      alert('An error occurred while trying to buy the item.');
    }
  };

  const handleShowBoughtItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/bought-items');
      if (response.ok) {
        const rawData: { message: string }[] = await response.json();
        const parsedData: BoughtItem[] = rawData.reduce((acc: BoughtItem[], rawItem) => {
          try {
            const parsedMessage = JSON.parse(rawItem.message);
            acc.push(parsedMessage);
          } catch (error) {
            // Skip this item if parsing fails
            console.error('Error parsing message:', rawItem.message, error);
          }
          return acc;
        }, []);
        setBoughtItems(parsedData);
        setShowBoughtItemsTable(true);
      } else {
        console.error('Failed to fetch bought items.');
        alert('Failed to fetch bought items.');
      }
    } catch (error) {
      console.error('Error fetching bought items:', error);
      alert('An error occurred while trying to fetch bought items.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Little Shop</h1>
        <div className="user-info">
          <p>Logged in as: {username} (ID: {userId})</p>
        </div>
        <div className="items-container">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <h2>{item.name}</h2>
              <p>${item.price}</p>
              <button onClick={() => handleBuy(item)}>Buy</button>
            </div>
          ))}
        </div>
        <button className="show-bought-button" onClick={handleShowBoughtItems}>
          Show Bought Items
        </button>

        {showBoughtItemsTable && (
          <div className="bought-items-table-container">
            <h2>Bought Items</h2>
            {boughtItems.length === 0 ? (
              <p>No items bought yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Username</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {boughtItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemName}</td>
                      <td>${item.price}</td>
                      <td>{item.username}</td>
                      <td>{new Date(item.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={() => setShowBoughtItemsTable(false)}>Close</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;