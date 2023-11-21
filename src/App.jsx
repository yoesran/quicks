import React from "react";

import { ReactComponent as SearchIcon } from "./assets/svgs/search.svg";

import Quicks from "./components/Quicks";

const App = () => {
  return (
    <>
      <header className="bg-[#4F4F4F] w-[100vw] fixed top-0 left-0 z-50">
        <div className="px-[20px] py-[24px] text-[#333333]">
          <SearchIcon />
        </div>
      </header>

      <main className="bg-[#333333] w-[100vw] h-[100svh]"></main>

      <Quicks />
    </>
  );
};

export default App;
