import React, { useState } from 'react';

import { messagesRoom } from '../constants';

import Inbox from './Inbox';
import Room from './Room';

const PopUpInbox = ({ closePopUp }) => {
  const [openedRoom, setOpenedRoom] = useState(null);

  function openRoom(id) {
    const openedRoom = messagesRoom.find(room => room.id === id);
    setOpenedRoom(openedRoom);
  }

  function closeRoom() {
    setOpenedRoom(null);
  }

  return (
    <div className="absolute right-[-32px] lg:right-0 bottom-[68px] mb-[12px] bg-white px-[12px] lg:px-[32px] py-[24px] w-[calc(100vw-8px)] lg:w-[calc(100vw-72px)] xl:w-[50vw] h-[75svh] border-2 border-[#BDBDBD] rounded-md overflow-x-clip">
      {openedRoom ? <Room room={openedRoom} closeRoom={closeRoom} closePopUp={closePopUp} /> : <Inbox onOpenRoom={openRoom} />}
    </div>
  )
}

export default PopUpInbox