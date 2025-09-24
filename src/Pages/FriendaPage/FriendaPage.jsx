import { useEffect, useState } from 'react';
import styles from './Pokemon.module.css';
import set1 from '../../db/pokemon-set1.json';
import set2 from '../../db/pokemon-set2.json';
import set3 from '../../db/pokemon-set3.json';
import set4 from '../../db/pokemon-set4.json';
import set5 from '../../db/pokemon-set5.json';
import wonderpicks from '../../db/pokemon-wonderpicks.json';
import besttag1 from '../../db/pokemon-besttag1.json';
import FriendaCard from './FriendaCard';

const emblems = [...set1, ...set2, ...set3, ...set4, ...set5, ...besttag1, ...wonderpicks];

function FriendaPage() {
  const [searchString, setSearchString] = useState("");
  const [setSelection, setSetSelection] = useState(set1);
  const [setSelectionValue, setSetSelectionValue] = useState("1");
  const [OwnedStatus, setOwnedStatus] = useState("both");
  const [emblemEncode, setEmblemEncode] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressSetFilter, setProgressSetFilter] = useState("1");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [ownedEmblems, setOwnedEmblems] = useState(() => {
    const stored = localStorage.getItem('friendaEncode');
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
    localStorage.setItem('friendaEncode', encoded);
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
    const rarityLevels = ["2", "3", "4", "5"];
    const progressByRarity = [];
  
    let overallOwned = 0;
    let overallTotal = 0;
  
    rarityLevels.forEach((rarity) => {
      const filtered = emblems.filter((e) => {
        let waveSetFilter = false;

        switch(setFilter) {
            case "1":
                waveSetFilter = e.set === "1" && e.setWave === "1" && !e.number.includes("W");
                break;
            case "2":
                waveSetFilter = e.set === "2" && e.setWave === "1" && !e.number.includes("W");
                break;
            case "3":
                waveSetFilter = e.set === "3" && e.setWave === "1" && !e.number.includes("W");
                break;
            case "4":
                waveSetFilter = e.set === "4" && e.setWave === "1" && !e.number.includes("W");
                break;
            case "5":
                waveSetFilter = e.set === "5" && e.setWave === "1" && !e.number.includes("W");
                break;
            case "6":
                waveSetFilter = e.set === "1" && e.setWave === "2" && !e.number.includes("W");
                break;
            case "7":
                waveSetFilter = e.number.includes("W"); 
                break;
        }

        console.log(e.set === "1")
        const matchesSet = waveSetFilter;
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
    
    return {
      rarities: progressByRarity,
      overall: {
        owned: overallOwned,
        total: overallTotal,
        percent: overallPercent,
      },
    };
  }  

  function updateSetSelection(selection) {
        switch(selection) {
            case "1":
                setSetSelectionValue("1");
                setSetSelection(set1);
                break;
            case "2":
                setSetSelectionValue("2");
                setSetSelection(set2);
                break;
            case "3":
                setSetSelectionValue("3");
                setSetSelection(set3);
                break;
            case "4":
                setSetSelectionValue("4");
                setSetSelection(set4);
                break;
            case "5":
                setSetSelectionValue("5");
                setSetSelection(set5);
                break;
            case "6":
                setSetSelectionValue("6");
                setSetSelection(besttag1);
                break;
            case "7":
                setSetSelectionValue("7");
                setSetSelection(wonderpicks);
                break;
        }
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
                    value={setSelectionValue}
                    onChange={(e) => updateSetSelection(e.target.value)}
                    className={styles["filter-dropdown"]}
                  >
                    <option value="1">Set 1-1</option>
                    <option value="2">Set 1-2</option>
                    <option value="3">Set 1-3</option>
                    <option value="4">Set 1-4</option>
                    <option value="5">Set 1-5</option>
                    <option value="6">Set 2-1</option>
                    <option value="7">Wonder Picks</option>
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
                  <label htmlFor="orderBy" className={styles["filter-label"]}>Order By:</label>
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
                  <label htmlFor="rarity" className={styles["filter-label"]}>Star Rarity:</label>
                  <select
                    name="rarity"
                    id="rarity"
                    value={rarityFilter}
                    onChange={(e) => setRarityFilter(e.target.value)}
                    className={styles["filter-dropdown"]}
                  >
                    <option value="all">All</option>
                    <option value="5">5★</option>
                    <option value="4">4★</option>
                    <option value="3">3★</option>
                    <option value="2">2★</option>
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
                <option value="1">Set 1-1</option>
                <option value="2">Set 1-2</option>
                <option value="3">Set 1-3</option>
                <option value="4">Set 1-4</option>
                <option value="5">Set 1-5</option>
                <option value="6">Set 2-1</option>
                <option value="7">Wonder Picks</option>
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
                    rarity === 5 || rarity === 4
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
          setSelection.filter((e) => {
          
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
          
            const matchesRarity = rarityFilter === "all" ? true : e.rarity === Number(rarityFilter);
          
            return matchesSearch && matchesOwned() && matchesRarity;
          })
          
        ).map((e) => (
          <FriendaCard
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

export default FriendaPage;