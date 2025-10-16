'use client';

import {
  deleteContactMessage,
  toggleMessageReadStatus,
} from '@/actions/admin/updateContactMessage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Clock,
  Eye,
  Mail,
  MailOpen,
  MessageSquare,
  Trash2,
  Users,
} from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

interface DashboardClientProps {
  messages: ContactMessage[];
}

export default function DashboardClient({ messages }: DashboardClientProps) {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const unreadCount = messages.filter((msg) => !msg.isRead).length;
  const todayMessages = messages.filter(
    (msg) =>
      new Date(msg.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const handleToggleRead = (messageId: string) => {
    startTransition(async () => {
      const result = await toggleMessageReadStatus(messageId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
      }
    });
  };

  const handleDelete = (messageId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      startTransition(async () => {
        const result = await deleteContactMessage(messageId);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success);
          setSelectedMessage(null);
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 p-3">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                Dashboard Admin
              </h1>
              <p className="text-slate-600">Gestion des messages de contact</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total messages
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {messages.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-orange-100 p-3">
                  <MailOpen className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Non lus</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {unreadCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-green-100 p-3">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Aujourd'hui
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {todayMessages}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Liste des messages */}
          <div className="card-hover-premium rounded-2xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800">
                <Users className="h-5 w-5" />
                Messages reçus
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <p>Aucun message reçu</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`cursor-pointer p-4 transition-colors hover:bg-slate-50 ${
                        selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <p className="truncate font-medium text-slate-800">
                              {message.name}
                            </p>
                            {!message.isRead && (
                              <Badge variant="secondary" className="text-xs">
                                Nouveau
                              </Badge>
                            )}
                          </div>
                          <p className="mb-1 text-sm text-slate-600">
                            {message.email}
                          </p>
                          <p className="truncate text-sm font-medium text-slate-700">
                            {message.subject}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            {formatDistanceToNow(new Date(message.createdAt), {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </p>
                        </div>
                        <Eye className="h-4 w-4 flex-shrink-0 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Détail du message sélectionné */}
          <div className="card-hover-premium rounded-2xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800">
                Détail du message
              </h2>
            </div>
            {selectedMessage ? (
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      De
                    </label>
                    <p className="font-medium text-slate-800">
                      {selectedMessage.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Email
                    </label>
                    <p className="text-slate-800">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Sujet
                    </label>
                    <p className="font-medium text-slate-800">
                      {selectedMessage.subject}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Date
                    </label>
                    <p className="text-slate-800">
                      {new Date(selectedMessage.createdAt).toLocaleDateString(
                        'fr-FR',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Message
                    </label>
                    <div className="mt-2 rounded-lg border bg-slate-50 p-4">
                      <p className="whitespace-pre-wrap text-slate-800">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 border-t border-slate-200 pt-4">
                  <Button
                    variant={selectedMessage.isRead ? 'outline' : 'success'}
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={isPending}
                    onClick={() => handleToggleRead(selectedMessage.id)}
                  >
                    <MailOpen className="h-4 w-4" />
                    {selectedMessage.isRead ? 'Marquer non lu' : 'Marquer lu'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    disabled={isPending}
                    onClick={() => handleDelete(selectedMessage.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <Mail className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p>Sélectionnez un message pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
