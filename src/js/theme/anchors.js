
var gitbook = window.gitbook;
var $ = require('jquery');

var scroller = '.book-body';

function init() {
    // 页面有锚点跳转到对应位置
    if (location.hash) {
        $(scroller).scrollTop($(decodeURIComponent(location.hash)).position().top);
    } else {
        $(scroller).scrollTop(0);
    }

    gitbook.events.on('page.render', function() {
        updateAnchors();
        updateBreadcrumb();

        initScroll();
    }).trigger('page.render');
}

function initScroll() {
    $('.book-anchor-body>a').on('click', function(e) {
        e.preventDefault();

        var target = $(this).attr('href');
        $(scroller).stop().animate({
            scrollTop: $(target).position().top
        }, 600, function() {
            location.hash = target;
        });
    });

    $(scroller).on('scroll', function() {
        var $navs = $('.book-anchor-body>a');
        var $elems = $navs.map(function() {
            return $($(this).attr('href'));
        });
        var scrollDistance = $(scroller).scrollTop();

        $elems.each(function(i) {
            if ($(this).position().top <= scrollDistance) {
                $navs.removeClass('selected').eq(i).addClass('selected');
            }
        });

        // 默认选中第一个
        if (!$navs.filter('.selected').length) {
            $navs.eq(0).addClass('selected');
        }
    }).trigger('scroll');
}

function updateBreadcrumb() {
    var $active = $('.chapter.active');
    var arr = [];
    
    $active.parents('.chapter').add($active).find('> a').map(function() {
        var $elem = $(this);

        arr.push(substitute('<a href="{{ url }}">{{ text }}</a>', {
            text: $elem.text(),
            url: $elem.attr('href')
        }));
    });

    if (arr.length > 1) {
        $('.page-breadcrumb').html(arr.join('<i class="fa fa-angle-right"></i>'));
    }
}

function updateAnchors() {
    $('.page-inner .markdown-section').find('h1,h2').each(function(){
        var className = 'anchor-h1';
        
        if($(this).is('h2')){
            className = 'anchor-h2';
        }

        var text = $(this).text();
        var href = $(this).attr('id');
        $('.book-anchor-body').append(substitute('<a class="anchor-text {{ className }}" title="{{ text }}" href="#{{ href }}">{{ text}}</a>', {
            text: text,
            href: href,
            className: className
        }));
    });
}

function substitute(str, o) {
    return str.replace(/\\?\{\{\s*([^{}\s]+)\s*\}\}/g, function (match, name) {
        if (match.charAt(0) === '\\') {
            return match.slice(1);
        }
        return (o[name] == null) ? '' : o[name];
    });
}

module.exports = {
    init: init
};