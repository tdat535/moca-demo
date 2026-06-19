import { supabase } from './supabase';

export async function uploadImage(file, folder = 'products') {
  const ext = file.name.split('.').pop();
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from('images').upload(name, file);
  if (error) throw error;

  const { data } = supabase.storage.from('images').getPublicUrl(name);
  return data.publicUrl;
}
