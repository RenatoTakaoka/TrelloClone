"use server"

import {InputType, ReturnType} from "@/actions/delete-board/types";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {revalidatePath} from "next/dist/server/web/spec-extension/revalidate";
import {createSafeAction} from "@/lib/create-safe-action";
import {DeleteBoard} from "@/actions/delete-board/schema";
import {redirect} from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = await auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id } = data

    try {
        await db.board.delete({
            where: {
                id,
                orgId,
            },
        })
    } catch {
        return {
            error: "Failed to delete"
        }
    }

    revalidatePath(`/organization/${orgId}`)
    redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeAction(DeleteBoard, handler)