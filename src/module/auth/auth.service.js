import User from "./auth.model.js"
import ApiError from "../../common/utils/api-error.js"
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyAccessToken } from "../../common/utils/jwt-util.js"

const hashToken = (token) => {
    crypto.createHash("sha256").update(token).digest("hex");
}

const register = async({name, email, password}) => {

    const existing = User.findOne({email});

    if(existing) throw ApiError.conflict("User Already exists");

    const {rawToken, hashedToken} = generateResetToken()

    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken: hashedToken
    })

    // TODO : send an email to user with token : rawtoken

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken
    
    return userObj;
}


const login = async({email, password}) => {

    const user = await User.findOne({email}).select("+password");
    if(!user) throw ApiError.unauthorized("Invalid email or password")

    const isMatch = await user.comparePassword(password)
    if(!isMatch) throw ApiError.unauthorized("Invalid Password")

    if(!user.isVerified){
        throw ApiError.forbidden("Please Verify email before login")
    }

    const accessToken = generateAccessToken({id:user._id, role: user.role})
    const refreshToken = generateRefreshToken({id:user._id})

    user.refreshToken = hashToken(refreshToken)
    await user.save({validateBeforeSave: false})

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.refreshToken

    return {user: userObj, accessToken, refreshToken}
}
export default {register, login};
