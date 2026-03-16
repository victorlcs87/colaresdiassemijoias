-- Promove o usuário criado no Auth para o perfil administrativo principal
DELETE FROM public.admin_profiles
WHERE email = 'victinxd@gmail.com'
  AND username <> 'admin';

UPDATE public.admin_profiles
SET email = 'victinxd@gmail.com'
WHERE username = 'admin';

INSERT INTO public.admin_profiles (username, email)
SELECT 'admin', 'victinxd@gmail.com'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.admin_profiles
  WHERE username = 'admin'
);
