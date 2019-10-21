import { get_personal_data } from "../../controllers/user.controller";

export default async function get_personal_data_route(req, res): Promise<void> {
    let user_id: number = parseInt(req.params.id);

    if (isNaN(user_id)) {
        await res.status(400).send("id parameter must be an integer");
    }
    try {
        let result = await get_personal_data(user_id);

        await res.status(200).json({
            result: result
        });
    } catch (error) {
        console.error(error);
        await res.status(500).send(error);
    }
}