"use server"

import {InputType, ReturnType} from "@/actions/create-list/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {createSafeAction} from "@/lib/create-safe-action";
import {CreateList} from "@/actions/create-list/schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = await auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { title, boardId } = data
    let list

    try {
        const board = await db.board.findUnique({
            where: {
                id: boardId,
                orgId
            }
        })

        if (!board) {
            return {
                error: "Board not found"
            }
        }

        const lastList = await db.list.findFirst({
            where: {
                boardId: boardId
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order: true
            }
        })

        const newOrder = lastList ? lastList.order + 1 : 1

        list = await db.list.create({
            data: {
                title,
                boardId,
                order: newOrder
            }
        })
    } catch {
        return {
            error: "Failed to update"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data: list}
}

export const createList = createSafeAction(CreateList, handler)