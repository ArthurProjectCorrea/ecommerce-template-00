'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { notify } from '@/lib/notifications';
import { supabase } from '@/lib/supabase/client';

interface UserProfileFormProps {
  initialData: {
    name: string;
    email: string;
    avatar: string;
  };
  onSuccess?: () => void;
}

export function UserProfileForm({
  initialData,
  onSuccess,
}: UserProfileFormProps) {
  const [name, setName] = useState(initialData.name || '');
  const [email] = useState(initialData.email || '');
  const [avatar, setAvatar] = useState(initialData.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Obter o usuário atual
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();
      if (authError || !session?.user) throw new Error('Falha de autenticação');

      // 2. Atualizar APENAS a tabela profiles (mantendo auth.users intacto)
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name,
          avatar_url: avatar,
        })
        .eq('id', session.user.id);

      if (error) throw error;

      notify.success('Perfil atualizado com sucesso!');

      // 3. Limpar o cache do cookie para o proxy.ts ler do banco novamente na próxima carga
      document.cookie = 'app-user-profile=; Max-Age=0; path=/';

      if (onSuccess) {
        onSuccess();
      }

      // 4. Force reload para atualizar os componentes que dependem do cookie, como o próprio NavUser
      window.location.reload();
    } catch (error) {
      console.error(error);
      notify.error('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit}>
      <FieldGroup className="grid grid-cols-1 gap-y-4">
        <Field className="col-span-1">
          <FieldLabel htmlFor="profile-name">Nome Completo</FieldLabel>
          <Input
            id="profile-name"
            type="text"
            placeholder="Seu nome"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field className="col-span-1">
          <FieldLabel htmlFor="profile-email">E-mail</FieldLabel>
          <Input
            id="profile-email"
            type="email"
            placeholder="m@exemplo.com"
            disabled
            value={email}
          />
          <FieldDescription>
            Seu e-mail está atrelado ao login principal.
          </FieldDescription>
        </Field>

        <Field className="col-span-1">
          <FieldLabel htmlFor="profile-avatar">Avatar URL</FieldLabel>
          <Input
            id="profile-avatar"
            type="url"
            placeholder="https://exemplo.com/avatar.png"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </Field>

        <Field className="col-span-1 pt-2">
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Spinner className="mr-2" />}
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
