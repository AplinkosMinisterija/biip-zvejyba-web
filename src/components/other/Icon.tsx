import { CgClose } from 'react-icons/cg';
import { FaAnchor, FaCheck, FaTrash } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa6';
import { FiArrowLeft, FiClock, FiDownload, FiMail, FiMenu } from 'react-icons/fi';
import { HiOutlineUsers } from 'react-icons/hi';
import { IoMdCalendar } from 'react-icons/io';
import { IoPersonOutline } from 'react-icons/io5';
import { LiaBalanceScaleSolid } from 'react-icons/lia';
import {
  MdDone,
  MdExitToApp,
  MdKeyboardArrowDown,
  MdLocationOn,
  MdOutlineEdit,
  MdOutlineFullscreen,
  MdOutlineFullscreenExit,
  MdOutlineLocalPhone,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdUnfoldMore,
} from 'react-icons/md';
import { PiArrowBendDownLeftBold } from 'react-icons/pi';
import { IoLocationOutline } from 'react-icons/io5';

export enum IconName {
  remove = 'remove',
  download = 'download',
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
  anchor = 'anchor',
  right = 'right',
  check = 'check',
  scales = 'scales',
  return = 'return',
  eGate = 'eGate',
  fourSquares = 'fourSquares',
  home = 'home',
  journal = 'journal',
  members = 'members',
  tools = 'tools',
  settings = 'settings',
  profile = 'profile',
  investigations = 'investigations',
  logo = 'logo',
  sidebarLogo = 'sidebarLogo',
  active = 'active',
  net = 'net',
  connection = 'connection',
  startFishing = 'startFishing',
  beginFishing = 'beginFishong',
  finishFishing = 'finishFishing',
  fish = 'fish',
  endFishing = 'endFishing',
  location = 'location',
  locationOutline = 'locationOutline',
  researches = 'researches',
  fullscreen = 'fullscreen',
  exitFullScreen = 'exitFullScreen',
}
export interface IconProps {
  name: IconName | string;
  className?: string;
}

