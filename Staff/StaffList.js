

import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import { useSelector, useDispatch} from 'react-redux';
import List from '@mui/material/List';
import EmptyContent from 'app/shared-components/EmptyContent';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import TableViewRoundedIcon from '@mui/icons-material/TableViewRounded';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from "./Staff.module.css"
import { selectStaffs } from './StaffsSlice';
import ServiceListItem from './StaffListItem';
import { changeOrderServices } from './StaffSlice';
import { getStaffCategories, selectStaffCategories } from '../StaffCategory/StaffCategoriesSlice';




function StaffssList({ canManage }) {
  const { loading } = useSelector((state) => state.StaffsApp.services);
  const staffs = useSelector(selectStaffs);
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { t } = useTranslation('navigation');

  const [hide,setHide]=useState('title')
  const [hideRole,setHideRole]= useState('role')
  const [hideCategory,setHideCategory]= useState('category')
  const [hidePhone,setHidePhone]= useState('phone')
  const [hideEmail,setHideEmail]= useState('email')
  const [filterDiv,setFilterDiv]=  useState('filter')
  const [filteredByCategory, setFilteredByCategory] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true);
  const dispatch=useDispatch()
  const [selectedValue, setSelectedValue] = useState('SHOWALL'); 
  const SelectedCategory= useSelector(selectStaffCategories,)




useEffect(() => {
    if (SelectedCategory.length <= 0) {
  
      dispatch(getStaffCategories())
      setLoadingCategories(true); 
    }
  }, [SelectedCategory]);

  if (!staffs) {
    return null;
  }

  if (loading) {
    return <FuseLoading />;
  }

  if (staffs.length === 0) {
    return <EmptyContent name="services" />;
  }

  const filterByCategory= SelectedCategory.map((el) => {
    return { id: el.id, title: el.translations[0].title };
  });

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
if (!loadingCategories ) {
    return <FuseLoading />;
  }

  return (
    <div className="flex-col w-full ">
      <div className="flex space-x-[80%] mx-[30px] pb-[45px]">
        {console.log(SelectedCategory,'from Category')}
{console.log(filterByCategory,888888)}
  <div>

   <FormControl fullWidth className="mt-[10px] w-[140px]">
      <InputLabel id="hidden-field-select-label">{t('CATEGORY')}</InputLabel>
      <Select
        labelId="hidden-field-select-label"
        id="hidden-field-select"
        value={selectedValue} 
        label="Category"
        onChange={handleChange} 
      >
        <MenuItem value="SHOWALL"> {t('SHOWALL')}</MenuItem>
        {filterByCategory.map((el) => (
          <MenuItem key={el.id} value={el.title}> 
            {el.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

        </div>

        <div className="flex-col  ml-[1000px] h-[65px]">
        <div className="p-[15px]  pb-2 "> <TableViewRoundedIcon style={{ color: '#2c9bdb', width: '40px', height: '35px',marginLeft:"90px",cursor:"pointer" }}  onClick={()=>{
          if(filterDiv === "filter"){
            setFilterDiv("hidden")
          }else{
            setFilterDiv("filter")
          }
        }}/> </div>
        <div  className={filterDiv === 'hidden' ? style.cover : style.filter} >
          {/* Dropdown to select which field to hide */}
          <FormControl fullWidth >
            <InputLabel id="hidden-field-select-label" >{t('SHOW')}</InputLabel>
            <Select
              labelId="hidden-field-select-label"
              id="hidden-field-select"
              // value={hideRole }
              label="Hide Field"
              // onChange={handleChange}
            >
              <MenuItem  onClick={()=>{
                setHide("title")
                setHideRole("role")
                setHideCategory("category")
                setHidePhone("phone")
                setHideEmail("email")

              }}value="">{t('SHOWALL')}</MenuItem>
              <MenuItem  onClick={()=> {
                if(hide==="title"){
                   setHide("hidden")
                }else{
                   setHide("title")
                }
               }} 
                value="title">{t('FIRSTNAMELASTNAME')}</MenuItem>
              <MenuItem  onClick={()=> {
                if(hideRole==="role"){
                    setHideRole("cover")
                }else{
                   setHideRole("role")
                }
               
              }}value="role">{t('ROLE')}</MenuItem>
              
              <MenuItem  onClick={()=> {
                if(hideCategory==="category"){
                    setHideCategory("hidden")
                }else{
                   setHideCategory("category")
                }
               
              }}value="category">{t('CATEGORY')}</MenuItem>

              <MenuItem   onClick={()=> {
                if(hidePhone==="phone"){
                    setHidePhone("cover")
                }else{
                   setHidePhone("phone")
                }
               
              }}value="phone">{t('PHONE')}</MenuItem>
              <MenuItem onClick={()=> {
                if(hideEmail==="email"){
                    setHideEmail("hidden")
                }else{
                   setHideEmail("email")
                }
               
              }} value="email">{t('EMAIL')}</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      </div>

      <div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          className="w-full"
        >
          <List className="w-full m-0 p-0 relative ">
            <DragAndDrop data={staffs} update={changeOrderServices} disableKey={!canManage}>
              <ServiceListItem     hide={hide} hideRole={hideRole} hideCategory={hideCategory} hidePhone={hidePhone} hideEmail={hideEmail}  filterByCategory={filterByCategory} selectedValue={selectedValue} canManage={canManage} />
            </DragAndDrop>
          </List>
        </motion.div>
      </div>
    </div>
  );
}

export default StaffssList;





















