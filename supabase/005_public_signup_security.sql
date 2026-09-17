-- Segurança: cadastros públicos nunca podem escolher o papel ADM via metadata.
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name','Sem nome'), 'colaborador');
  return new;
end;
$$ language plpgsql security definer;
