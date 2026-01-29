import { httpResponse, httpResponseError } from "../utils/http/httpResponse.js";
import { generalStatus } from "../utils/http/httpStatus.js";
import userServices from "../services/userServices.js";
import userDto from "../dto/userDto.js";

const createUser = async (req, res) => {
  try {
    const userInput = req.body?.data;
    if (!userInput) {
      httpResponseError(res, generalStatus.BAD_REQUEST, "data is required");
      return;
    }

    const { name, email } = userInput;
    if (!name || !email) {
      httpResponseError(
        res,
        generalStatus.BAD_REQUEST,
        "name and email required",
      );
      return;
    }

    const user = await userServices.createUser(userInput);
    httpResponse(res, generalStatus.SUCCESS, userDto.toDTO(user));
  } catch (error) {
    httpResponseError(res, error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userServices.getUserById(req.params.id);
    if (!user) {
      httpResponseError(res, generalStatus.NOT_FOUND, "User not found");
      return;
    }
    httpResponse(res, generalStatus.SUCCESS, userDto.toDTO(user));
  } catch (error) {
    httpResponseError(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.email) filter.email = req.query.email;
    const users = await userServices.getUsers(filter);
    httpResponse(
      res,
      generalStatus.SUCCESS,
      users.map((item) => userDto.toDTO(item))
    );
  } catch (error) {
    httpResponseError(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const userInput = req.body?.data;
    if (!userInput) {
      httpResponseError(res, generalStatus.BAD_REQUEST, "data is required");
      return;
    }

    const user = await userServices.updateUser(req.params.id, userInput);
    if (!user) {
      httpResponseError(res, generalStatus.NOT_FOUND, "User not found");
      return;
    }
    httpResponse(res, generalStatus.SUCCESS, userDto.toDTO(user));
  } catch (error) {
    httpResponseError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await userServices.deleteUser(req.params.id);
    if (!deleted) {
      httpResponseError(res, generalStatus.NOT_FOUND, "User not found");
      return;
    }
    httpResponse(res, generalStatus.SUCCESS, { message: "User deleted" });
  } catch (error) {
    httpResponseError(res, error);
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      httpResponseError(res, generalStatus.UNAUTHORIZED, "Unauthorized");
      return;
    }

    const user = await userServices.getUserById(userId);
    if (!user) {
      httpResponseError(res, generalStatus.NOT_FOUND, "User not found");
      return;
    }
    httpResponse(res, generalStatus.SUCCESS, userDto.toDTO(user));
  } catch (error) {
    httpResponseError(res, error);
  }
};

export { createUser, getUser, getUsers, updateUser, deleteUser, getProfile };
