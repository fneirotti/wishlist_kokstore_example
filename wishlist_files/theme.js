;window.la_studio = {};

(function($) {
    "use strict";

    var la_studio = window.la_studio || {};

    function userAgentDetection() {
        var ua = navigator.userAgent.toLowerCase(),
            platform = navigator.platform.toLowerCase(),
            UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0],
            mode = UA[1] == 'ie' && document.documentMode;

        window.laBrowser = {
            name: (UA[1] == 'version') ? UA[3] : UA[1],
            version: UA[2],
            platform: {
                name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
            }
        };
    }
    userAgentDetection();

    function getOffset(elem) {
        if (elem.getBoundingClientRect && window.laBrowser.platform.name != 'ios') {
            var bound = elem.getBoundingClientRect(), html = elem.ownerDocument.documentElement, htmlScroll = getScroll(html), elemScrolls = getScrolls(elem), isFixed = (styleString(elem, 'position') == 'fixed');
            return {
                x: parseInt(bound.left) + elemScrolls.x + ((isFixed) ? 0 : htmlScroll.x) - html.clientLeft,
                y: parseInt(bound.top) + elemScrolls.y + ((isFixed) ? 0 : htmlScroll.y) - html.clientTop
            };
        }
        var element = elem, position = {x: 0, y: 0};
        if (isBody(elem))return position;
        while (element && !isBody(element)) {
            position.x += element.offsetLeft;
            position.y += element.offsetTop;
            if (window.laBrowser.name == 'firefox') {
                if (!borderBox(element)) {
                    position.x += leftBorder(element);
                    position.y += topBorder(element);
                }
                var parent = element.parentNode;
                if (parent && styleString(parent, 'overflow') != 'visible') {
                    position.x += leftBorder(parent);
                    position.y += topBorder(parent);
                }
            } else if (element != elem && window.laBrowser.name == 'safari') {
                position.x += leftBorder(element);
                position.y += topBorder(element);
            }
            element = element.offsetParent;
        }
        if (window.laBrowser.name == 'firefox' && !borderBox(elem)) {
            position.x -= leftBorder(elem);
            position.y -= topBorder(elem);
        }
        return position;
    }
    function getScroll(elem) {
        return {
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop
        };
    }
    function getScrolls(elem) {
        var element = elem.parentNode, position = {x: 0, y: 0};
        while (element && !isBody(element)) {
            position.x += element.scrollLeft;
            position.y += element.scrollTop;
            element = element.parentNode;
        }
        return position;
    }
    function styleString(element, style) {
        return $(element).css(style);
    }
    function styleNumber(element, style) {
        return parseInt(styleString(element, style)) || 0;
    }
    function borderBox(element) {
        return styleString(element, '-moz-box-sizing') == 'border-box';
    }
    function topBorder(element) {
        return styleNumber(element, 'border-top-width');
    }
    function leftBorder(element) {
        return styleNumber(element, 'border-left-width');
    }
    function isBody(element) {
        return (/^(?:body|html)$/i).test(element.tagName);
    }

    la_studio.skrollr = skrollr.init({forceHeight:!1,smoothScrolling:!1,mobileCheck:function(){return!1}});

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function addStyleSheet( css ) {
        var head, styleElement;
        head = document.getElementsByTagName('head')[0];
        styleElement = document.createElement('style');
        styleElement.setAttribute('type', 'text/css');
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = css;
        } else {
            styleElement.appendChild(document.createTextNode(css));
        }
        head.appendChild(styleElement);
        return styleElement;
    }

    function addQueryArg(key, value){
        key = escape(key);
        value = escape(value);
        var s = document.location.search,
            kvp = key+"="+value,
            r = new RegExp("(&|\\?)"+key+"=[^\&]*");
        s = s.replace(r,"$1"+kvp);
        if(!RegExp.$1) {
            s += (s.length>0 ? '&' : '?') + kvp;
        }
        return s;
    }

    function showMessageBox( html ){
        lightcase.start({
            href: '#',
            showSequenceInfo: false,
            maxWidth:600,
            maxHeight: 500,
            onFinish: {
                insertContent: function () {
                    lightcase.get('contentInner').children().html('<div class="la-global-message">' + html + '</div>');
                    lightcase.resize();
                    clearTimeout(la_studio.timeOutMessageBox);
                    la_studio.timeOutMessageBox = setTimeout(function(){
                        lightcase.close();
                    }, 9 * 1000);
                }
            },
            onClose : {
                qux: function() {
                    clearTimeout(la_studio.timeOutMessageBox);
                }
            }
        });

    }

    function isCookieEnable (){
        if (navigator.cookieEnabled) return true;
        document.cookie = "cookietest=1";
        var ret = document.cookie.indexOf("cookietest=") != -1;
        document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
        return ret;
    }

    function isMobile(){
        var isMobile = false;
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))){
            isMobile = true;
        }
        return isMobile;
    }

    la_studio.shortcodes = {
        unit_responsive : function(){
            var xlg = '',
                lg  = '',
                md  = '',
                sm  = '',
                xs  = '';
            $('.la-unit-responsive').each(function(index, element){
                var t 		= $(this),
                    n 		= t.attr('data-responsive-json-new'),
                    target 	= t.data('unit-target'),
                    tmp_xlg = '',
                    tmp_lg  = '',
                    tmp_md  = '',
                    tmp_sm  = '',
                    tmp_xs  = '';
                if (typeof n != "undefined" || n != null) {
                    $.each($.parseJSON(n), function (i, v) {
                        var css_prop = i;
                        if (typeof v != "undefined" && v != null && v != '') {
                            $.each(v.split(";"), function(i, vl) {
                                if (typeof vl != "undefined" && vl != null && vl != '') {
                                    var splitval = vl.split(":"),
                                        _elm_attr = css_prop + ":" + splitval[1] + ";";
                                    switch( splitval[0]) {
                                        case 'xlg':
                                            tmp_xlg     += _elm_attr;
                                            break;
                                        case 'lg':
                                            tmp_lg      += _elm_attr;
                                            break;
                                        case 'md':
                                            tmp_md      += _elm_attr;
                                            break;
                                        case 'sm':
                                            tmp_sm      += _elm_attr;
                                            break;
                                        case 'xs':
                                            tmp_xs      += _elm_attr;
                                            break;
                                    }
                                }
                            });
                        }
                    });
                }
                if(tmp_xlg!='') {   xlg += target+ '{'+tmp_xlg+'}' }
                if(tmp_lg!='') {    lg  += target+ '{'+tmp_lg+'}' }
                if(tmp_md!='') {    md  += target+ '{'+tmp_md+'}' }
                if(tmp_sm!='') {    sm  += target+ '{'+tmp_sm+'}' }
                if(tmp_xs!='') {    xs  += target+ '{'+tmp_xs+'}' }
            });

            var css = '';
            css += md;
            css += "\n@media (min-width: 1200px) {\n"+ lg            +"\n}";
            css += "\n@media (min-width: 1440px) {\n"+ xlg            +"\n}";
            css += "\n@media (max-width: 991px) {\n"+ sm            +"\n}";
            css += "\n@media (max-width: 767px) {\n"+ xs            +"\n}";
            addStyleSheet(css);
            $('.la-divider').removeAttr('style');
        },
        fix_tabs : function(){
            $( document )
                .on( 'click.vc.tabs.data-api', '[data-vc-tabs]', function(e){
                    var $this, plugin_tabs, $slick_slider, $selector;
                    $this = $( this );
                    plugin_tabs = $this.data('vc.tabs');
                    $selector = $( plugin_tabs.getSelector() );
                    $slick_slider = $selector.find('.slick-slider');
                    e.preventDefault();
                    $selector.find('.elm-ajax-loader').trigger('la_event_ajax_load');
                    if( $slick_slider.length > 0 ){
                        $slick_slider.css('opacity','0').slick("setPosition").css('opacity','1');
                    }
                })
                .on('show.vc.accordion','[data-vc-accordion]',function(e){
                    var $this = $(this),
                        $data = $this.data("vc.accordion"),
                        $selector = $data.getTarget(),
                        $slick_slider = $selector.find('.slick-slider');
                    $selector.find('.elm-ajax-loader').trigger('la_event_ajax_load');
                    if( $slick_slider.length > 0 ){
                        $slick_slider.css('opacity','0').slick("setPosition").css('opacity','1');
                    }
                });
        },
        fix_parallax_row: function(){
            la_studio.skrollr.refresh();
            var call_vc_parallax = setInterval(function(){
                if(window.vcParallaxSkroll !== 'undefined'){
                    try{
                        window.vcParallaxSkroll.refresh();
                    }catch (ex){
                        //console.log(ex)
                    }
                    clearInterval(call_vc_parallax);
                }
            },100);
        },
        fix_row_fullwidth: function(){
            var winW = $(window).width(),
                $page = $('#main.site-main');
            $(document).on('vc-full-width-row', function(e){
                if (winW - $page.width() > 25) {
                    for (var i = 1; i < arguments.length; i++) {
                        var $el = $(arguments[i]);
                        $el.addClass("vc_hidden");
                        var $el_full = $el.next(".vc_row-full-width");
                        $el_full.length || ($el_full = $el.parent().next(".vc_row-full-width"));
                        var el_margin_left = parseInt($el.css("margin-left"), 10),
                            el_margin_right = parseInt($el.css("margin-right"), 10),
                            offset = 0 - $el_full.offset().left - el_margin_left + $page.offset().left + parseInt($page.css('padding-left')),
                            width = $page.width();
                        if ($el.css({
                                position: "relative",
                                left: offset,
                                "box-sizing": "border-box",
                                width: $page.width()
                            }), !$el.data("vcStretchContent")) {
                            var padding = -1 * offset;
                            0 > padding && (padding = 0);
                            var paddingRight = width - padding - $el_full.width() + el_margin_left + el_margin_right;
                            0 > paddingRight && (paddingRight = 0), $el.css({
                                "padding-left": padding + "px",
                                "padding-right": paddingRight + "px"
                            })
                        }
                        $el.attr("data-vc-full-width-init", "true"), $el.addClass('vc-has-modified').removeClass("vc_hidden");
                    }
                }
            })
        },
        google_map: function(){
            $(window).on('load resize',function(){
                var $maps = $('.map-full-height');
                $maps.css('height',$maps.closest('.vc_column-inner ').height());
            });
        },
        counter : function(){
            var $shortcode = $('.la-stats-counter');
            $shortcode.appear();
            $shortcode.on('appear', function(){
                var $this = $(this),
                    $elm = $this.find('.icon-value');
                if(false === !!$this.data('appear-success')){
                    var endNum = parseFloat($elm.data('counter-value'));
                    var Num = $elm.data('counter-value') + ' ';
                    var speed = parseInt($elm.data('speed'));
                    var sep = $elm.data('separator');
                    var dec = $elm.data('decimal');
                    var dec_count = Num.split(".");
                    var grouping = true;
                    var prefix = endNum > 0 && endNum < 10 ? '0' : '';
                    if(dec_count[1])
                        dec_count = dec_count[1].length-1;
                    else
                        dec_count = 0;
                    if(dec == "none")
                        dec = "";
                    if(sep == "none")
                        grouping = false;
                    else
                        grouping = true;

                    $elm.countup({
                        startVal: 0,
                        endVal: endNum,
                        decimals: dec_count,
                        duration: speed,
                        options: {
                            useEasing : true,
                            useGrouping : grouping,
                            separator : sep,
                            decimal : dec,
                            prefix: prefix
                        }
                    });
                    $this.data('appear-success','true');
                }
            });
        },
        countdown : function(){
            $(document).on('la_event_countdown','.elm-countdown-dateandtime',function(e){
                var $this = $(this),
                    t = new Date($this.html()),
                    tfrmt = $this.data('countformat'),
                    labels_new = $this.data('labels'),
                    new_labels = labels_new.split(","),
                    labels_new_2 = $this.data('labels2'),
                    new_labels_2 = labels_new_2.split(",");

                var server_time = new Date($this.data('time-now'));

                var ticked = function (a){
                    var $amount = $this.find('.countdown-amount'),
                        $period = $this.find('.countdown-period');
                    $amount.css({
                        'color': $this.data('tick-col'),
                        'border-color':$this.data('br-color'),
                        'border-width':$this.data('br-size'),
                        'border-style':$this.data('br-style'),
                        'border-radius':$this.data('br-radius'),
                        'background':$this.data('bg-color'),
                        'padding':$this.data('padd')
                    });
                    $period.css({
                        'font-size':$this.data('tick-p-size'),
                        'color':$this.data('tick-p-col')
                    });

                    if($this.data('tick-style')=='bold'){
                        $amount.css('font-weight','bold');
                    }
                    else if ($this.data('tick-style')=='italic'){
                        $amount.css('font-style','italic');
                    }
                    else if ($this.data('tick-style')=='boldnitalic'){
                        $amount.css('font-weight','bold');
                        $amount.css('font-style','italic');
                    }
                    if($this.data('tick-p-style')=='bold'){
                        $period.css('font-weight','bold');
                    }
                    else if ($this.data('tick-p-style')=='italic'){
                        $period.css('font-style','italic');
                    }
                    else if ($this.data('tick-p-style')=='boldnitalic'){
                        $period.css('font-weight','bold');
                        $period.css('font-style','italic');
                    }
                };

                if($this.hasClass('usrtz')){
                    $this.countdown({labels: new_labels, labels1: new_labels_2, until : t, format: tfrmt, padZeroes:true,onTick:ticked});
                }else{
                    $this.countdown({labels: new_labels, labels1: new_labels_2, until : t, format: tfrmt, padZeroes:true,onTick:ticked , serverSync:server_time});
                }
            });
            $('.elm-countdown-dateandtime').trigger('la_event_countdown')
        },
        pie_chart : function(){
            $('.la-circle-progress').appear({ force_process: true });
            $('.la-circle-progress').on('appear',function(e){
                var $this = $(this);
                var value = $this.data('pie-value'),
                    color = $this.data('pie-color'),
                    unit  = $this.data('pie-units'),
                    emptyFill = $this.data('empty-fill'),
                    border = 5,
                    init = $this.data('has_init') == 'true' ? true : false,
                    $el_val = $this.find('.sc-cp-v');
                if(!init){
                    $this.find('.sc-cp-canvas').circleProgress({
                        value: parseFloat(value/100),
                        thickness: border,
                        emptyFill: emptyFill,
                        reverse: false,
                        lineCap: 'round',
                        size:130,
                        startAngle: - Math.PI / 2,
                        fill: {
                            color: color
                        }
                    }).on('circle-animation-progress', function(event, progress, stepValue) {
                        $el_val.text( parseInt(100 * stepValue) + unit );
                    });
                    $this.data('has_init','true');
                }
            });
        },
        progress_bar: function(){
            if("undefined" != typeof $.fn.waypoint){
                $(".vc_progress_bar").waypoint(function () {
                    $(this).find(".vc_single_bar").each(function (index) {
                        var $this = $(this),
                            bar = $this.find(".vc_bar"),
                            unit = $this.find(".vc_label_units"),
                            val = bar.data("percentage-value");
                        setTimeout(function () {
                            unit.css({
                                left: val + "%",
                                opacity: 1
                            });
                        }, 200 * index)
                    })
                }, {offset: "85%"})
            }
        }
    };

    la_studio.theme = {
        ajax_loader : function(){
            $('.elm-ajax-loader').appear();
            $(document)
                .on('la_event_ajax_load', '.elm-ajax-loader', function(e){
                    if($(this).hasClass('is-loading') || $(this).hasClass('has-loaded')){
                        return;
                    }
                    var $this = $(this),
                        query = $this.data('query-settings'),
                        request_url = $this.data('request'),
                        nonce = $this.data('public-nonce'),
                        requestData = {
                            action : 'get_shortcode_loader_by_ajax',
                            tag : query.tag,
                            data : query,
                            _vcnonce : nonce
                        };

                    $this.addClass('is-loading');

                    $.ajax({
                        url : request_url,
                        method: "POST",
                        dataType: "html",
                        data : requestData
                    }).done(function(data){
                        var $data = $(data);
                        $(document).trigger('la_event_ajax_load:before_render',[$this,$data]);
                        $this.removeClass('is-loading');
                        $this.addClass('has-loaded');
                        if($data.hasClass('wpb_animate_when_almost_visible')){
                            $data.addClass('wpb_start_animation animated');
                        }else{
                            $data.addClass('fadeIn animated');
                        }
                        $data.appendTo($this);
                        $(document).trigger('la_event_ajax_load:after_render',[$this,$data]);
                    });
                })
                .on('la_event_ajax_load:after_render',function( e, $wrap, $data ){
                    var $slider = $wrap.find('.la-slick-slider'),
                        $isotope = $wrap.find('.la-isotope-container'),
                        $isotope_filter = $wrap.find('.la-isotope-filter-container');
                    if($slider.length){
                        $slider.trigger('la_event_init_carousel')
                    }
                    if($isotope.length){
                        $isotope.trigger('la_event_init_isotope');
                    }
                    if($isotope_filter.length){
                        $isotope_filter.trigger('la_event_init_isotope_filter')
                    }
                    la_studio.shortcodes.fix_parallax_row();
                    $(window).trigger('resize');
                })
                .on('appear', '.elm-ajax-loader', function( e ){
                    $(this).trigger('la_event_ajax_load');
                })
                .on('click', '.elm-loadmore-ajax', function(e){
                    e.preventDefault();
                    if($(this).hasClass('is-loading')){
                        return;
                    }
                    var $this = $(this),
                        $container = $($this.data('container')),
                        elem = $this.data('item-class'),
                        query = $this.data('query-settings'),
                        request_url = $this.data('request'),
                        nonce = $this.data('public-nonce'),
                        paged = parseInt($this.data('paged')),
                        max_page = parseInt($this.data('max-page')),
                        requestData;
                    if(paged < max_page){
                        query.atts.paged = paged + 1;
                        requestData = {
                            action : 'get_shortcode_loader_by_ajax',
                            tag : query.tag,
                            data : query,
                            _vcnonce : nonce
                        };
                        $this.addClass('is-loading');
                        $.ajax({
                            url : request_url,
                            method: "POST",
                            dataType: "html",
                            data : requestData
                        }).done(function(data){
                            var $data = $(data).find(elem);
                            $data.imagesLoaded(function() {
                                if($container.data('slider_config')){
                                    $container.slick('slickAdd', $data);
                                    $container.slick('setPosition');
                                }else if( $container.data('isotope') ){
                                    $container.isotope('insert', $data);
                                    setTimeout(function(){
                                        $container.isotope('layout');
                                    },300)
                                }else{
                                    $data.appendTo($container);
                                }
                                $this.data('paged', paged + 1);
                                $this.removeClass('is-loading');
                                if( max_page === paged + 1 ){
                                    $this.addClass('hide');
                                }
                            });
                        });
                    }
                })
                .on('click', '.elm-pagination-ajax a', function(e){
                    e.preventDefault();
                    if($(this).closest('.elm-pagination-ajax').hasClass('is-loading')){
                        return;
                    }
                    var $this = $(this),
                        $parent = $this.closest('.elm-pagination-ajax'),
                        $container = $($parent.data('container')),
                        elem = $parent.data('item-class'),
                        query = $parent.data('query-settings'),
                        request_url = $parent.data('request'),
                        nonce = $parent.data('public-nonce'),
                        paged = parseInt(getParameterByName('la_paged', $this.attr('href'))),
                        appendType = $parent.data('append-type'),
                        requestData;
                    if(paged > 0){
                        query.atts.paged = paged;
                        requestData = {
                            action : 'get_shortcode_loader_by_ajax',
                            tag : query.tag,
                            data : query,
                            _vcnonce : nonce
                        };
                        $parent.addClass('is-loading');
                        $.ajax({
                            url : request_url,
                            method: "POST",
                            dataType: "html",
                            data : requestData
                        }).done(function(data){
                            var $data = $(data).find(elem);
                            $data.imagesLoaded(function() {
                                if( $container.data('isotope') ){
                                    $container.isotope('remove', $container.isotope('getItemElements'));
                                    $container.isotope('insert', $data);
                                    setTimeout(function(){
                                        $container.isotope('layout');
                                    },300)
                                }else{
                                    if($data.hasClass('wpb_animate_when_almost_visible')){
                                        $data.addClass('wpb_start_animation animated');
                                    }else{
                                        $data.addClass('fadeIn animated');
                                    }
                                    $data.appendTo($container.empty());
                                }
                                $parent.removeClass('is-loading');
                            });
                            $parent.find('.la-pagination').html($(data).find('.la-pagination').html());
                        });
                    }
                });
        },
        mega_menu : function(){

            $(document).on('click', '.toggle-category-menu', function(){
                $(this).next().slideToggle();
            })

            $(document).on('la_reset_megamenu', '.mega-menu', function(){
                var $megaMenu = $(this),
                    containerClass = $megaMenu.parent().attr('data-container'),
                    parentContainerClass = $megaMenu.parent().attr('data-parent-container'),
                    isVerticalMenu = $megaMenu.hasClass('isVerticalMenu'),
                    container_width = $(containerClass).width();

                if(isVerticalMenu){
                    container_width = ( parentContainerClass ? $(parentContainerClass).width() : $(window).width() )  -  $(containerClass).outerWidth();
                }
                $('li.mm-popup-wide > .popup', $megaMenu).removeAttr('style');
                $('li.mm-popup-wide', $megaMenu).each(function(){
                    var $menu_item = $(this),
                        $popup = $('> .popup', $menu_item),
                        $inner_popup = $('> .popup > .inner', $menu_item),
                        item_max_width = parseInt($inner_popup.css('maxWidth')),
                        default_width = 1170;

                    if(container_width < default_width){
                        default_width = container_width;
                    }
                    if(default_width > item_max_width){
                        default_width = item_max_width;
                    }

                    var new_megamenu_width = default_width - parseInt($inner_popup.css('padding-left')) - parseInt($inner_popup.css('padding-right')),
                        _tmp = $menu_item.attr('class').match(/mm-popup-column-(\d)/),
                        columns = _tmp && _tmp[1] || 4;

                    $('> ul > li', $inner_popup).each(function(){
                        var _col = parseFloat($(this).data('column')) || 1;
                        if(_col < 0) _col = 1;
                        var column_width = parseInt( (new_megamenu_width / columns) * _col);
                        $(this).data('old-width', $(this).width()).css('width', column_width);
                    });

                    $popup.width(default_width);
                });
                $('li.mm-popup-wide .megamenu-inited', $megaMenu).removeClass('megamenu-inited');

            });

            $(window).on('resize', function(){
                $('.mega-menu').trigger('la_reset_megamenu');
            })

            $('.mega-menu').trigger('la_reset_megamenu');

            function fix_megamenu_position( elem, containerClass, container_width, isVerticalMenu) {
                if($('.megamenu-inited', elem).length){
                    return false;
                }
                var $popup = $('> .popup', elem);
                if ($popup.length == 0) return;
                var this_popup = $popup.get(0),
                    megamenu_width = $popup.outerWidth();

                if (megamenu_width > container_width) {
                    megamenu_width = container_width;
                }
                if (!isVerticalMenu) {
                    var $container = $(containerClass),
                        container_padding_left = parseInt($container.css('padding-left')),
                        container_padding_right = parseInt($container.css('padding-right')),
                        parent_width = $popup.parent().outerWidth(),
                        left = 0,
                        container_offset = getOffset($container[0]),
                        megamenu_offset = getOffset(this_popup);


                    if (megamenu_width > parent_width) {
                        left = -(megamenu_width - parent_width) / 2;
                    }else{
                        left = 0
                    }

                    if ((megamenu_offset.x - container_offset.x - container_padding_left + left) < 0) {
                        left = -(megamenu_offset.x - container_offset.x - container_padding_left);
                    }
                    if ((megamenu_offset.x + megamenu_width + left) > (container_offset.x + $container.outerWidth() - container_padding_right)) {
                        left -= (megamenu_offset.x + megamenu_width + left) - (container_offset.x + $container.outerWidth() - container_padding_right);
                    }
                    $popup.css('left', left).css('left');
                }

                if (isVerticalMenu) {
                    var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                        itemOffset = $popup.offset(),
                        itemHeight = $popup.outerHeight(),
                        scrollTop = $(window).scrollTop();
                    if (itemOffset.top - scrollTop + itemHeight > clientHeight) {
                        $popup.css({top: clientHeight - itemOffset.top + scrollTop - itemHeight - 20});
                    }
                }
                $popup.addClass('megamenu-inited');
            }

            $('.mega-menu').each(function(){
                var $megaMenu = $(this),
                    containerClass = $megaMenu.parent().attr('data-container'),
                    isVerticalMenu = $megaMenu.hasClass('isVerticalMenu'),
                    parentContainerClass = $megaMenu.parent().attr('data-parent-container'),
                    container_width = $(containerClass).width();

                if(isVerticalMenu){
                    container_width = ( parentContainerClass ? $(parentContainerClass).width() : $(window).width() )  - $(containerClass).outerWidth();
                }

                $('li.mm-popup-wide', $megaMenu).hover(function(){
                    fix_megamenu_position( $(this), containerClass, container_width, isVerticalMenu);
                }, function(){})
            });

            var $primary_menu = $('.main-menu').clone();
            $primary_menu.find('.mm-menu-block').remove();
            $primary_menu.find('.sub-menu').addClass('dl-submenu').removeAttr('style');
            $primary_menu.find('.mm-item-level-0').each(function(){
                var $this = $(this),
                    $submenu = $this.find('> .popup > .inner > .sub-menu').clone();
                $this.find('> .popup').remove();
                $submenu.find('li').removeAttr('style data-column');
                $submenu.appendTo($this);
            });
            $primary_menu.removeAttr('id class').attr('class', 'dl-menu dl-menuopen').appendTo($('#la_mobile_nav'));
            $('#la_mobile_nav').dlmenu({
                animationClasses : {
                    classin : 'dl-animate-in-2',
                    classout : 'dl-animate-out-2'
                }
            });

        },
        accordion_menu : function(){
            $('.menu li > ul').each(function(){
                var $ul = $(this);
                $ul.before('<span class="narrow"><i></i></span>');
            });
            $(document).on('click','.menu li.mm-item-has-sub > a,.menu li > .narrow',function(e){
                e.preventDefault();
                var $parent = $(this).parent();
                if ($parent.hasClass('open')) {
                    $parent.removeClass('open');
                    $parent.find('>ul').stop().slideUp();
                } else {
                    $parent.addClass('open');
                    $parent.find('>ul').stop().slideDown();
                    $parent.siblings().removeClass('open').find('>ul').stop().slideUp();
                }
            });
        },

        headerSidebar: function(){
            var adminbar_height = ($('#wpadminbar').length && $('#wpadminbar').css('position') == 'fixed') ? $('#wpadminbar').height() : 0;
            $('.header--aside .header-aside-wrap').LaStickySidebar({
                containerSelector: '#page',
                additionalMarginTop: adminbar_height
            });
        },
        header_sticky : function(){
            var $body = $('body'),
                $window = $(window),
                lastScrollTop = 0;


            if(!$body.hasClass('enable-header-sticky')) return;

            $window.on('load scroll', function(e){
                var scrollTop = $window.scrollTop(),
                    $header = $('#masthead'),
                    $header_inner = $('#masthead > .site-header-inner'),
                    latest_height = 0,
                    adminbar_height = ($('#wpadminbar').length && $('#wpadminbar').css('position') == 'fixed') ? $('#wpadminbar').height() : 0;

                if('resize' === e.type){
                    $header.height('auto');
                    delete window['latest_height'];
                }
                if(typeof window['latest_height'] === 'undefined'){
                    window['latest_height'] = $header.height();
                }
                if($(window).width() > 991 && scrollTop > window['latest_height']){
                    if(!$header.hasClass('is-sticky')){
                        window['latest_height'] = $header.height();
                        $header.height($header.height());
                        $header.addClass('is-sticky');
                        $header_inner.css('top',adminbar_height);
                    }
                    if(scrollTop < $('#page.site').height() && scrollTop < lastScrollTop){
                        $header_inner.removeClass('sticky--unpinned').addClass('sticky--pinned');
                    }else{
                        $header_inner.removeClass('sticky--pinned').addClass('sticky--unpinned');
                    }
                }else{
                    if(scrollTop < 60){
                    if($header.hasClass('is-sticky')){
                        $header.removeClass('is-sticky');
                        $header_inner.css('top','0').removeClass('sticky--pinned sticky--unpinned');
                        window['latest_height'] = $header.height('auto').height();
                    }
                    }
                }
                lastScrollTop = scrollTop;
            });
        },
        auto_popup : function(){
            $('.la-popup:not(.wpb_single_image)').lightcase({
                maxWidth:1920,
                maxHeight: 1080,
                iframe:{
                    width:1920,
                    height:1080
                }
            });
            $('.la-popup.wpb_single_image a').lightcase({
                showTitle: false,
                showCaption: false,
                maxWidth:1920,
                maxHeight: 1080,
                iframe:{
                    width:1920,
                    height:1080
                }
            });
            $('.la-popup-slideshow').lightcase({
                showTitle: false,
                showCaption: false,
                transition: 'scrollHorizontal'
            });
        },
        auto_carousel : function(){
            $(document).on('la_event_init_carousel','.la-slick-slider, .la-carousel-for-products ul.products',function(e){
                var $this = $(this),
                    slider_config = $this.data('slider_config') || {};
                $this.slick($.extend({
                    prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                    nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                    adaptiveHeight: true
                }, slider_config));
            });
            $('.la-slick-slider,.la-carousel-for-products ul.products').trigger('la_event_init_carousel');
        },
        init_isotope  : function(){
            $(document)
                .on( 'la_event_init_isotope', '.la-isotope-container', function(e){
                    var $this           = $(this),
                        item_selector   = $(this).data('item_selector'),
                        callback        = ( $this.data('callback') || false ),
                        configs         = ( $this.data('config_isotope') || {} );
                    if ($().isotope) {
                        $this.find('.la-isotope-loading').show();
                        configs = $.extend({
                            itemSelector : item_selector,
                            layoutMode: 'packery'
                        },configs);
                        $this.isotope(configs);
                        $this.imagesLoaded(function() {
                            $this.isotope('layout').find('.la-isotope-loading').hide();
                        });
                    }
                })
                .on( 'la_event_init_isotope_filter', '.la-isotope-filter-container', function(e){
                    var $this = $(this),
                        options = ($this.data('isotope_option') || {}),
                        $isotope = $($this.data('isotope_container'));

                    $this.find('li').on('click', function (e) {
                        e.preventDefault();
                        var selector = $(this).attr('data-filter');
                        $this.find('.active').removeClass('active');

                        if (selector != '*')
                            selector = '.' + selector;
                        if ($isotope){
                            $isotope.isotope(
                                $.extend(options,{
                                    filter: selector
                                })
                            );
                        }
                        $(this).addClass('active');
                        $this.find('.la-toggle-filter').removeClass('active').text($(this).text());
                    })
                })
                .on('click', '.la-toggle-filter', function(e){
                    e.preventDefault();
                    $(this).toggleClass('active');
                });

            $('.la-isotope-container').trigger('la_event_init_isotope');
            $('.la-isotope-filter-container').trigger('la_event_init_isotope_filter');

        },
        init_infinite : function(){
            var default_options =  {
                navSelector  : ".la-pagination",
                nextSelector : ".la-pagination a.next",
                loading      : {
                    finished: function(){
                        $('.la-infinite-loading').remove();
                    },
                    finishedMsg: "All item is show",
                    msg: $("<div class='la-infinite-loading'><div class='la-loader spinner3'><div class='dot1'></div><div class='dot2'></div><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></div>")
                }
            };
            $('.posts-infinite-container').each(function() {
                var $this           = $(this),
                    itemSelector    = $this.data('item_selector'),
                    curr_page       = $this.data('page_num'),
                    page_path       = $this.data('path'),
                    max_page        = $this.data('page_num_max');
                $this.infinitescroll(
                    $.extend( default_options, {
                        itemSelector : itemSelector,
                        state : {
                            currPage: curr_page
                        },
                        pathParse : function(a, b) {
                            return [page_path, '/'];
                        },
                        dataType : 'html+callback',
                        maxPage : max_page,
                        appendCallback: false
                    }),
                    function(data) {

                        var $data = $(data).find(itemSelector);
                        $data.hide();
                        $data.find('.twitter-tweet').parent().removeClass('flex-video').removeClass('widescreen').addClass('twitter-tweet-iframe');
                        $this.append($data);
                        $this.find('.la-infinite-loading').remove();
                        $data.imagesLoaded(function() {
                            $data.show();
                            if($data.find('.la-slick-slider').length){
                                $data.find('.la-slick-slider').each(function(){
                                    var $this = $(this),
                                        slider_config = $this.data('slider_config') || {};
                                    $this.slick($.extend({
                                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>'
                                    }, slider_config));
                                });
                            }
                            if ($().isotope) {
                                if ($this.data('isotope')) {
                                    $this.isotope('appended', $data).isotope('layout');
                                    $this.isotope('layout');
                                }
                            }
                        });
                    }
                );
            });
            $('.products-infinite-container').each(function() {
                var $this           = $(this),
                    itemSelector    = $this.data('item_selector'),
                    curr_page       = $this.data('page_num'),
                    page_path       = $this.data('path'),
                    max_page        = $this.data('page_num_max');
                $this.infinitescroll(
                    $.extend( default_options, {
                        itemSelector : itemSelector,
                        state : {
                            currPage: curr_page
                        },
                        pathParse : function(a, b) {
                            return [page_path, '/'];
                        },
                        maxPage : max_page
                    }),
                    function(data) {
                        $this.find('.la-infinite-loading').remove();
                    }
                );
            });
        },
        scrollToTop : function(){
            $(document).on('click', '.btn-backtotop', function(e){
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: 0
                }, 800)
            })
        },
        css_animation : function(){
            if( "undefined" != typeof $.fn.waypoint ){
                $('.la-animation:not(.wpb_start_animation)').waypoint(function(){
                    $(this).addClass($(this).data('animation-class'));
                }, {offset: "85%"} )
            }
        },
        extra_func : function(){
            $(document)
                .on('click','.wc-view-toggle span',function(){
                    var _this = $(this),
                        _mode = _this.data('view_mode');
                    if(!_this.hasClass('active')){
                        $('.wc-view-toggle span').removeClass('active');
                        _this.addClass('active');
                        $('.page-content').find('ul.products').removeClass('products-grid').removeClass('products-list').addClass('products-'+_mode);
                        Cookies.set('oasis_wc_catalog_view_mode', _mode, { expires: 30 });
                    }
                })
                .on('click','.quantity .desc-qty',function(e){
                    e.preventDefault();
                    var $qty = $(this).closest('.quantity').find('.qty'),
                        min_val = 0,
                        max_val = 0,
                        default_val = 1,
                        old_val = parseInt($qty.val());
                    if( $qty.attr('min') )  min_val = parseInt( $qty.attr('min') );
                    if( $qty.attr('max') )  max_val = parseInt( $qty.attr('max') );
                    if( min_val ) default_val = min_val;
                    if( max_val > 0 ) default_val = max_val;
                    if( max_val ){
                        $qty.val( (old_val && max_val > old_val) ? old_val + 1 : default_val);
                    }else{
                        $qty.val( (old_val) ? old_val + 1 : default_val);
                    }
                })
                .on('click','.quantity .inc-qty',function(e){
                    e.preventDefault();
                    var $qty = $(this).closest('.quantity').find('.qty'),
                        min_val = 0,
                        old_val = parseInt($qty.val());
                    if( $qty.attr('min') )  min_val = parseInt( $qty.attr('min') );
                    $qty.val((old_val > 0 && old_val > min_val) ? old_val - 1 : min_val);
                })
                .on('click', '.popup-button-continue', function(e){
                    e.preventDefault();
                    lightcase.close();
                })
                .on('click', '.btn-aside-toggle', function(e){
                    e.preventDefault();
                    $('body').toggleClass('open-header-aside');
                })
                .on('click', '.header-toggle-search', function(e){
                    e.preventDefault();
                    $('body').toggleClass('open-search-form');
                })
                .on('click', '.search-form-aside', function(e){
                    if($(e.target).closest('.search-form').length === 0){
                        $('body').removeClass('open-search-form');
                    }
                })
                .on('click', '.la-overlay-global,.header-aside-overlay', function(e){
                    $('body').removeClass('open-aside open-search-form open-mobile-menu open-widget-filter open-header-aside');
                })
                .on('click', '.btn-mobile-menu-trigger', function(e){
                    e.preventDefault();
                    $(this).toggleClass('active');
                    $(document.body).toggleClass('open-mobile-menu');
                })
                .on('click', '.header7toogle-sidebar', function(e){
                    e.preventDefault();
                    $(this).toggleClass('active');
                    $('#masthead_aside').toggleClass('header7toogle-open-aside');
                })
                .on('click', '.shop-filter-toggle', function(e){
                    e.preventDefault();
                    $(document.body).toggleClass('open-widget-filter');
                });


            $('.append-css-to-head').each(function(){
                addStyleSheet( $(this).text() );
            });

            $('body').data('header-transparency', $('body').hasClass('enable-header-transparency'));
        }
    };

    la_studio.woocommerce = {
        ProductZoom : function(_images, _thumbs, _vertical){

            var $images, $thumbs, enable_zoom, enable_popup, zoom_type;
            var vertical = (_vertical || $('.lastudio-oasis').hasClass('product-single-design-1'));
            $images =  _images || $('.product-main-image .product--large-image');
            $thumbs = _thumbs || $('.product-main-image .product--thumbnails');
            enable_zoom = ($images.data('zoom') == 1 ? true : false);
            zoom_type = ($images.data('zoom_type') == 'lens' ? 'lens' : 'inner');

            if($('.lastudio-oasis').hasClass('product-single-design-2')){
                enable_zoom = false;
            }
            if(enable_zoom){
                $images.easyZoom({
                    preventClicks: false
                });
                $(document).on('click', '.easyzoom-flyout' , function(){
                    $(this).prev('a').trigger('click');
                });
            }

            var slick_option = {
                prevArrow: '<span class="slick-prev"><i class="fa fa-angle-left"></i></span>',
                nextArrow: '<span class="slick-next"><i class="fa fa-angle-right"></i></span>',
                slidesToShow: 4,
                vertical: vertical,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            vertical: false
                        }
                    }
                ]
            };
            $thumbs.slick(slick_option);

            $thumbs.on('beforeChange', function(event, slick, currentSlide, nextSlide){
                var $current = slick.$slides.eq(nextSlide);
                try {
                    $images.data('easyZoom').swap(
                        $current.data('standard'),
                        $current.attr('href'),
                        ((!!$current.find('img').attr('srcset') && !!$images.find('img').attr('srcset')) ? $current.find('img').attr('srcset') : '')
                    )
                }catch (ex){
                    $images.find('a').attr('href',$current.attr('href')).find('img').removeAttr('sizes srcset').attr('src',$current.attr('data-standard'));
                }
            });
            $thumbs.on('click', 'a', function(e) {
                e.preventDefault();
                var $this = $(this),
                    $slick = $thumbs.slick('getSlick'),
                    currentSlide = $this.data('slickIndex');
                if($slick.$slides.length > 4){
                    $thumbs.slick('slickGoTo',currentSlide,false);
                }else{
                    $slick.$slides.removeClass('slick-current slick-center');
                    $this.addClass('slick-current slick-center');
                    try {
                        $images.data('easyZoom').swap(
                            $this.data('standard'),
                            $this.attr('href'),
                            ((!!$this.find('img').attr('srcset') && !!$images.find('img').attr('srcset')) ? $this.find('img').attr('srcset') : '')
                        )
                    }catch (ex){
                        $images.find('a').attr('href',$this.attr('href')).find('img').removeAttr('sizes srcset').attr('src',$this.attr('data-standard'));
                    }
                }
            });
        },
        ProductThumbnail: function(){
            $('.product-main-image .product--large-image a.zoom').unbind('click.prettyphoto');
            $(document.body).on('reset_image' ,'.variations_form', function(e){
                var api = $('.product-main-image .product--large-image').data('easyZoom');
                try {
                    api.teardown();
                    api._init();
                }catch (ex){

                }
            });
            if($('.product-main-image .product--thumbnails').length == 0){
                $('.product-main-image .p---large').addClass('no-thumbgallery');
            }

            if($('.lastudio-oasis').hasClass('product-single-design-2')){
                if($('.product-main-image .product--thumbnails').length){
                    $('.product-main-image .product--thumbnails').slick({
                        prevArrow: '<span class="slick-prev"><i class="fa fa-angle-left"></i></span>',
                        nextArrow: '<span class="slick-next"><i class="fa fa-angle-right"></i></span>',
                        variableWidth: true
                    });
                    $('.product-main-image .p---large').hide();
                    $(document).on('click', '.product-main-image .product--thumbnails a', function(e){
                        e.preventDefault();
                        var $this = $(this);
                        lightcase.start({
                            href: $this.attr('href')
                        });
                    })
                }
            }else{
                la_studio.woocommerce.ProductZoom();
            }
        },
        ProductQuickView : function(){
            if($(window).width() > 900){
                $(document).on('click','.la-quickview-button',function(e){
                    e.preventDefault();
                    lightcase.start({
                        href: $(this).data('href'),
                        showSequenceInfo: false,
                        type: 'ajax',
                        ajax: {
                            width: 1170
                        },
                        onFinish: {
                            renderContent: function () {
                                var $popup = lightcase.get('case');
                                if ( typeof wc_add_to_cart_variation_params !== 'undefined' ) {
                                    $popup.find('.variations_form').wc_variation_form().find('.variations select:eq(0)').change();
                                }
                                la_studio.woocommerce.ProductZoom($popup.find('.product-main-image .product--large-image'), $popup.find('.product-main-image .product--thumbnails'), true);
                                setTimeout(function(){
                                    lightcase.resize();
                                },300);
                            }
                        }
                    })
                });
            }
        },
        ProductAddCart : function(){
            $(document).on( 'adding_to_cart', function( e ){
                $('.header-toggle-cart > a > i').removeClass('la-icon-bag').addClass('fa-spinner fa-spin');
            });
            $(document).on( 'added_to_cart', function( e, fragments, cart_hash, $button ){
                var $product_image = $button.closest('.product').find('.product--thumbnail img:eq(0)'),
                    target_attribute = $('body').is('.woocommerce-yith-compare') ? ' target="_parent"' : '',
                    product_name = 'Product';

                if ( !!$button.data('product_title')){
                    product_name = $button.data('product_title');
                }
                var html = '<div class="popup-added-msg">';
                if ($product_image.length){
                    html += $('<div>').append($product_image.clone()).html();
                }
                html += '<div class="popup-message"><span class="text-color-heading2">'+ product_name +' </span>' + '</div>';
 html += '<div class="popup-message"><span class="texto13">'+ oasis_configs.addcart.success + '</div>';
                
                html += '<a class="btn2 popup-button-continue2" rel="nofollow" href="http://kokstore.com">'+ oasis_configs.global.continue_shopping + '</a>';
html += '<a rel="nofollow" class="btn2 view-popup-addcart2" ' + target_attribute + ' href="' + wc_add_to_cart_params.cart_url + '">' + wc_add_to_cart_params.i18n_view_cart + '</a>';
                html += '</div>';
                $('.header-toggle-cart > a > i').removeClass('fa-spinner fa-spin').addClass('la-icon-bag');
                if(typeof oasis_configs.enable_popup_addtolink !== "undefined" && oasis_configs.enable_popup_addtolink){
                    showMessageBox(html);
                }
            } );
            $('.la-global-message').on('click','.popup-button-continue',function(e){
                e.preventDefault();
                $('.la-global-message .close-message').trigger('click');
            })
        },
        ProductAddCompare : function(){
            $(document).on('click','.view-popup-compare', function(e){
                e.preventDefault();
                $('body').trigger('yith_woocompare_open_popup', { response: addQueryArg('action', yith_woocompare.actionview) + '&iframe=true' });
            });
            $(document).on( 'click', '.product a.add_compare', function(e){
                e.preventDefault();
                var $button     = $(this),
                    widget_list = $('.yith-woocompare-widget ul.products-list'),
                    $product_image = $button.closest('.product').find('.product--thumbnail img:eq(0)'),
                    data        = {
                        action: yith_woocompare.actionadd,
                        id: $button.data('product_id'),
                        context: 'frontend'
                    },
                    product_name = 'Product';
                if(!!$button.data('product_title')){
                    product_name = $button.data('product_title');
                }

                $.ajax({
                    type: 'post',
                    url: yith_woocompare.ajaxurl.toString().replace( '%%endpoint%%', yith_woocompare.actionadd ),
                    data: data,
                    dataType: 'json',
                    beforeSend: function(){
                        $button.addClass('loading');
                    },
                    complete: function(){
                        $button.removeClass('loading').addClass('added');
                    },
                    success: function(response){
                        if( typeof $.fn.block != 'undefined' ) {
                            widget_list.unblock()
                        }
                        var html = '<div class="popup-added-msg">';
                        if ($product_image.length){
                            html += $('<div>').append($product_image.clone()).html();
                        }
                        html += '<div class="popup-message"><span class="text-color-heading">'+ product_name +' </span>' + oasis_configs.compare.success + '</div>';
                        html += '<a class="btn btn-secondary view-popup-compare" rel="nofollow" href="'+response.table_url+'">'+oasis_configs.compare.view+'</a>';
                        html += '<a class="btn popup-button-continue" href="#" rel="nofollow">'+ oasis_configs.global.continue_shopping + '</a>';
                        html += '</div>';

                        if(typeof oasis_configs.enable_popup_addtolink !== undefined && oasis_configs.enable_popup_addtolink){
                            showMessageBox(html);
                        }

                        widget_list.unblock().html( response.widget_table );
                    }
                });
            });
        },
        ProductAddWishlist : function(){
            $(document).on('click','.product a.add_wishlist',function(e){
                if(!$(this).hasClass('added')) {
                    e.preventDefault();
                    var $button     = $(this),
                        product_id = $button.data( 'product_id' ),
                        $product_image = $button.closest('.product').find('.product--thumbnail img:eq(0)'),
                        product_name = 'Product',
                        data = {
                            add_to_wishlist: product_id,
                            product_type: $button.data( 'product-type' ),
                            action: yith_wcwl_l10n.actions.add_to_wishlist_action
                        };
                    if (!!$button.data('product_title')) {
                        product_name = $button.data('product_title');
                    }
                    try {
                        if (yith_wcwl_l10n.multi_wishlist && yith_wcwl_l10n.is_user_logged_in) {
                            var wishlist_popup_container = $button.parents('.yith-wcwl-popup-footer').prev('.yith-wcwl-popup-content'),
                                wishlist_popup_select = wishlist_popup_container.find('.wishlist-select'),
                                wishlist_popup_name = wishlist_popup_container.find('.wishlist-name'),
                                wishlist_popup_visibility = wishlist_popup_container.find('.wishlist-visibility');

                            data.wishlist_id = wishlist_popup_select.val();
                            data.wishlist_name = wishlist_popup_name.val();
                            data.wishlist_visibility = wishlist_popup_visibility.val();
                        }

                        if (!isCookieEnable()) {
                            alert(yith_wcwl_l10n.labels.cookie_disabled);
                            return;
                        }

                        $.ajax({
                            type: 'POST',
                            url: yith_wcwl_l10n.ajax_url,
                            data: data,
                            dataType: 'json',
                            beforeSend: function () {
                                $button.addClass('loading');
                            },
                            complete: function () {
                                $button.removeClass('loading').addClass('added');
                            },
                            success: function (response) {
                                var msg = $('#yith-wcwl-popup-message'),
                                    response_result = response.result,
                                    response_message = response.message;

                                if (yith_wcwl_l10n.multi_wishlist && yith_wcwl_l10n.is_user_logged_in) {
                                    var wishlist_select = $('select.wishlist-select');
                                    if (typeof $.prettyPhoto != 'undefined') {
                                        $.prettyPhoto.close();
                                    }
                                    wishlist_select.each(function (index) {
                                        var t = $(this),
                                            wishlist_options = t.find('option');
                                        wishlist_options = wishlist_options.slice(1, wishlist_options.length - 1);
                                        wishlist_options.remove();

                                        if (typeof( response.user_wishlists ) != 'undefined') {
                                            var i = 0;
                                            for (i in response.user_wishlists) {
                                                if (response.user_wishlists[i].is_default != "1") {
                                                    $('<option>')
                                                        .val(response.user_wishlists[i].ID)
                                                        .html(response.user_wishlists[i].wishlist_name)
                                                        .insertBefore(t.find('option:last-child'))
                                                }
                                            }
                                        }
                                    });

                                }
                                var html = '<div class="popup-added-msg">';
                                if (response_result == 'true') {
                                    if ($product_image.length){
                                        html += $('<div>').append($product_image.clone()).html();
                                    }
                                    html += '<div class="popup-message"><span class="text-color-heading">'+ product_name +' </span>' + oasis_configs.wishlist.success + '</div>';
                                }else {
                                    html += '<div class="popup-message">' + response_message + '</div>';
                                }
                                html += '<a class="btn btn-secondary view-popup-wishlish" rel="nofollow" href="' + response.wishlist_url.replace('/view', '') + '">' + oasis_configs.wishlist.view + '</a>';
                                html += '<a class="btn popup-button-continue" rel="nofollow" href="#">' + oasis_configs.global.continue_shopping + '</a>';
                                html += '</div>';
                                if(typeof oasis_configs.enable_popup_addtolink !== undefined && oasis_configs.enable_popup_addtolink){
                                    showMessageBox(html);
                                }
                                $button.attr('href',response.wishlist_url);
                                $('body').trigger('added_to_wishlist');
                            }
                        });
                    } catch (ex) {
                        //console.log(ex);
                    }
                }
            })
        }
    };


    la_studio.woocommerce.shopInfinite = function(){
        if(typeof oasis_configs.shop_infinite !== "undefined" ){
            var $shop_ul = $('.page-content>.row >.col-xs-12 > ul.products');
            $shop_ul.infinitescroll({
                navSelector  : ".page-content > .la-pagination",
                nextSelector : ".page-content > .la-pagination a.next",
                loading      : {
                    finished: function(){
                        $('.la-infinite-loading').remove();
                    },
                    finishedMsg: "All item is show",
                    msg: $("<div class='la-infinite-loading'><div class='la-loader spinner3'><div class='dot1'></div><div class='dot2'></div><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></div>")
                },
                itemSelector : 'li.product-item',
                state : {
                    currPage: parseInt(oasis_configs.shop_infinite.page_num)
                },
                pathParse : function(a, b) {
                    return [oasis_configs.shop_infinite.path, '/'];
                },
                maxPage : parseInt(oasis_configs.shop_infinite.page_num_max),
                dataType : 'html+callback',
                appendCallback: false
            }, function(data){
                var $data = $(data).find('.page-content>.row >.col-xs-12 > ul.products > li.product-item');
                $shop_ul.append($data);
                $shop_ul.find('.la-infinite-loading').remove();
            });
        }
    };

    $(document).ready(function(){

        la_studio.theme.ajax_loader();
        la_studio.theme.mega_menu();
        la_studio.theme.accordion_menu();
        la_studio.theme.header_sticky();
        la_studio.theme.headerSidebar();
        la_studio.theme.auto_popup();
        la_studio.theme.auto_carousel();
        la_studio.theme.init_isotope();
        la_studio.theme.init_infinite();
        la_studio.theme.scrollToTop();
        la_studio.theme.css_animation();

        la_studio.shortcodes.unit_responsive();
        la_studio.shortcodes.fix_parallax_row();
        la_studio.shortcodes.google_map();
        la_studio.shortcodes.counter();
        la_studio.shortcodes.fix_tabs();
        la_studio.shortcodes.countdown();
        la_studio.shortcodes.pie_chart();
        la_studio.shortcodes.progress_bar();
        la_studio.shortcodes.fix_row_fullwidth();

        la_studio.woocommerce.ProductThumbnail();
        la_studio.woocommerce.ProductQuickView();
        la_studio.woocommerce.ProductAddCart();
        la_studio.woocommerce.ProductAddCompare();
        la_studio.woocommerce.ProductAddWishlist();
        la_studio.theme.extra_func();
        la_studio.woocommerce.shopInfinite();
    });
    setTimeout(function(){
        $('body').removeClass('site-loading');
    }, 500);
    $(window).load(function(){
        $('body').removeClass('site-loading');
        $('.products-grid-featured-01').isotope({ itemSelector : '.product-item', layoutMode: 'packery' });

        function la_newsletter_popup(){
            var $newsletter_popup = $('#la_newsletter_popup');
            if($newsletter_popup.length){
                var show_on_mobile = $newsletter_popup.attr('data-show-mobile'),
                    p_delay = parseInt($newsletter_popup.attr('data-delay'));
                if( (show_on_mobile && $(window).width() < 767) ){
                    return;
                }
                if(typeof $.cookie != "undefined"){
                    if($.cookie('oasis_dont_display_popup') == 'yes'){
                        return;
                    }
                }
                setTimeout(function(){
                    lightcase.start({
                        href: '#',
                        maxWidth: 790,
                        maxHeight: 430,
                        inline: {
                            width : 790,
                            height : 430
                        },
                        onInit : {
                            foo: function() {
                                $('body.lastudio-oasis').addClass('open-newsletter-popup');
                            }
                        },
                        onClose : {
                            qux: function() {
                                if($('.la-newsletter-popup #dont_show_popup').length && $('.la-newsletter-popup #dont_show_popup').is(':checked')){
                                    var backtime = parseInt($newsletter_popup.attr('data-back-time'));
                                    if(typeof $.cookie != "undefined"){
                                        $.cookie('oasis_dont_display_popup', 'yes', { expires: backtime, path: '/' });
                                    }
                                }
                                $('body.lastudio-oasis').removeClass('open-newsletter-popup');
                            }
                        },
                        onFinish: {
                            injectContent: function () {
                                lightcase.get('contentInner').children().append($newsletter_popup);
                                $('.lightcase-icon-close').hide();
                                lightcase.resize();
                            }
                        }
                    });
                }, p_delay)
            }

            $(document).on('click', '.btn-close-newsletter-popup', function(e){
                lightcase.close();
            })
        }
        la_newsletter_popup();
    });
})(jQuery);

