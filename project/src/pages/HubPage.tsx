import React, { useEffect, useState } from 'react';
import supabase from "../utils/supabase";
import MyHubLayout from '../components/hub/MyHubLayout';
import { Item } from '../types'; // Assuming Item is defined in types

const HubPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]); // State to store fetched items
  const [loading, setLoading] = useState<boolean>(true); // State for loading state
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetching items from Supabase when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase.from('items').select('*'); // Fetching all items
        if (error) throw error;
        setItems(data as Item[]); // Update state with fetched items
      } catch (error: any) {
        setError('Error fetching items: ' + error.message); // Handling any error
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchItems(); // Calling the function to fetch data
  }, []); // Empty dependency array ensures this runs once when the component mounts

  if (loading) return <div>Loading...</div>; // Show loading message if data is still being fetched
  if (error) return <div>{error}</div>; // Show error message if something went wrong

  return (
    <div>
      <MyHubLayout />
      <h1>Items List</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - {item.quantity} {item.unit}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HubPage;
