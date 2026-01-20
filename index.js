require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors');
const port = 5000

app.use(express.json());
app.use(cors())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const db = client.db("skillswap");
        const skillcollection = db.collection("skills")



        app.post("/skills", async (req, res) => {
            try {
                const data = req.body
                if (!data.name || !data.level || !data.icon || !data.providerName || !data.providerEmail) {
                    return res.status(400).json({ message: "Missing required fields" })
                }
                const result = await skillcollection.insertOne(data)
                res.status(201).json({ message: "Skill added successfully", skillId: result.insertedId })
            } catch (error) {
                console.error(error)
                res.status(500).json({ message: "Internal Server Error" })
            }
        })



        app.get("/skills", async (req, res) => {
            try {
                const skills = await skillcollection.find({}).toArray()
                res.status(200).json(skills)
            } catch (error) {
                console.error(error)
                res.status(500).json({ message: "Internal Server Error" })
            }
        })



        app.get("/skills", async (req, res) => {
            try {
                const { Email } = req.query;
                console.log(Email)
                if (!providerEmail) {
                    return res.status(400).json({ error: "providerEmail query is required" });
                }

                const skills = await skillcollection.find({ providerEmail:Email }).toArray();

                res.status(200).json(skills);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });




        app.get("/skills-email", async (req, res) => {
            try {
                const email = req.query.email;

                let query = {};
                if (email) {
                    query = { providerEmail: email };
                }

                const skills = await skillcollection.find(query).toArray();
                res.status(200).json(skills);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });


        app.get("/skills5", async (req, res) => {
            try {
                const skills = await skillcollection.find({}).limit(4).toArray()
                res.status(200).json(skills)
            } catch (error) {
                console.error(error)
                res.status(500).json({ message: "Internal Server Error" })
            }
        })


        app.put("/skills/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const { name, level } = req.body;

                const result = await skillcollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { name, level } }
                );

                res.status(200).json({ message: "Skill updated", result });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });


        app.delete("/skills/:id", async (req, res) => {
            try {
                const { id } = req.params;

                const result = await skillcollection.deleteOne({
                    _id: new ObjectId(id)
                });

                res.status(200).json({ message: "Skill deleted", result });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
})

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })


module.exports = app
