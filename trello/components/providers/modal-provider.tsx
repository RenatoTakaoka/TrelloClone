"use client"

import {CardModal} from "@/components/modals/card-modal";
import {useEffect, useState} from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounterd] = useState(false)

    useEffect(() => {
        setIsMounterd(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <>
            <CardModal />
        </>
    )
}