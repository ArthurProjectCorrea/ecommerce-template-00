-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  avatar_url text,
  name text,
  email text unique not null,
  is_client boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Users can view own profile" 
on public.profiles for select 
using (auth.uid() = id);

create policy "Users can update own profile" 
on public.profiles for update 
using (auth.uid() = id);

create policy "Users can delete own profile" 
on public.profiles for delete 
using (auth.uid() = id);

-- Create a function to handle new user signups
create function public.handle_new_user()
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, avatar_url, name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.email
  );
  return new;
end;
$$;

-- Create a trigger each time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
