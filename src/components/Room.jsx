import React, { useEffect, useRef, useState } from 'react';

import { ReactComponent as ArrowBackIcon } from "../assets/svgs/arrow-back.svg";
import { ReactComponent as CloseIcon } from "../assets/svgs/close.svg";
import { ReactComponent as MoreHorizIcon } from "../assets/svgs/more-horiz.svg";
import { ReactComponent as SpinnerIcon } from "../assets/svgs/spinner.svg";

const Room = ({ room, closeRoom, closePopUp }) => {
  const [messages, setMessages] = useState([]);
  const [earliestUnreadMessage, setEarliestUnreadMessage] = useState(null);
  const [isEarliestUnreadMessageIntersecting, setIsEarliestUnreadMessageIntersecting] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);
  const [isFetchDone, setIsFetchDone] = useState(false);
  const earliestUnreadMessageRef = useRef(null);

  function onDeleteMessage(message) {
    const newMessages = messages.filter(item => item.id !== message.id);
    newMessages.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

    setMessages(newMessages);
  }

  function onReplyMessage(message) {
    setReplyMessage(message);
  }

  function onSubmit(e) {
    e.preventDefault();
    const message = e.target.message.value;

    if (message !== '') {
      e.target.message.value = '';

      const id = messages[messages.length - 1].id + 1;
      let newMessages;

      if (replyMessage) {
        newMessages = [...messages, {
          id: id,
          user: 'You',
          message: message,
          replyMessage: replyMessage.message, 
          date: Date.now(),
          status: 'unread'
        }];

        setReplyMessage(null);
      } else {
        newMessages = [...messages, {
          id: id,
          user: 'You',
          message: message,
          date: Date.now(),
          status: 'unread'
        }];
      }

      newMessages.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });

      setMessages(newMessages);
      setIsEarliestUnreadMessageIntersecting(false);
    }
  }

  useEffect(() => {
    if (earliestUnreadMessage && !isEarliestUnreadMessageIntersecting) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsEarliestUnreadMessageIntersecting(true);
          setTimeout(() => {
            const updatedData = messages.map(item => {
              if (item.status === 'unread') {
                return { ...item, status: 'read' };
              }
              return item;
            });
          
            setMessages(updatedData);
          }, 2000);
        }
      }, { rootMargin: "-300px" });
      observer.observe(earliestUnreadMessageRef.current);
      return () => observer.disconnect();
    }
  }, [messages, earliestUnreadMessage, isEarliestUnreadMessageIntersecting]);


  useEffect(() => {
    const sortedMessages = room.messages.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
    setMessages(sortedMessages);
  }, [room]);

  useEffect(() => {
    const earliestUnreadMessage = messages.find(message => message.status === 'unread');
    setEarliestUnreadMessage(earliestUnreadMessage);
  }, [messages]);

  useEffect(() => {
    if (room.users.length === 1) {
      setTimeout(() => setIsFetchDone(true), 1000)
    } else {
      setIsFetchDone(true);
    }
  }, [room]);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-col'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='cursor-pointer' onClick={closeRoom}>
              <ArrowBackIcon />
            </div>
            <div className='flex flex-col'>
              <p className='text-[#2F80ED] text-lg font-bold'>{room.title}</p>
              {room.users.length > 1 ? <p className='text-[#333333]'>{room.users.length} Participants</p> : null}
            </div>
          </div>
          <div className='cursor-pointer' onClick={closePopUp}>
            <CloseIcon />
          </div>
        </div>
        <div className='bg-[#BDBDBD] mt-[24px] w-[200vw] h-[1px] -translate-x-1/2'></div>
      </div>

      <div className='flex-grow flex flex-col w-full overflow-y-auto pr-5'>
        {messages.map((message, index) => {
          let currentDate = null;
          let previousDate = null;
          if (index > 0) {
            currentDate = new Date(messages[index].date);
            previousDate = new Date(messages[index-1].date);
          }

          if (earliestUnreadMessage?.id === message.id) {
            return (
              <div key={message.id} className='flex flex-col w-full mt-[20px]'>
                <div className='flex items-center w-full'>
                  <span className='flex-1 h-[1px] bg-[#EB5757] mr-[20px]'></span>
                  <span className='font-bold text-[#EB5757]'>New Message</span>
                  <span className='flex-1 h-[1px] bg-[#EB5757] ml-[20px]'></span>
                </div>
                <MessageBubble message={message} onReply={onReplyMessage} onDelete={onDeleteMessage} refs={earliestUnreadMessageRef} /> 
              </div>
            );
          } else if (currentDate?.getDate() !== previousDate?.getDate()) {
            const formatDate = (inputDate) => {
              const date = new Date(inputDate);
              const options = { year: 'numeric', month: 'long', day: '2-digit' };
              return date.toLocaleDateString('en-US', options);
            };

            return (
              <div key={message.id} className='flex flex-col w-full mt-[20px]'>
                <div className='flex items-center w-full'>
                  <span className='flex-1 h-[1px] bg-[#4F4F4F] mr-[20px]'></span>
                  <span className='font-bold text-[#4F4F4F] text-lg'>{formatDate(currentDate)}</span>
                  <span className='flex-1 h-[1px] bg-[#4F4F4F] ml-[20px]'></span>
                </div>
                <MessageBubble message={message} onReply={onReplyMessage} onDelete={onDeleteMessage}/> 
              </div>
            );
          } else {
            return <MessageBubble key={message.id} message={message} onReply={onReplyMessage} onDelete={onDeleteMessage}/>
          }
        })}
      </div>

      <div className='relative flex gap-5 pt-[24px]'>
        {(!isEarliestUnreadMessageIntersecting && earliestUnreadMessage) ? 
            <div className='cursor-pointer absolute top-[-5px] left-1/2 -translate-x-1/2 -translate-y-1/2 px-[12px] py-[8px] bg-[#E9F3FF] text-[#2F80ED] font-bold rounded-md' onClick={() => {earliestUnreadMessageRef.current?.scrollIntoView()}}>
              New Message
            </div> 
          : null
        }
        {(room.users.length === 1 && !isFetchDone) ?
            <div className='w-full flex items-center gap-3 absolute top-[-15px] left-1/2 -translate-x-1/2 -translate-y-1/2 p-[10px] bg-[#E9F3FF] text-[#4F4F4F] font-bold rounded-md'>
              <div className='animate-spin'>
                <SpinnerIcon />
              </div>
              <p>Please wait while we connect you with one of our team ...</p>
            </div> 
          : null
        }
        <form onSubmit={onSubmit} className='w-full flex gap-5'>
          <div className="relative w-full rounded-md border-2 border-[#828282] py-1">
            <input type="text" disabled={!isFetchDone} placeholder='Type a new message' name='message' autoComplete='off' className='w-full px-5 py-1 placeholder:text-[#333333] focus:outline-none'/>

            {replyMessage ? 
              <div className='absolute top-0 left-0 -translate-y-full w-full rounded-t-md border-2 border-[#828282] flex flex-col bg-[#F2F2F2] text-[#4F4F4F] p-[10px]'>
                <div className='flex justify-between'>
                  <p className='font-bold'>Replying to {replyMessage.user}</p>
                  <div className='cursor-pointer' onClick={() => {setReplyMessage(null)}}>
                    <CloseIcon />
                  </div>
                </div>
                <p>{replyMessage.message}</p>
              </div> 
              : null
            }
          </div>
          <button className='px-[16px] py-[8px] text-center text-white font-bold bg-[#2F80ED] rounded-md'>Send</button>
        </form>
      </div>
    </div>
  )
}

