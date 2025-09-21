import { useEffect, useState } from 'react';
import './App.css';
import EmblemCard from './Components/EmblemCard';
import emblems from './emblems';

function App() {
  const [searchString, setSearchString] = useState("");
  const [setSelection, setSetSelection] = useState("both");
  const [OwnedStatus, setOwnedStatus] = useState("both");
  const [emblemEncode, setEmblemEncode] = useState(""); // Base64 encoded string
  const [ownedEmblems, setOwnedEmblems] = useState(() => {
    const stored = localStorage.getItem('emblemEncode');
    if (stored) {
      setEmblemEncode(stored);
      return decodeEmblems(stored);
    }
    return [];
  });

  const [orderBy, setOrderBy] = useState("id");  // New state for sorting

  useEffect(() => {
    const encoded = encodeEmblems();
    localStorage.setItem('emblemEncode', encoded);
    setEmblemEncode(encoded);
  }, [ownedEmblems]);

  const toggleOwned = (id) => {
    setOwnedEmblems((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  function breakIntoChunks(str, chunkSize) {
    const chunks = [];
    
    // Loop through the string, incrementing by chunkSize each time
    for (let i = 0; i < str.length; i += chunkSize) {
      chunks.push(str.slice(i, i + chunkSize)); // Slice the string into chunks
    }
  
    return chunks;
  }

  function encodeEmblems() {
    let emblemsBin = "";
    for (const emblem of emblems) {
      emblemsBin = ownedEmblems.includes(emblem.id) ? "1" + emblemsBin : "0" + emblemsBin;
    }
    return binaryToBase64(emblemsBin);
  }

  function binaryToBase64(binary) {
    let paddedBinary = binary.padStart(Math.ceil(binary.length / 6) * 6, '0');
    const base64Chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
    let base64 = [];
    let chunks = breakIntoChunks(paddedBinary, 6);
    chunks.forEach(chunk => {
      let decimal = parseInt(chunk, 2);
      base64.push(base64Chars[decimal]);
    })

    const firstChar = base64.findIndex(item => item !== "0");

    console.log(base64.slice(firstChar).join(""))
    return base64.slice(firstChar).join("") || '0';
  }

  function base64ToBinary(base64) {
    const base64Chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
    const chunks = breakIntoChunks(base64, 1); // Split the base64 string into 1-character chunks
    let binary = [];
  
    chunks.forEach(char => {
      let decimal = base64Chars.indexOf(char); // Find the index of the base64 character
      if (decimal === -1) return; // Ignore any invalid characters (padding or non-base64)
      
      let bin = decimal.toString(2).padStart(6, '0'); // Convert decimal to binary, ensuring 6 bits
      binary.push(bin);
    });
  
    return binary.join("");
  }

  function decodeEmblems(encoded) {
    const binary = base64ToBinary(encoded);
    const reversedBinary = binary.split('').reverse().join('');
    const updatedOwnedEmblems = [];
    for (let i = 0; i < reversedBinary.length; i++) {
      console.log(emblems[i])
      if (reversedBinary[i] === '1') updatedOwnedEmblems.push(emblems[i]?.id);
    }
    return updatedOwnedEmblems;
  }

  const handleEmblemEncodeChange = (e) => {
    const value = e.target.value;
    setEmblemEncode(value);
  };

  const handleSaveEncodedValue = () => {
    try {
      const decodedEmblems = decodeEmblems(emblemEncode);
      setOwnedEmblems(decodedEmblems);
    } catch (error) {
      console.error('Invalid base64 string:', error);
    }
  };

  // Sorting function based on the selected "Order By" value
  function extractNumericId(id) {
    const parts = id.split('-'); // Split the ID at the dash
    return parts.map(part => parseInt(part, 10)); // Convert each part to a number
  }
  
  const sortEmblems = (filteredEmblems) => {
    switch (orderBy) {
      case "id":
        return filteredEmblems.sort((a, b) => {
          const aIdParts = extractNumericId(a.id);
          const bIdParts = extractNumericId(b.id);
          
          for (let i = 0; i < Math.min(aIdParts.length, bIdParts.length); i++) {
            if (aIdParts[i] !== bIdParts[i]) {
              return aIdParts[i] - bIdParts[i]; // Compare by number, not lexicographically
            }
          }
          return aIdParts.length - bIdParts.length; // Handle case where one ID is a prefix of the other
        });
      case "reverseId":
        return filteredEmblems.sort((a, b) => {
          const aIdParts = extractNumericId(a.id);
          const bIdParts = extractNumericId(b.id);
          
          for (let i = 0; i < Math.min(aIdParts.length, bIdParts.length); i++) {
            if (aIdParts[i] !== bIdParts[i]) {
              return bIdParts[i] - aIdParts[i]; // Reverse the comparison
            }
          }
          return bIdParts.length - aIdParts.length; // Handle case where one ID is a prefix of the other
        });
      case "alphabetical":
        return filteredEmblems.sort((a, b) => a.name.localeCompare(b.name));
      case "reverseAlphabetical":
        return filteredEmblems.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return filteredEmblems;
    }
  };

  return (
    <>
      <div id="filters" className="filters-container">
        <div className="filter-group">
          <label htmlFor="search" className="filter-label">Search:</label>
          <input
            type="text"
            id="search"
            placeholder="Search by name, tag, or ID"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group filter-group-inline">
          <div className="filter-item">
            <label htmlFor="set" className="filter-label">Set Number:</label>
            <select
              name="set"
              id="set"
              value={setSelection}
              onChange={(e) => setSetSelection(e.target.value)}
              className="filter-dropdown"
            >
              <option value="both">Both</option>
              <option value="1">Set 1</option>
              <option value="2">Set 2</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="owned" className="filter-label">Owned Status:</label>
            <select
              name="owned"
              id="owned"
              value={OwnedStatus}
              onChange={(e) => setOwnedStatus(e.target.value)}
              className="filter-dropdown"
            >
              <option value="both">Both</option>
              <option value="Owned">Owned</option>
              <option value="Unowned">Unowned</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="orderBy" className="filter-label">Order By:</label>
            <select
              name="orderBy"
              id="orderBy"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="filter-dropdown"
            >
              <option value="id">ID</option>
              <option value="reverseId">Reverse ID</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="reverseAlphabetical">Reverse Alphabetical</option>
            </select>
          </div>
        </div>

        

        <div className="filter-group">
          <label htmlFor="emblemEncode" className="filter-label">Emblem Collection ID:</label>
          <input
            type="text"
            id="emblemEncode"
            value={emblemEncode}
            onChange={handleEmblemEncodeChange}
            onBlur={handleSaveEncodedValue}
            className="filter-input"
            placeholder="Enter collection ID"
          />
        </div>
      </div>

      <div className="card-list">
        {sortEmblems(
          emblems
            .filter((e) => {
              const matchesSet =
                setSelection === "both" ? true : e.setNumber === Number(setSelection);

              const matchesOwned = () => {
                if (OwnedStatus === "both") return true;
                return OwnedStatus === "Owned"
                  ? ownedEmblems.includes(e.id)
                  : !ownedEmblems.includes(e.id);
              };

              const query = searchString.toLowerCase();

              const matchesSearch =
                e.name.toLowerCase().includes(query) ||
                e.id.toLowerCase().includes(query) ||
                e.tags.some((tag) => tag.toLowerCase().includes(query));

              return matchesSet && matchesSearch && matchesOwned();
            })
        ).map((e) => (
          <EmblemCard
            key={e.id}
            emblem={e}
            isOwned={ownedEmblems.includes(e.id)}
            toggleOwned={toggleOwned}
          />
        ))}
      </div>
    </>
  );
}

export default App;
