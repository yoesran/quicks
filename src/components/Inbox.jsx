import React from 'react';

import { ReactComponent as SearchIcon } from "../assets/svgs/search-black.svg";
import { ReactComponent as PersonIcon } from "../assets/svgs/person.svg";
import { ReactComponent as OtherPersonIcon } from "../assets/svgs/other-person.svg";

import { messagesRoom } from '../constants';

const Inbox = ({ onOpenRoom }) => {
  return (
    <>
      <div className="relative w-full rounded-md border-2 border-[#828282] py-1">
        <input type="text" placeholder='Search' className='w-full px-5 py-1 placeholder:text-[#333333] focus:outline-none'/>
        <div className='absolute top-0 right-0 translate-y-[110%] -translate-x-full'>
          <SearchIcon />
        </div>
      </div>

      <div className='pr-[15px] overflow-y-auto h-[93%]'>
        {messagesRoom.map((room, index) => 
          <div key={room.id}>
            <InboxItem room={room} onOpenRoom={onOpenRoom} />
            {index === messagesRoom.length-1 ? null : <div className='bg-[#828282] w-full h-[1px]'></div>}
          </div>
        )}
      </div>
    </>
  )
}

export default Inbox

const InboxItem = ({ room, onOpenRoom }) => {
  const latestMessage = room.messages.reduce((latest, current) => {
    const currentDate = new Date(current.date);
    const latestDate = new Date(latest.date);
  
    return currentDate > latestDate ? current : latest;
  });
  
  const latestMessageDate = new Date(latestMessage.date);
  const formattedDate = latestMessageDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  let opacity = 'opacity-1';
  if (room.users.length === 1) opacity = 'opacity-0';

  return (
    <div className='flex py-[22px] cursor-pointer' onClick={() => onOpenRoom(room.id)}>
      <div className='flex w-[68px]'>
        <div className={`${opacity}`}>
          <OtherPersonIcon />
        </div>
        <div className='-translate-x-1/2'>
          {room.users.length === 1 
            ? 
              <div className='w-[34px] h-[34px] rounded-full bg-[#2F80ED] flex items-center justify-center text-white font-bold'>
                {room.users[0].charAt(0).toUpperCase()}
              </div> 
            : <PersonIcon />
          }
        </div>
      </div>

      <div className='flex flex-col w-[calc(100%-78px)]'>
        <div className='flex w-full'>
          <p className='text-[#2F80ED] text-[8px] xxs:text-[10px] xs:text-xs sm:text-base font-bold max-w-[calc(65%-10px)] mr-[10px]'>{room.title}</p>
          <p className='text-[#4F4F4F] text-[8px] xxs:text-[10px] xs:text-xs sm:text-base max-w-[35%-10px]'>{formattedDate}</p>
        </div>

        {room.users.length > 1 && <p className='text-[#4F4F4F] font-bold max-w-[calc(80%-10px)] text-ellipsis inline-block overflow-hidden whitespace-nowrap'>{latestMessage.user} :</p>}
        <p className='text-[#4F4F4F] text-sm max-w-[calc(80%-10px)] text-ellipsis inline-block overflow-hidden whitespace-nowrap'>{latestMessage.message}</p>
      </div>

      <div className='self-center w-[10px]'>
        {latestMessage.status === 'unread' ? <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5Z" fill="#EB5757"/>
        </svg> : null}
      </div>
    </div>
  )
}