const mainContainer = 'main-menu-container';
const contentContainer = 'content-container';
const mainPage = 'main-menu';
const page_metadata = {
  "main-menu": {
    "title": "A & Y Plumbing: Toronto Plumbing, Drain, and Waterproofing Experts",
    "description": "We offer plumbing, drain, and waterproofing services all around Toronto and the GTA. Call us 24/7 at 416-835-7986 for your free estimate."
  },
  "bathroom-plumbing-services": {
    "title": "Bathroom Plumbing Services - A & Y Plumbing",
    "description": "Toilets, sink faucets, showers, low water pressure, broken pipes, drain services, we do it all. Call us any time at 416-835-7986 to ask questions or schedule in an appointment."
  },
  "basement-plumbing-services": {
    "title": "Basement & Outdoor Plumbing Services - A & Y Plumbing",
    "description": "Hose bibb valves, outdoor taps, backwater valves, grease traps, shutoff valves, laundry rooms, sump pumps, we do it all. Call us at 416-835-7986 for your free estimate."
  },
  "basement-waterproofing": {
    "title": "Basement Waterproofing - A & Y Plumbing",
    "description": "Leak prevention, blue skin membranes, window wells, weeping tiles, foundation repair, sump up installations, and more, we do it all. Call us at 416-835-7986 for your free estimate."
  },
  "construction-and-renovations": {
    "title": "Construction & Renovations - A & Y Plumbing",
    "description": "Call us at 416-835-7986 for your free estimate for your next big project."
  },
  "contact-form": {
    "title": "Contact Form - A & Y Plumbing",
    "description": "Call us at 416-835-7986, email us at mail@ayplumbing.ca, message us on Facebook, or fill out this online form."
  },
  "drain-services": {
    "title": "Drain Services - A & Y Plumbing",
    "description": "One of our core focuses is cleaning, maintaining, and repairing drain systems. Call us any time at 416-835-7986 to ask questions or schedule in an appointment."
  },
  "kitchen-plumbing-services": {
    "title": "Kitchen Plumbing Services - A & Y Plumbing",
    "description": "Sink faucets, garburators, dishwashers, grease traps, leaks, low water pressure, we do it all. Call us any time at 416-835-7986 to ask questions or schedule in an appointment."
  },
  "privacy-policy": {
    "title": "Privacy Policy - A & Y Plumbing",
    "description": "Read our privacy policy here."
  },
  "services": {
    "title": "Plumbing Services - A & Y Plumbing",
    "description": "Need a plumber? We offer a variety of services, ranging from in-home plumbing repairs to larger scale projects. Call us any time at 416-835-7986 to ask questions or schedule in an appointment."
  },
};

let isMain = true;
let inTransition = false;
let pageToTransition = null;

$().ready(siteReady)

function getPage(url) {
  if (url === undefined) {
    return window.location.pathname.replaceAll('/', '') || mainPage;
  } else {
    return new URL(url, window.location.href).pathname.replaceAll('/', '') || mainPage;
  }
}

function siteReady() {
  isMain = !($(".main-container").hasClass('hidden-container'));
  $('body').find('a').each(bootstrapNavigationLinks);
  window.addEventListener('popstate', pageChanged);
  if (getPage() != mainPage) {
    pageChanged();
  }
}

function pageChanged() {
  const current_page = getPage();
  $('meta[name="description"]').attr('content', page_metadata[current_page].description);
  document.title = page_metadata[current_page].title;
  loadPage(current_page);
}

function bootstrapNavigationLinks() {
  var href = $(this).attr('href');
  if (!href.includes('http')) {
    $(this).on('click', navigationClick);
  }
}

function navigationClick(event) {
  event.preventDefault();
  if (inTransition) {
    return;
  }
  const hrefUrl = event.target.getAttribute('href');
  window.history.pushState({}, page_metadata[getPage(hrefUrl)].title, hrefUrl);
  pageChanged();

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
  inTransition = true;
}

function transitionEnded() {
  inTransition = false;
  var page = getPage();
  if (page != pageToTransition) {
    loadPage(page);
  }
}
