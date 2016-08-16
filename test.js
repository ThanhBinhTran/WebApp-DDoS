var exec = require('child_process').exec,
    child;

child = exec('ls',
  function (error, stdout, stderr) {
    var lines = stdout.split('\n')
    for(var index in lines){
	if(lines[index].indexOf('.js') >0)
	   console.log(lines[index])
    }
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});

alo = exec('rdaxi 0x78200000',
  function (error, stdout, stderr) {
    console.log(stdout);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});

