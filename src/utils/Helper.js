import Immutable from "immutable";

export function merge(original, override) {
  return Immutable.Map(original).merge(override).toObject();
};

export function getFileExtension(filename) {
  if (!filename) {
    return '';
  }

  let idx = filename.lastIndexOf('.');
  return idx !== -1 ? filename.substring(idx + 1) : '';
};

export function getUrl() {
  if (typeof window !== 'undefined') {
    return window.URL || window.webkitURL;
  }
}

export function generateUUID(){
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}