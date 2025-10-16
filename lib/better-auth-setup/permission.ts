// import { createAccessControl } from "better-auth/plugins/access";
// import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

// const statements = {
//   ...defaultStatements,
//   // Pas de "posts" = AC uniquement pour Better-Auth
// } as const;

// export const ac = createAccessControl(statements);

// export const roles = {
//   USER: ac.newRole({
//     // ✅ Seulement les permissions Better-Auth du user qui ne peut rien faire
//   }),

//   ADMIN: ac.newRole({
//     // ✅ Permissions admin Better-Auth seulement admin qui peut tout faire
//     ...adminAc.statements,
//   }),
// };
