import React from "react";
import { Button } from "react-bootstrap"
import DummyPOHService from "./services/DummyPOHService";

export default function DummyPOHController(props: IBaseHumanitweetProps) {

    const handleRegisterHumanClicked = async () => {
        await DummyPOHService.registerHuman(props.appState.account, props.drizzle);
        console.log("REGISTERED");
    }

    return(<div>
        <Button onClick={handleRegisterHumanClicked}>Register as Human</Button>
    </div>)
}