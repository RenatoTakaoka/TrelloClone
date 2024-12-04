"use server"

import {InputType, ReturnType} from "@/actions/copy-list/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {createSafeAction} from "@/lib/create-safe-action";
import {CopyList} from "@/actions/copy-list/schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = await auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id, boardId } = data

    let list

    try {
        const listToCopy = await db.list.findFirst({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            },
            include: {
                cards: true
            }
        })

        if (!listToCopy) {
            return {
                error: "List not found"
            }
        }

        const lastList = await db.list.findFirst({
            where: {boardId},
            orderBy: {order: "desc"},
            select: {order: true}
        })

        const newOrder = lastList ? lastList.order + 1 : 1

        list = await db.list.create({
            data: {
                boardId: listToCopy.boardId,
                title: `${listToCopy.title} - Copy`,
                order: newOrder,
                cards: {
                    createMany: {
                        data: listToCopy.cards.map(card => ({
                            title: card.title,
                            description: card.description,
                            order: card.order
                        }))
                    }
                }
            },
            include: {
                cards: true
            }
        })
    } catch {
        return {
            error: "Failed to copy"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return { data: list }
}

export const copyList = createSafeAction(CopyList, handler)