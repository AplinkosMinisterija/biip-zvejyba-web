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
import { FaAnchor } from 'react-icons/fa';

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
}
export interface IconProps {
    name: IconName | string;
    className?: string;
}

const Icon = ({ name, className }: IconProps) => {
    switch (name) {
        case 'logout':
            return <MdLogout className={className} />;
        case 'back':
            return <FiArrowLeft className={className} />;
        case 'burger':
            return <FiMenu className={className} />;
        case 'showMore':
            return <MdUnfoldMore className={className} />;
        case 'edit':
            return <MdOutlineEdit className={className} />;
        case 'deleteItem':
            return <MdOutlineDelete className={className} />;
        case 'time':
            return <FiClock className={className} />;
        case 'calendar':
            return <IoMdCalendar className={className} />;
        case 'exit':
            return <MdExitToApp className={className} />;
        case 'lootsCount':
            return <TbCurrentLocation className={className} />;
        case 'mapLocation':
            return <IoLocationSharp className={className} />;
        case 'users':
            return <HiOutlineUsers className={className} />;
        case 'ticket':
            return <TbTicket className={className} />;
        case 'phone':
            return <MdOutlineLocalPhone className={className} />;
        case 'email':
            return <FiMail className={className} />;
        case 'visibleOn':
            return <MdOutlineVisibility className={className} />;
        case 'visibleOff':
            return <MdOutlineVisibilityOff className={className} />;
        case 'dropdownArrow':
            return <MdKeyboardArrowDown className={className} />;
        case 'invited':
            return <FiUserPlus className={className} />;
        case 'verified':
            return <MdVerifiedUser className={className} />;
        case 'close':
            return <CgClose className={className} />;
        case 'violation':
            return <BsFillExclamationTriangleFill className={className} />;
        case 'crown':
            return <FaCrown className={className} />;
        case 'person':
            return <IoPersonOutline className={className} />;
        case 'home':
            return <AiFillHome className={className} />;
        case 'anchor':
            return <FaAnchor className={className} />;
        case 'hook':
            return <TbFishHook className={className} />;
        case 'right':
            return <FaChevronRight className={className} />;

        default:
            return null;
    }
};

export default Icon;
