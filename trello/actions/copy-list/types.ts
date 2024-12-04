import {z} from "zod";
import {ActionState} from "@/lib/create-safe-action";
import {List} from "@prisma/client";
import {CopyList} from "@/actions/copy-list/schema";

export type InputType = z.infer<typeof CopyList>
export type ReturnType = ActionState<InputType, List>