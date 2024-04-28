import { useEffect, useState } from "react";

interface UserProfileProps {
  setUserToken: (userId: string | null) => void;
}

export function UserProfile({ setUserToken }: UserProfileProps) {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetch(`/users/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    })
      .then((response) => response.json())
      .then((data) => setUserData(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");

    setUserToken(null);
  };

  if (userData) {
    return (
      <div>
        <h2>Current User</h2>
        <p>Username: {userData.username}</p>
        <p>Email: {userData.email}</p>
        <p>Age: {userData.age}</p>
        <p>Role: {userData.role}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  } else {
    return <h2>Loading...</h2>;
  }
}