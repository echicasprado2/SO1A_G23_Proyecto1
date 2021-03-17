import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Inicio',
    path: '/',
    //icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  /*{
    title: 'Region Mas Infectada',
    path: '/',
    //icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },*/
  {
    title: 'Deparatamentos mas Infectados',
    path: '/depto/top5',
    //icon: <FaIcons.FaCartPlus />,
    cName: 'nav-text'
  },
  {
    title: 'Casos por Estado',
    path: '/cases/state',
    //icon: <IoIcons.IoMdPeople />,
    cName: 'nav-text'
  },
  {
    title: 'Casos por Tipo',
    path: '/cases/infectedtype',
   // icon: <FaIcons.FaEnvelopeOpenText />,
    cName: 'nav-text'
  },
  {
    title: 'Ultimos Casos',
    path: '/cases/last',
    //icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text'
  },
  {
    title: 'Rango de Edades',
    path: '/cases/agesrange',
    //icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text'
  }
];