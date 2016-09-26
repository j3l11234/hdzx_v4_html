export function ajaxGet(url) {
  if (url.indexOf('?') === -1 ){
    url += '?r='+Math.random();
  } else {
    url += '&r='+Math.random();
  }
 return sendAjax(url, 'GET', null);
}

export function ajaxPost(url, data) {
 return sendAjax(url, 'POST', data);
}


export function ajaxPut(url, data) {
  return sendAjax(url, 'PUT', data);
}

export function ajaxDelete(url, data) {
  return sendAjax(url, 'DELETE', data);
}


function sendAjax(url, method, data) {
  let inputData = {
    url: url,
    dataType: 'json',
    type: method,
    contentType: 'application/json; charset=UTF-8',
  };

  if (method != 'GET') {
    inputData.data = JSON.stringify(data);
  }

  return new Promise((resolve,reject) => {
    $.ajax(inputData)
    .done((data, textStatus, jqXHR) => {
      if (data.error == 0) {
        resolve(data);
      } else {
        reject(data);
      }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      reject(textStatus + ': ' + errorThrown);
    });
  });
}