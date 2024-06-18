import { useEffect, useState } from "react";
import { LoginForm } from "./components/loginForm/LoginForm";
import { RegisterForm } from "./components/registrationForm/RegistrationForm";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import RootLayOut from "./components/rootlayout/RootLayOut";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/categoryPage/CategoryPage";
import ChangePassword from "./pages/ChangePasswordPage";
import { EditProfilePage } from "./components/editProfile/EditProfilePage";
import { PurchaseHistoryPage } from "./components/purchaseHistory/PurchaseHistoryPage";
import { ChooseStorePage } from "./components/ChooseStorePage/ChooseStorePage";
import { ItemsPage } from "./components/itemPage/ItemsPage";
import { OrdersPage } from "./components/orderPage/OrdersPage";
import { ManagersPage } from "./components/managePage/ManagersPage";
import { CreateDiscountPage } from "./components/createDiscount/CreateDiscountPage";
import CartPage from "./components/CartPage";
import ErrorNotFound from "./pages/ErrorNotFound";
import { AddressForm } from "./components/AddressForm/AddressForm";

interface RouterProps {
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const handleRouter = ({ userToken, setUserToken }) => {
  let router;

  router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayOut />,
      children: [
        { path: "/", element: <Navigate to="/home" replace /> },
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
        { path: "/categories/tech", element: <CategoryPage name="Tech" /> },
        {
          path: "/categories/lifestyle",
          element: <CategoryPage name="LifeStyle" />,
        },
        { path: "/categories/cars", element: <CategoryPage name="Cars" /> },
        { path: "*", element: <ErrorNotFound /> },
      ],
    },
  ]);

  if (userToken !== null) {
    console.log("authorized");
    router = createBrowserRouter([
      {
        path: "/",
        element: <RootLayOut />,
        children: [
          { path: "/", element: <Navigate to="/home" replace /> },
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
            element: <CategoryPage name="LifeStyle" />,
          },
          { path: "/categories/Cars", element: <CategoryPage name="Cars" /> },
          { path: "/changepassword", element: <ChangePassword /> }, // dialog - DONE
          { path: "/changeaddress", element: <AddressForm /> }, // dialog - DONE
          {
            path: "/editprofile",
            element: (
              <EditProfilePage
                onChangePasswordClick={() => {}}
                onAddRemoveAddressClick={() => {}}
              />
            ),
          }, // while hovering user in navbar
          { path: "/purchasehistory", element: <PurchaseHistoryPage /> }, // page - while hovering user in navbar
          { path: "/choosestore", element: <ChooseStorePage /> }, // page - DONE
          {
            path: "/items/:shop_name",
            element: <ItemsPage ownerView={false} />,
          }, // page - DONE
          {
            path: "/orders/:shop_name",
            element: <OrdersPage ownerView={false} />,
          }, // page- DONE
          {
            path: "/managers/:shop_name",
            element: <ManagersPage ownerView={false} />,
          }, // page - DONE
          {
            path: "/discount/:shop_name",
            element: <CreateDiscountPage ownerView={false} />,
          }, // page - list of card of all discounted and edit/remove/create a discount  - HALF DONE
          { path: "/items", element: <ItemsPage ownerView={true} /> }, // page - DONE
          { path: "/orders", element: <OrdersPage ownerView={true} /> }, // page- DONE
          { path: "/managers", element: <ManagersPage ownerView={true} /> }, // page - DONE
          {
            path: "/discount",
            element: <CreateDiscountPage ownerView={true} />,
          }, // page - list of card of all discounted and edit/remove/create a discount  - HALF DONE
          { path: "/cart", element: <CartPage /> }, // dialog
          { path: "*", element: <ErrorNotFound /> },
        ],
      },
    ]);
  }

  return router;
};

export default function App() {
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for user token
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setUserToken(storedToken);
    }
  }, []);

  return (
    <div>
      <RouterProvider router={handleRouter({ userToken, setUserToken })} />
    </div>
  );
}