(function($) {
    "use strict";
    function getHoverDirection( $element, x, y ) {
        var w = $element.width(),
            h = $element.height(),
            x = ( x - $element.offset().left - ( w/2 )) * ( w > h ? ( h/w ) : 1 ),
            y = ( y - $element.offset().top  - ( h/2 )) * ( h > w ? ( w/h ) : 1 ),
            direction = Math.round( ( ( ( Math.atan2(y, x) * (180 / Math.PI) ) + 180 ) / 90 ) + 3 ) % 4;
        return direction;
    }

    $( document ).ready(function() {
        var $selectedGridItemEnter,
            $selectedGridItemLeave;

        function initOverlayGridHover(){
            $('#page')
                .on( 'mouseenter', '.item-overlay-effect', function( e ) {
                    $selectedGridItemEnter = $( this );
                    $selectedGridItemEnter.removeClass( "in-top in-left in-right in-bottom out-top out-left out-right out-bottom" ) ;
                    var dir = getHoverDirection( $( this ), e.pageX, e.pageY );
                    $selectedGridItemEnter.css({transition: 'none;'});
                    if ( typeof $selectedGridItemEnter !== 'undefined' ) {
                        switch(dir) {
                            case 0:
                                $selectedGridItemEnter.addClass('in-top');
                                break;
                            case 1:
                                $selectedGridItemEnter.addClass('in-right');
                                break;
                            case 2:
                                $selectedGridItemEnter.addClass('in-bottom');
                                break;
                            case 3:
                                $selectedGridItemEnter.addClass('in-left');
                                break;
                            default:
                                $selectedGridItemEnter.addClass('in-top');
                                break;
                        }
                    }
                })
                .on( 'mouseleave', '.item-overlay-effect', function( e ) {
                    $selectedGridItemLeave = $( this );
                    var dir = getHoverDirection( $( this ), e.pageX, e.pageY );
                    $selectedGridItemLeave.removeClass( "in-top in-left in-right in-bottom out-top out-left out-right out-bottom" );
                    if ( typeof $selectedGridItemEnter !== 'undefined' ) {
                        switch(dir) {
                            case 0:
                                $selectedGridItemEnter.addClass('out-top');
                                break;
                            case 1:
                                $selectedGridItemEnter.addClass('out-right');
                                break;
                            case 2:
                                $selectedGridItemEnter.addClass('out-bottom');
                                break;
                            case 3:
                                $selectedGridItemEnter.addClass('out-left');
                                break;
                            default:
                                $selectedGridItemEnter.addClass('out-top');
                                break;
                        }
                    }
                });
        }
        initOverlayGridHover();
    })
    
})(jQuery);