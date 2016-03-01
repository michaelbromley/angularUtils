/**
 * A directive to embed a Disqus comments widget on your AngularJS page.
 *
 * Created by Michael on 22/01/14.
 * Modified by Serkan "coni2k" Holat on 24/02/16.
 * Copyright Michael Bromley 2014
 * Available under the MIT license.
 */

(function () {

    /**
     * Config
     */
    var moduleName = 'angularUtils.directives.dirDisqus';

    /**
     * Module
     */
    var module;
    try {
        module = angular.module(moduleName);
    } catch (err) {
        // named module does not exist, so create one
        module = angular.module(moduleName, []);
    }

    module.directive('dirDisqus', ['$window', function ($window) {
        return {
            restrict: 'E',
            scope: {
                config: '='
            },
            template: '<div id="disqus_thread"></div><a href="http://disqus.com" class="dsq-brlink"></a>',
            link: function (scope) {

                scope.$watch('config', configChanged, true);

                function configChanged() {

                    // Ensure that the disqus_identifier and disqus_url are both set, otherwise we will run in to identifier conflicts when using URLs with "#" in them
                    // see http://help.disqus.com/customer/portal/articles/662547-why-are-the-same-comments-showing-up-on-multiple-pages-
                    if (!scope.config.disqus_shortname ||
                        !scope.config.disqus_identifier ||
                        !scope.config.disqus_url) {
                        return;
                    }

                    $window.disqus_shortname = scope.config.disqus_shortname;
                    $window.disqus_identifier = scope.config.disqus_identifier;
                    $window.disqus_url = scope.config.disqus_url;
                    $window.disqus_title = scope.config.disqus_title;
                    $window.disqus_category_id = scope.config.disqus_category_id;
                    $window.disqus_disable_mobile = scope.config.disqus_disable_mobile;
                    $window.disqus_config = function () {
                        this.language = scope.config.disqus_config_language;
                        this.page.remote_auth_s3 = scope.config.disqus_remote_auth_s3;
                        this.page.api_key = scope.config.disqus_api_key;
                        if (scope.config.disqus_on_ready) {
                            this.callbacks.onReady = [function () {
                                scope.config.disqus_on_ready();
                            }];
                        }
                    };

                    // Get the remote Disqus script and insert it into the DOM, but only if it not already loaded (as that will cause warnings)
                    if (!$window.DISQUS) {
                        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                        dsq.src = '//' + scope.config.disqus_shortname + '.disqus.com/embed.js';
                        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
                    } else {
                        $window.DISQUS.reset({
                            reload: true,
                            config: function () {
                                this.page.identifier = scope.config.disqus_identifier;
                                this.page.url = scope.config.disqus_url;
                                this.page.title = scope.config.disqus_title;
                                this.language = scope.config.disqus_config_language;
                                this.page.remote_auth_s3 = scope.config.disqus_remote_auth_s3;
                                this.page.api_key = scope.config.disqus_api_key;
                            }
                        });
                    }
                }
            }
        };
    }]);
})();
