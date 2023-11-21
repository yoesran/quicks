import React, { useEffect, useState } from 'react';

import { ReactComponent as ExpandIcon } from "../assets/svgs/expand.svg";
import { ReactComponent as SpinnerIcon } from "../assets/svgs/spinner-grey.svg";

import { tags } from '../constants';
import Task from './Task';

const PopUpTask = () => {
  const [tasks, setTasks] = useState([]);
  const [isFilterPopUpOpen, setIsFilterPopUpOpen] = useState(false);
  const [filterTaskIndex, setFilterTaskIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function onAddTask(e) {
    e.preventDefault();

    setIsLoading(true);
    fetch(`https://restful-api-vercel-yoesran.vercel.app/todos`, {
      method: "POST",
      body: JSON.stringify({
        title: "",
        detail: "",
        date: "",
        tagsIndex: [],
        completed: false
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(() => fetchAndSetTasks());
  }

  function onPickFilter(tag) {
    if (tag !== null) {
      const data = tasks.filter(task => task.tagsIndex.includes(tag));
      setTasks(data);
      setFilterTaskIndex(tag);
    } else {
      setIsLoading(true);
      fetch('https://restful-api-vercel-yoesran.vercel.app/todos?_sort=date&_order=desc')
      .then(response => response.json())
      .then(data => {
        setTasks(data);
        setFilterTaskIndex(null);

        setIsLoading(false);
      });
    }
  }

  function fetchAndSetTasks() {
    setIsLoading(true);
    fetch('https://restful-api-vercel-yoesran.vercel.app/todos?_sort=date&_order=desc')
      .then(response => response.json())
      .then(data => {
        if (filterTaskIndex) {
          const filteredTasks = data.filter(task => task.tagsIndex.includes(filterTaskIndex));
          setTasks(filteredTasks);
        } else {
          setTasks(data);
        }

        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchAndSetTasks();
  }, []);

  return (
    <div className="absolute right-[-32px] lg:right-0 bottom-[68px] mb-[12px] bg-white px-[12px] lg:px-[32px] py-[24px] w-[calc(100vw-8px)] lg:w-[calc(100vw-72px)] xl:w-[50vw] h-[75svh] border-2 border-[#BDBDBD] rounded-md">
      {isLoading ? 
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'>
          <div className='animate-spin'>
            <SpinnerIcon />
          </div>
          <p className='text-[#4F4F4F] font-bold'>Loading Task List ...</p>
        </div> 
        : 
        <>
          <div className='flex justify-between'>
            <div className='relative cursor-pointer flex items-center ml-[50px] px-[14px] py-[8px] bg-white font-bold border-2 border-[#828282] rounded-md' onClick={() => setIsFilterPopUpOpen(old => !old)}>
              <p className='text-[#4F4F4F]'>{filterTaskIndex !== null ? tags[filterTaskIndex] : "My Task"}</p>
              <div className={`cursor-pointer ${isFilterPopUpOpen ? 'rotate-180' : ''}`}>
                <ExpandIcon />
              </div>
              
              {isFilterPopUpOpen ? <div className='z-50 rounded-md border-2 border-[#BDBDBD] bg-white absolute top-0 left-0-0 translate-y-[50px] -translate-x-[80px] w-[250px] flex flex-col items-start'>
                <button onClick={() => {onPickFilter(null)}} className={`w-full rounded-md px-[12px] py-[6px] font-bold text-[#4F4F4F] text-start`}>My Task</button>
                {tags.map((tag, index) => {
                  return <div key={tag} className='w-full'>
                    <button onClick={() => {onPickFilter(index)}} className={`w-full rounded-md px-[12px] py-[6px] font-bold text-[#4F4F4F] text-start`}>{tag}</button>
                    <div className='bg-[#BDBDBD] h-[1px] w-full'></div>
                  </div>;
                })}
              </div> : null}
            </div>

            <button className='bg-[#2F80ED] text-white font-bold px-[14px] py-[8px] rounded-md' onClick={onAddTask}>New task</button>
          </div>

          <div className='pr-[15px] overflow-y-auto h-[93%]'>
            {tasks.map((task, index) => 
              <div key={task.id}>
                <Task task={task} fetchAndSetTasks={fetchAndSetTasks}/>
                {index === task.length-1 ? null : <div className='bg-[#828282] w-full h-[1px]'></div>}
              </div>
            )}
          </div>
        </>
      }
    </div>
  )
}

export default PopUpTask