import React from "react";
import RootLayOut from "../components/rootlayout/RootLayOut";
import { AddressForm } from "../components/AddressForm/AddressForm";

export default function CreateStorePage() {
    return (
        <div>
            <AddressForm></AddressForm>
            <RootLayOut></RootLayOut>
        </div>
    )
}


