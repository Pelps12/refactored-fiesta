import {NextApiRequest, NextApiResponse }from 'next'


export default function getCookies(request: NextApiRequest, key: string) {
    const cookies = {};
    request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
      const parts = cookie.match(/(.*?)=(.*)$/)
      cookies[ parts[1].trim() ] = (parts[2] || '').trim();
    });
    return cookies[key];
  };