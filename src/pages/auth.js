import React, { memo } from "react";

import Login from "@/components/Layout/Auth/login/login";

const auth = () => {
  return (
    <div
      data-cy="main-grid"
      className="grid items-center justify-center h-screen w-screen"
    >
      <div className="lg:grid lg:grid-cols-2 xl:grid xl:grid-cols-3 md:grid grid-cols-2 w-screen">
        <div className="hidden sm:flex h-screen align-middle justify-center items-center xl:col-span-2">
          <div className="justify-center align-middle items-center">
            <h1 className="mx-auto text-8xl font-bold text-rose-500">
              Admin Panel
            </h1>
            <div className="flex inline-block align-middle justify-center mt-5">
              <div className="p-2 font-body text-2xl">
                <small className="bg-clip-text text-transparent bg-gradient-to-r font-semibold text-xl from-rose-500 to-orange-500">BTX Wallet</small>
              </div>
            </div>
          </div>
        </div>
        <Login />
      </div>
    </div>
  );
};

export default memo(auth);
