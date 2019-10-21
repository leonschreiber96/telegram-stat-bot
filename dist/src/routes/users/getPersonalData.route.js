"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../../controllers/user.controller");
function get_personal_data_route(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user_id = parseInt(req.params.id);
        if (isNaN(user_id)) {
            yield res.status(400).send("id parameter must be an integer");
        }
        try {
            let result = yield user_controller_1.get_personal_data(user_id);
            yield res.status(200).json({
                result: result
            });
        }
        catch (error) {
            console.error(error);
            yield res.status(500).send(error);
        }
    });
}
exports.default = get_personal_data_route;
//# sourceMappingURL=getPersonalData.route.js.map