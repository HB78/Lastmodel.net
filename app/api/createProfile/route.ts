// import { prisma } from '@/lib/prisma-setup/db';
// import { getSession } from '@/tools';
// import {
//   UpdateUserProfilFormData,
//   UpdateUserProfilSchema,
// } from '@/zodSchema/updateUserSchema';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   const body = await request.json();

//   const session = await getSession();
//   const userId = session?.user.id;

//   if (!session || !userId) {
//     return NextResponse.json({ error: 'Session non trouvée' }, { status: 401 });
//   }

//   try {
//     const findUser = await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         emailVerified: true,
//         name: true,
//         sex: true,
//         age: true,
//         phone: true,
//         city: true,
//         description: true,
//       },
//     });

//     if (!findUser) {
//       return NextResponse.json(
//         { error: 'Utilisateur non trouvé' },
//         { status: 404 }
//       );
//     }

//     if (findUser.id !== userId) {
//       return NextResponse.json(
//         { error: 'Vous ne pouvez pas modifier ce profil' },
//         { status: 404 }
//       );
//     }

//     if (!findUser.emailVerified) {
//       return NextResponse.json(
//         { error: 'Veuillez vérifier votre email' },
//         { status: 401 }
//       );
//     }

//     // Validation avec le schéma existant
//     const validationResult = UpdateUserProfilSchema.safeParse(body);

//     if (!validationResult.success) {
//       return NextResponse.json(
//         {
//           error: 'Données invalides',
//           details: validationResult.error.issues,
//         },
//         { status: 400 }
//       );
//     }

//     const validatedData: UpdateUserProfilFormData = validationResult.data;

//     // Trouver l'origine sélectionnée
//     let originId: string | null = null;
//     if (validatedData.origin) {
//       const origin = await prisma.origin.findUnique({
//         where: { name: validatedData.origin },
//       });
//       originId = origin?.id || null;
//     }

//     // Mettre à jour le user existant
//     const user = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         name: validatedData.name || findUser.name,
//         sex: validatedData.sex || findUser.sex,
//         age: validatedData.age || findUser.age,
//         phone: validatedData.phone || findUser.phone || null,
//         city: validatedData.city || findUser.city,
//         description: validatedData.description || findUser.description,
//         originId: originId,
//         updatedAt: new Date(),
//       },
//     });

//     return NextResponse.json({ success: true, user });
//   } catch (error) {
//     console.error('Erreur lors de la mise à jour du profil:', error);
//     return NextResponse.json(
//       { error: 'Erreur interne du serveur' },
//       { status: 500 }
//     );
//   }
// }
