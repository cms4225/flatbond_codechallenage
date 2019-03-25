import axios from 'axios';

function sendRequest(url, options) {
  const opt = options || {
    method: 'get',
    headers: {}
  };

  return axios(url, opt)
    .then(handleResponse)
    .catch(handleError);
}

const handleResponse = async response => {
  if (response && response.status >= 200 && response.status < 300) {
    const contentType = response.headers["content-type"];
    const data = response.data;

    if (contentType.includes("json")) {
      return data;
    } else {
      return data;
    }
  } else {
    return "";
  }
};

const handleError = err => {
  console.log(`err resp: ${err}`);
  return err;
};

const request = {
  get: function(url) {
    return sendRequest(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  },
  post: function(url, data) {
    return sendRequest(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data ? JSON.stringify(data) : ""
    });
  }
};

export default request;
