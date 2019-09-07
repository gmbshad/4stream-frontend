import 'whatwg-fetch';

function doFetch({url, method, data, cors, unauthorizedHandler}) {
  const fetchObject = Object.assign({
    credentials: 'same-origin',
    method: method
  }, data);
  if (!cors) {
    const headers = fetchObject.headers;
    const cacheHeaders = {
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    };
    fetchObject.headers = (!headers) ? cacheHeaders : (Object.assign(headers, cacheHeaders));
  } else {
    fetchObject.mode = 'cors';
  }
  return fetch(url, fetchObject).then(response => {
    if (response.status === 401) {
      if (unauthorizedHandler !== undefined) {
        unauthorizedHandler();
      }
      throw Error('Unauthorized');
    } else {
      return response;
    }
  });
}

export {doFetch};
