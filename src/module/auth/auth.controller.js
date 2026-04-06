import * as authService from "./auth.service.js"
import ApiResponse from "../../common/utils/api-response.js"

const register = async(req, res) => {
    const user = await authService.register(req.body);
    ApiResponse.created(res, "registration successfull", user)
}

const login = async(req, res) => {
    const user = await authService.login(req.body);
    ApiResponse.ok(res, "logged in", user)
}

export {register, login}