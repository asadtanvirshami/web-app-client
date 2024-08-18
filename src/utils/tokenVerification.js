// utils/verifyToken.js

import jwt from "jsonwebtoken";

const SECRET_KEY =
  "qwertyuiodoasjrfbheskfhdsxcvboiswueorghbfo3urbn23o9h9hjklzxcvbnms"; // Replace with your own secret key

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    return null;
  }
};

export default verifyToken;
