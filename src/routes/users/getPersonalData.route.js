import { get_personal_data } from "../../controllers/user.controller";

export default async function get_personal_data_route(req, res) {
    let user_id = parseInt(req.params.id);

    if (isNaN(user_id)) {
        res.status(400).send("id parameter must be an integer");
    }
    try {
        let result = await get_personal_data(user_id);

        res.status(200).json({
            result: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}