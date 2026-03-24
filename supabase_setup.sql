-- Scripts de Inicialización para Supabase Auth y Dashboard Externo (Nia CRM)

-- 1. Tabla pública de Clientes para tu Dashboard Externo
-- Aquí podrás ver la lista de todos los usuarios, aprobarlos y cambiar sus fechas de corte.
create table if not exists public.clients (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  phone text,
  status text default 'pending', -- Estados: 'pending', 'active', 'suspended'
  due_date date,
  plan text default 'trial',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Función para poblar `public.clients` e inyectar JWT metadata al registrarse
-- Por defecto: 15 días de prueba y Cuenta Pendiente de Aprobación
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  -- Define los días de prueba predeterminados
  trial_days interval := '15 days';
  calculated_due_date date;
begin
  calculated_due_date := (now() + trial_days)::date;

  -- Insertar en la tabla pública para que sea visible en tu dashboard
  insert into public.clients (id, name, email, phone, status, due_date, plan)
  values (
    new.id, 
    -- Si envías 'name' y 'phone' al hacer supabase.auth.signUp() en las opciones (user_metadata)
    new.raw_user_meta_data->>'name', 
    new.email, 
    new.raw_user_meta_data->>'phone',
    'pending', 
    calculated_due_date, 
    'trial'
  );

  -- Actualiza el app_metadata del usuario (el JWT) para la seguridad en VPS locales
  update auth.users
  set raw_app_meta_data = 
    coalesce(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'is_approved', false,
      'due_date', calculated_due_date::text,
      'plan', 'trial'
    )
  where id = new.id;
  
  return new;
end;
$$;

-- Crear el Trigger para cuando nazca el usuario
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 3. Trigger para INYECTAR MAGIA:
-- Cuando tú desde tu Panel actualices la tabla `public.clients` (ej. para aprobarlo o añadirle días),
-- este trigger automáticamente actualizará la seguridad del JWT (app_metadata).
-- Así, los VPS independientes de Nia CRM reconocerán el pago de forma instantánea.
create or replace function public.sync_client_to_app_metadata()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update auth.users
  set raw_app_meta_data = 
    coalesce(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'is_approved', (new.status = 'active'),
      'due_date', new.due_date::text,
      'plan', new.plan
    )
  where id = new.id;
  
  return new;
end;
$$;

drop trigger if exists on_client_updated on public.clients;
create trigger on_client_updated
  after update of status, due_date, plan on public.clients
  for each row execute procedure public.sync_client_to_app_metadata();
