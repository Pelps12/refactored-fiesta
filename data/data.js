export const users = [
    {
        id: 1,
        username: "Ojomojos",
        password: "abcd",
        createdAt: new Date(2022, 2, 9),
        firstName: "John",
        lastName: "Ojo",
        phoneNumber: "08039991298",

    },

    {
        id: 2,
        username: "Oluwapelps",
        password: "efgh",
        createdAt: new Date(2022, 2, 9),
        firstName: "Oluwapelumi",
        lastName: "Adegoke",
        phoneNumber: "08039191298",

    },
    {
        id: 3,
        username: "Orezzy",
        password: "ijkl",
        createdAt: new Date(2022, 2, 9),
        firstName: "Oreoluwa",
        lastName: "Adegoke",
        phoneNumber: "08039191299",

    }

]
export const sellers = [
    {
        id: 1,
        storename: "Ewa Agoyin International",
        location: [32.984110, -96.756390, 0],
        owner: "Tayo Aina",
        password: "klmn",
        createdAt: new Date(2022, 2, 9),
        openingTime: "8AM",
        closingTime: "10PM"

    }
]

export const goods = [
    {
        name: "Tomatoes",
        image: `../public/images/tomatoes.jpg`,
        perishable: true,
        

    }
]

export const listing = [
    {
        id: 1,
        storename: "Ewa Agoyin International",
        iat: new Date(2022, 9, 2),
        currency: "NGN",
        startingPrice: 500,
        expiresAt: new Date(2022, 9, 7)
    }
]