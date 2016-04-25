import {
  POST_SIGN_IN_PATH,
  HOME_PATH
} from 'config';


export function authRouteResolver(getState) {
  return (nextState, replace) => {
    const { auth } = getState();
    const { pathname } = nextState.location;

    if (!auth.authenticated && `/${pathname}` !== HOME_PATH) {
      replace({pathname: HOME_PATH});
    }
    else if (auth.authenticated && `/${pathname}` !== POST_SIGN_IN_PATH) {
      replace({pathname: POST_SIGN_IN_PATH});
    }
  };
}
