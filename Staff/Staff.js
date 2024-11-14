import FusePageSimple from '@fuse/core/FusePageSimple';   
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import { changeMaximize } from 'app/store/RightBarSlice';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import HeaderContent from 'app/shared-components/HeaderContent';
import { selectUser } from 'app/store/userSlice';
import reducer from './index';

import {
  getPermissionsByPage,
  selectPermission,
} from '../../administration/store/permissionsSlice';
import Error404Page from '../../404/Error404Page';
import {
  getStuffs,
  selectStaffs,
  // selectCategoriesSearchText,
  // setCategoriesSearchText,
} from './StaffsSlice';

import StaffssList from './StaffList';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function StaffsApp() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const location = useLocation();
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const services = useSelector( selectStaffs);
  const { t } = useTranslation('navigation');
  const[collapseAll,setCollapseAll] = useState(false)
  const routeParams = useParams()
  
  useDeepCompareEffect(() => {

    dispatch(getStuffs());
  }, [dispatch]);

useEffect(()=>{
  setRightSidebarOpen(Boolean(routeParams.id))
},[routeParams])


  useEffect(() => {
     const globalRegex = new RegExp('edit', 'gm');
    dispatch(getPermissionsByPage({ userId, pageName: 'Staffs' }));
   
    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);

  const servicesteps = [
    {
      element: '#services',
      intro: t('ADDSTEP', { name: t('SERVICES') }),
    },
    {
      element: '#two',
      intro: t('VIEWSTEP', { name: t('SERVICES') }),
    },
    {
      element: '#three',
      intro: t('QUESTIONSTEP5', { name: t('SERVICES') }),
    },
  ];

  return canView ? (
    <>
    {console.log(services, "services js data")}
    

    <Root
      header={
        <HeaderContent
          id="staffApp"
         addButtonTo="new/edit"
          steps={servicesteps}
          instruction={t('INSTRUCTION', { name: t('STAFF') })}
          name="STAFF"
          data={services}
          // searchText={searchText}
          // onSearch={(e) => dispatch(setCategoriesSearchText(e))}
          eyeOpen
          setCollapseAll={setCollapseAll}
          collapseAll={collapseAll}
          disableAddButton={!canManage}
          disableSearch
        />
        
      }
      content={<StaffssList canManage={canManage}  setCollapseAll={setCollapseAll}  collapseAll={collapseAll} />}
     
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/view/staff/staff" name="STAFF">
          <Outlet />
        </RightBarLayout>
      }
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={maximize ? '100%' : 640}
      scroll="content"
      
    />

    </>
    
  ) : (
    <Error404Page />
  );
}

export default withReducer('StaffsApp', reducer)(StaffsApp);


