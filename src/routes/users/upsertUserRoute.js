import { upsertUser } from "../../controllers/user.controller";

export default function upsert_user_route(req, res) {
    let contentData = [];

    req.on("data", chunk => {
        contentData.push(chunk);
    });

    req.on("end", async () => {
        let user = JSON.parse(contentData);

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