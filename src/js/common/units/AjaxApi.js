
export function ajaxGet(url, callback) {
  $.get(_Server_Data_.BASE_URL + url)
    .done((data, textStatus, jqXHR) => {
      if (data.error == 0) {
        callback && callback(true, data);
      } else {
        callback && callback(false, data);
      }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      let data = {
        error: jqXHR.status,
        message: jqXHR.statusText
      };
      callback && callback(false, jqXHR.responseJSON ? jqXHR.responseJSON : data);
    });
}

export function ajaxPost(url, data, callback) {
  $.post(_Server_Data_.BASE_URL + url, data)
    .done((data, textStatus, jqXHR) => {
      if (data.error == 0) {
        callback && callback(true, data);
      } else {
        callback && callback(false, data);
      }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      data = {
        error: jqXHR.status,
        message: jqXHR.statusText
      };
      callback && callback(false, jqXHR.responseJSON ? jqXHR.responseJSON : data);
    });
}