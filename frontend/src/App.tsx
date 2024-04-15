import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { UserProfile } from "./components/UserProfile";
import { RegistrationForm } from "./components/RegistrationForm";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const BACKEND_URL = "http://127.0.0.1:5000";

export default function App() {
  const [userToken, setUserToken] = useState<string | null>(null);

  return (
    <div>

      <LoginPage></LoginPage>
      {/* <RegisterPage></RegisterPage> */}
      {/* <h1>Login example</h1>
      <p>If something is not working for you, try clearing local storage and reloading</p>
      <p>Token: {localStorage.getItem("access_token")}</p>
      {userToken ? <UserProfile setUserToken={setUserToken} /> : <LoginForm setUserToken={setUserToken} />}
      <RegistrationForm setUserToken={setUserToken} /> */}
    </div>
  );
}