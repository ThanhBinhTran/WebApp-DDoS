var data = require('./data');

exports.add_routes = function (app) {
	
	//Main database
	app.get('/manga/info/:manga_id', data.getMangaInfoByID);
	app.get('/manga/chapter/:manga_id', data.getChapterList);
	app.get('/manga/chapter/:manga_id/:start/:limit', data.getChapterList);
	app.get('/manga/list/:group_id', data.getMangaList);
	app.get('/manga/image/:chap_id', data.getChapterImages);

	// app.get('/bua/novel/category/:id', data.getAllNovelOfCategory);
	// app.get('/bua/novel/brief/category/:id', data.getAllNovelOfCategory);
	// app.get('/bua/novel/category/:id/:start/:limit', data.getAllNovelOfCategory);
	// app.get('/bua/novel/brief/category/:id/:start/:limit', data.getAllNovelOfCategory);
	// app.get('/bua/novel/all/:id',data.getAllNovel);
	// app.get('/bua/novel/photo/:id',data.getNovelPhotoById);
	// app.get('/bua/chapter/content/:id',data.getChapterContentById);
	// app.get('/bua/novel/outline/:id',data.getNovelOutline);
}