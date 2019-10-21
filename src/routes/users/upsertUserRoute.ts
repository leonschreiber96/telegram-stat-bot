import { upsertUser } from "../../controllers/user.controller";

export default async function upsert_user_route(req, res): Promise<void> {
    // let contentData: String = [];

    // req.on("data", chunk => {
    //     contentData.push(chunk);
    // });

    console.log(req.body)

    req.on("end", async () => {
        let user = JSON.parse("");

        try {
            let result = await upsertUser(user);

            res.status(200).json({
                result: result
            });
        } catch (error) {
            console.error(error);
            res.status(error.status).send(error.message);
        }
    });
}