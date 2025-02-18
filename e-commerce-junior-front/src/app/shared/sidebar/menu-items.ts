import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [

  {
    path: '/dashboard',
    title: 'Inicio',
    icon: 'bi bi-house-door-fill',
    class: '',
    extralink: false,
    submenu: [],
    roles: ["admin", "seller", "shooper"]
  },

// Corrige el archivo menu-items.ts
{
  path: 'component/validacion',
  title: 'Formulario Validacion',
  icon: 'bi bi-patch-check',
  class: '',
  extralink: false,
  submenu: [],
  roles: ["admin", "seller", "shooper"]
},


{
  path: 'component/video',
  title: 'video',
  icon: 'bi bi-patch-check',
  class: '',
  extralink: false,
  submenu: [],
  roles: ["admin", "seller", "shooper"]
},

{
  path: 'component/audio',
  title: 'Audio',
  icon: 'bi bi-patch-check',
  class: '',
  extralink: false,
  submenu: [],
  roles: ["admin", "seller", "shooper"]
},

  {
    path: 'component/responsive',
    title: 'responsive',
    icon: 'bi bi-patch-check',
    class: '',
    extralink: false,
    submenu: [],
    roles: ["admin", "seller", "shooper"]
  },

  {
    path: 'products',
    title: 'Inventario Producto',
    icon: 'bi bi-play-btn-fill',
    class: '',
    extralink: false,
    submenu: [],
    roles: ["admin", "seller", "shooper"]
  },

  {
    path: '/pages/products/product-form',
    title: 'Productos',
    icon: 'bi bi-patch-check',
    class: '',
    extralink: false,
    submenu: [],

    roles: ["admin", "seller", "shooper"]
  },


  {
    path: 'component/chatbot',
    title: 'chatbot',
    icon: 'bi bi-patch-check',
    class: '',
    extralink: false,
    submenu: [],
    roles: ["admin", "seller", "shooper"]
  },
  {
    path: '/people',
    title: 'Usuario',
    icon: 'bi bi-patch-check',
    class: '',
    extralink: false,
    submenu: [],
    roles: ["admin", "seller", "shooper"]
  },
  {
    path: '/about',
    title: 'About',
    icon: 'bi bi-people-fill',
    class: '',
    extralink: false,
    submenu: [],
    roles: ["admin", "seller", "shooper"]
  },

];
