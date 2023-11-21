import React, { useEffect, useRef, useState } from 'react';

import { ReactComponent as ExpandIcon } from "../assets/svgs/expand.svg";
import { ReactComponent as MoreIcon } from "../assets/svgs/more-horiz.svg";
import { ReactComponent as CheckboxIcon } from "../assets/svgs/checkbox.svg";
import { ReactComponent as ScheduleIcon } from "../assets/svgs/schedule.svg";
import { ReactComponent as ScheduleBlueIcon } from "../assets/svgs/schedule-blue.svg";
import { ReactComponent as EditIcon } from "../assets/svgs/edit.svg";
import { ReactComponent as EditBlueIcon } from "../assets/svgs/edit-blue.svg";
import { ReactComponent as BookmarksIcon } from "../assets/svgs/bookmarks.svg";
import { ReactComponent as BookmarksBlueIcon } from "../assets/svgs/bookmarks-blue.svg";
import { colorTags, tags } from '../constants';

const Task = ({ task, fetchAndSetTasks }) => {
  const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
  const [isTagPopUpOpen, setIsTagPopUpOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [tagsIndex, setTagsIndex] = useState([]);

  const [title, setTitle] = useState('Type Task Title');
  const [isEditTitle, setIsEditTitle] = useState(false);

  const [daysLeft, setDaysLeft] = useState('');
  const [date, setDate] = useState('');
  const [displayDate, setDisplayDate] = useState('');

  const [detail, setDetail] = useState('No Description');
  const [isEditDetail, setIsEditDetail] = useState(false);

  const editTitleRef = useRef(null);
  const editDetailRef = useRef(null);
  const datePickerRef = useRef(null);

  let lineThrough = '';
  if (isChecked) lineThrough = 'line-through text-[#828282]';

  function onCompleteTask(e) {
    e.preventDefault();

    putRequest({
      ...task,
      completed: !task.completed,
    });
  }

  function onKeyDownTitle(e) {
    if (e.key === 'Enter') {
      e.preventDefault();

      const trimmedValue = editTitleRef.current.value.trim();
      if (trimmedValue !== '') {
        putRequest({
          ...task,
          title: trimmedValue,
        });
      } else {
        setTitle('Type Task Title');
      }

      setIsEditTitle(false);
    }
  }

  function onKeyDownDetail(e) {
    if (e.key === 'Enter') {
      e.preventDefault();

      const trimmedValue = editDetailRef.current.value.trim();
      if (trimmedValue !== '') {
        putRequest({
          ...task,
          detail: trimmedValue,
        });
      } else {
        setDetail('No Description');
      }

      setIsEditDetail(false);
    }
  }

  function onPickDate(e) {
    e.preventDefault();
    
    putRequest({
      ...task,
      date: e.target.value,
    })
  }

  function onPickTag(tagIndex) {
    const index = tagsIndex.indexOf(tagIndex);
    if (index > -1) {
      const array = tagsIndex;
      array.splice(index, 1);

      putRequest({
        ...task,
        tagsIndex: [...array],
      })
    } else {
      putRequest({
        ...task,
        tagsIndex: [...tagsIndex, tagIndex],
      })
    }
  }

  function onDeleteTask(task) {
    fetch(`https://restful-api-vercel-yoesran.vercel.app/todos/${task.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(() => fetchAndSetTasks());
  }

  function putRequest(body) {
    fetch(`https://restful-api-vercel-yoesran.vercel.app/todos/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(() => fetchAndSetTasks())
  }

  function datediff(first, second) {        
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  useEffect(() => {
    setTagsIndex([]);
    setTitle('Type Task Title');
    setDetail('No Description');
    setDate('');
    setDisplayDate('');
    setDaysLeft('');
    setIsChecked(false);

    if (task.tagsIndex.length > 0) {
      setTagsIndex([...task.tagsIndex]);
    }
    if (task.title !== '') {
      setTitle(task.title);
    }
    if (task.detail !== '') {
      setDetail(task.detail);
    }
    if (task.date !== '') {
      const date = new Date(task.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      setDate(task.date);
      setDisplayDate(formattedDate);
      const dateDiff = datediff(new Date(Date.now()), new Date(task.date));
      if (dateDiff >= 0) {
        setDaysLeft(dateDiff);
      } 
      // else if (!task.completed) {
      //   fetch(`https://restful-api-vercel-yoesran.vercel.app/todos/${task.id}`, {
      //     method: "PUT",
      //     body: JSON.stringify({
      //       ...task,
      //       completed: true,
      //     }),
      //     headers: {
      //       "Content-type": "application/json; charset=UTF-8"
      //     }
      //   }).then(() => fetchAndSetTasks());
      // }
    }
    if (task.completed) {
      setIsChecked(true);
    }
  }, [task]);

  return (
    <div className='w-full flex gap-5 py-[22px]'>
      <div className='w-[18px] h-[18px] flex items-center' onClick={onCompleteTask}>
        {isChecked ? <CheckboxIcon /> : <div className='w-[18px] h-[18px] bg-transparent border-2 border-[#828282] rounded-sm'></div>}
      </div>

      <div className='flex-grow flex flex-col text-[#4F4F4F]'>
        <div className='w-full flex justify-between'>
          <div className={`relative w-[70%] ${title === 'Type Task Title' && !isEditTitle  ? 'px-[14px] py-[8px] bg-white border-2 border-[#828282] rounded-md' : ''}`}>
            <p onClick={() => setIsEditTitle(old => !old)} className={`${title !== 'Type Task Title' ? 'font-bold' : ''} ${lineThrough} ${isEditTitle ? 'opacity-0 h-[50px]' : ''}`}>{title}</p>
            {isEditTitle ? <textarea ref={editTitleRef} defaultValue={title} onKeyDown={onKeyDownTitle} className='absolute top-0 left-0 w-full h-full appearance-none px-[14px] py-[8px] bg-white border-2 border-[#828282] rounded-md'/> : null}
          </div>
          
          <div className='flex gap-5'>
            {daysLeft === '' || isChecked ? null : <p className='text-[#EB5757]'>{daysLeft} Days Left</p>}
            <p className=''>{displayDate}</p>
          </div>
        </div>

        {isOpen ? 
          <div className='flex flex-col gap-3 pt-[22px]'>
            <div className='flex gap-3 items-center'>
              <div onClick={(e) => datePickerRef.current.showPicker()} className='cursor-pointer'>
                {date ? <ScheduleBlueIcon /> : <ScheduleIcon />}
              </div>
              <input ref={datePickerRef} value={date} onChange={onPickDate} type="date" className='appearance-none px-[14px] py-[8px] bg-white border-2 border-[#828282] rounded-md'/>
            </div>

            <div className='flex gap-3 items-center'>
              <div className='cursor-pointer' onClick={() => setIsEditDetail(old => !old)}>
                {detail === 'No Description' ? <EditIcon /> : <EditBlueIcon />}
              </div>
              <div className='relative w-full'>
                <p onClick={() => setIsEditDetail(old => !old)} className={`${isEditDetail ? 'opacity-0 h-[150px]' : ''} cursor-pointer`}>{detail}</p>
                {isEditDetail ? <textarea ref={editDetailRef} defaultValue={detail} onKeyUp={onKeyDownDetail} className='absolute top-0 left-0 w-full h-full appearance-none px-[14px] py-[8px] bg-white border-2 border-[#828282] rounded-md'/> : null}
              </div>
            </div>

            <div className='flex gap-3 items-center'>
              <div className='relative'>
                <div onClick={() => setIsTagPopUpOpen(old => !old)} className='cursor-pointer'>
                  {tagsIndex.length > 0 ? <BookmarksBlueIcon /> : <BookmarksIcon />}
                </div>

                {isTagPopUpOpen ? <div className='z-50 rounded-md border-2 border-[#BDBDBD] bg-white absolute top-0 left-0-0 translate-y-[40px] w-[300px] flex flex-col gap-3 items-start px-3 py-2'>
                  {tags.map((tag, index) => <button key={tag} onClick={() => onPickTag(index)} className={`${tagsIndex.indexOf(index) > -1 ? 'border border-[#2F80ED]' : ''} w-full rounded-md px-[12px] py-[6px] font-bold text-[#4F4F4F] text-start ${colorTags[index]}`}>{tags[index]}</button>)}
                </div> : null}
              </div>
              <div className='flex flex-wrap gap-3'>
                {tagsIndex.length > 0 ? tagsIndex.map((tag) => <p key={tag} className={`rounded-md px-[12px] py-[6px] font-bold text-[#4F4F4F] ${colorTags[tag]}`}>{tags[tag]}</p>) : null}
              </div>
            </div>
          </div>
          : null
        }
      </div>

      <div className='self-start flex gap-5'>
        <div className={`cursor-pointer ${isOpen ? 'rotate-180' : ''}`} onClick={() => setIsOpen(old => !old)}>
          <ExpandIcon />
        </div>
        <div className='relative'>
          <div className='cursor-pointer' onClick={() => setIsDeletePopUpOpen(old => !old)}>
            <MoreIcon />
          </div>

          {isDeletePopUpOpen ? <div className='rounded-md border border-[#BDBDBD] bg-white absolute top-0 right-0 translate-y-[30px] w-[100px] flex flex-col items-start'>
            <button className='px-3 py-2 text-[#EB5757]' onClick={() => {onDeleteTask(task)}}>Delete</button>
          </div> : null}
        </div>
      </div>
    </div>
  )
}

export default Task