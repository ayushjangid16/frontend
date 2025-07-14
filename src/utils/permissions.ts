export const hasPermission = (permission: string, permissionsArray: any[]) => {
  return permissionsArray?.some(
    (perm) => perm.username === permission && !perm.isDeleted
  );
};
