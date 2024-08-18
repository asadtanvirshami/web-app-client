import { HttpApiError, HttpResponse } from "../../../utils/HttpRespone";
import { Mongo } from "../../../utils/mongo/";

import jwt from "jsonwebtoken";
import cookie from "cookie";

const SECRET_KEY =
  "qwertyuiodoasjrfbheskfhdsxcvboiswueorghbfo3urbn23o9h9hjklzxcvbnms"; // Replace with your own secret key

const handleLogin = async (req, res) => {
  const { email, password } = req.query;
  const queryVal = {
    email: email?.replace(/^"(.*)"$/, "$1"),
    password: password?.replace(/^"(.*)"$/, "$1"),
  };
  const result = await Mongo.findOne({
    collection: "Admin",
    query: { email: queryVal.email, password: queryVal.password },
  });

  if (result) {
    //Set token payload
    let payload = {
      id: result.id,
      fname: result.fname,
      lname: result.lname,
      email: result.email,
      username: result.username,
      isAdmin: true,
    };
    // Generate JWT token
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "1h",
    }); // Token expires in 1 hour
    // Send token in response
    // Save token in cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        maxAge: 3600, // Token expires in 1 hour
        sameSite: "strict",
        path: "/", // Adjust path as needed
      })
    );
    res.status(200).json(HttpResponse({ token }));
  } else {
    throw new HttpApiError(401, "Invalid email or password");
  }
};

const GetUserApi = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      const get = handleLogin;
      return get(req, res);
    default:
      throw new HttpApiError(400, `Not supported. Method: ${method}`);
  }
};

export default GetUserApi;
