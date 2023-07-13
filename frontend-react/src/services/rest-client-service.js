import axios from 'axios';

/**
* @param {string} url - request url
* @param {object} extraHeaders - object, optional, additonal HTTP headers
as Key-Value-Pair-Collection
* @param {object} query - object, optional, query as Key-Value-PairCollection
* */
async function get(url, extraHeaders, query) {
    let requestOptions = {
        method: 'GET',
        url: url,
        headers: extraHeaders,
        params: query
    };
    return call(requestOptions);
}

/**
* @param {string} url - request url
* @param {object} payload - native JS-DataType expected. payload will be
stringified to JSON per default
* @param {object} extraHeaders - object, optional, additonal HTTP headers
as Key-Value-Pair-Collection
* */
async function post(url, payload, extraHeaders = {}) {
    let requestOptions = {
        method: 'POST',
        url: url,
        data: payload
    };
    if (!payload)
        throw new Error('no payload in POST-Call. call fails');
    if (!extraHeaders['Content-Type']) {
        requestOptions.headers = {
            ...extraHeaders,
            'Content-Type': 'application/json',
        };
        // overwrite set payload
        requestOptions.data = JSON.stringify(payload);
    }
    else {
        requestOptions.headers = extraHeaders;
    }
    return call(requestOptions);
}

/**
* @param {string} url - request url
* @param {object} payload - native JS-DataType expected. payload will be
stringified to JSON per default
* @param {object} extraHeaders - object, optional, additonal HTTP headers
as Key-Value-Pair-Collection
* */
async function patch(url, payload, extraHeaders = {}) {
    let requestOptions = {
        method: 'PATCH',
        url: url,
        data: payload
    };
    if (!payload)
        throw new Error('no payload in PATCH-Call. call fails');
    if (!extraHeaders['Content-Type']) {
        requestOptions.headers = {
            ...extraHeaders,
            'Content-Type': 'application/json',
        };
        // overwrite set payload
        requestOptions.data = JSON.stringify(payload);
    }
    else {
        requestOptions.headers = extraHeaders;
    }
    return call(requestOptions);
}

async function deleteRequest(url) {
    let requestOptions = {
        method: 'DELETE',
        url: url,
    };
    return call(requestOptions);
}

async function call(requestConfig) {
    // check method
    if (requestConfig.method && typeof (requestConfig.method) !== 'string')
        throw new Error('method is not a string. call fails');
    if (!requestConfig.method)
        requestConfig.method = 'GET';
    else
        requestConfig.method = requestConfig.method.toUpperCase();
    if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(requestConfig.method))
        throw new Error('http method not allowed. call fails');
    // check url
    if (!requestConfig.url || typeof (requestConfig.url) !== 'string')
        throw new Error('no url as string provided. call fails');
    // check headers
    if (requestConfig.headers && typeof (requestConfig.headers) !== 'object')
        throw new Error('headers not an object. call fails');
    let response = await axios(requestConfig);
    return response;
}

const restClient = {
    get: get,
    post: post,
    patch: patch,
    delete: deleteRequest
};

export default restClient;
