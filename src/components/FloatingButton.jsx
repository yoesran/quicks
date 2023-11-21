import React from 'react';

const FloatingButton = ({ icon, text, isPopUpOpen, onClick } ) => {
  let translate = "translate-x-0";
  if (isPopUpOpen) translate = "translate-x-[20px]";

  return (
    <div className={`z-50 cursor-pointer w-[68px] flex flex-col items-center gap-3 ${translate}`} onClick={onClick}>
      {!isPopUpOpen && <p className="text-[#F2F2F2]">{text}</p>}
      {icon}
    </div>
  );
}

export default FloatingButton