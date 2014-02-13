!function(a,b){"use strict";a.moaApp=b.module("moaApp",["ngSanitize"])}(window,window.angular),function(a){"use strict";a.controller("ApplicationController",["$rootScope","$scope",function(a,b){b.filtersOpen="",b.modalOpen=!1,b.keyUp=function(a){27===a.keyCode&&b.$broadcast("modal/close")},b.broadcast=function(b){a.$broadcast(b)}}])}(window.moaApp),function(a){"use strict";a.controller("BasketController",["$scope",function(a){a.products=[],a.$on("basket/updated",function(b,c){a.products=c,console.log(c)})}])}(window.moaApp),function(a){"use strict";a.controller("CurrenciesController",["$scope","http","currency",function(a,b,c){a.currencies=[],a.baseCurrency={},a.setCurrency=c.setCurrency,b.getCurrencies().then(function(b){a.currencies=b,a.baseCurrency=_.find(b,function(a){return!!a.base}),a.setCurrency(a.baseCurrency)})}])}(window.moaApp),function(a){"use strict";a.controller("DashboardController",["$scope","dashboard",function(a,b){a.basketCount=0,a.$on("basket/updated",function(c,d){a.basketCount=b.itemCount(d)})}])}(window.moaApp),function(a){"use strict";a.controller("FiltersController",["$scope","$timeout","gateway","dashboard",function(a,b,c,d){a.price={minimum:0,maximum:100},a.batch={colour:null,brand:null},a.setName=c.setName,a.basketCount=0,a.$on("basket/updated",function(b,c){a.basketCount=d.itemCount(c)}),a.setBatch=function(c,d){a.batch[c]="",b(function(){a.batch[c]=d},1)},a.update=function(a,b){a=a.charAt(0).toUpperCase()+a.substring(1),c["set"+a](b)},a.resetPrices=function(){a.price.minimum=0,a.price.maximum=a.immutableStatistics.ranges.price.max,a.setPriceRange(null,a.price.minimum,a.price.maximum)},a.setPriceRange=function(b,d,e){d=a.immutableStatistics.ranges.price.max/100*d,e=a.immutableStatistics.ranges.price.max/100*e,d>e&&("maximum"===b?(a.price.minimum=a.price.maximum,d=e):(a.price.maximum=a.price.minimum,e=d)),c.setPriceRange(d,e+.001)},a.open=function(b){a.$parent.filtersOpen=b},a.close=function(){a.$parent.filtersOpen=""},a.$on("filters/close",a.close)}])}(window.moaApp),function(a){"use strict";a.controller("ModalController",["$scope","$timeout",function(a,b){a.options=null,a.partial="",a.promise=null,a.$on("modal/open",function(c,d,e){b.cancel(a.promise),a.partial="views/"+d,a.options=e}),a.$on("modal/close",function(){a.close()}),a.$on("modal/reset",function(){a.partial="",a.options=null}),a.close=function(){a.$parent.modalOpen=!1,a.promise=b(function(){a.partial="",a.options=null},1250)}}])}(window.moaApp),function(a){"use strict";a.controller("ProductController",["$scope","http","dashboard",function(a,b,c){a.productId=null,a.ERRORS={stock:"Unfortunately the product is currently out of stock.",unknown:"Sorry, but an unknown error occurred."},a.errorMessage="",a.selectedProduct={},a.basketAdding=!1,a.addBasket=function(d){a.basketAdding=!0,b.addBasket(d).then(function(b){return b.data.error?(a.errorMessage=a.ERRORS[b.data.error],void(a.basketAdding=!1)):(a.errorMessage="",a.basketAdding=!1,void c.setBasket(b.data.models))})},a.changeProduct=function(){a.setProduct(a.selectedProduct)},a.setProduct=function(b){return b?void("configurable"!==b.type&&(a.productId=b.id)):void(a.productId=null)}}])}(window.moaApp),function(a){"use strict";a.controller("ProductsController",["$scope","$rootScope","socket","gateway","http","currency",function(a,b,c,d,e,f){a.products=[],a.perPage=15,a.perPageSteps=5,a.maximumPerPage=100,a.currency=f.model,a.$on("currency/changed",function(b,c){a.currency=c}),a.sorting={property:"name",direction:"asc"},a.statistics={},a.immutableStatistics=null,a.view=function(c,d){d&&d.stopPropagation(),a.modalOpen=!0,b.$broadcast("modal/reset"),e.getProduct(c).then(function(a){b.$broadcast("modal/open","product.html",{model:a.data})})},a.closeModal=function(){a.modalOpen&&b.$broadcast("modal/close")},a.closeFilters=function(){b.$broadcast("filters/close")},a.setSorting=function(b){a.sorting.property===b&&(a.sorting.direction="asc"===a.sorting.direction?"desc":"asc"),a.sorting.property=b,c.node.emit("snapshot/products/sortBy",a.sorting.property,a.sorting.direction)},c.node.on("snapshot/products/contentUpdated",function(b,c){a.$apply(function(){a.statistics=c,a.products=d.resolve(b),a.immutableStatistics||(a.immutableStatistics=a.statistics)})}),a.gotoPage=function(a){c.node.emit("snapshot/products/pageNumber",a)},a.nextPage=function(){a.gotoPage(a.statistics.pages.current+1)},a.decreasePerPage=function(){a.perPage!==a.perPageSteps&&c.node.emit("snapshot/products/perPage",a.perPage-=a.perPageSteps)},a.increasePerPage=function(){a.perPage!==a.maximumPerPage&&c.node.emit("snapshot/products/perPage",a.perPage+=a.perPageSteps)},a.previousPage=function(){a.gotoPage(a.statistics.pages.current-1)},a.$on("paging/previous",a.previousPage),a.$on("paging/next",a.nextPage),a.$on("paging/decrease",a.decreasePerPage),a.$on("paging/increase",a.increasePerPage)}])}(window.moaApp),function(a){"use strict";a.directive("filter",["http",function(a){return{restrict:"A",scope:{batched:"=batch",update:"&"},templateUrl:"views/filter.html",link:function(b,c,d){b.type=d.property,b.models=[],b.selected={},b.$watch("batched",function(a){if(a){var c="selectAll"===a?!0:!1;_.forEach(b.selected,function(a,d){b.selected[d]=c}),b.initiateUpdate(b.selected)}}),a.getAttribute(d.namespace).then(function(a){b.models=a.data,_.forEach(b.models,function(a){b.selected[a.id]=!0})}),b.initiateUpdate=function(a){b.update({type:b.type,selected:b.prepare(a)})},b.prepare=function(a){var b=[];return _.forEach(a,function(a,c){a===!0&&b.push(+c)}),b}}}}])}(window.moaApp),function(a){"use strict";a.directive("panel",function(){return{restrict:"A",link:function(a,b,c){a.$watch("filtersOpen",function(a){return a!==c.panel?void b.hide():void b.show()})}}})}(window.moaApp),function(a){"use strict";a.directive("sidebar",["$window",function(a){return{restrict:"A",link:function(b,c){var d=function(){var b=50-a.scrollY,d=0>b?0:b;c[0].style.top=(d>50?50:d)+"px"};angular.element(a).bind("scroll",d),d()}}}])}(window.moaApp),function(a){"use strict";a.filter("convert",function(){return function(a,b){return!b||b.base?a:a*b.rate}})}(window.moaApp),function(a){"use strict";a.service("currency",["$rootScope",function(a){var b={};return b.model=!1,b.setCurrency=function(c){b.model=c,a.$broadcast("currency/changed",c)},b}])}(window.moaApp),function(a){"use strict";a.service("dashboard",["$rootScope","http",function(a,b){var c={};return c.items=[],b.getBasket().then(function(b){c.items=b.data,a.$broadcast("basket/updated",c.items)}),c.setBasket=function(b){c.items=b,a.$broadcast("basket/updated",c.items)},c.itemCount=function(a){var b=0;return _.forEach(a,function(a){b+=+a.quantity}),b},c}])}(window.moaApp),function(a){"use strict";a.service("gateway",["socket",function(a){var b={};return b._productsCache={},b.primaryKey="id",b.resolve=function(a){var c=[];return _.forEach(a,function(a){if(!_.isNumber(a)){var d=a[b.primaryKey];return b._productsCache[d]=a,void c.push(a)}c.push(b._productsCache[a])}),c},b.setPriceRange=function(b,c){a.node.emit("snapshot/products/rangeFilter","price",[b,c])},b.setName=function(b){a.node.emit("snapshot/products/fuzzyFilter","name",b)},b.setColour=function(b){a.node.emit("snapshot/products/colours",b)},b.setManufacturer=function(b){a.node.emit("snapshot/products/manufacturers",b)},b}])}(window.moaApp),function(a){"use strict";a.service("http",["$q","$http",function(a,b){var c={};return c.url="../api/public/",c._request=function(){var d=a.defer();return b.get(c.url+"currencies").then(function(a){d.resolve(a.data)}),d.promise},c.getAttribute=function(a){return b.get(c.url+"attributes/"+a)},c.getProduct=function(a){return b.get(c.url+"product/"+a)},c.getCurrencies=function(){return c._request(c.url+"currencies")},c.getBasket=function(){return b.get(c.url+"basket")},c.addBasket=function(a){return b.get(c.url+"basket/add/"+a)},c}])}(window.moaApp),function(a){"use strict";a.service("socket",["$window",function(a){var b={};return b.url="http://localhost:8888/",b._getSocket=function(){return a.io},b.connect=function(a){return b._getSocket().connect(a)},b.node=b.connect(b.url),b}])}(window.moaApp);