export default Room

const MessageBubble = ({ message, onReply, onDelete, refs }) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const date = new Date(message.date);
  const hour = date.getHours();
  const minute = date.getMinutes();

  const formattedTime = `${hour}.${minute < 10 ? '0' + minute : minute}`;

  const bgColors = ['bg-[#FCEED3]', 'bg-[#EEDCFF]', 'bg-[#D2F2EA]'];
  const textColors = ['text-[#E5A443]', 'text-[#9B51E0]', 'text-[#43B78D]'];

  let bgColor = '';
  let textColor = '';
  if (message.user === 'You') {
    bgColor = bgColors[1];
    textColor = textColors[1];
  } else if (message.user === 'Mary Hilda') {
    bgColor = bgColors[0];
    textColor = textColors[0];
  } else if (message.user === 'Obaidullah Amarkhil') {
    bgColor = bgColors[2];
    textColor = textColors[2];
  } else {
    bgColor = 'bg-[#F8F8F8]';
    textColor = 'text-[#2F80ED]';
  }

  let selfEnd = '';
  let flexRowReverse = '';
  if (message.user === 'You') {
    selfEnd = 'self-end';
    flexRowReverse = 'flex-row-reverse';
  }

  let renderedPopUp = null;
  if (isPopUpOpen) {
    if (message.user === 'You') {
      renderedPopUp = <div className='rounded-md border border-[#BDBDBD] text-[#2F80ED] bg-white absolute top-0 left-0 translate-y-[20px] w-[150px] flex flex-col items-start'>
        <button className='px-3 py-2'>Edit</button>
        <div className='bg-[#BDBDBD] h-[1px] w-full'></div>
        <button className='px-3 py-2 text-[#EB5757]' onClick={() => onDelete(message)}>Delete</button>
      </div>;
    } else {
      renderedPopUp = <div className='rounded-md border border-[#BDBDBD] text-[#2F80ED] bg-white absolute top-0 left-0 translate-y-[20px] w-[150px] flex flex-col items-start'>
        <button className='px-3 py-2'>Share</button>
        <div className='bg-[#BDBDBD] h-[1px] w-full'></div>
        <button className='px-3 py-2' onClick={() => onReply(message)}>Reply</button>
      </div>;
    }
  }

  return (
    <div className='flex flex-col w-full my-[20px]' ref={refs}>
      <p className={`${selfEnd} font-bold ${textColor}`}>{message.user}</p>
      {message.hasOwnProperty('replyMessage') ? <div className={`${selfEnd} max-w-[75%] p-[10px] bg-[#F2F2F2] text-[#4F4F4F] rounded-md my-[5px]`}>
        <p>{message.replyMessage}</p>
      </div> : null}
      <div className={`flex ${flexRowReverse} gap-2`}>
        <div className={`flex flex-col gap-3 max-w-[75%] p-[10px] ${bgColor} text-[#4F4F4F] rounded-md`}>
          <p>{message.message}</p>
          <p>{formattedTime}</p>
        </div>

        <div className='self-baseline relative'>
          <div className='cursor-pointer' onClick={() => setIsPopUpOpen(old => !old)}>
            <MoreHorizIcon />
          </div>
          {renderedPopUp}
        </div>
      </div>
    </div>
  );
}