import React from "react";
import { Button } from "@/components/ui/button";

import { useMutation } from "react-query";

import { apiCall } from "@/utils/apiCalls";
import { API } from "@/utils/apiCalls";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import { PulseLoader } from "react-spinners";
import Cookies from "js-cookie";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const loginUser = async (formData) => {
    const response = await apiCall(
      `${API.ADMIN_AUTH_LOGIN}?email=${formData.email}&password=${formData.password}`,
      "GET"
    );
    if (response?.data?.data.token) {
      let jwtToken = jwtDecode(response?.data?.data.token);
      if (jwtToken?.isAdmin === true) {
        Cookies.set("user",jwtToken?.username)
        return router.push("/dashboard");
      }
    } else {
      return undefined;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const {
    mutate: authMutation,
    isLoading,
    isError,
  } = useMutation(loginUser, {
    onSuccess: (data) => {
      if (data !== undefined) {
        console.log("user logged in");
      }
    },
    onError: (error) => {
      console.error("Error editing profile:", error);
    },
  });

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Execute the mutation function with the form data
      await authMutation(formData);
    } catch (error) {
      console.error("Error editing profile:", error);
    }
  };

  return (
    <div className="flex h-screen align-middle justify-center items-center bg-gradient-to-r from-rose-500 to-orange-500">
      <div className=" justify-center align-middle">
        <h1 className="text-center font-body mb-14 font-semibold text-5xl text-white">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="w-auto lg:w-96 grid">
          <label className="text-sm text-white ml-2">Email</label>
          <input
            name="email"
            onChange={(e) => handleChange(e)}
            className=" p-2 rounded-md m-2 outline-none"
          />
          <label className="text-sm text-white ml-2">Password</label>
          <input
            name="password"
            onChange={(e) => handleChange(e)}
            className=" p-2 rounded-md m-2 outline-none"
          />
          <div className="text-left mb-4 ml-2 mt-5 ">
            <Button
              className="bg-white text-red-500 font-semibold hover:bg-white"
              variant="default"
            >
              {isLoading ? <PulseLoader color="red" size={8} /> : "Login"}
            </Button>
            <p className="text-sm font-semibold float-right text-white mt-2">
              Forget password? <Link href="/reset">Reset here.</Link>
            </p>
          </div>
          <p className="text-white text-sm"></p>
        </form>
      </div>
    </div>
  );
};

export default React.memo(Login);
