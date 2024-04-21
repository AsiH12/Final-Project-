import React from "react";
import RootLayOut from "../components/RootLayOut";
import { StoreForm } from "../components/CreateStore";

export default function CreateStorePage() {
    return (
        <div>
            <StoreForm></StoreForm>
            <RootLayOut></RootLayOut>
        </div>
    )
}


