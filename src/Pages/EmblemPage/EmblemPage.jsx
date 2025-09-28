import { useEffect, useState } from 'react';
import styles from './Naruto.module.css';
import EmblemCard from './EmblemCard';
import emblems from '../../db/emblems';
import EmblemInfo from './EmblemInfo';

function EmblemPage() {
  const [searchString, setSearchString] = useState("");
  const [setSelection, setSetSelection] = useState("all");
  const [OwnedStatus, setOwnedStatus] = useState("both");
  const [emblemEncode, setEmblemEncode] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [displayInfo, setDisplayInfo] = useState(false);
  const [displayInfoID, setDisplayInfoID] = useState(0);
  const [progressSetFilter, setProgressSetFilter] = useState("all");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [ownedEmblems, setOwnedEmblems] = useState(() => {
    const stored = localStorage.getItem('emblemEncode');
    if (stored) {
      setEmblemEncode(stored);
      return decodeEmblems(stored);
    }
    return [];
  });

  const [orderBy, setOrderBy] = useState("id");  // New state for sorting

  const { rarities, overall } = getRarityProgress(progressSetFilter);


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

  function getRarityProgress(setFilter) {
    const rarityLevels = [1, 2, 3, 4, 5, 6];
    const progressByRarity = [];
  
    let overallOwned = 0;
    let overallTotal = 0;
  
    rarityLevels.forEach((rarity) => {
      const filtered = emblems.filter((e) => {
        const matchesSet =
          setFilter === "all" ? true : e.setNumber === Number(setFilter);
        return matchesSet && e.rarity === rarity;
      });
  
      const owned = filtered.filter((e) => ownedEmblems.includes(e.id));
  
      progressByRarity.push({
        rarity,
        owned: owned.length,
        total: filtered.length,
      });
  
      overallOwned += owned.length;
      overallTotal += filtered.length;
    });
  
    const overallPercent = overallTotal > 0 ? (overallOwned / overallTotal) * 100 : 0;
    
    console.log({
      owned: overallOwned,
      total: overallTotal,
      percent: overallPercent,
    })
    return {
      rarities: progressByRarity,
      overall: {
        owned: overallOwned,
        total: overallTotal,
        percent: overallPercent,
      },
    };
  }  

  function openEmblemInfo(id) {
    setDisplayInfo(!displayInfo);
    setDisplayInfoID(id);
  }

  function closeEmblemInfo() {
    setDisplayInfo(false);
    setDisplayInfoID(0);
  }

  return (
    <>
      <div id="filters" className={styles["filters-container"]}>
        <div className={styles["filters-header"]}>
          <button
            className={styles["filter-toggle"]}
            onClick={() => {
              if (showFilters) {
                setShowFilters(false);
              } else {
                setShowFilters(true);
                setShowProgress(false);
              }
            }}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <button
            className={styles["progress-toggle"]}
            onClick={() => {
              if (showProgress) {
                setShowProgress(false);
              } else {
                setShowProgress(true);
                setShowFilters(false);
              }
            }}
          >
            {showProgress ? "Hide Progress" : "Show Progress"}
          </button>
        </div>

        {showFilters && (
          <>
            {/* Filter form goes here (everything that was originally inside filters-container) */}
            <div id='filter-section'>
              <div className={styles["filter-group"]}>
                <label htmlFor="search" className={styles["filter-label"]}>Search:</label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name, tag, or ID"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  className={styles["filter-input"]}
                />
              </div>

              <div className={`${styles["filter-group"]}  ${styles["filter-group-inline"]}`}>
                <div className={styles["filter-item"]}>
                  <label htmlFor="set" className={styles["filter-label"]}>Set Number:</label>
                  <select
                    name="set"
                    id="set"
                    value={setSelection}
                    onChange={(e) => setSetSelection(e.target.value)}
                    className={styles["filter-dropdown"]}
                  >
                    <option value="all">All</option>
                    <option value="1">Set 1</option>
                    <option value="2">Set 2</option>
                    <option value="3">Set 3</option>
                  </select>
                </div>

                <div className={styles["filter-item"]}>
                  <label htmlFor="owned" className={styles["filter-label"]}>Owned Status:</label>
                  <select
                    name="owned"
                    id="owned"
                    value={OwnedStatus}
                    onChange={(e) => setOwnedStatus(e.target.value)}
                    className={styles["filter-dropdown"]}
                  >
                    <option value="both">Both</option>
                    <option value="Owned">Owned</option>
                    <option value="Unowned">Unowned</option>
                  </select>
                </div>

                <div className={styles["filter-item"]}>
                  <label htmlFor="orderBy" className={styles["filter-label"]}>Order:</label>
                  <select
                    name="orderBy"
                    id="orderBy"
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                    className={styles["filter-dropdown"]}
                  >
                    <option value="id">ID (Asc)</option>
                    <option value="reverseId">ID (Desc)</option>
                    <option value="alphabetical">A-Z</option>
                    <option value="reverseAlphabetical">Z-A</option>
                  </select>
                </div>

                <div className={styles["filter-item"]}>
                  <label htmlFor="rarity" className={styles["filter-label"]}>Rarity:</label>
                  <select
                    name="rarity"
                    id="rarity"
                    value={rarityFilter}
                    onChange={(e) => setRarityFilter(e.target.value)}
                    className={styles["filter-dropdown"]}
                  >
                    <option value="all">All</option>
                    <option value="6">6★</option>
                    <option value="5">5★</option>
                    <option value="4">4★</option>
                    <option value="3">3★</option>
                    <option value="2">2★</option>
                    <option value="1">1★</option>
                  </select>
                </div>
              </div>

              <div className={styles["filter-group"]}>
                <label htmlFor="emblemEncode" className={styles["filter-label"]}>Emblem Collection ID:</label>
                <div className={styles["input-with-button"]}>
                  <input
                    type="text"
                    id="emblemEncode"
                    value={emblemEncode}
                    onChange={handleEmblemEncodeChange}
                    onBlur={handleSaveEncodedValue}
                    className={styles["filter-input"]}
                    placeholder="Enter collection ID"
                  />
                  <button
                    type="button"
                    className={styles["copy-btn"]}
                    onClick={() => {
                      navigator.clipboard.writeText(emblemEncode)
                        .then(() => alert('Copied to clipboard!'))
                        .catch(() => alert('Failed to copy!'));
                    }}
                    aria-label="Copy emblem collection ID"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 24 24"
                      width="20"
                      fill="currentColor"
                    >
                      <path d="M0 0h24v24H0z" fill="none"/>
                      <path d="M16 1H8c-1.1 0-2 .9-2 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 
                              2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-2c0-1.1-.9-2-2-2zm0 
                              4h4v16H4V5h4v1h8V5zm-2-2v2H10V3h4z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}


        {showProgress && (
          <div className={styles["collection-progress"]}>
            <h3>Collection Progress</h3>

            <div className={styles["progress-filter"]}>
              <label htmlFor="progressSetFilter">View Set:</label>
              <select
                id="progressSetFilter"
                value={progressSetFilter}
                onChange={(e) => setProgressSetFilter(e.target.value)}
              >
                <option value="all">All Sets</option>
                <option value="1">Set 1</option>
                <option value="2">Set 2</option>
                <option value="3">Set 3</option>
              </select>
            </div>

            <div className={styles["rarity-progress"]}>
            <div className={`${styles["rarity-row"]}  ${styles["overall-progress"]}`}>
              <div className={styles["rarity-label"]}>
                <strong>All</strong>
              </div>
              <div className={styles["progress-bar-container"]}>
                <div
                  className={`${styles["progress-bar"]}  ${styles["overall-bar"]}`}
                  style={{ width: `${overall.percent}%` }}
                ></div>
              </div>
              <div className={styles["progress-text"]}>
                {overall.owned} / {overall.total} ({overall.percent.toFixed(1)}%)
              </div>
            </div>
              {rarities.map(({ rarity, owned, total }) => {
                const percent = total > 0 ? (owned / total) * 100 : 0;
                const starClass =
                  rarity === 6
                    ? "six-star"
                    : rarity === 5 || rarity === 4
                    ? "five-star"
                    : rarity === 3
                    ? "three-star"
                    : "two-star";

                return (
                  <div key={rarity} className={styles["rarity-row"]}>
                    <div className={styles["rarity-label"]}>
                      <strong>{rarity}★</strong>
                    </div>
                    <div className={styles["progress-bar-container"]}>
                      <div className={`${styles["progress-bar"]}  ${styles[`${starClass}`]}`} style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className={styles["progress-text"]}>
                      {owned} / {total} ({percent.toFixed(1)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className={styles["card-list"]}>
        {sortEmblems(
          emblems.filter((e) => {
            const matchesSet = setSelection === "all" ? true : e.setNumber === Number(setSelection);
          
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
          
            const matchesRarity = rarityFilter === "all" ? true : e.rarity >= Number(rarityFilter);
          
            return matchesSet && matchesSearch && matchesOwned() && matchesRarity;
          })
          
        ).map((e) => (
          <EmblemCard
            key={e.id}
            emblem={e}
            isOwned={ownedEmblems.includes(e.id)}
            toggleOwned={toggleOwned}
            openEmblemInfo={openEmblemInfo}
          />
        ))}
      </div>
      {
        displayInfo && 
        <EmblemInfo emblem={emblems.find((e) => e.id === displayInfoID)} closeEmblemInfo={closeEmblemInfo} />
      }
    </>
  );
}

export default EmblemPage;