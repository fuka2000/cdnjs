angular.module('ngWig', ['ngwig-app-templates']);




angular.module('ngWig').directive('ngWig', function () {

      return {
        scope: {
          content: '=ngWig',
          debug: '&'
        },
        restrict: 'A',
        replace: true,
        templateUrl: 'ng-wig/views/ng-wig.html',
        link: function (scope) {
          scope.editMode = false;

          scope.execCommand = function (command, options) {
            scope.$emit('execCommand', {command: command, options: options});
          }
        }
      }
    }
);


angular.module('ngWig').directive('ngWigEditable', function () {
      function init(scope, $element, attrs, ctrl) {
        var $document = $element[0].contentDocument,
            $body;
        $document.open();
        $document.write('<!DOCTYPE html><html><head></head><body contenteditable="true"></body></html>');
        $document.close();
        $body = angular.element($element[0].contentDocument.body);

        //model --> view
        ctrl.$render = function () {
          $body[0].innerHTML = ctrl.$viewValue || '';
        }

        //view --> model
        $body.bind('blur keyup change paste', function () {
          scope.$apply(function blurkeyup() {
            ctrl.$setViewValue($body.html());
          });
        });

        scope.$on('execCommand', function (event, params) {
          var sel = $document.selection,
              command = params.command,
              options = params.options;
          if (sel) {
            var textRange = sel.createRange();
            $document.execCommand(command, false, options);
            textRange.collapse(false);
            textRange.select();
          }
          else {
            $document.execCommand(command, false, options);
          }
          $document.body.focus();
          //sync
          scope.$evalAsync(function () {
            ctrl.$setViewValue($body.html());
          });
        });

      }
      return {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        link: init
      }
    }
);
angular.module('ngwig-app-templates', ['ng-wig/views/ng-wig.html']);

angular.module("ng-wig/views/ng-wig.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ng-wig/views/ng-wig.html",
    "<div class=\"ng-wig\">\n" +
    "  <ul class=\"nw-toolbar\">\n" +
    "    <li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--header-one\" title=\"Header\" ng-click=\"execCommand('formatblock', '<h1>')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--paragraph\" title=\"Paragraph\" ng-click=\"execCommand('formatblock', '<p>')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--unordered-list\" title=\"Unordered List\" ng-click=\"execCommand('insertunorderedlist')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--ordered-list\" title=\"Ordered List\" ng-click=\"execCommand('insertorderedlist')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--bold\" title=\"Bold\" ng-click=\"execCommand('bold')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--italic\" title=\"Italic\" ng-click=\"execCommand('italic')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--link\"></button>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"nw-editor\">\n" +
    "    <textarea class=\"nw-editor__src\" ng-show=\"editMode\" ng-model=\"content\"></textarea>\n" +
    "    <iframe class=\"nw-editor__res\" frameBorder=\"0\" ng-hide=\"editMode\" ng-model=\"content\" ng-wig-editable></iframe>\n" +
    "  </div>\n" +
    "</div>");
}]);
