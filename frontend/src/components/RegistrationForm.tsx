import { useRef } from "react";

interface RegistrationFormProps {
  setUserToken: (userId: string | null) => void;
}

export function RegistrationForm({ setUserToken }: RegistrationFormProps) {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);

  const handleRegister = () => {
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const age = ageRef.current?.value || "";

    fetch(`/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email, age }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("access_token", data.access_token);
        setUserToken(data.access_token);
      })
      .catch((error) => alert("Error registering: " + error));
  };

  return (
    <div>
      <h2>Register</h2>
      <input type="text" name="username" placeholder="Username" ref={usernameRef} />
      <input type="password" name="password" placeholder="Password" ref={passwordRef} />
      <input type="email" name="email" placeholder="Email" ref={emailRef} />
      <input type="number" name="age" placeholder="Age" ref={ageRef} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}