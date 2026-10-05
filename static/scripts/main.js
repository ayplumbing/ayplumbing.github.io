const mainContainer = 'main-menu-container';
const contentContainer = 'content-container';
const mainPage = 'main-menu';
const page_metadata = {
  "main-menu": {
    "title": "A & Y Plumbing: Toronto Plumbing, Drain, and Waterproofing Experts",
    "description": "Family-owned Toronto plumbers serving Toronto and the GTA since 2001. Plumbing, drains, waterproofing, and water filtration. Call 416-835-7986 for 24/7 service or a free estimate."
  },
  "bathroom-plumbing-services": {
    "title": "Bathroom Plumbing Services - A & Y Plumbing",
    "description": "Bathroom plumbing repairs and installations in Toronto, including toilets, faucets, showers, and drain services."
  },
  "basement-plumbing-services": {
    "title": "Basement & Outdoor Plumbing Services - A & Y Plumbing",
    "description": "Basement and outdoor plumbing services in Toronto, including sump pumps, backwater valves, laundry connections, and outdoor taps."
  },
  "basement-waterproofing": {
    "title": "Basement Waterproofing - A & Y Plumbing",
    "description": "Basement waterproofing, foundation repairs, window wells, and weeping tile services in Toronto and the GTA. Call A & Y Plumbing for an estimate."
  },
  "construction-and-renovations": {
    "title": "Construction & Renovations - A & Y Plumbing",
    "description": "Plumbing, construction, and renovation services for larger residential projects in Toronto and the GTA. Contact A & Y Plumbing for an estimate."
  },
  "contact-form": {
    "title": "Contact Form - A & Y Plumbing",
    "description": "Contact A & Y Plumbing for plumbing, drain, waterproofing, and water filtration services in Toronto and the GTA."
  },
  "drain-services": {
    "title": "Drain Services - A & Y Plumbing",
    "description": "Drain cleaning, inspection, maintenance, and repair services in Toronto and the GTA. Contact A & Y Plumbing for help."
  },
  "kitchen-plumbing-services": {
    "title": "Kitchen Plumbing Services - A & Y Plumbing",
    "description": "Kitchen plumbing repairs and installations, including faucets, dishwashers, garburators, and leak detection in Toronto and the GTA."
  },
  "privacy-policy": {
    "title": "Privacy Policy - A & Y Plumbing",
    "description": "Read the A & Y Plumbing privacy policy and learn how we handle information sent through our website."
  },
  "services": {
    "title": "Plumbing Services - A & Y Plumbing",
    "description": "Explore plumbing repairs, drain services, waterproofing, and water filtration from A & Y Plumbing in Toronto and the GTA. Call 416-835-7986."
  },
  "water-filters": {
    "title": "Water Filters - A & Y Plumbing",
    "description": "Water filtration and reverse osmosis systems for Toronto homes. A & Y Plumbing can help you choose, install, and maintain a system."
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

function getPageMetadata(page) {
  return page_metadata[page] || {
    title: 'A & Y Plumbing',
    description: 'A & Y Plumbing serves Toronto and the GTA with plumbing, drain, and waterproofing services.'
  };
}

function updateCopyrightYear() {
  const yearElement = document.getElementById('copyright-year');
  if (!yearElement) {
    return;
  }

  fetch('https://timeapi.io/api/Time/current/zone?timeZone=America%2FToronto')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Could not retrieve the current year.');
      }
      return response.json();
    })
    .then((data) => {
      const year = String(data.dateTime || '').slice(0, 4);
      if (/^\d{4}$/.test(year)) {
        yearElement.textContent = year;
      }
    })
    .catch(() => {});
}

function siteReady() {
  updateCopyrightYear();
  isMain = !($(".main-container").hasClass('hidden-container'));
  $('body').find('a').each(bootstrapNavigationLinks);
  window.addEventListener('popstate', pageChanged);
  if (getPage() != mainPage) {
    pageChanged();
  }
}

function pageChanged() {
  const current_page = getPage();
  const metadata = getPageMetadata(current_page);
  $('meta[name="description"]').attr('content', metadata.description);
  document.title = metadata.title;
  loadPage(current_page);
}

function bootstrapNavigationLinks() {
  const href = $(this).attr('href');
  if (!href || href.startsWith('#')) {
    return;
  }
  const destination = new URL(href, window.location.href);
  if (destination.origin === window.location.origin && page_metadata[getPage(destination.href)]) {
    $(this).on('click', navigationClick);
  }
}

function navigationClick(event) {
  const hrefUrl = event.currentTarget.getAttribute('href');
  const nextPage = getPage(hrefUrl);
  if (!page_metadata[nextPage]) {
    return;
  }
  event.preventDefault();
  if (inTransition) {
    return;
  }
  window.history.pushState({}, getPageMetadata(nextPage).title, hrefUrl);
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
                            {'duration':motionDuration(300), 'easing': 'easeInOutExpo',
                             'complete' : function() {
                                current_subpage.hide();
                                current_subpage.css({'position':'static'});
                            }});
    next_subpage.animate({'top':'10px'},
                         {'duration':motionDuration(300), 'easing' : 'easeInOutExpo',
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

function motionDuration(duration) {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 0
    : duration;
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
  fromPage.attr('aria-hidden', 'true');
  toPage.attr('aria-hidden', 'false');
  toPage.css('height', fromPage.height());
  if (isMain) {
    toPage.css('left', '100%');
  }
  fromPage.animate({'left' : isMain ? '-100%' : '100%'},
                   {'duration' : motionDuration(300), 'complete' : function() {
    if (toPage == mainContainer) {
      fromPage.css('left', '-100%');
    }
  }});
  toPage.animate({'left' : '0%'},
                 {'duration' : motionDuration(300), 'complete' : function() {
    $(document.scrollingElement).animate({'scrollTop' : 0},
                            {'duration' : motionDuration(120), 'complete': function() {
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
