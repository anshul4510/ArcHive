import { supabase } from './supabase';
import { uploadImage, uploadFile, PRESETS } from './cloudinary';

async function setUid(uid) {
  if (uid) await supabase.rpc('set_firebase_uid', { uid });
}

// ─── Feed ─────────────────────────────────────────

export async function getProjectsFeed({
  firebaseUid = null,
  category = null,
  sort = 'newest',
  contentType = 'project',
  limit = 12,
  offset = 0,
}) {
  try {
    if (firebaseUid) await setUid(firebaseUid);
    const { data, error } = await supabase.rpc('get_projects_feed', {
      p_firebase_uid: firebaseUid,
      p_category: category,
      p_sort: sort,
      p_content_type: contentType,
      p_limit: limit,
      p_offset: offset,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

// ─── Single project ───────────────────────────────

export async function getProject({ repoName, username, firebaseUid }) {
  try {
    if (firebaseUid) await setUid(firebaseUid);
    const { data, error } = await supabase.rpc('get_project', {
      p_repo_name: repoName,
      p_username: username,
      p_firebase_uid: firebaseUid || null,
    });
    if (error) throw error;
    if (!data) return { data: null, error: 'Not found' };
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

// ─── Create / Update ──────────────────────────────

export async function createProject(firebaseUid, projectData) {
  try {
    await setUid(firebaseUid);
    // Get author_id via user query (simulated or direct join)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .single();
    
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('projects')
      .insert({
        author_id: userData.id,
        repo_name: projectData.repoName,
        title: projectData.title,
        description: projectData.description,
        content_type: projectData.contentType,
        category: projectData.category,
        tags: projectData.tags || [],
        location_city: projectData.locationCity,
        location_country: projectData.locationCountry,
        project_year: projectData.projectYear,
        area_value: projectData.areaValue,
        area_unit: projectData.areaUnit || 'sqft',
        visibility: projectData.visibility || 'public',
        license: projectData.license || 'CC BY-NC',
        allow_comments: projectData.allowComments ?? true,
        allow_forks: projectData.allowForks ?? true,
        allow_downloads: projectData.allowDownloads ?? false,
      })
      .select('id, repo_name')
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function updateProject(firebaseUid, projectId, updates) {
  try {
    await setUid(firebaseUid);
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function publishProject(firebaseUid, projectId) {
  try {
    await setUid(firebaseUid);
    const { data, error } = await supabase
      .from('projects')
      .update({ 
        status: 'published', 
        published_at: new Date().toISOString() 
      })
      .eq('id', projectId)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function unpublishProject(firebaseUid, projectId) {
  try {
    await setUid(firebaseUid);
    const { data, error } = await supabase
      .from('projects')
      .update({ status: 'draft' })
      .eq('id', projectId)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function deleteProject(firebaseUid, projectId) {
  try {
    await setUid(firebaseUid);
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { error: err.message };
  }
}

// ─── Files ────────────────────────────────────────

export async function uploadProjectFile(firebaseUid, projectId, file, section, onProgress) {
  try {
    let uploadRes;
    if (file.type.startsWith('image/')) {
      uploadRes = await uploadImage(file, PRESETS.UPLOADS, onProgress);
    } else {
      uploadRes = await uploadFile(file, PRESETS.UPLOADS, onProgress);
    }

    if (uploadRes.error) throw new Error(uploadRes.error);

    await setUid(firebaseUid);
    let fileType = 'other';
    if (file.type.startsWith('image/')) fileType = 'image';
    else if (file.type === 'application/pdf') fileType = 'pdf';
    else if (file.name.endsWith('.dwg') || file.name.endsWith('.dxf')) fileType = 'dwg';

    const { data, error } = await supabase
      .from('project_files')
      .insert({
        project_id: projectId,
        file_url: uploadRes.url,
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
        mime_type: file.type,
        section: section || 'General',
      })
      .select()
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function setCoverImage(firebaseUid, projectId, fileId) {
  try {
    await setUid(firebaseUid);
    // Reset all
    await supabase.from('project_files').update({ is_cover: false }).eq('project_id', projectId);
    // Set one
    const { data: fileData, error: fileError } = await supabase
      .from('project_files')
      .update({ is_cover: true })
      .eq('id', fileId)
      .select('file_url')
      .single();
    if (fileError) throw fileError;
    
    // Update project cover
    const { error: projError } = await supabase
      .from('projects')
      .update({ cover_image_url: fileData.file_url })
      .eq('id', projectId);
    if (projError) throw projError;
    
    return { error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { error: err.message };
  }
}

export async function deleteProjectFile(firebaseUid, fileId) {
  try {
    await setUid(firebaseUid);
    const { error } = await supabase.from('project_files').delete().eq('id', fileId);
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { error: err.message };
  }
}

export async function reorderFiles(firebaseUid, projectId, orderedIds) {
  try {
    await setUid(firebaseUid);
    for (let i = 0; i < orderedIds.length; i++) {
      await supabase
        .from('project_files')
        .update({ sort_order: i })
        .eq('id', orderedIds[i])
        .eq('project_id', projectId);
    }
    return { error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { error: err.message };
  }
}

// ─── Interactions ─────────────────────────────────

export async function toggleUpvote(firebaseUid, projectId) {
  try {
    await setUid(firebaseUid);
    const { data, error } = await supabase.rpc('toggle_upvote', {
      p_firebase_uid: firebaseUid,
      p_project_id: projectId,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function toggleSave(firebaseUid, projectId, collection = 'Saved') {
  try {
    await setUid(firebaseUid);
    const { data, error } = await supabase.rpc('toggle_save', {
      p_firebase_uid: firebaseUid,
      p_project_id: projectId,
      p_collection: collection,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function forkProject(firebaseUid, projectId) {
  try {
    await setUid(firebaseUid);
    const { data, error } = await supabase.rpc('fork_project', {
      p_firebase_uid: firebaseUid,
      p_project_id: projectId,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function recordView(projectId, firebaseUid = null) {
  try {
    // Fire and forget
    supabase.rpc('record_project_view', {
      p_project_id: projectId,
      p_viewer_uid: firebaseUid || null,
    }).then(() => {}).catch(e => console.error('[ArcHive Projects View]', e));
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

// ─── Comments ─────────────────────────────────────

export async function getComments(projectId, firebaseUid = null) {
  try {
    if (firebaseUid) await setUid(firebaseUid);
    const { data, error } = await supabase.rpc('get_comments', {
      p_project_id: projectId,
      p_firebase_uid: firebaseUid || null,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function addComment(firebaseUid, projectId, body, parentId = null) {
  try {
    await setUid(firebaseUid);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .single();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('comments')
      .insert({
        project_id: projectId,
        author_id: userData.id,
        body: body,
        parent_id: parentId,
      })
      .select()
      .single();
    if (error) throw error;
    
    // Increment project comment count manually if not handled by trigger
    await supabase.rpc('increment_project_comments', { p_project_id: projectId }).catch(()=>{});
    
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function deleteComment(firebaseUid, commentId) {
  try {
    await setUid(firebaseUid);
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { error: err.message };
  }
}

export async function toggleCommentLike(firebaseUid, commentId) {
  try {
    await setUid(firebaseUid);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .single();
    if (userError) throw userError;

    // Manual toggle
    const { data: existing } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('user_id', userData.id)
      .eq('comment_id', commentId)
      .single();

    if (existing) {
      await supabase.from('comment_likes').delete().eq('id', existing.id);
      return { data: { action: 'removed' }, error: null };
    } else {
      await supabase.from('comment_likes').insert({ user_id: userData.id, comment_id: commentId });
      return { data: { action: 'added' }, error: null };
    }
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

// ─── Collections ──────────────────────────────────

export async function getCollections(firebaseUid) {
  try {
    await setUid(firebaseUid);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .single();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', userData.id);
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function createCollection(firebaseUid, name) {
  try {
    await setUid(firebaseUid);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .single();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('collections')
      .insert({ user_id: userData.id, name })
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function getSavedProjects(firebaseUid, collectionName) {
  try {
    await setUid(firebaseUid);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .single();
    if (userError) throw userError;

    const query = supabase
      .from('saved_projects')
      .select('project_id, collection_name, projects(*)')
      .eq('user_id', userData.id);
      
    if (collectionName) {
      query.eq('collection_name', collectionName);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    // Format similar to feed
    return { data: data.map(d => d.projects), error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

// ─── User's own projects ──────────────────────────

export async function getUserProjects(firebaseUid, filters = {}) {
  try {
    await setUid(firebaseUid);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .single();
    if (userError) throw userError;

    let query = supabase.from('projects').select('*').eq('author_id', userData.id);
    
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.visibility) query = query.eq('visibility', filters.visibility);
    if (filters.contentType) query = query.eq('content_type', filters.contentType);
    
    if (filters.sort === 'newest') query = query.order('updated_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function getPinnedProjects(username) {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('pinned_projects')
      .select('project_id, sort_order, projects(*)')
      .eq('user_id', userData.id)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    
    return { data: data.map(d => d.projects), error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}

export async function getProfileProjects(username) {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('author_id', userData.id)
      .eq('status', 'published')
      .eq('visibility', 'public')
      .order('published_at', { ascending: false });
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Projects]', err);
    return { data: null, error: err.message };
  }
}
