import Pocketbase from 'pocketbase';

// In development or when explicitly configured, use local proxy or env;
// in production, point to the live Hostinger Horizons PocketBase endpoint with full CORS support.
const POCKETBASE_API_URL =
  import.meta.env.VITE_POCKETBASE_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.origin}/hcgi/platform`
    : 'https://strongbuild.in/hcgi/platform');

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient };
