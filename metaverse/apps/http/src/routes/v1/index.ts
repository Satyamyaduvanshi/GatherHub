import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import {SigninSchema,SignupSchema} from "../../types/index"
import client from "@repo/db/client"


export const router = Router()


router.post("/signup",async(req,res)=>{

    const parsedData = SignupSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(403).json({
            message: "validation falied , try again with correct email and password",
            error: parsedData.error
        })
        return
    }
    const {email,password,type} = parsedData.data

    try {
        await client.user.create({
            data:{
                email,
                password: parsedData.data.password,
                type: parsedData.data.type === "admin" ? "admin" : "user",
            }
        })
        
    } catch (e) {
        res.status(400).json({
            message: "user already exists"
        })
    }
    res.json({
        message : "singup"
    })
})

router.post("/signin",(req,res)=>{
    res.json({
        message: "signin"
    })
})

router.get("/elements",(req,res)=>{

})

router.get("/avatars",(req,res)=>{

})

router.use("/user",userRouter);
router.use("/admin",adminRouter);
router.use("/space",spaceRouter)