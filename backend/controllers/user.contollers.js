import prisma from "../DB/db.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate that all fields are provided
    if (
      [name, email, password].some((field) => !field || field.trim() === "")
    ) {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, {}, "All fields are required"));
    }

    // Check if the user already exists
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (findUser) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            false,
            400,
            {},
            "Email already taken. Please use another email."
          )
        );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = newUser;

    return res
      .status(201)
      .json(
        new ApiResponse(
          true,
          201,
          userWithoutPassword,
          "User registered successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, null, "Internal Server Error"));
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
//   console.log(req.body);
  try {
    // Validate that all fields are provided
    if ([email, password].some((field) => !field || field.trim() === "")) {
      return res
        .status(400)
        .json(
          new ApiResponse(false, 400, {}, "Email and password are required")
        );
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, {}, "Invalid email or password"));
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, {}, "Invalid email or password"));
    }

    // Generate JWT access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = user;

    // Set the access token as a cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true, // Ensure secure cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          200,
          { user: userWithoutPassword, accessToken },
          "Login successful"
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, null, "Internal Server Error"));
  }
};



// update the user
export const updateUser = async (req, res) => {
  const { name, password } = req.body;

  try {
    const userId = req.user.id;

    if (!req.user) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, null, "Unauthorized request"));
    }

    const updateData = {};

    // Only add fields to updateData if they are provided
    if (name) {
      updateData.name = name;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(false, 400, null, "No fields provided to update")
        );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: updateData,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(true, 200, updatedUser, "User updated successfully")
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, {}, "Internal Server Error"));
  }
};

// * Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!req.user) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, null, "Unauthorized request"));
    }

    // Attempt to delete the user
    await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(true, 200, null, "User deleted successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, null, "Internal Server Error"));
  }
};

export const logoutUser = (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, null, "Unauthorized request"));
    }

    // Clear the cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS in production
      sameSite: "strict",
    });

    return res
      .status(200)
      .json(new ApiResponse(true, 200, null, "User logged out successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, null, "Internal Server Error"));
  }
};