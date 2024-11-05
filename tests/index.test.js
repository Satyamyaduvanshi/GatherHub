import axios from "axios"

const BACKEND_URL = "DAMY"
// describe blocks

describe("authentication",()=>{
   
    test('user is able to singup only once',async()=>{
        const username = "satyam"+ Math.random()
        const password = "12345"

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type: "admin"
        })
        
        expect(response.statuscode).toBe(200)

        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type: "admin"
        })

        expect(updatedResponse.statuscode).toBe(400)
    });


    test('signup fails if username is empty', async()=>{
        const username = "satyam" + Math.random()
        const password = "12345"

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            password,
        })
        expect (response.statuscode).toBe(400)
    });

    test('signin succeeds if the username and password are correct', async()=>{
        const username = "satyam" + Math.random()
        const password = "12345"

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password
        })
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        expect(response.statuscode).toBe(200)
        expect(response.body.token).toBeDefined()
    })

    test('signin fails if username and password are incorrect', async()=>{
        const username = "satyma"+Math.random()
        const password = "12345"

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username: "worngusername",
            password

        })

        expect(response.statuscode).toBe(403)
    })
    
})

describe("User information endpoints", ()=>{

    let token = "";
    let avatarId = "";
    beforeAll(async()=>{
        const username = "satyam"+ Math.random()
        const password = "12345"
        
        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type : "admin"
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        token = response.data.token

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        })
        
        avatarId = avatarResponse.data.avatarId
    })

    test("user cant update their metadata with wrong metadata", async()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId: "759867589768945"
        })
        expect(response.statuscode).toBe(400)
    })

    test("user can update their metadata with correct metadata", async()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId: avatarId
        })
        expect(response.statuscode).toBe(200)

    })
})