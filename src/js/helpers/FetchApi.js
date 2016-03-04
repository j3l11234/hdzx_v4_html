import fetch from 'isomorphic-fetch';

import { AJAX_LOADING, AJAX_SUCCESS, AJAX_ERROR } from '../constants/ActionTypes';

export function fetchGet(dispatch, url, fn, show = true) {
  show && dispatch({type: AJAX_LOADING, payload: {url}});
  fetch(url, {
    credentials: 'include',
    method: 'GET',
  })
    .then(response => {
      let data = response.json();
      show && dispatch({type: AJAX_SUCCESS, payload: {url, data}});
      return data;
    })
    .then(fn, error => {
      show && dispatch({type: AJAX_ERROR, payload: {url, error}});
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
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      ok = response.ok;
      return response.json();
    })
    .then(data=>{
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