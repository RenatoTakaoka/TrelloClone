"use client"

import {List} from "@prisma/client";
import {useState, useRef, ElementRef} from "react";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

interface ListHeaderProps {
    data: List
}

export const ListHeader = ({data}: ListHeaderProps) => {
    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)

    const enableEditing = () => {
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
        })
    }

    const disableEditing = () => {
        setIsEditing(false)
    }

    return (
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start
        gap-x-2">
            <div className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
                {title}
            </div>
        </div>
    )
}