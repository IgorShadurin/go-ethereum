(function (angular, $) {
    'use strict';
    angular.module('FileManagerApp').service('apiHandler', ['$http', '$q', '$window', '$translate', 'Upload',
        function ($http, $q, $window, $translate, Upload) {

            $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

            var ApiHandler = function () {
                this.inprocess = false;
                this.asyncSuccess = false;
                this.error = '';
            };

            ApiHandler.prototype.deferredHandler = function (data, deferred, defaultMsg) {
                if (!data || typeof data !== 'object') {
                    this.error = 'Bridge response error, please check the docs';
                }
                if (data.result && data.result.error) {
                    this.error = data.result.error;
                }
                if (!this.error && data.error) {
                    this.error = data.error.message;
                }
                if (!this.error && defaultMsg) {
                    this.error = defaultMsg;
                }
                if (this.error) {
                    return deferred.reject(data);
                }
                return deferred.resolve(data);
            };

            ApiHandler.prototype.list = function (apiUrl, path, customDeferredHandler) {
                var self = this;
                var dfHandler = customDeferredHandler || self.deferredHandler;
                var deferred = $q.defer();

                var data = {
                    action: 'list',
                    path: path
                };

                self.inprocess = true;
                self.error = '';
                // todo get files from directory
                dfHandler({
                    "result": [
                        {
                        "time": "07:09",
                        "day": "7",
                        "month": "Jun",
                        "size": "4096",
                        "group": "860",
                        "user": "igor.shadurin@gmail.com",
                        "number": "6",
                        "rights": "drwxr-xr-x",
                        "type": "dir",
                        "name": "images",
                        "date": "2016-06-07 09:21:40"
                    }, {
                        "time": "15:10",
                        "day": "6",
                        "month": "Jun",
                        "size": "4096",
                        "group": "860",
                        "user": "igor.shadurin@gmail.com",
                        "number": "3",
                        "rights": "drwxr-xr-x",
                        "type": "dir",
                        "name": "src",
                        "date": "2016-06-07 09:21:40"
                    }, {
                        "time": "03:11",
                        "day": "7",
                        "month": "Jun",
                        "size": "4096",
                        "group": "860",
                        "user": "igor.shadurin@gmail.com",
                        "number": "3",
                        "rights": "drwxr-xr-x",
                        "type": "dir",
                        "name": "test",
                        "date": "2016-06-07 09:21:40"
                    }, {
                        "time": "04:04",
                        "day": "7",
                        "month": "Jun",
                        "size": "2871635",
                        "group": "860",
                        "user": "igor.shadurin@gmail.com",
                        "number": "1",
                        "rights": "-rw-r--r--",
                        "type": "file",
                        "name": "1465283027569196928552.jpg",
                        "date": "2016-06-07 09:21:40"
                    }, {
                        "time": "14:44",
                        "day": "6",
                        "month": "Jun",
                        "size": "8714",
                        "group": "860",
                        "user": "igor.shadurin@gmail.com",
                        "number": "1",
                        "rights": "-rw-r--r--",
                        "type": "file",
                        "name": "Blank.xlsx.xml",
                        "date": "2016-06-07 09:21:40"
                    }, {
                        "time": "20:06",
                        "day": "6",
                        "month": "Jun",
                        "size": "8082",
                        "group": "860",
                        "user": "igor.shadurin@gmail.com",
                        "number": "1",
                        "rights": "-rw-r--r--",
                        "type": "file",
                        "name": "Errors10.xlsb",
                        "date": "2016-06-07 09:21:40"
                    }, {
                        "time": "15:11",
                        "day": "6",
                        "month": "Jun",
                        "size": "79821",
                        "group": "860",
                        "user": "igor.shadurin@gmail.com",
                        "number": "1",
                        "rights": "-rw-r--r--",
                        "type": "file",
                        "name": "Lol.pdf",
                        "date": "2016-06-07 09:21:40"
                    }, {
                        "time": "14:58",
                        "day": "6",
                        "month": "Jun",
                        "size": "47513",
                        "group": "860",
                        "user": "igor.shadurin@gmail.com",
                        "number": "1",
                        "rights": "-rw-r--r--",
                        "type": "file",
                        "name": "companies.csv",
                        "date": "2016-06-07 09:21:40"
                    }, {
                        "time": "03:23",
                        "day": "7",
                        "month": "Jun",
                        "size": "0",
                        "group": "860",
                        "user": "igor.shadurin@gmail.com",
                        "number": "1",
                        "rights": "-rw-r--r--",
                        "type": "file",
                        "name": "test.zip",
                        "date": "2016-06-07 09:21:40"
                    }, {
                        "time": "12:48",
                        "day": "6",
                        "month": "Jun",
                        "size": "8",
                        "group": "860",
                        "user": "igor.shadurin@gmail.com",
                        "number": "1",
                        "rights": "-rw-r--r--",
                        "type": "file",
                        "name": "ttttttttindex.html",
                        "date": "2016-06-07 09:21:40"
                    }]
                }, deferred);

                self.inprocess = false;
                /*$http.post(apiUrl, data).success(function(data) {
                 dfHandler(data, deferred);
                 }).error(function(data) {
                 dfHandler(data, deferred, 'Unknown error listing, check the response');
                 })['finally'](function() {
                 self.inprocess = false;
                 });*/
                return deferred.promise;
            };

            ApiHandler.prototype.copy = function (apiUrl, items, path) {
                var self = this;
                var deferred = $q.defer();
                var data = {
                    action: 'copy',
                    items: items,
                    newPath: path
                };

                self.inprocess = true;
                self.error = '';
                $http.post(apiUrl, data).success(function (data) {
                    self.deferredHandler(data, deferred);
                }).error(function (data) {
                    self.deferredHandler(data, deferred, $translate.instant('error_copying'));
                })['finally'](function () {
                    self.inprocess = false;
                });
                return deferred.promise;
            };

            ApiHandler.prototype.move = function (apiUrl, items, path) {
                var self = this;
                var deferred = $q.defer();
                var data = {
                    action: 'move',
                    items: items,
                    newPath: path
                };
                self.inprocess = true;
                self.error = '';
                $http.post(apiUrl, data).success(function (data) {
                    self.deferredHandler(data, deferred);
                }).error(function (data) {
                    self.deferredHandler(data, deferred, $translate.instant('error_moving'));
                })['finally'](function () {
                    self.inprocess = false;
                });
                return deferred.promise;
            };

            ApiHandler.prototype.remove = function (apiUrl, items) {
                var self = this;
                var deferred = $q.defer();
                var data = {
                    action: 'remove',
                    items: items
                };

                self.inprocess = true;
                self.error = '';
                $http.post(apiUrl, data).success(function (data) {
                    self.deferredHandler(data, deferred);
                }).error(function (data) {
                    self.deferredHandler(data, deferred, $translate.instant('error_deleting'));
                })['finally'](function () {
                    self.inprocess = false;
                });
                return deferred.promise;
            };

            ApiHandler.prototype.upload = function (apiUrl, destination, files) {
                var self = this;
                var deferred = $q.defer();
                self.inprocess = true;
                self.progress = 0;
                self.error = '';

                var data = {
                    destination: destination
                };

                for (var i = 0; i < files.length; i++) {
                    data['file-' + i] = files[i];
                }

                if (files && files.length) {
                    Upload.upload({
                        url: apiUrl,
                        data: data
                    }).then(function (data) {
                        self.deferredHandler(data, deferred);
                    }, function (data) {
                        self.deferredHandler(data, deferred, 'Unknown error uploading files');
                    }, function (evt) {
                        self.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total)) - 1;
                    })['finally'](function () {
                        self.inprocess = false;
                        self.progress = 0;
                    });
                }

                return deferred.promise;
            };

            ApiHandler.prototype.getContent = function (apiUrl, itemPath) {
                var self = this;
                var deferred = $q.defer();
                var data = {
                    action: 'getContent',
                    item: itemPath
                };

                self.inprocess = true;
                self.error = '';
                $http.post(apiUrl, data).success(function (data) {
                    self.deferredHandler(data, deferred);
                }).error(function (data) {
                    self.deferredHandler(data, deferred, $translate.instant('error_getting_content'));
                })['finally'](function () {
                    self.inprocess = false;
                });
                return deferred.promise;
            };

            ApiHandler.prototype.edit = function (apiUrl, itemPath, content) {
                var self = this;
                var deferred = $q.defer();
                var data = {
                    action: 'edit',
                    item: itemPath,
                    content: content
                };

                self.inprocess = true;
                self.error = '';

                $http.post(apiUrl, data).success(function (data) {
                    self.deferredHandler(data, deferred);
                }).error(function (data) {
                    self.deferredHandler(data, deferred, $translate.instant('error_modifying'));
                })['finally'](function () {
                    self.inprocess = false;
                });
                return deferred.promise;
            };

            ApiHandler.prototype.rename = function (apiUrl, itemPath, newPath) {
                var self = this;
                var deferred = $q.defer();
                var data = {
                    action: 'rename',
                    item: itemPath,
                    newItemPath: newPath
                };
                self.inprocess = true;
                self.error = '';
                $http.post(apiUrl, data).success(function (data) {
                    self.deferredHandler(data, deferred);
                }).error(function (data) {
                    self.deferredHandler(data, deferred, $translate.instant('error_renaming'));
                })['finally'](function () {
                    self.inprocess = false;
                });
                return deferred.promise;
            };

            ApiHandler.prototype.getUrl = function (apiUrl, path) {
                var data = {
                    action: 'download',
                    path: path
                };
                return path && [apiUrl, $.param(data)].join('?');
            };

            ApiHandler.prototype.download = function (apiUrl, itemPath, toFilename, downloadByAjax, forceNewWindow) {
                var self = this;
                var url = this.getUrl(apiUrl, itemPath);

                if (!downloadByAjax || forceNewWindow || !$window.saveAs) {
                    !$window.saveAs && $window.console.error('Your browser dont support ajax download, downloading by default');
                    return !!$window.open(url, '_blank', '');
                }

                var deferred = $q.defer();
                self.inprocess = true;
                $http.get(url).success(function (data) {
                    var bin = new $window.Blob([data]);
                    deferred.resolve(data);
                    $window.saveAs(bin, toFilename);
                }).error(function (data) {
                    self.deferredHandler(data, deferred, $translate.instant('error_downloading'));
                })['finally'](function () {
                    self.inprocess = false;
                });
                return deferred.promise;
            };

            ApiHandler.prototype.downloadMultiple = function (apiUrl, items, toFilename, downloadByAjax, forceNewWindow) {
                var self = this;
                var deferred = $q.defer();
                var data = {
                    action: 'downloadMultiple',
                    items: items,
                    toFilename: toFilename
                };
                var url = [apiUrl, $.param(data)].join('?');

                if (!downloadByAjax || forceNewWindow || !$window.saveAs) {
                    !$window.saveAs && $window.console.error('Your browser dont support ajax download, downloading by default');
                    return !!$window.open(url, '_blank', '');
                }

                self.inprocess = true;
                $http.get(apiUrl).success(function (data) {
                    var bin = new $window.Blob([data]);
                    deferred.resolve(data);
                    $window.saveAs(bin, toFilename);
                }).error(function (data) {
                    self.deferredHandler(data, deferred, $translate.instant('error_downloading'));
                })['finally'](function () {
                    self.inprocess = false;
                });
                return deferred.promise;
            };

            ApiHandler.prototype.compress = function (apiUrl, items, compressedFilename, path) {
                var self = this;
                var deferred = $q.defer();
                var data = {
                    action: 'compress',
                    items: items,
                    destination: path,
                    compressedFilename: compressedFilename
                };

                self.inprocess = true;
                self.error = '';
                $http.post(apiUrl, data).success(function (data) {
                    self.deferredHandler(data, deferred);
                }).error(function (data) {
                    self.deferredHandler(data, deferred, $translate.instant('error_compressing'));
                })['finally'](function () {
                    self.inprocess = false;
                });
                return deferred.promise;
            };

            ApiHandler.prototype.extract = function (apiUrl, item, folderName, path) {
                var self = this;
                var deferred = $q.defer();
                var data = {
                    action: 'extract',
                    item: item,
                    destination: path,
                    folderName: folderName
                };

                self.inprocess = true;
                self.error = '';
                $http.post(apiUrl, data).success(function (data) {
                    self.deferredHandler(data, deferred);
                }).error(function (data) {
                    self.deferredHandler(data, deferred, $translate.instant('error_extracting'));
                })['finally'](function () {
                    self.inprocess = false;
                });
                return deferred.promise;
            };

            ApiHandler.prototype.changePermissions = function (apiUrl, items, permsOctal, permsCode, recursive) {
                var self = this;
                var deferred = $q.defer();
                var data = {
                    action: 'changePermissions',
                    items: items,
                    perms: permsOctal,
                    permsCode: permsCode,
                    recursive: !!recursive
                };

                self.inprocess = true;
                self.error = '';
                $http.post(apiUrl, data).success(function (data) {
                    self.deferredHandler(data, deferred);
                }).error(function (data) {
                    self.deferredHandler(data, deferred, $translate.instant('error_changing_perms'));
                })['finally'](function () {
                    self.inprocess = false;
                });
                return deferred.promise;
            };

            ApiHandler.prototype.createFolder = function (apiUrl, path) {
                var self = this;
                var deferred = $q.defer();
                var data = {
                    action: 'createFolder',
                    newPath: path
                };

                self.inprocess = true;
                self.error = '';
                $http.post(apiUrl, data).success(function (data) {
                    self.deferredHandler(data, deferred);
                }).error(function (data) {
                    self.deferredHandler(data, deferred, $translate.instant('error_creating_folder'));
                })['finally'](function () {
                    self.inprocess = false;
                });

                return deferred.promise;
            };

            return ApiHandler;

        }]);
})(angular, jQuery);