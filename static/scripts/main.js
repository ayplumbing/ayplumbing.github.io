var mainContainer = 'main-menu-container';
var contentContainer = 'content-container';
var mainPage = 'main-menu';
var isMain = true;
var inTransition = false;
var pageToTransition = null;
var startingPage = '';

$().ready(siteReady)

function getHashPage() {
  var page = '';
  if (window.location.hash && (window.location.hash.indexOf('#!') == 0 ||
                               window.location.hash.indexOf('!') == 0)) {
    page = window.location.hash.replace(/^#?!/, '');
  }
  return page;
}

function siteReady() {
  startingPage = getHashPage();
  isMain = !($(".main-container").hasClass('hidden-container'));
  $('body').find('a').each(bootstrapNavigationLinks);
  if (startingPage) {
    loadPage(startingPage);
  } else {
    $(window).on('hashchange', hashChanged);
  }
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
  if (page == mainPage) {
    container = mainContainer;
  } else {
    container = contentContainer;
  }
  var inMainContainer = container == mainContainer;
  if (inMainContainer != isMain) {
    $('#'+container).children().stop().hide();
    $('#'+page).stop().show();
    togglePage();
  } else {
    toggleSubPage(container, page);
  }
}

function toggleSubPage(container, page) {
  if (container == contentContainer) {
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

function alignTopBrickOffset(topPosition) {
  var topBrickOffset = topPosition % 72;
  return topPosition - topBrickOffset;
}

function togglePage() {
  var detailedContainer = $('.detailed-container');
  var mainContainer = $('.main-container');
  var fromPage = isMain ? mainContainer : detailedContainer;
  var toPage = isMain ? detailedContainer : mainContainer;
  toPage.css('height', fromPage.height());
  if (isMain) {
    toPage.css('left', '100%');
  }
  fromPage.animate({'left' : isMain ? '-100%' : '100%'},
                   {'duration' : 800, 'complete' : function() {
    if (toPage == mainContainer) {
      fromPage.css('left', '-100%');
    }
  }});
  toPage.animate({'left' : '0%'},
                 {'duration' : 800, 'complete' : function() {
    $(document.scrollingElement).animate({'scrollTop' : 0},
                            {'duration' : 200, 'complete': function() {
      toPage.css({'height' : 'auto', 'overflow' : 'auto', 'top' : 0});
      isMain = !isMain;
      transitionEnded();
    }});
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
