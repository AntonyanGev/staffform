import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import DevMode from 'app/shared-components/DevMode';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import ImageBox from 'app/shared-components/ImageBox';

import { useState } from 'react';
import { FILE_API_URL } from '@api/http';
import { useTranslation } from 'react-i18next';
import translations from 'src/app/configs/navigation-i18n/en';
import style from "./Staff.module.css"
import { getStuffs } from './StaffsSlice';




function ServiceListItem(props) {
  const { item, canManage, hide, hideRole,hideCategory,hidePhone,hideEmail,filterByCategory, selectedValue } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const { translationLanguage } = useSelector((state) => state.i18n);
     const { t } = useTranslation('navigation');
    const data=item

   
console.log(item, "this is item")
console.log(selectedValue, "this is selectedValuey")
  return (
  <div className={
  (() => {
    if (selectedValue === 'SHOWALL') {
      return style.show;
    }
    if (item.category.translations[0].title === selectedValue) {
      return style.show;
    }
    return style.hidden;
  })()
}>
    {console.log(data, "this is data")}
       {console.log(filterByCategory, "this is filterByCategory")}

      <ListItem
        id="two"
        className="px-32 py-16 flex "
        sx={{ bgcolor: item.id === +id ? '' : 'background.paper' }}
        onDoubleClick={() =>
          item.id !== +id && !!canManage && navigate(`/view/staff/staff/${item.id}/edit`)
        }
      >
            
        <DevMode><span className="mx-8 my-8 ">{`id: ${item.id} `}</span></DevMode>

<div className={style.show}>
  <div className="w-[100px] h-[70px]">
       <ListItemAvatar>
              <ImageBox
                src={item?.image_id ?`${FILE_API_URL}/${item.image.name}` :""}
                alt="Staffs"
                // height={60}
                className="rounded"
              />
        </ListItemAvatar>
        </div>


    {item.translations.find((val) => val.language_id === translationLanguage) && (

  <div className="grid pl-[30px]">
      {item.translations[0].title !== null &&
 
  <div className={hide === 'hidden' ? style.hidden : ''}> <strong>{ t('FIRSTNAMELASTNAME') } ։ </strong> {item.translations[0].title},  {console.log(item.translations[0].title,'title[0]')}</div>
    
    }
     {item.role.translations.title !== null &&
      <div className={hideRole === 'cover' ? style.cover : ''}> <strong>{ t('ROLE') } ։ </strong>{item?.role?.translations[0]?.title} </div>
     }
  {item.category.translations[0].title !== null &&
      <div className={hideCategory === 'hidden' ? style.hidden : ''}> <strong>{ t('CATEGORY') } ։ </strong>{item.category.translations[0].title}</div>
  }
      {item.phone !== null &&
       <div className={hidePhone === 'cover' ? style.cover : ''}><strong>{ t('PHONENUMBER') } ։ </strong>+{item.phone}</div>
      }
       {item.email !== null  &&
      <div  className={hideEmail === 'hidden' ? style.hidden : ''}>  <strong>{ t('EMAIL') } ։ </strong>{item.email} </div>
      }
   
  </div>

)} 

        {canManage ? (
          <div className="flex ml-auto items-center">
         
            {item.id === +id ? (
              <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
            ) : (
              <ListItem
                id="one"
                className="px-0"
                component={NavLinkAdapter}
                to={`/view/staff/staff/${item?.id}/edit`}
              >
                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>  {/* staff edit buttom */}
              </ListItem>

            )}
          </div>
        ) : (
          ''
        )}
        
        </div>
      </ListItem>
      <Divider />
    </div> 
  );
}


export default ServiceListItem;


