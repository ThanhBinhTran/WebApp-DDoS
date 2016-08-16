exports.index = function(req,res) {
	res.render('index');
};

exports.partials = function(req,res) {
	var name = req.params.name;
	res.render('partials/'+ name);
};
exports.test = function(req,res) {
	console.log(req.method, "++"+req.url);
	res.render('index');
}
exports.tmip = function (req, res) {
  var name = req.params.name;
  var news = [];
  for(i = 0; i<10; i++){
          var this_news = { 
            'title': 'hello ' + i,
            'description': 'description ' +i
          }   
          news.push(this_news);
      }

  res.render('tmip/' + name,{
  	title: 'NodeJS experimental sss',
  	newsi: JSON.stringify(news)
  });
};