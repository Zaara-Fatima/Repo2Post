import { login, logout, refresh, register } from "../services/auth.service.js";
import AppError from "../utils/AppError.js";

export const registerController = async (req, res, next) => {
  try {
    const user = await register(req.body);
    res.status(201).json({
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    next(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await login(req.body);

    res.cookie(
      "refreshToken",
      result.refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }
    );

    res.status(200).json({
      message: "Login successful",
      accessToken: result.accessToken,
      user: result.user,
    });

  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req,res,next) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
    throw new AppError("Refresh token required", 401)
}
  const result = await refresh(refreshToken)
   res.cookie("refreshToken", result.refreshToken,{
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7* 24 *60 *60 * 1000
   })
   res.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    next(error)
  }
  
}

export const logoutController = async(req,res,next)=>{
  try {
    const refreshToken = req.cookies.refreshToken
  const result =await logout(refreshToken)
  res.clearCookie("refreshToken",{
    httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
  })
  res.status(200).json({
    message: "Logged out successfully",
  })
  } catch (error) {
    next(error)
  }
}