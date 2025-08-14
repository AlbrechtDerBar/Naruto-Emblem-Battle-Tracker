// App.js
import { useEffect, useState } from 'react';
import './App.css';
import EmblemCard from './Components/EmblemCard';
import emblems from './emblems';

function App() {
  const [searchString, setSearchString] = useState("");
  const [setSelection, setSetSelection] = useState("both");

  const [ownedEmblems, setOwnedEmblems] = useState(() => {
    const stored = localStorage.getItem('ownedEmblems');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('ownedEmblems', JSON.stringify(ownedEmblems));
  }, [ownedEmblems]);

  const toggleOwned = (id) => {
    setOwnedEmblems((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search by name, tag, or ID"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />
      <select
        name="set"
        id="set"
        value={setSelection}
        onChange={(e) => setSetSelection(e.target.value)}
      >
        <option value="both">Both</option>
        <option value="1">Set 1</option>
        <option value="2">Set 2</option>
      </select>

      <div className="card-list">
        {emblems
          .filter((e) => {
            const matchesSet =
              setSelection === "both" ? true : e.setNumber === Number(setSelection);

            const query = searchString.toLowerCase();

            const matchesSearch =
              e.name.toLowerCase().includes(query) ||
              e.id.toLowerCase().includes(query) ||
              e.tags.some((tag) => tag.toLowerCase().includes(query));

            return matchesSet && matchesSearch;
          })
          .map((e) => (
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
