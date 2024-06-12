import React from 'react';
import { Route, Redirect } from 'react-router-dom';
 
const RouteGuard2 = ({ component: Component, ...rest }) => {
 
   function hasJWT() {
       let flag = false;
 
       localStorage.getItem("jwt") ? flag=false : flag=true
       
      
       return flag
   }
 
   return (
       <Route {...rest}
           render={props => (
               hasJWT() ?
                   <Component {...props} />
                   :
                   <Redirect to={{ pathname: '/Profil' }} />
           )}
       />
   );
};
 
export default RouteGuard2;