import dbConnect from "@/pages/libs/mongodb";
import Admin from "@/models/admin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();

    const { username, email, password } = req.body;

    try {
      const existingUser = await Admin.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new Admin({
        username,
        email,
        password,
      });

      await newUser.save();

      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
