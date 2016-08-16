var ncache = require('node-cache');
var db = require('./db');
var retcode    = require('./return_code');
var fs 		   = require('fs');
var utf8 = require('utf8');

var searchCache = new ncache( { stdTTL: 900, checkperiod: 1500 } );



//This function returns integer numbers from low (inclusive) up to high (inclusive) ([low, high])
function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

//This function returns floating-point numbers from low (inclusive) up to high (exclusive) ([low, high))
function random (low, high) {
    return Math.random() * (high - low) + low;
}

//This function returns integer numbers from low (inclusive) up to high (exclusive) ([low, high))
function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}


function getMangaInfoByID(req, res) {
	var id = req.params.manga_id;

	console.log('Retrieving Manga info: ' + id );

	result = {
		code : 'FAIL',
		count : 0,
	}

	db.getConnection(function(err,connection) {
		if(err) {
			//	cb(err,null);
			res.send(JSON.stringify(result));
			console.log(err);
			return;
		}

		var query_string = "SELECT * from manga where _id=" + id;
		//console.log(query_string);
		connection.query(query_string, function(err, rows, fields) {
			if (err) {
				res.send(retcode.getReturnCode('QUERY_ERROR'));
				connection.release();
			}else{
				if(rows.length > 0){
					result.code = 'OK'
					result.count = rows.length;
					result.manga = rows[0];
					//get chapter count
					connection.query("SET NAMES utf8");
					query_string = "SELECT count(*) as count from chapter where control=0 and manga_id="+id;
					connection.query(query_string, function(err, rows, fields) {
						if (err) {
							res.send(retcode.getReturnCode('QUERY_ERROR'));
						}else{
							if(rows.length > 0){
								result.manga.count = rows[0].count;
								res.writeHeader(200, {'Content-Type': 'text/plain; charset=utf-8'});
								res.write(JSON.stringify(result));
								res.end();
							}else{
								result.code='ERROR';
								result.count = 0;
								res.send(JSON.stringify(result));
							}
						}
					});
					connection.release();
				}else{
					result.code='OK';
					result.count = 0;
					res.send(JSON.stringify(result));
					connection.release();
				}
			}
		});
	});
};


function getChapterList(req, res) {
	var id = req.params.manga_id;
	var start = req.params.start;
	var limit = req.params.limit;
	var all = false;
	if(!start || !limit || isNaN(start) || isNaN(limit)){
		all = true;
		start = 0;
		limit = 0;
	}

	console.log('Retrieving Manga: ' + id + " - " + start + " - " +  limit);

	result = {
		code : 'FAIL',
		count : 0,
	}

	db.getConnection(function(err,connection) {
		if(err) {
			//	cb(err,null);
			res.send(JSON.stringify(result));
			console.log(err);
			return;
		}

		var query_string = "SELECT * from manga where _id=" + id;
		//console.log(query_string);
		connection.query(query_string, function(err, rows, fields) {
			if (err) {
				res.send(retcode.getReturnCode('QUERY_ERROR'));
				connection.release();
			}else{
				if(rows.length > 0){
					result.code = 'OK'
					result.count = rows.length;
					result.manga = rows[0];
					//get chapter
					var limit_string = "";
					if(!all){
						limit_string = " LIMIT "+start+","+limit;
					}
					var current = (new Date).getTime()/1000;
					console.log("current time ", current);
					connection.query("SET NAMES utf8");
					query_string = "SELECT * from chapter where control=0 and manga_id="+id + limit_string;
					connection.query(query_string, function(err, rows, fields) {
						if (err) {
							res.send(retcode.getReturnCode('QUERY_ERROR'));
						}else{
							if(rows.length > 0){
								result.manga.count = rows.length;
								result.manga.chaps = rows
								//inser is_new, is_update
								for(var i=0; i< rows.length; i++){
									chap = rows[i];
									if((chap.time_add + 3*86400)>current)
										chap.is_new = 1;
									else
										chap.is_new = 0;
								}
								
								res.writeHeader(200, {'Content-Type': 'text/plain; charset=utf-8'});
								res.write(JSON.stringify(result));
								res.end();
							}else{
								result.code='ERROR';
								result.count = 0;
								res.send(JSON.stringify(result));
							}
						}
					});
					connection.release();
				}else{
					result.code='OK';
					result.count = 0;
					res.send(JSON.stringify(result));
					connection.release();
				}
			}
		});
	});
};


