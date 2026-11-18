import { useState } from 'react';
import { API_BASE_URL } from '../api';

const publicImage = (filename) => `${import.meta.env.BASE_URL}images/${filename}`;
const fallback = publicImage('demo/hostel.jpg');
const samplePath = /^\/?images\/hostels\/sample([1-8])\.jpg(?:[?#].*)?$/i;

export function roomSamplePhoto(type) {
  const file = { Single: 'single', Double: 'double', Triple: 'triple', Dorm: 'dorm' }[type];
  return file ? publicImage(`demo/${file}.jpg`) : fallback;
}

function resolveHostelPhoto(path) {
  const sample = path?.match(samplePath);
  if (sample) {
    return Number(sample[1]) <= 5 ? publicImage(`hostels/sample${sample[1]}.jpg`) : fallback;
  }
  if (!path) return fallback;
  if (/^(https?:)?\/\//i.test(path)) return path;
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${apiOrigin}/${path.replace(/^\/+/, '')}`;
}

export default function HostelPhoto({ path, alt, className }) {
  const image = resolveHostelPhoto(path);
  const [failed, setFailed] = useState(null);
  const src = failed === image ? fallback : image;
  const isSample = src === fallback || samplePath.test(path ?? '');

  return (
    <div className="relative">
      <img
        src={src}
        alt={isSample ? 'Sample hostel photo' : alt}
        className={className}
        loading="lazy"
        onError={src !== fallback ? () => setFailed(image) : undefined}
      />
      {isSample && (
        <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
          Sample photo
        </span>
      )}
    </div>
  );
}