const Icon = ({ name, className }: IconProps) => {
  switch (name) {
    case IconName.sidebarLogo:
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 407.18 71.87">
          <path
            fill="#102EB1"
            d="m7.9,58.56h6.44v-12.4c0-1.73-2.09-2.59-3.31-1.37l-6.24,6.24c-2.78,2.78-.81,7.53,3.12,7.53Z"
          />
          <path
            fill="#102EB1"
            d="m52.24,20.66c2.82-2.82,7.65-.82,7.65,3.17v13.06c0,11.97-9.7,21.68-21.68,21.68H14.34L52.24,20.66Zm-8.89,19.96h5.03c4.07,0,7.36-3.3,7.36-7.36v-5.03c0-1.73-2.09-2.59-3.31-1.37l-10.46,10.46c-1.22,1.22-.36,3.31,1.37,3.31Z"
          />
          <path
            fill="#102EB1"
            d="m51.99,0h-6.44v12.4c0,1.73,2.09,2.59,3.31,1.37l6.24-6.24C57.89,4.75,55.92,0,51.99,0Z"
          />
          <path
            fill="#102EB1"
            d="m21.68,0h23.88L7.65,37.9c-2.82,2.82-7.65.82-7.65-3.17v-13.06C0,9.7,9.7,0,21.68,0ZM4.14,30.34c0,1.73,2.09,2.59,3.31,1.37l10.46-10.46c1.22-1.22.36-3.31-1.37-3.31h-5.03c-4.07,0-7.36,3.3-7.36,7.36v5.03Z"
          />
          <path d="m112.07,58.66h-19.86c-4.68,0-6.95-2.19-6.95-5.36s2.34-7.02,6.19-11.17l10.27-11.17c1.21-1.36,2.79-3.25,3.47-4.61h-20.01v-3.09c0-3.02,2.19-5.36,6.72-5.36h18.5c4.76,0,6.34,2.87,6.34,5.21,0,3.17-1.66,6.95-5.21,10.8l-10.19,11.02c-1.43,1.58-2.94,3.4-3.85,5.06h19.78v3.93c0,2.49-2.64,4.75-5.21,4.75Zm-10.42-53.22L113.35.07v2.34c0,3.7-1.21,5.51-4.45,7.4l-7.32,4.23-7.17-4.15c-2.87-1.66-4.61-3.7-4.61-7.7V0l11.85,5.43Z" />
          <path d="m154.73,35.63c-2.72,7.48-7.25,17.29-11.78,23.48h-1.96c-3.02,0-4.61-1.06-6.64-4.08-5.51-8.38-12.46-26.12-13.36-37.14h5.44c3.47,0,5.66,2.64,6.04,4.83,1.43,7.55,3.47,15.4,7.78,23.78,3.85-7.62,7.4-18.42,8.91-28.61h4.3c3.47,0,4.76,1.51,4.76,4.83,0,1.21-.98,6.12-3.47,12.91Z" />
          <path d="m179.49,42.66h-6.64c.76,5.13,5.44,8.38,11.4,8.38,4.23,0,9.21-.83,12.46-3.85h.38v3.17c0,5.21-3.55,9.21-14.72,9.21-10.12,0-20.01-8-20.01-20.46,0-13.59,8.3-22.12,19.93-22.12,8.46,0,16.31,6.04,16.31,15.78,0,7.47-5.66,9.89-19.1,9.89Zm1.89-17.21c-4.91,0-8.3,4-8.53,8.68l-.07,1.36h4.53c9.59,0,11.78-1.06,11.78-3.93,0-4.08-3.02-6.12-7.7-6.12Z" />
          <path d="m204.71,71.87c-4,0-6.57-2.11-6.57-4.61v-3.7c1.43,0,4.15-.23,4.91-.3,2.87-.22,5.29-1.96,5.29-5.89V18.8h2.87c4.53,0,7.25,2.41,7.25,7.02v32.54c0,8.53-5.81,13.51-13.74,13.51Zm8.91-57c-3.25,0-5.96-2.72-5.96-5.96s2.72-5.89,5.96-5.89,5.81,2.64,5.81,5.89-2.57,5.96-5.81,5.96Z" />
          <path d="m233.7,71.87c-3.78,0-7.1-2.49-7.1-6.26v-1.96l5.74-.38c3.7-.22,4.98-1.73,7.17-7.47-5.36-8.08-13.06-28.31-14.42-37.9h5.36c2.79,0,5.36,1.89,5.89,4.76,1.44,7.85,4.45,16.31,8.15,23.48,3.32-7.63,7.02-19.93,7.93-28.24h4.38c3.25,0,4.76,1.44,4.76,4.76,0,4.3-7.1,22.88-8.98,27.25-7.55,17.82-11.55,21.97-18.87,21.97Z" />
          <path d="m286.93,59.57c-10.42,0-19.18-8.53-19.18-20.76V4.3h3.47c3.93,0,6.64,2.26,6.64,7.02v11.85c2.04-2.94,5.51-6.19,11.02-6.19,10.34,0,18.27,8.46,18.27,20.46s-7.85,22.12-20.23,22.12Zm0-33.6c-5.13,0-8.98,5.06-8.98,11.4,0,9.36,4,13.21,10.04,13.21,5.06,0,8.68-4.83,8.68-11.4,0-9.89-3.55-13.21-9.74-13.21Z" />
          <path d="m331.78,59.34h-2.04c-9.66,0-16.31-5.43-16.31-12.91s5.29-12.76,20.23-12.76h3.55v-.53c0-5.74-2.72-7.47-8.76-7.47-7.32,0-11.4,2.79-12.91,4.68h-.38v-3.25c0-4.53,4.08-9.97,14.8-9.97,9.06,0,17.21,4.23,17.21,18.27v9.36c0,8.61-6.34,14.57-15.4,14.57Zm5.51-18.42h-3.62c-7.7,0-9.89,1.81-9.89,5.13s2.57,5.06,7.02,5.06,6.49-2.12,6.49-6.27v-3.93Z" />
        </svg>
      );

    case IconName.logo:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 512 512"
          fill="#102EB1"
        >
          <path d="M68 512h55V406c0-14.8-17.9-22.2-28.3-11.7l-53.4 53.4C17.6 471.4 34.4 512 68 512zM447 188c24.1-24.1 65.4-7 65.4 27.1v111.6c0 102.3-83 185.3-185.3 185.3H123l324-324zm-76 170.6h43c34.8 0 62.9-28.2 62.9-62.9v-43c0-14.8-17.9-22.2-28.3-11.7l-89.4 89.4c-10.3 10.3-2.9 28.2 11.8 28.2zM444.9 0h-55v106c0 14.8 17.9 22.2 28.3 11.7l53.4-53.4C495.2 40.6 478.4 0 444.9 0zM185.7 0h204.1l-324 324C41.7 348.1.4 331 .4 296.9V185.3C.4 83 83.4 0 185.7 0zM35.8 259.4c0 14.8 17.9 22.2 28.3 11.7l89.4-89.4c10.5-10.5 3-28.3-11.7-28.3h-43c-34.8 0-62.9 28.2-62.9 62.9v43.1z"></path>
        </svg>
      );

    case IconName.logout:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      );

    case IconName.active:
      return <MdDone className={className} />;

    case IconName.back:
      return <FiArrowLeft className={className} />;
    case IconName.burger:
      return <FiMenu className={className} />;
    case IconName.showMore:
      return <MdUnfoldMore className={className} />;
    case IconName.edit:
      return <MdOutlineEdit className={className} />;
    case IconName.deleteItem:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke="red"
          fill="transparent"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path
            stroke="red"
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          ></path>
          <line stroke="red" x1="10" y1="11" x2="10" y2="17"></line>
          <line stroke="red" x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      );
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
    case IconName.anchor:
      return <FaAnchor className={className} />;
    case IconName.right:
      return <FaChevronRight className={className} />;
    case IconName.check:
      return <FaCheck className={className} />;
    case IconName.scales:
      return <LiaBalanceScaleSolid className={className} />;
    case IconName.return:
      return <PiArrowBendDownLeftBold className={className} />;
    case IconName.visibleOn:
      return <MdOutlineVisibility className={className} />;
    case IconName.visibleOff:
      return <MdOutlineVisibilityOff className={className} />;
    case IconName.eGate:
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <g id="Group_6068" data-name="Group 6068" transform="translate(-349.5 -473.5)">
            <path
              id="Path_2975"
              data-name="Path 2975"
              d="M365.876,473.5H351.124a1.624,1.624,0,0,0-1.624,1.624v14.752a1.624,1.624,0,0,0,1.624,1.624h.715v-8.064a6.661,6.661,0,0,1,6.661-6.661h0a6.661,6.661,0,0,1,6.661,6.661V491.5h.715a1.624,1.624,0,0,0,1.624-1.624V475.124A1.624,1.624,0,0,0,365.876,473.5Z"
              transform="translate(0 0)"
              fill="#121A55"
            />
            <path
              id="Path_2976"
              data-name="Path 2976"
              d="M386.98,529.746c-.8.366.412-1.146-.262-.907-.011-.077.122-.252.2-.136.115.016,0-.147-.087-.1-.737-.276-1.219-1-1.838-1.46.04-.25-.94-.053-1.251-.254-.077-.1-.422-1.092-.426-.7-.5-.1-.641.812-1.07.366-.5.27-.477.071-.924-.1-.12-.082-.448.138-.32-.041.022-.1-.153.013-.285-.039-.224.287-.548-.19-.861-.015-.3.605-.289-.29-.532-.177-.542.475-1.26-.357-1.959.11-2.692.459-1.638,2.136-1.535,3.648-.057.243.174-.084.253-.018.053.259.94.714,1.213.711.193-.116.069.427.324.12a1.353,1.353,0,0,1,.693.016c.527-.279.107.314.6.365.4.31.189.567-.109.874-.011.649-.245,1.018.474,1.014.183-.041.065.094.2.106s-.106.207.236.169c1.148.256.4,1.668,1.382,1.243.051.08.2.028.292-.049.51.233.451-.322.791.178.517.062.426-.3.868-.357.148.277.467.031.213-.358.194-.033.043-.038.1-.129.318-.065.172-.092.4.062.445-.064.3-.442.444-.473.351.183.374-.2.584-.111-.043.093.332.262.032.212-.176.422.8.5.526-.223-.21.1,0-.076-.149-.119-.516.244-.276-.151-.173-.373-.051-.364.149-.263.269-.47,0-.2-.211-.615,0-.752.222-.975.831-.051,1-1.125.044-.241.417.141.414-.078.2-.079.39.343.374-.153C387.255,529.909,387.735,529.873,386.98,529.746Z"
              transform="translate(-22.714 -44.877)"
              fill="#121A55"
            />
          </g>
        </svg>
      );

    case IconName.fourSquares:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      );
    case IconName.home:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      );
    case IconName.journal:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      );
    case IconName.members:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      );
    case IconName.tools:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <circle cx="12" cy="6" r="3" />
          <path d="M12,9v8.5" />
          <path
            d="M16,15l3-3v5.5c0,1.9-1.6,3.5-3.5,3.5h0c-1.9,0-3.5-1.6-3.5-3.5c0,1.9-1.6,3.5-3.5,3.5h0C6.6,21,5,19.4,5,17.5
