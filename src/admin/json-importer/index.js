import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { createRoot } from 'react-dom/client';

export default function JsonImportBlock() {
  const [jsonText, setJsonText] = useState('');
  const [status, setStatus] = useState('');

  async function createPost(post) {
    setStatus(`Creating post: ${post.title}`);

    // Prepare data for REST API
    const postData = {
      title: post.title,
      content: post.content || '',
      status: post.status || 'publish',
      meta: {
        address: post.meta?.address || '',
        lat: post.meta?.lat || null,
        lng: post.meta?.lng || null,
        // add other meta fields if needed
      },
    };

    try {
      const created = await apiFetch({
        path: `/wp/v2/place`, // fixed endpoint for places
        method: 'POST',
        data: postData,
      });
      setStatus(`Created place ID: ${created.id} (${post.title})`);
    } catch (e) {
      setStatus(`Failed to create place: ${post.title}`);
      console.error(e);
    }
  }

  async function handleImport() {
    setStatus('Parsing JSON...');
    let posts;

    try {
      posts = JSON.parse(jsonText);
      posts = Array.isArray(posts) ? posts : [posts];
    } catch {
      setStatus('Invalid JSON');
      return;
    }

    for (const post of posts) {
      await createPost(post);
    }

    setStatus('Import complete!');
  }

  return (
    <div>
      <textarea
        rows="10"
        style={{ width: '100%' }}
        placeholder="Paste JSON here"
        value={jsonText}
        onChange={e => setJsonText(e.target.value)}
      />
      <button onClick={handleImport} style={{ marginTop: '10px' }}>
        Import Places from JSON
      </button>
      <p>{status}</p>
    </div>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById('json-importer-root'));
  root.render(<JsonImportBlock />);
});
