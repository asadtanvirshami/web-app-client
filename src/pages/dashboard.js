import React from "react";
import Dashboard from "@/components/Layout/Dashboard";
import { useRouter } from "next/router";
import verifyToken from "@/utils/tokenVerification";

const DashboardPage = ({ email }) => {
  const router = useRouter();

  if (!email) {
    // Redirect to login page if email is missing
    router.push("/auth");
    return null; // Return null to prevent rendering anything on the client-side
  }

  return (
    <div className="bg-gradient-to-r from-rose-500 to-orange-500">
      <Dashboard />
    </div>
  );
};

export default DashboardPage;

export async function getServerSideProps(context) {
  try {
    const { req, res } = context;
    const token = req.cookies.token;
    console.log('====================================');
    console.log(token);
    console.log('====================================');
    if (!token) {
      // Token is missing, redirect to login page
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }

    // Verify token
    const decodedToken = await verifyToken(token);
    console.log('====================================');
    console.log(decodedToken);
    console.log('====================================');
    if (!decodedToken) {
      // Token is invalid or expired, redirect to login page
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }

    // Token is valid, extract user data from token and pass it as props
    return {
      props: {
        email: decodedToken.email,
      },
    };
  } catch (error) {
    console.error("Error verifying token:", error);
    // Redirect to login page on error
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
}
