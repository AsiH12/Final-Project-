import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { UserProfile } from "./components/UserProfile";
import { RegisterForm } from "./components/RegistrationForm";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import RootLayOut from "./components/RootLayOut";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import CreateStorePage from "./pages/CreateStorePage";
import ChangePassword from "./pages/ChangePasswordPage";
import { AddressForm } from "./components/AddressForm";
import { EditItemForm } from "./components/EditItemForm";
import Create_item from "./pages/CreateItemPage";
import { CreateItemForm } from "./components/CreateItemForm";
import { EditProfilePage } from "./components/EditProfilePage";
import { PurchaseHistoryPage } from "./components/PurchaseHistoryPage";
import { ChooseStorePage } from "./components/ChooseStorePage";
import { StorePage } from "./components/StorePage";
import { ItemsPage } from "./components/ItemsPage";
import { OrdersPage } from "./components/OrdersPage";
import { RevenuesPage } from "./components/RevenuesPage";
import { AddManagerPage } from "./components/AddManagerPage";
import { ManagersPage } from "./components/ManagersPage";
import { UsersPage } from "./components/UsersPage";
import { CreateDiscountPage } from "./components/CreateDiscountPage";

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
          {
            path: "/login",
            element: <LoginForm setUserToken={setUserToken} />,
          },
          {
            path: "/register",
            element: <RegisterForm setUserToken={setUserToken} />,
          },
          { path: "/home", element: <HomePage /> },
          {
            path: "/categories/fashion",
            element: <CategoryPage name="Fashion" />,
          },
          { path: "/categories/Tech", element: <CategoryPage name="Tech" /> },
          {
            path: "/categories/Lifestyle",
            element: <CategoryPage name="Lifestyle" />,
          },
          { path: "/categories/Cars", element: <CategoryPage name="Cars" /> },
          { path: "/createstore", element: <CreateStorePage /> },
          { path: "/changepassword", element: <ChangePassword /> },
          { path: "/changeaddress", element: <AddressForm /> },
          { path: "/edititem", element: <EditItemForm /> },
          { path: "/createitem", element: <CreateItemForm /> },
          { path: "/editprofile", element: <EditProfilePage /> },
          { path: "/purchasehistory", element: <PurchaseHistoryPage /> },
          { path: "/choosestore", element: <ChooseStorePage /> },
          { path: "/store", element: <StorePage /> },
          { path: "/items", element: <ItemsPage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/revenues", element: <RevenuesPage /> },
          { path: "/addmanager", element: <AddManagerPage /> },
          { path: "/managers", element: <ManagersPage /> },
          { path: "/users", element: <UsersPage /> },
          { path: "/discount", element: <CreateDiscountPage /> },






        ],
      },
    ]);

    return router;
  };
  return (
    <div>
      <RouterProvider router={handleRouter()} />
    </div>
  );
}
