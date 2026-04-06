import User from "./auth.model.js"
import ApiError from "../../common/utils/api-error.js"

const register = async({name, email, password}) => {

    const existing = User.findOne({email});

    if(existing) throw ApiError.conflict("User Already exists");

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    // TODO : send an email to user with token : rawtoken

    const userObj = user.toObject();
    delete userObj.password;
    
    return userObj;
}
