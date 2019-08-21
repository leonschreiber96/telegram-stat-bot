import { upsertUser } from "../../controllers/user.controller";

export default function upsertUserRoute(req, res) {
    let contentData = [];
    
    req.on("data", chunk => {
        contentData.push(chunk);
    });

    req.on("end", () => {
        let user = JSON.parse(contentData);

        upsertUser(user)
            .then((result) => {
                res.status(200).json({
                    result: result
                });
            }).catch((error) => {
                console.error(error);
                res.status(error.status).send(error.message);
            });
    });


}