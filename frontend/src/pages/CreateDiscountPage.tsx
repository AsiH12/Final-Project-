import React from "react";
import RootLayOut from "../components/rootlayout/RootLayOut";
import { CreateDiscountPage } from "../components/createDiscount/CreateDiscountPage";

export default function Managers_Page() {
    return (
        <div>
            <CreateDiscountPage></CreateDiscountPage>
            <RootLayOut></RootLayOut>
        </div>
    )
}


