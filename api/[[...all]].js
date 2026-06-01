import server from '../dist/server/server.js';

export const config = { runtime: 'edge' };

export default async function handler(request) {
  try {
    if (server && typeof server.fetch === 'function') {
      return await server.fetch(request);
    }

    if (server && server.default && typeof server.default.fetch === 'function') {
      return await server.default.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
