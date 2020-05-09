import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false });// NProgress Configuration
const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start();

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    // determine whether the user has obtained his permission roles through getInfo
    const hasRoles = store.getters.roles && store.getters.roles.length > 0;
    if (hasRoles) {
      next()
    } else {
      // get user info
      // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
      const {roles} = await store.dispatch('user/getInfo');

      // generate accessible routes map based on roles
      const accessRoutes = await store.dispatch('permission/generateRoutes', roles);

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      // hack method to ensure that addRoutes is complete
      // set the replace: true, so the navigation will not leave a history record
      next({...to, replace: true})
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next("/login");
      NProgress.done()
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
});
