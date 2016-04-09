var sass = require('node-sass');
var fs = require('fs');

sass.render({
  file: './src/scss/app.scss',
  //outputStyle: 'compressed',
  outFile: 'css/app.css',
  sourceMap: true,
  includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets'],
}, function(error, result) { // node-style callback from v3.0.0 onwards 
  if (error) {
    console.log(error.status); // used to be "code" in v2x and below 
    console.log(error.column);
    console.log(error.message);
    console.log(error.line);
  }
  else {
    fs.writeFile('D:/xampp/htdocs/hdzx_v4/frontend/web/css/app.css', result.css);
    fs.writeFile('D:/xampp/htdocs/hdzx_v4/frontend/web/css/app.css.map', result.map);


    console.log(result.stats);

    // or better 
    //console.log(JSON.stringify(result.map)); // note, JSON.stringify accepts Buffer too 
  }
});