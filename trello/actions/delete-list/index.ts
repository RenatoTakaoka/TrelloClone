"use server"

import {InputType, ReturnType} from "@/actions/delete-list/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {createSafeAction} from "@/lib/create-safe-action";
import {DeleteList} from "@/actions/delete-list/schema";
import {createAuditLog} from "@/lib/create-audit-log";
import {ACTION, ENTITY_TYPE} from "@prisma/client";

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
        list = await db.list.delete({
            where: {
                id,
                boardId,
                board: {
                    orgId
                },
            },
        })

        await createAuditLog({
            entityTitle: list.title,
            entityId: list.id,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.DELETE,
        })
    } catch {
        return {
            error: "Failed to delete"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return { data: list }
}

export const deleteList = createSafeAction(DeleteList, handler)