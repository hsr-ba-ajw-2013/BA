 console.log(process.env.COVERAGE);
 module.exports = process.env.COVERAGE
   ? require('./test-cov/app.js')
   : require('./src/app.js');
