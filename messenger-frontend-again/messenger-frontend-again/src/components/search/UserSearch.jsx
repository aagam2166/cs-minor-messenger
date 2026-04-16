import { useEffect, useState } from "react";
import { getUserByUsernameRequest } from "../../backend/user";

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [results,setResults] = useState();

 useEffect(() => {
  if (!query.trim()) {
    setResults([]);
    return;
  }

  const timer = setTimeout(() => {
    searchUsersRequest(query)
      .then((res) => {
        setResults(res.data.data || []);
      })
      .catch(() => {
        setResults([]);
      });
  }, 300);

  return () => clearTimeout(timer);
}, [query]);



  return (
    <div>
      <input
        type="text"
        placeholder="Search users…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
     <ul>
  {Array.isArray(results) &&
    results.map((user) => (
      <li key={user._id}>{user.username}</li>
    ))}
</ul>


    </div>
  );
}
