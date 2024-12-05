"use server"

import {InputType, ReturnType} from "@/actions/delete-card/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {createSafeAction} from "@/lib/create-safe-action";
import {DeleteCard} from "@/actions/delete-card/schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = await auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id, boardId } = data

    let card

    try {
        card = await db.card.delete({
            where: {
                id,
                list: {
                    board: {
                        orgId
                    }
                }
            }
        })
    } catch {
        return {
            error: "Failed to delete"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return { data: card }
}

export const deleteCard = createSafeAction(DeleteCard, handler)