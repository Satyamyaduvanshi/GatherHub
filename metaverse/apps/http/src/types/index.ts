import z from "zod";

//----------  Auth Schema  ---------------------------------------------

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["user","admin"])
})

export const SigninSchema = z.object({
    email: z.string().email(),
    passwrod: z.string().min(8)
})

//------- Metadata Schema ------------------------------------------------

export const UpdateMetadataSchema = z.object({
    avatarId: z.string()
})

//--------- Space Schema  ----------------------------------------------

export const CreateSpaceSchema = z.object({
    name: z.string(),
    // custom function for dimesion
    dimension: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId: z.string()
})

//------- Element Schema ---------------------------------------------------------

export const AddElementSchema = z.object({
    spaceId: z.string(),
    elementId: z.string(),
    x: z.number(),
    y: z.number()
})

export const CreateELementSchema = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    static: z.boolean()
})

export const UpdateElementSchema = z.object({
    imageUrl: z.string()
})

//----------- Avatar Schema --------------------------------------------

export const CreateAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string()
})

//------------ Map Schema -------------------------------------

export const CreateMapSchema = z.object({
    thumbnail: z.string(),
    dimension: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number()
    }))
})