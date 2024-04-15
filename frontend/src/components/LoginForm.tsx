import { useRef } from "react";

interface LoginFormProps {
  setUserToken: (userId: string | null) => void;
}

export function LoginForm({ setUserToken }: LoginFormProps) {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = () => {
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    fetch(`/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("access_token", data.access_token);
        setUserToken(data.access_token);
      })
      .catch((error) => alert("Error logging in: " + error));
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" name="username" placeholder="Username" ref={usernameRef} />
      <input type="password" name="password" placeholder="Password" ref={passwordRef} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
