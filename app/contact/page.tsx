'use client';

import { sendMessageAction } from '@/actions/contact/sendMessageToAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ContactFormData,
  contactSchema,
} from '@/zodSchema/contactPage/contactSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MessageSquare, User } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('subject', data.subject);
        formData.append('message', data.message);

        const result = await sendMessageAction(formData);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        toast.success('Votre message a bien été envoyé. Merci !');
        reset();
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
        toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-700">
              Nous contacter
            </span>
          </div>
          <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
            Écrivez-nous
          </h1>
          <p className="mt-3 text-gray-600">
            Une question, un souci, une suggestion ? Nous répondons rapidement.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-3xl border border-white/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm"
        >
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <User className="h-4 w-4 text-purple-600" /> Nom
            </label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Votre nom"
              disabled={isPending}
              className={`h-12 text-base ${
                errors.name
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <Mail className="h-4 w-4 text-purple-600" /> Email
            </label>
            <Input
              id="email"
              {...register('email')}
              type="email"
              placeholder="vous@exemple.com"
              disabled={isPending}
              className={`h-12 text-base ${
                errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="subject"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <MessageSquare className="h-4 w-4 text-purple-600" /> Sujet
            </label>
            <Input
              id="subject"
              {...register('subject')}
              placeholder="Sujet de votre message"
              disabled={isPending}
              className={`h-12 text-base ${
                errors.subject
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'
              }`}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-semibold text-slate-700"
            >
              Message
            </label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Votre message..."
              disabled={isPending}
              className={`min-h-32 text-base ${
                errors.message
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'
              }`}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Envoi...</span>
                </div>
              ) : (
                'Envoyer'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
