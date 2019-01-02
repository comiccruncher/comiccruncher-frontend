import ReactGA from 'react-ga';

export const Categories = {
  APPEARANCES: 'appearances',
  MODAL: 'modal',
  CHARACTERLIST: 'character-list',
  FOOTER: 'footer',
  MENU: 'menu',
  LOGO: 'logo',
  SEARCH: 'search',
  ERROR: 'error',
};

export const Actions = {
  CLICK: 'click',
  OPEN: 'open',
  CLOSE: 'close',
  TYPEAHEAD: 'typeahead',
};

export const Event = (category, action, label) => {
  return ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

export const TrackEvent = (category, action, label) => {
  return new Promise((resolve, reject) => {
    resolve(Event(category, action, label));
  });
};

export const TrackExternalClick = (e, category, href) => {
  e.preventDefault();
  TrackEvent(category, 'click', href).then(() => (window.location.href = href));
};

export const TrackError = (description, isFatal) => {
  console.log(description, isFatal);
  return ReactGA.exception({ description: description, fatal: isFatal });
};

export const TrackErrorP = (description, isFatal) => {
  return new Promise((resolve, reject) => {
    resolve(TrackError(description, isFatal));
  });
};

export const TrackErrorWithEvent = (status_code, url, ...message) => {
  Event(Categories.ERROR, status_code ? status_code.toString() : 'undefined', url);
};

export const TrackModal = (href) => {
  ReactGA.modalview(href);
};

export const TrackModalP = (href) => {
  return new Promise((resolve, reject) => {
    resolve(TrackModal(href));
  });
};

export const TrackPageview = (href, title) => {
  ReactGA.pageview(href, null, title);
};

export const TrackPageviewP = (href, title) => {
  return new Promise((resolve, reject) => {
    resolve(TrackPageview(href, title));
  });
};
