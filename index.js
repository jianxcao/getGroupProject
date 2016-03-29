var request = require('request');
var exec = require('child_process').exec;
var outPutDir = '/Users/jxcao/project/gitLab/fe';
var url = 'https://{项目地址}/api/v3/groups/fe?private_token=私有key';
//clone 项目的方法
var clonePro = function(url) {
	var cmd = "git clone " + url;
	console.log('准备下载:' + url);
	return new Promise(function(resolve, reject) {
		exec(cmd, {
			cwd: outPutDir
		}, function(err) {
			if (err) {
				console.log('失败：' + url);
				reject(err);
			} else {
				console.log('成功：' + url);
				resolve();
			}
		});
	});
};


return new Promise(function(resolve, reject) {
	var r = request.get(url, function(err, httpResponse, body) {
		if (err) {
			reject(err);
		} else {
			resolve(body);
		}
	});
})
.then(function(result) {
	return JSON.parse(result);
})
.then(function(result) {
	var promise = Promise.resolve();
	if (result && result.projects && result.projects.length) {
		result.projects.forEach(function(current) {
			if (current && current.http_url_to_repo) {
				console.log('current', current.http_url_to_repo);
				promise = promise.then(function() {
					return clonePro(current.http_url_to_repo);
				});
			}
		});
	}
	return promise;
});