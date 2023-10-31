import { FiArrowLeft, FiChevronRight, FiClock, FiHome, FiMail, FiUserPlus } from 'react-icons/fi';
import { HiOutlineUsers } from 'react-icons/hi';
import { IoMdCalendar } from 'react-icons/io';
import { IoCloseOutline, IoLocationSharp, IoPersonOutline } from 'react-icons/io5';
import {
  MdArrowBack,
  MdExitToApp,
  MdKeyboardArrowDown,
  MdLogout,
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineLocalPhone,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdUnfoldMore,
  MdVerifiedUser,
} from 'react-icons/md';
import { TbCurrentLocation, TbFishHook, TbTicket } from 'react-icons/tb';
import { BsFillExclamationTriangleFill } from 'react-icons/bs';
import { FaChevronRight, FaCrown } from 'react-icons/fa6';
import { FiMenu } from 'react-icons/fi';
import { TfiAnchor } from 'react-icons/tfi';
import React from 'react';
import { CgClose } from 'react-icons/cg';
import { LuHome } from 'react-icons/lu';
import { AiFillHome } from 'react-icons/ai';
import { FaAnchor, FaCheck } from 'react-icons/fa';
import { retry } from '@reduxjs/toolkit/query';
import { LiaBalanceScaleSolid } from 'react-icons/lia';
import { PiArrowBendDownLeftBold } from 'react-icons/pi';

export enum IconName {
  logout = 'logout',
  back = 'back',
  burger = 'burger',
  showMore = 'showMore',
  edit = 'edit',
  deleteItem = 'deleteItem',
  time = 'time',
  calendar = 'calendar',
  exit = 'exit',
  lootsCount = 'lootsCount',
  mapLocation = 'mapLocation',
  users = 'users',
  ticket = 'ticket',
  phone = 'phone',
  email = 'email',
  visibleOn = 'visibleOn',
  visibleOff = 'visibleOff',
  dropdownArrow = 'dropdownArrow',
  invited = 'invited',
  verified = 'verified',
  close = 'close',
  violation = 'violation',
  crown = 'crown',
  person = 'person',
  home = 'home',
  anchor = 'anchor',
  hook = 'hook',
  right = 'right',
  check = 'check',
  scales = 'scales',
  return = 'return',
}
export interface IconProps {
  name: IconName | string;
  className?: string;
}

const Icon = ({ name, className }: IconProps) => {
  switch (name) {
    case IconName.logout:
      return <MdLogout className={className} />;
    case IconName.back:
      return <FiArrowLeft className={className} />;
    case IconName.burger:
      return <FiMenu className={className} />;
    case IconName.showMore:
      return <MdUnfoldMore className={className} />;
    case IconName.edit:
      return <MdOutlineEdit className={className} />;
    case IconName.deleteItem:
      return <MdOutlineDelete className={className} />;
    case IconName.time:
      return <FiClock className={className} />;
    case IconName.calendar:
      return <IoMdCalendar className={className} />;
    case IconName.exit:
      return <MdExitToApp className={className} />;
    case IconName.users:
      return <HiOutlineUsers className={className} />;
    case IconName.phone:
      return <MdOutlineLocalPhone className={className} />;
    case IconName.email:
      return <FiMail className={className} />;
    case IconName.dropdownArrow:
      return <MdKeyboardArrowDown className={className} />;
    case IconName.close:
      return <CgClose className={className} />;
    case IconName.person:
      return <IoPersonOutline className={className} />;
    case IconName.home:
      return <AiFillHome className={className} />;
    case IconName.anchor:
      return <FaAnchor className={className} />;
    case IconName.hook:
      return <TbFishHook className={className} />;
    case IconName.right:
      return <FaChevronRight className={className} />;
    case IconName.check:
      return <FaCheck className={className} />;
    case IconName.scales:
      return <LiaBalanceScaleSolid className={className} />;
    case IconName.return:
      return <PiArrowBendDownLeftBold className={className} />;
    default:
      return null;
  }
};

export default Icon;
