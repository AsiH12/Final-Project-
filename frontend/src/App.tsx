import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { UserProfile } from "./components/UserProfile";
import { RegisterForm } from "./components/RegistrationForm";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayOut from "./components/RootLayOut";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";

const BACKEND_URL = "http://127.0.0.1:5000";

export default function App() {
  const [userToken, setUserToken] = useState<string | null>(null);

  const handleRouter = () => {
    let router;
    router = createBrowserRouter([
      {
        path: "/",
        element: <RootLayOut />,
        children: [
          { path: "/", element: <Navigate to="/login" replace /> },
          { path: "/login", element: <LoginForm  setUserToken={setUserToken}/> },
          { path: "/register", element: <RegisterForm setUserToken={setUserToken} /> },
          { path: "/home", element: <HomePage /> },
          { path: "/categories/fashion", element: <CategoryPage name="Fashion"/> },
          { path: "/categories/Tech", element: <CategoryPage name="Tech"/> },
          { path: "/categories/fashion", element: <CategoryPage name="Lifestyle"/> },
          { path: "/categories/fashion", element: <CategoryPage name="Cars"/> },


          // { path: "*", element: <ErrorNotFoundPage /> },
        ],
      },
    ]);

    return router;
  }
  return (
    <div>
      {/* <p>Token: {localStorage.getItem("access_token")}</p> */}
      {/* {userToken ? (
        <UserProfile setUserToken={setUserToken} />
      ) : (
        <>
          <LoginForm setUserToken={setUserToken} />
          {/* <RegisterForm setUserToken={setUserToken} /> */}
        {/* </>
      )} */}

      <RouterProvider router={handleRouter()} />
    </div>
  );
}