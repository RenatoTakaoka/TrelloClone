"use server"

import {InputType, ReturnType} from "./types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {createSafeAction} from "@/lib/create-safe-action";
import {CreateBoard} from "@/actions/create-board/schema";

const handler = async (data: InputType): Promise<ReturnType> => {

    const { userId } = await auth()

    if (!userId) {
        return {
            error: "Not authenticated"
        }
    }

    const { title } = data

    let board

    try {
        board = await db.board.create({
            data: {
                title,
            }
        })
    } catch {
        return {
            error: "Failed to connect"
        }
    }

    revalidatePath(`/board/${board.id}`)
    return { data: board }
}

export const createBoard = createSafeAction(CreateBoard, handler)