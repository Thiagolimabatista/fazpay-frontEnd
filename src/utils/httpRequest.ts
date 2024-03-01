import axios from 'axios';

import { CLOUD_API } from 'src/config-global';

type MethodsProps = 'get' | 'post' | 'put' | 'patch' | 'delete';

export default (path: string, data?: unknown, method: MethodsProps = 'post') => {
  const requestOptions = {
    url: `${CLOUD_API.baseurl}${path}`,
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLOUD_API.apiKey,
      'x-api-token': CLOUD_API.apiToken,
    },
    data,
  };
  return axios(requestOptions)
    .then((response) => response.data)
    .catch((error) => error.response.data);
};
