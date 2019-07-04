$().ready(siteReady)
var inTransition = false;
var pageToTransition = null;
var listeningToMouseWheel = false;

function getHashPage() {
  var page = '';
  if (window.location.hash && (window.location.hash.indexOf('#!') == 0 ||
                               window.location.hash.indexOf('!') == 0)) {
    page = window.location.hash.replace(/^#?!/, '');
  }
  return page;
}
var startingPage = getHashPage();

function siteReady() {
  isMain = !($(".main-container").hasClass('hidden-container'));
  $('body').find('a').each(bootstrapNavigationLinks);
  if (startingPage) {
    loadPage(startingPage);
  } else {
    $(window).on('hashchange', hashChanged);
  }
  $('ul.slimmenu').slimmenu(
  {
    resizeWidth: '800',
    collapserTitle: document.title.split(' | ')[0],
    easingEffect:'easeInOutQuint',
    animSpeed:'medium',
    indentChildren: true,
    childrenIndenter: '&raquo;'
  });
}

function hashChanged() {
  var page = getHashPage() || mainPage;
  loadPage(page);
}

function bootstrapNavigationLinks() {
  var href = $(this).attr('href');
  if (href.indexOf('#!') == 0) {
    $(this).on('click', navigationClick);
  }
}

function navigationClick(event) {
  if (inTransition) {
    event.preventDefault();
    return;
  }
}

function htmlDecode(value){ 
  return $('<div/>').html(value).text(); 
}

function loadPage(page) {
  if (inTransition) {
    return;
  }
  transitionStarted(page);
  var container = pageToContainer[page];
  var inMainContainer = container == mainContainer;
  if ($('#'+page).length > 0 ){
    // Already loaded.
    if (inMainContainer != isMain) {
      $('#'+container).children().stop().hide();
      $('#'+page).stop().show();
      togglePage();
    } else {
      toggleSubPage(container, page);
    }
    return;
  }
  $.get('pages/'+page+'.html', function(pageHTML) {
    var content = $($.parseHTML(pageHTML));
    content.hide();
    $('#'+container).append(content);
    // Bootstrap links and navigation menus
    $('#'+page).find('a').not('.goto').each(bootstrapNavigationLinks);
    $('#'+page).find('ul.slimmenu').slimmenu(
      {
        resizeWidth: '80000',
        collapserTitle: page,
        easingEffect:'easeInOutQuint',
        animSpeed:'medium',
        indentChildren: true,
        childrenIndenter: '&raquo;'
      });
    if (inMainContainer != isMain) {
      $('#'+container).children().stop().hide();
      $('#'+page).stop().show();
      togglePage();
    } else {
      toggleSubPage(container, page);
    }
  });
}

function toggleSubPage(container, page) {
  if (container == 'content-container') {
    var detailed_container = $('.detailed-container');
    var current_subpage = $('#'+container).children(':visible');
    var next_subpage = $('#'+page);
    detailed_container.css({'height':'100%', 'overflow':'hidden'});
    current_subpage.css({'position':'absolute', 'right':0, 'left':0,
                         'top':'10px'});
    next_subpage.css({'position':'absolute', 'visibility':'hidden',
                      'display':'block'});
    var new_height = next_subpage.height();
    next_subpage.css({'position':'absolute', 'top':'-'+(new_height+100)+'px',
                      'left':0, 'right':0, 'visibility':'visible'});
    current_subpage.animate({'top':(Math.max(new_height, $(window).height())+120)+'px'},
                            {'duration':1000, 'easing': 'easeInOutExpo',
                             'complete' : function() {
                                current_subpage.hide();
                                current_subpage.css({'position':'static'});
                            }});
    next_subpage.animate({'top':'10px'},
                         {'duration':1000, 'easing' : 'easeInOutExpo',
                           'complete': function() {
                             next_subpage.css({'position': 'static',
                                               'height':'auto',
                                               'overflow':'auto'});
                             detailed_container.css({'height':'auto',
                                                     'overflow':'auto'});
                             transitionEnded();
                         }});
  } else {
    $('#'+container).children().stop().hide();
    $('#'+page).stop().show();
    transitionEnded();
  }
}

function togglePage() {
  $('body, html').scrollTop(0);
  var detailedContainer = $('.detailed-container');
  var mainContainer = $('.main-container');
  var fromPage = isMain ? mainContainer : detailedContainer;
  var toPage = isMain ? detailedContainer : mainContainer;
  fromPage.css({'height' : '100%', 'overflow' : 'hidden'});
  if (isMain) {
    toPage.css('left', '100%');
  }
  fromPage.animate({'left' : isMain ? '-100%' : '100%'},
                   {'duration' : 1000, 'complete' : function() {
    if (toPage == mainContainer) {
      fromPage.css('left', '-100%');
    }
  }});
  toPage.animate({'left' : '0%'},
                 {'duration' : 1000, 'complete' : function() {
    toPage.css({'height' : 'auto', 'overflow' : 'auto'});
    isMain = !isMain;
    transitionEnded();
  }});
}

function transitionStarted(page) {
  pageToTransition = page;
  $(window).off('hashchange', hashChanged);
  inTransition = true;
}

function transitionEnded() {
  inTransition = false;
  var page = getHashPage() || mainPage;
  if (page != pageToTransition) {
    loadPage(page);
  } else {
    $(window).on('hashchange', hashChanged);
  }
}
