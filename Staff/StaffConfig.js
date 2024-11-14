import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import StaffForm from "./StaffForm"


const StaffApp= lazy(() => import('./Staff'));

const StaffApp2= {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'view/staff/staff',
      element: <StaffApp/>,
      children: [
        {
          path: ':id/edit',
          element: <StaffForm />,
        },
      ],
    },
  ],
};

export default StaffApp2;