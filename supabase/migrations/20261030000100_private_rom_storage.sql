-- RETROVA: private storage for user-owned game files.
-- Apply this migration to a Supabase project only after reviewing the project settings.
-- The bucket is private; reads, downloads and writes require authenticated RLS policies.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'private-roms',
  'private-roms',
  false,
  536870912,
  array['application/octet-stream', 'application/zip', 'application/x-iso9660-image']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can list their own ROM files" on storage.objects;
create policy "Users can list their own ROM files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'private-roms'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users can upload their own ROM files" on storage.objects;
create policy "Users can upload their own ROM files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'private-roms'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users can update their own ROM files" on storage.objects;
create policy "Users can update their own ROM files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'private-roms'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'private-roms'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users can delete their own ROM files" on storage.objects;
create policy "Users can delete their own ROM files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'private-roms'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
