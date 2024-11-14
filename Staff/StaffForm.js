import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import {Controller, useForm } from 'react-hook-form';
import FormButtons from 'app/shared-components/modals/FormButtons';
import * as yup from 'yup';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField'
import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, FormControlLabel, FormHelperText, Autocomplete, Switch, Typography } from '@mui/material';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import { selectUser } from 'app/store/userSlice';

import {getPermissionsByPage, selectPermission, } from 'src/app/main/administration/store/permissionsSlice';
import { useTranslation } from 'react-i18next';
import createTranslationData from '@helpers/createTranslationData';
import NewImageController from 'app/shared-components/fields/NewImageController';
import EditorTranslationController from 'app/shared-components/fields/EditorTranslationController';
import InputController from 'app/shared-components/fields/InputController';
import PhoneField from 'app/shared-components/fields/Phone';

import {
  addStaff,
  getStaffs2,
  newStaffs,
  removeStaffs,
  selectStaff,
  updateStaffs,
} from "./StaffSlice"
import { getStaffCategories, selectStaffCategories } from '../StaffCategory/StaffCategoriesSlice';
import   {getStuffs } from './StaffsSlice'
import { getStaffRoles, selectStaffRoles } from '../StaffRoles/StaffRolesSlice';


const StaffForm = (props) => {
  const { translationLanguages,translationLanguage } = useSelector((state) => state.i18n);

  const service = useSelector( selectStaff);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const FromRole= useSelector(selectStaffRoles)
  const FromCategory2= useSelector(selectStaffCategories)
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
   const { t } = useTranslation('navigation');
const [newPageChecked, setNewPageChecked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState({});
const [defaultSelected, setDefaultSelected] = useState({});
const [phoneNumber, setPhoneNumber] = useState(''); 


  const edit = routeParams.id !== 'new';

console.log(service,"data from selectStaff")

const schema = yup.object().shape({

  title1: yup.string().trim()
   .required('You must enter a service name'),


  category_id1: yup
    .object()
    .shape({
      id: yup.number()
 
  
    })
    .nullable(),
 


  role_id1: yup
    .object()
    .shape({
      id: yup.number(),

    })
    .nullable(),


  phone: yup
    .string()

    .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number is not valid'),

  email1: yup
    .string()
    .email('Email must be a valid email')
 
});

  const { control, reset,watch, handleSubmit, formState } = useForm({
     mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      category: '',
      role: '',
      phone: '',
      email: '',
    }
  });

  const { isValid, dirtyFields, errors } = formState;
  const [editorData, setEditorData] = useState({});
   
  useEffect(() => {
    dispatch(getStaffCategories());
    dispatch(getStaffRoles())
    // dispatch(getPages())

  }, [dispatch]);





const form = watch()
const [defaultValue, setDefaultValue] = useState(t('CATEGORY'));
const [defaultValue2, setDefaultValue2] = useState(t('ROLES'));
  useEffect(() => {
     dispatch(getPermissionsByPage({ userId, pageName: 'staff' }));
    if (!canManage) {
      navigate(`/view/staff/staff`);
    }
    if(routeParams.id ==="new"){
       dispatch(newStaffs());;
    } else
      dispatch(getStaffs2(routeParams.id))
    setEditorData({});

  }, [dispatch, routeParams.id ,canManage, navigate, userId]);

  const copyService = useMemo(() => {
    return { ...service };
  }, [service]);

 useEffect(() => {
  const img ={
    id:service?.image_id,
    src:service?.image?.thumbnail_url
  }
  setDefaultSelected(img)
  setSelected(img)
 },[service?.image_id,service?.image?.thumbnail_url,])
  




function onSubmit(data) {
   console.log(data,"this is data of sended form");
    data.title = createTranslationData(data, 'title');
    data.image_id = selected.id;
   data.category_id= data.category.id 
  data.role_id= data.role.id 
  data.phone_number = phoneNumber; 
  data.email_=data.email;          


   if (routeParams.id === 'new') {
      dispatch(addStaff(data)).finally(() => {
         dispatch(getStuffs());
         navigate(`/view/staff/staff`);
      });
   } else {
      data.id = routeParams.id;
      dispatch(updateStaffs(data)).finally(() => {
         dispatch(getStaffs2(routeParams.id));
         dispatch(getStuffs());
         navigate(`/view/staff/staff`);
      });
   }
}



  useEffect(() => {
    if (!service) return;

    const newCopyService = { ...copyService }; 
    if (edit) {
       console.log(service,"service from form")
        service.translations.forEach((item) => {
            copyService[`title${item.language_id}`] = item.title;
        });

        if (FromCategory2.length) {
            console.log(FromCategory2,"FromCategory2 from form")
            const category = FromCategory2.find((e) => e.id === service.category_id) || null;
            copyService.category = category;

            if (category) {
                const translation = category.translations.find((tr) => tr.language_id === translationLanguage);
                if (translation) {
                    setDefaultValue(`${translation.title} (${category.slug})`);
                }
            }
        }
         if (FromRole.length) {
            const role = FromRole.find((e) => e.id === service.role_id) || null;
            copyService.role = role;

            if (role) {
                const translation = role.translations.find((tr) => tr.language_id === translationLanguage);
                if (translation) {
                    setDefaultValue2(`${translation.title} `);
                }
            }
        }
    } else {
        translationLanguages.forEach((language) => {
            newCopyService[`title${language.id}`] = ''; 
        });
         setSelected(0);
         setDefaultValue(t('CATEGORY'));
         setDefaultValue2(t('ROLE'));
   
    }

    reset({ ...newCopyService });
}, [service, edit, reset, copyService, FromCategory2, translationLanguage, translationLanguages]);






useEffect(() => {
    reset({ ...copyService });
  }, [copyService, service, reset]);


   if (_.isEmpty(form) || !service) {
    return <FuseLoading />;
  }

console.log(service, "serviceeeee")
  return (
    <>
    
      <Box className="relative flex flex-col flex-auto items-center px-24">
        
         <div className="relative flex flex-col flex-auto items-start content-start w-full px-2 sm:px-48">
        <NewImageController 
  id="services"
  setDefaultSelected={setDefaultSelected}
  control={control}
  name="icon_id"
  disableEdit={!canManage}
  selected={selected}
  defaultSelected ={ defaultSelected}
  setSelected ={setSelected}
/>

       
        <InputTranslationController control={control} errors={errors} name="title" label='FIRSTNAMELASTNAME' />
  

{console.log(FromRole, "data from")} 
{console.log(FromCategory2,"data from category")}
 {FromCategory2 && FromCategory2.length > 0 ? (
  <Controller
    name="category"
    control={control}
    render={({ field: { onChange } }) => (
      <Autocomplete
        className="mt-20 w-full"
        options={FromCategory2}
        getOptionLabel={(option) => `${option.translations?.find(tr => tr.language_id === translationLanguage)?.title || 'No title'} (${option.slug})`}
        renderInput={(params) => <TextField {...params} label={defaultValue || 'Select Category'} />}
        onChange={(event, newValue) => onChange(newValue)}
        disablePortal
      />
    )}
  />
) : (
  <FuseLoading />
)}

 {FromRole && FromRole.length > 0 ? (
   <Controller
     name="role"
     control={control}
     render={({ field: { onChange } }) => (
       <Autocomplete
         className="mt-20 w-full"
         options={FromRole}
         getOptionLabel={(option) => `${option.translations?.find(tr => tr.language_id === translationLanguage)?.title || 'No title'} `}
         renderInput={(params) => <TextField {...params} label={defaultValue2 || 'Select Roles'} />}
         onChange={(event, newValue) => onChange(newValue)}
         disablePortal
       />
     )}
   />
 ) : (
   <FuseLoading />
)}
 
 <div className='mt-[10px]'> <strong>{t("PHONENUMBER")}</strong> </div>
   <Controller
                name="phone"
                control={control}
                defaultValue={phoneNumber} 
                render={({ field: { onChange, value } }) => (
                    <PhoneField
                        value={value || phoneNumber} 
                        defaultCountry="am" 
                        onChange={(values) => onChange(values)} 
                    />
                )}
            />

            <InputController control={control} name="email" errors={errors}  /> {/* disabled={edit} */}

</div>


 <FormHelperText>{errors?.Select?.message}</FormHelperText>

     </Box> 
      <FormButtons
  edit={routeParams.id !== 'new'}
  onDeleteFunction={() => {
  dispatch(removeStaffs(service?.id)).then(() => {
     dispatch(getStuffs());
  navigate('/view/staff/staff'); 
    });
  }}
  onSubmitFunction={handleSubmit(onSubmit)}
saveDisable={!isValid || _.isEmpty(dirtyFields)}
/>


    </>
  );
};

export default StaffForm;
