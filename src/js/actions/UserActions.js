import { fetchGet, fetchPost } from '../helpers/FetchApi';
import urls from '../constants/Urls';
import { USER_LOGIN, USER_LOGOUT } from '../constants/ActionTypes';

export function login(username, password, remenber_me, callback) {
	return dispatch => {
		fetchPost(dispatch, urls.base + urls.user.login, {
			username,
			password,
			remenber_me
		}).then(data => {
			const { user } = data;
			dispatch({type: USER_LOGIN, payload: user});
			callback && callback(true, data);
    },data => {
    	callback && callback(false, data);
    });
	};
}

export function logout(callback) {
	return dispatch => {
		fetchPost(dispatch, urls.base + urls.user.logout, null)
		.then(data => {
			const { user } = data;
			dispatch({type: USER_LOGOUT});
			callback && callback(true, data);
    },data => {
    	callback && callback(false, data);
    });
	};
}