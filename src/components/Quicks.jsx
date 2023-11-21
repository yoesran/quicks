import React, { useEffect, useState } from 'react';

import { ReactComponent as ControlIcon } from "../assets/svgs/control.svg";
import { ReactComponent as SelectedControlIcon } from "../assets/svgs/selected-control.svg";
import { ReactComponent as TaskIcon } from "../assets/svgs/task.svg";
import { ReactComponent as SelectedTaskIcon } from "../assets/svgs/selected-task.svg";
import { ReactComponent as InboxIcon } from "../assets/svgs/inbox.svg";
import { ReactComponent as SelectedInboxIcon } from "../assets/svgs/selected-inbox.svg";

import FloatingButton from './FloatingButton';
import PopUpInbox from './PopUpInbox';
import PopUpTask from './PopUpTask';

const Quicks = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopUpInboxOpened, setIsPopUpInboxOpened] = useState(false);
  const [isPopUpTaskOpened, setIsPopUpTaskOpened] = useState(false);

  function openInbox(e) {
    e.stopPropagation();

    setIsPopUpInboxOpened(true);
    setIsPopUpTaskOpened(false);
  }

  function openTask(e) {
    e.stopPropagation();
    
    setIsPopUpTaskOpened(true);
    setIsPopUpInboxOpened(false);
  }

  function closePopUp() {
    setIsPopUpInboxOpened(false);
    setIsPopUpTaskOpened(false);
    setIsHovered(false);
  }

  let position = "static";
  if (isPopUpInboxOpened || isPopUpTaskOpened) position = "absolute";

  useEffect(() => {
    window.addEventListener("click", closePopUp);

    return () => {
      window.removeEventListener("click", closePopUp);
    };
  }, []);

  return (
    <div className="fixed bottom-0 right-0 mr-[36px] mb-[28px] flex flex-row-reverse items-end gap-[28px]">
      <div className={`cursor-pointer z-40 w-[68px] h-[68px] ${position}`} onClick={(e) => {e.stopPropagation(); setIsHovered(old => !old)}}>
        {(isPopUpInboxOpened || isPopUpTaskOpened) ? <SelectedControlIcon /> : <ControlIcon />}
      </div>

      {(isHovered || isPopUpInboxOpened || isPopUpTaskOpened) && 
        <div className={`flex ${isPopUpTaskOpened ? 'flex-row-reverse' : ''} items-end gap-[28px]`}>
          <FloatingButton icon={isPopUpTaskOpened  ? <SelectedTaskIcon /> : <TaskIcon />} text={"Task"} isPopUpOpen={isPopUpTaskOpened || isPopUpInboxOpened} onClick={openTask}/>
          <FloatingButton icon={isPopUpInboxOpened ? <SelectedInboxIcon /> : <InboxIcon />} text={"Inbox"} isPopUpOpen={isPopUpTaskOpened || isPopUpInboxOpened} onClick={openInbox}/>
        </div>
      }

      <div onClick={(e) => e.stopPropagation()}>
        {isPopUpInboxOpened && <PopUpInbox closePopUp={closePopUp}/>}
        {isPopUpTaskOpened && <PopUpTask />}
      </div>
    </div>
  )
}

export default Quicks