import $ from 'jquery';

window.stickAlert = function(style, content) {
  const templete = '\
<div class="alert alert-'+ style +' alert-dismissible fixed" role="alert">\
  <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
' + content + '\
</div>';

  $('#stick-alert').append($(templete));
}