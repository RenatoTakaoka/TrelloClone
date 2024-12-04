"use server"

import {InputType, ReturnType} from "@/actions/update-list-order/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {createSafeAction} from "@/lib/create-safe-action";
import {UpdateListOrder} from "@/actions/update-list-order/schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = await auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { items, boardId } = data
    let lists

    try {
    
    } catch {
        return {
            error: "Failed to update"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data: list}
}

export const updateListOrder = createSafeAction(UpdateListOrder, handler)