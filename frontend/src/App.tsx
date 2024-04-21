import { useState } from "react";
import { LoginForm } from "./components/loginForm/LoginForm";
import { UserProfile } from "./components/UserProfile";
import { RegisterForm } from "./components/registrationForm/RegistrationForm";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import RootLayOut from "./components/rootlayout/RootLayOut";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/categoryPage/CategoryPage";
import CreateStorePage from "./pages/CreateStorePage";
import ChangePassword from "./pages/ChangePasswordPage";
import { AddressForm } from "./components/AddressForm/AddressForm";
import { EditItemForm } from "./components/editItem/EditItemForm";
import Create_item from "./pages/CreateItemPage";
import { CreateItemForm } from "./components/createItem/CreateItemForm";
import { EditProfilePage } from "./components/editProfile/EditProfilePage";
import { PurchaseHistoryPage } from "./components/purchaseHistory/PurchaseHistoryPage";
import { ChooseStorePage } from "./components/ChooseStorePage/ChooseStorePage";
import { StorePage } from "./components/storePage/StorePage";
import { ItemsPage } from "./components/itemPage/ItemsPage";
import { OrdersPage } from "./components/orderPage/OrdersPage";
import { RevenuesPage } from "./components/revenuesPage/RevenuesPage";
import { AddManagerPage } from "./components/AddManagerPage/AddManagerPage";
import { ManagersPage } from "./components/managePage/ManagersPage";
import { UsersPage } from "./components/userPage/UsersPage";
import { CreateDiscountPage } from "./components/createDiscount/CreateDiscountPage";

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
          { path: "/createstore", element: <CreateStorePage /> },             // dialog - DONE
          { path: "/changepassword", element: <ChangePassword /> },           // dialog - DONE
          { path: "/changeaddress", element: <AddressForm /> },               // dialog
          { path: "/edititem", element: <EditItemForm /> },                   // dialog
          { path: "/createitem", element: <CreateItemForm /> },               // dialog
          { path: "/editprofile", element: <EditProfilePage /> },             // while hovering user in navbar
          { path: "/purchasehistory", element: <PurchaseHistoryPage /> },     // page - while hovering user in navbar
          { path: "/choosestore", element: <ChooseStorePage /> },             // page - list of cards - shops i manage and shops i own - use mui card
          { path: "/store", element: <StorePage /> },                         // dialog
          { path: "/items", element: <ItemsPage /> },                         // page
          { path: "/orders", element: <OrdersPage /> },                       // page
          { path: "/revenues", element: <RevenuesPage /> },                   // page
          { path: "/addmanager", element: <AddManagerPage /> },               // dialog
          { path: "/managers", element: <ManagersPage /> },                   // page
          { path: "/users", element: <UsersPage /> },                         // page
          { path: "/discount", element: <CreateDiscountPage /> },             // page - list of card of all discounted and edit/remove/create a discount  - DONE






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