V12l3,3"
          />
        </svg>
      );
    case IconName.settings:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      );
    case IconName.profile:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      );
    case IconName.investigations:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="m19,5.11c-1.89,2.4-4.8,3.94-8.06,3.94s-6.17-1.54-8.06-3.94c1.89-2.4,4.8-3.94,8.06-3.94s6.26,1.54,8.06,3.94Z" />
          <path d="m1,1c.26,1.54.94,2.91,1.89,4.11" />
          <path d="m1,9.23c.26-1.54.94-2.91,1.89-4.11" />
          <line x1="19.06" y1="18.55" x2="1.06" y2="18.55" />
          <line x1="1.06" y1="18.55" x2="1.06" y2="12.55" />
          <line x1="19.06" y1="18.55" x2="19.06" y2="12.55" />
          <line x1="10.06" y1="18.55" x2="10.06" y2="15.55" />
        </svg>
      );
    case IconName.net:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4,13c0.5,0.2,3.6,1.7,7.1,0.1c2.7-1.2,3.8-3.6,4.1-4.2"></path>
          <path d="M4,18c1,0.3,4.3,1.4,8.1,0c4.9-1.8,6.7-6.3,7-7"></path>
          <line x1="4" y1="3" x2="4" y2="21"></line>
          <line x1="18" y1="18" x2="4" y2="3"></line>
          <polyline points="21,12 4,3 12,21 "></polyline>
        </svg>
      );

    case IconName.connection:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <circle cx="12" cy="12" r="3" />
          <circle cx="5" cy="21" r="1" />
          <circle cx="19" cy="3" r="1" />
          <path d="M15,12h1.5c2.5,0,4.5,2,4.5,4.5v0c0,2.5-2,4.5-4.5,4.5H6" />
          <path d="M18,3H7.5C5,3,3,5,3,7.5v0C3,10,5,12,7.5,12H9" />
        </svg>
      );

    case IconName.startFishing:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="116"
          height="115.841"
          viewBox="0 0 116 115.841"
          className={className}
        >
          <path
            id="ship"
            d="M11.558,90.3a5.784,5.784,0,1,0,10.749-4.276l-6.472-16.3,38.372-8.5v27.45a5.779,5.779,0,0,0,11.558,0V61.234l38.372,8.5-6.472,16.3A5.784,5.784,0,0,0,108.414,90.3l8.957-22.6a5.849,5.849,0,0,0-4.1-7.8L94.66,55.8V30.895a5.779,5.779,0,0,0-5.779-5.779H77.323V7.779A5.779,5.779,0,0,0,71.544,2H48.428a5.779,5.779,0,0,0-5.779,5.779V25.116H31.091a5.779,5.779,0,0,0-5.779,5.779V55.8L6.7,59.79a5.849,5.849,0,0,0-4.1,7.8ZM54.207,13.558H65.765V25.116H54.207ZM36.87,36.674H83.1V53.2l-21.845-4.97H58.715L36.87,53.2Zm73.451,65.187a25.312,25.312,0,0,0-5.779,2.6,12.02,12.02,0,0,1-12.136,0,26.7,26.7,0,0,0-26.237,0,12.367,12.367,0,0,1-12.251,0,26.814,26.814,0,0,0-26.237,0,12.02,12.02,0,0,1-12.136,0,25.312,25.312,0,0,0-5.779-2.6,5.779,5.779,0,0,0-7.57,4.161,5.779,5.779,0,0,0,3.872,7.166,12.136,12.136,0,0,1,3.294,1.445,23.116,23.116,0,0,0,11.558,3.178,23.929,23.929,0,0,0,12.024-3.238,15.314,15.314,0,0,1,14.79,0,23.983,23.983,0,0,0,23.809,0,15.314,15.314,0,0,1,14.794,0,23.116,23.116,0,0,0,23.694,0,12.136,12.136,0,0,1,3.294-1.445,5.841,5.841,0,1,0-3.005-11.269Z"
            transform="translate(-1.959 -2)"
            fill="#1121DA"
          ></path>
        </svg>
      );
    case IconName.beginFishing:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <polyline className="st0" points="5.7,19.3 2,14.4 22,9.9 18.5,18.9 "></polyline>
          <polyline className="st0" points="16.7,11.1 11.2,7.2 4.5,7.2 4,13.9 "></polyline>
          <line className="st0" x1="8" y1="4.6" x2="8" y2="7.2"></line>
          <path
            className="st0"
            d="M2.1,18.4c2.4,0,2.4,1,4.7,1c2.4,0,2.4-1,4.7-1c2.4,0,2.4,1,4.7,1s2.4-1,4.7-1"
          ></path>
        </svg>
      );
    case IconName.endFishing:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="116"
          height="116"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
          <line x1="4" y1="22" x2="4" y2="15"></line>
        </svg>
      );

    case IconName.location:
      return <MdLocationOn className={className} />;
    case IconName.researches:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="m19,5.11c-1.89,2.4-4.8,3.94-8.06,3.94s-6.17-1.54-8.06-3.94c1.89-2.4,4.8-3.94,8.06-3.94s6.26,1.54,8.06,3.94Z" />
          <path d="m1,1c.26,1.54.94,2.91,1.89,4.11" />
          <path d="m1,9.23c.26-1.54.94-2.91,1.89-4.11" />
          <line x1="19.06" y1="18.55" x2="1.06" y2="18.55" />
          <line x1="1.06" y1="18.55" x2="1.06" y2="12.55" />
          <line x1="19.06" y1="18.55" x2="19.06" y2="12.55" />
          <line x1="10.06" y1="18.55" x2="10.06" y2="15.55" />
        </svg>
      );

    case IconName.fullscreen:
      return <MdOutlineFullscreen className={className} />;
    case IconName.exitFullScreen:
      return <MdOutlineFullscreenExit className={className} />;
    case IconName.download:
      return <FiDownload className={className} />;
    case IconName.remove:
      return <FaTrash className={className} />;

    case IconName.finishFishing:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
          <line x1="4" y1="22" x2="4" y2="15"></line>
        </svg>
      );

    case IconName.fish:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M22.5,12c-2.2,2.8-5.6,4.6-9.4,4.6c-3.8,0-7.2-1.8-9.4-4.6c2.2-2.8,5.6-4.6,9.4-4.6S20.4,9.2,22.5,12z"></path>
          <path d="M1.5,7.2C1.8,9,2.6,10.6,3.7,12"></path>
          <path d="M1.5,16.8C1.8,15,2.6,13.4,3.7,12"></path>
        </svg>
      );

    case IconName.locationOutline:
      return <IoLocationOutline className={className} />;

    default:
      return null;
  }
};

export default Icon;
