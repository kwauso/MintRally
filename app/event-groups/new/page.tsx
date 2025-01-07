"use client"

import {createEventGroup} from "../../lib/data";
import {useState} from "react";

export default function Page() {
    /*
    async function FormToCreate(formData) {
        const groupName:string = await formData.get("groupName");
        const masterName:string = await formData.get("masterName");
        console.log(groupName);
        console.log(masterName);
    }

     */
    const [groupName, setGroupName] = useState("");
    const [masterName, setMasterName] = useState("");
    return (
        <>
            <h1>Your are in event-groups/new</h1>
            <form>
                <input name="groupName" type="text" placeholder="Group Name"
                onChange={(e) => setGroupName(e.target.value)} />
                <input name="masterName" type="text" placeholder="Master Name"
                onChange={(e) => setMasterName(e.target.value)} />
                <button type="submit" onClick={() => {createEventGroup("groupName", "masterName")}}>submit</button>
            </form>
        </>
    );
}