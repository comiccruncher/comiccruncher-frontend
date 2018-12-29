import ReactGA from 'react-ga';

export const Categories = {
  Appearances: 'appearances',
  Modal: 'modal',
  CharacterList: 'character-list',
  Footer: 'footer',
  Menu: 'menu',
  Logo: 'logo',
  Search: 'search',
};

export const Actions = {
  Click: 'click',
  Open: 'open',
  Close: 'close',
  Typeahead: 'typeahead',
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
  return ReactGA.exception({ description: description, fatal: isFatal });
};

export const TrackErrorP = (description, isFatal) => {
  return new Promise((resolve, reject) => {
    resolve(TrackError(description, isFatal));
  });
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
