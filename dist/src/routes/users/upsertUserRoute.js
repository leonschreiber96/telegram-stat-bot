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
function upsert_user_route(req, res) {
    // let contentData: String = [];
    // req.on("data", chunk => {
    //     contentData.push(chunk);
    // });
    console.log(req.body);
    req.on("end", () => __awaiter(this, void 0, void 0, function* () {
        let user = JSON.parse("");
        try {
            let result = yield user_controller_1.upsertUser(user);
            res.status(200).json({
                result: result
            });
        }
        catch (error) {
            console.error(error);
            res.status(error.status).send(error.message);
        }
    }));
}
exports.default = upsert_user_route;
//# sourceMappingURL=upsertUserRoute.js.map