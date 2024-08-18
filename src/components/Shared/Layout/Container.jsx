import React from "react";

function Container({ children }) {
  return (
    <div className="mx-auto px-3 sm:px-6 max-w-6xl 2xl:max-w-7xl w-full">
      <>{children}</>
    </div>
  );
}

export default React.memo(Container);
