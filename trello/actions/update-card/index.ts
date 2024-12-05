"use server"

import {InputType, ReturnType} from "@/actions/update-card/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {createSafeAction} from "@/lib/create-safe-action";
import {UpdateCard} from "@/actions/update-card/schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = await auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id, boardId, ...values } = data
    let card

    try {
        card = await db.card.update({
            where: {
                id,
                list: {
                    board: {
                        orgId
                    }
                },
            },
            data: {
                ...values
            }
        })
    } catch {
        return {
            error: "Failed to update"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data: card}
}

export const updateCard = createSafeAction(UpdateCard, handler)