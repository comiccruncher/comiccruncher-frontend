import ReactGA from 'react-ga';

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
