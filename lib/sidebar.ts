import {
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  LayoutDashboard,
  Boxes,
  Box,
} from 'lucide-react';

export const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Produtos',
      url: '/admin/products',
      icon: Box,
    },
    {
      title: 'Categorias',
      url: '/admin/categories',
      icon: Boxes,
    },
    // {
    //   title: 'Playground',
    //   url: '#',
    //   icon: SquareTerminal,
    //   isActive: true,
    //   items: [
    //     {
    //       title: 'History',
    //       url: '#',
    //     },
    //     {
    //       title: 'Starred',
    //       url: '#',
    //     },
    //     {
    //       title: 'Settings',
    //       url: '#',
    //     },
    //   ],
    // },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};
