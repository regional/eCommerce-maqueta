import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [

  {
    path: '/home',
    title: 'Inicio',
    icon: 'bi bi-house-door-fill',
    class: '',
    extralink: false,
    submenu: [],
    roles: ["admin", "seller", "shooper"]
  },
  {
    path: '/component/presentation',
    title: 'Videos',
    icon: 'bi bi-play-btn-fill',
    class: '',
    extralink: false,
    submenu: [],
    roles: ["admin", "seller", "shooper"]
  },
// Corrige el archivo menu-items.ts
{
  path: '/component/validacion',
  title: 'Validación Formulario', // Nombre consistente
  icon: 'bi bi-check-circle-fill', // Icono diferente al de videos
  class: '',
  extralink: false,
  submenu: [],
  roles: ["admin", "seller", "shooper"] // Roles corregidos
},

  {
    path: 'component/audio',
    title: 'Audio y Canvas',
    icon: 'bi bi-play-btn-fill',
    class: '',
    extralink: false,
    submenu: [],
    roles: ["admin", "seller", "shooper"]
  },
  {
    path: '/pages/products',
    title: 'Productos',
    icon: 'bi bi-patch-check',
    class: '',
    extralink: false,
    submenu: [],

    roles: ["admin", "seller", "shooper"]
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'bi bi-speedometer2',
    class: '',
    extralink: false,
    submenu: [],
    roles: ["admin", "seller", "shooper"]
  },

  {
    path: '/products',
    title: 'Productos',
    icon: 'bi bi-patch-check',
    class: '',
    extralink: false,
    submenu: [],
    roles: ["admin", "seller", "shooper"]
  },
  {
    path: '/pipes',
    title: 'Usuarios',
    icon: 'bi bi-people-fill',
    class: '',
    extralink: false,
    submenu: [],
    roles: ["admin", "seller", "shooper"]
  }
];
