"use server"

import {InputType, ReturnType} from "@/actions/update-list/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {createSafeAction} from "@/lib/create-safe-action";
import {UpdateList} from "@/actions/update-list/schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = await auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { title, id, boardId } = data
    let list

    try {
        list = await db.list.update({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            },
            data: {
                title
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

export const updateList = createSafeAction(UpdateList, handler)