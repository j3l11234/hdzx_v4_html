import fetch from 'isomorphic-fetch';

import { AJAX_LOADING, AJAX_SUCCESS, AJAX_ERROR } from '../constants/ActionTypes';

export function fetchGet(dispatch, url, show = true) {
  show && dispatch({type: AJAX_LOADING, payload: {url}});

  let ok = false;
  return fetch(url, {
    credentials: 'include',
    method: 'GET',
    headers: {
      'x-requested-with': 'XMLHttpRequest'
    }
  }).then(response => {
    ok = response.ok;
    return response.json();
  }).then(data => {
    if (ok) {
      show && dispatch({type: AJAX_SUCCESS, payload: {url, data}});
      return data;
    } else {
      show && dispatch({type: AJAX_ERROR, payload: {url, data}});
      throw data;
    }
  }, error => {
    let data = {message: error.message, status: -1};
    show && dispatch({type: AJAX_ERROR, payload: {url, data}});
    throw data;
  });
}

export function fetchPost(dispatch, url, data, show = true) {
  show && dispatch({type: AJAX_LOADING, payload: {url}});

  let ok = false;
  return fetch(url, {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'x-requested-with': 'XMLHttpRequest'
    }
  }).then(response => {
    ok = response.ok;
    return response.json();
  }).then(data => {
    if (ok) {
      show && dispatch({type: AJAX_SUCCESS, payload: {url, data}});
      return data;
    } else {
      show && dispatch({type: AJAX_ERROR, payload: {url, data}});
      throw data;
    }
  }, error => {
    let data = {message: error.message, status: -1};
    show && dispatch({type: AJAX_ERROR, payload: {url, data}});
    throw data;
  });
}