function getChapterImages(req, res) {
	var id = req.params.chap_id;

	console.log('Retrieving chapter: ' + id );

	result = {
		code : 'FAIL',
		count : 0,
	}

	db.getConnection(function(err,connection) {
		if(err) {
			//	cb(err,null);
			res.send(JSON.stringify(result));
			console.log(err);
			return;
		}

		var query_string = "SELECT * from image where chap_id=" + id;
		//console.log(query_string);
		connection.query(query_string, function(err, rows, fields) {
			if (err) {
				res.send(retcode.getReturnCode('QUERY_ERROR'));
				connection.release();
			}else{
				if(rows.length > 0){
					result.code = 'OK'
					result.count = rows.length;
					result.images = rows;
					res.writeHeader(200, {'Content-Type': 'text/plain; charset=utf-8'});
					res.write(JSON.stringify(result));
					res.end();
					connection.release();
				}else{
					result.code='OK';
					result.count = 0;
					res.send(JSON.stringify(result));
					connection.release();
				}
			}
		});
	});
};


function getMangaList(req,res){
	var id = req.params.group_id;
	console.log('Get manga list: ' + id);

	result = {
		code : 'FAIL',
		count : 0,
	}
	var cacheName = "truyen_tranh_manga_list_"+id ;
	searchCache.get(cacheName,function(err,value) {
		if(!err && value && value[cacheName]) {
			console.log("got cached");
			result = value[cacheName];
			res.writeHeader(200, {'Content-Type': 'text/plain; charset=utf-8'});
			res.write(JSON.stringify(result));
			res.end();;
			return;
		} else {
			db.getConnection(function(err,connection) {
				if(err) {
					console.log(err);
					res.send(JSON.stringify(result));
					return;
				}
				var current = (new Date).getTime()/1000;
				console.log("current time ", current);
				connection.query("SET NAMES utf8");
				query_string = "select m._id, m.thumbnail, m.name, m.time_add, m.time_update, m.count_view, m.count_download, count(distinct c._id) as count_chapter from manga as m left join chapter c on c.manga_id = m._id where m.control=0 and m.group_id="+id+" and c.control=0 group by m._id ORDER BY m.time_update DESC";
				connection.query(query_string, function(err, rows, fields) {
					if (err) {
						res.send(JSON.stringify(result));
					}else{
						if(rows.length > 0){
							result.code = 'OK'
							result.count = rows.length;
							result.mangas = rows;
							//inser is_new, is_update
							for(var i=0; i< rows.length; i++){
								manga = rows[i];
								if((manga.time_add + 3*86400)>current)
									manga.is_new = 1;
								else
									manga.is_new = 0;
								if((manga.time_update + 2*86400)>current)
									manga.is_update = 1;
								else
									manga.is_update = 0;
							}
							//set cache
							// searchCache.set( cacheName, result, function( err, success ){});
							// res.writeHeader(200, {'Content-Type': 'text/plain; charset=utf-8'});
							// res.write(JSON.stringify(result));
							// res.end();

							 res.render('manga/test',{
							  	title: 'Manga list i',
							  	data: result
							  });
						}else{
							result.code='OK';
							result.count = 0;
							res.send(JSON.stringify(result));
						}
					}
				});
				connection.release();
			});
		}
	});
}


exports.getMangaInfoByID = getMangaInfoByID;
exports.getChapterList = getChapterList;
exports.getChapterImages = getChapterImages;
exports.getMangaList = getMangaList;