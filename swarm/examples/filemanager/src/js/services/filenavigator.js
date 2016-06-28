(function (angular) {
    'use strict';
    angular.module('FileManagerApp').service('fileNavigator', [
        'apiMiddleware', 'fileManagerConfig', 'item', '$http', function (ApiMiddleware, fileManagerConfig, Item, $http) {

            var FileNavigator = function () {
                this.apiMiddleware = new ApiMiddleware();
                this.requesting = false;
                this.fileList = [];
                this.currentPath = [];
                this.history = [];
                this.error = '';
                this.swarmPath = [];
                this.fullManifest = {};
                this.manifestQueue={};

                this.onRefresh = function () {
                };
            };

            FileNavigator.prototype.deferredHandler = function (data, deferred, defaultMsg) {
                if (!data || typeof data !== 'object') {
                    this.error = 'Bridge response error, please check the docs';
                }
                if (!this.error && data.result && data.result.error) {
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

            FileNavigator.prototype.list = function () {
                return this.apiMiddleware.list(this.currentPath, this.deferredHandler.bind(this));
            };

            FileNavigator.prototype.refresh = function () {
                var self = this;
                var siteHash = window.location.hash.substring(2);
                var path = self.currentPath.join('/');
                if (self.currentPath.length == 0) {
                    self.currentPath = ["swarm:", siteHash];
                }

                self.requesting = true;
                self.fileList = [];
                return self.list().then(function (data) {
                    self.fileList = (data.result || []).map(function (file) {
                        return new Item(file, self.currentPath);
                    });
                    self.buildTree(path);
                    self.onRefresh();
                }).finally(function () {
                    self.requesting = false;
                });
            };

            FileNavigator.prototype.buildTree = function (path) {
                var flatNodes = [], selectedNode = {};

                function recursive(parent, item, path) {
                    var absName = path ? (path + '/' + item.model.name) : item.model.name;
                    if (parent.name.trim() && path.trim().indexOf(parent.name) !== 0) {
                        parent.nodes = [];
                    }
                    if (parent.name !== path) {
                        parent.nodes.forEach(function (nd) {
                            recursive(nd, item, path);
                        });
                    } else {
                        for (var e in parent.nodes) {
                            if (parent.nodes[e].name === absName) {
                                return;
                            }
                        }
                        parent.nodes.push({item: item, name: absName, nodes: []});
                    }

                    parent.nodes = parent.nodes.sort(function (a, b) {
                        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() === b.name.toLowerCase() ? 0 : 1;
                    });
                }

                function flatten(node, array) {
                    array.push(node);
                    for (var n in node.nodes) {
                        flatten(node.nodes[n], array);
                    }
                }

                function findNode(data, path) {
                    return data.filter(function (n) {
                        return n.name === path;
                    })[0];
                }

                !this.history.length && this.history.push({name: '', nodes: []});
                flatten(this.history[0], flatNodes);
                selectedNode = findNode(flatNodes, path);
                selectedNode && (selectedNode.nodes = []);

                for (var o in this.fileList) {
                    var item = this.fileList[o];
                    item instanceof Item && item.isFolder() && recursive(this.history[0], item, path);
                }
            };

            FileNavigator.prototype.folderClick = function (item) {
                this.currentPath = [];
                if (item && item.isFolder()) {
                    this.currentPath = item.model.fullPath().split('/').splice(1);
                }
                this.refresh();
            };

            FileNavigator.prototype.upDir = function () {
                if (this.currentPath[0]) {
                    this.currentPath = this.currentPath.slice(0, -1);
                    this.refresh();
                }
            };

            FileNavigator.prototype.goTo = function (index) {
                this.currentPath = this.currentPath.slice(0, index + 1);
                this.refresh();
            };

            FileNavigator.prototype.fileNameExists = function (fileName) {
                return this.fileList.find(function (item) {
                    return fileName.trim && item.model.name.trim() === fileName.trim();
                });
            };

            FileNavigator.prototype.listHasFolders = function () {
                return this.fileList.find(function (item) {
                    return item.model.type === 'dir';
                });
            };

            FileNavigator.prototype.fixUrl = function (url) {
                function getCookie(name) {
                    var matches = document.cookie.match(new RegExp(
                        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
                    ));
                    return matches ? decodeURIComponent(matches[1]) : undefined;
                }

                // if is_debug enabled you can use swarm via php proxy
                if (getCookie('is_debug') == 1) {
                    url = url.replace('/bzz:', '/proxy/bzz.php').replace('/bzzr:', '/proxy/bzzr.php');
                }

                console.log(url);

                return url;
            };

            FileNavigator.prototype.downloadFullManifest = function (hash, key) {
                if (!hash) {
                    hash = window.location.hash.substring(2);
                }

                if (!key) {
                    key = '';
                }

                var self = this;
                var url = this.fixUrl('/bzzr:/') + hash;
                console.log("url: " + url);
                $http.get(url, {}).success(function (data) {
                    console.log(data);
                    $.each(data.entries, function (k, v) {
                        var path = v.path;
                        if (!path) {
                            // handle root folder hash here
                        }

                        var keyPath = key + path;
                        self.fullManifest[keyPath] = v.hash;
                        if (v.contentType == "application/bzz-manifest+json") {
                            delete self.fullManifest[keyPath];
                            self.downloadFullManifest(v.hash, keyPath);
                        }
                    });

                    console.log(self.fullManifest);
                    console.log(Object.keys(self.fullManifest).length);
                    //dfHandler(convertedData, deferred);
                }).error(function (data) {
                    //dfHandler(data, deferred, 'Unknown error listing, check the response');
                })['finally'](function () {
                    //self.inprocess = false;
                });
            };

            return FileNavigator;
        }]);
})(angular);