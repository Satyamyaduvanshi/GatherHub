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

describe("User metadata endpoints", ()=>{

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
        },{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        expect(response.statuscode).toBe(400)
    })

    test("user can update their metadata with correct metadata", async()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId: avatarId
        },{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        expect(response.statuscode).toBe(200)
    })

    test("user is not able to update their metadata if auth header is not present", async()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId: avatarId
        })

        expect(response.statuscode).toBe(403)
    })
})


describe("user avatar endpoint", ()=>{

    let token;
    let avatarId;
    let userId;

    beforeAll(async()=>{
        const username = "satyam"+Math.random()
        const password = "12345"

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type : "admin"
        })

        userId = signupResponse.data.userId


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

    test("get back avatar information for a user", async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`)

        expect(response.data.avatars.length).toBe(1);
        expect(response.data.avatars[0].userId).toBeDefined(userId)

    })

    test("available avatars lists the recently created avatart",async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`)

        expect(response.data.avatars.length).not.toBe(0)
        const currentAvatar = response.data.avatars.find(x => x.id == avatarId)
        expect(currentAvatar).toBeDefined()
    })
})
//-------------- space information ---------------------------------------------
describe("space information", () => {
    let mapId;
    let element1Id;
    let element2Id;
    let userToken;
    let adminToken;
    let userId;
    let adminId;

    beforeAll(async () => {
        const username = "satyam" + Math.random();
        const password = "12345";

        //---------------------------- admin (auth)
        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });
        adminId = signupResponse.data.userId;

        const tokenResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });
        adminToken = tokenResponse.data.token;

        //---------------------------- user (auth)
        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "user",
            password,
            type: "user"
        });
        userId = userSignupResponse.data.userId;

        const userTokenResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "user",
            password
        });
        userToken = userTokenResponse.data.token;

        //---------------------------- create elements
        const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true 
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        element1Id = element1Response.data.id;

        const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true 
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        element2Id = element2Response.data.id;

        //---------------------------- create map
        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [
                { elementId: element1Id, x: 20, y: 20 },
                { elementId: element1Id, x: 18, y: 20 },
                { elementId: element2Id, x: 19, y: 20 },
                { elementId: element2Id, x: 19, y: 20 }
            ]
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        mapId = mapResponse.data.id;
    });

    test("user is able to create a space", async () => {
        const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
        }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        expect(spaceResponse.data.spaceId).toBeDefined();
    });

    test("user is able to create a space without mapId (empty space)", async () => {
        const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200"
        }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        expect(spaceResponse.data.spaceId).toBeDefined();
    });

    test("user is unable to create a space without mapId and dimensions", async () => {
        try {
            await axios.post(`${BACKEND_URL}/api/v1/space`, {
                "name": "Test"
            }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }
    });

    test("user is not able to delete a space that doesn't exist", async () => {
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }
    });

    test("user is able to delete a space that does exist", async () => {
        const spaceCreatedResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200"
        }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const spaceId = spaceCreatedResponse.data.spaceId;

        const spaceResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        expect(spaceResponse.status).toBe(200);
    });

    test("user should not be able to delete a space created by another user", async () => {
        const spaceCreatedResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200"
        }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const spaceId = spaceCreatedResponse.data.spaceId;

        const spaceResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        expect(spaceResponse.status).toBe(400);
    });

    test("show existing spaces", async () => {
        const spaceCreatedResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200"
        }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const spaceId = spaceCreatedResponse.data.spaceId;

        const getSpaceResponse = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        expect(getSpaceResponse.data.spaces.some(space => space.id === spaceId)).toBe(true);
        expect(getSpaceResponse.data.spaces.length).toBeGreaterThan(0);
    });

    test("admin has no spaces initially",async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`);
        expect(response.data.spaces.length).toBe(0)
    })
});
//----------- Arena ---------------------------

describe("Areana endpoints",()=>{

    let mapId;
    let element1Id;
    let element2Id;
    let userToken;
    let adminToken;
    let userId;
    let adminId;
    let spaceId;

    beforeAll(async () => {
        const username = "satyam" + Math.random();
        const password = "12345";

        //---------------------------- admin (auth)
        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });
        adminId = signupResponse.data.userId;

        const tokenResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });
        adminToken = tokenResponse.data.token;

        //---------------------------- user (auth)
        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "user",
            password,
            type: "user"
        });
        userId = userSignupResponse.data.userId;

        const userTokenResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "user",
            password
        });
        userToken = userTokenResponse.data.token;

        //---------------------------- create elements
        const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true 
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        element1Id = element1Response.data.id;

        const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true 
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        element2Id = element2Response.data.id;

        //---------------------------- create map
        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [
                { elementId: element1Id, x: 20, y: 20 },
                { elementId: element1Id, x: 18, y: 20 },
                { elementId: element2Id, x: 19, y: 20 },
                { elementId: element2Id, x: 19, y: 20 }
            ]
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        mapId = mapResponse.data.id;

        const createSpaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200"
        }, {
            headers: { 
                Authorization: `Bearer ${userToken}` 
            }
        });

        spaceId = createSpaceResponse.data.spaceId;
    });

    test("",async()=>{
        
    })
})