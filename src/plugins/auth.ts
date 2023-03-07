import useUserStore from '@/store/modules/user'

// @ts-ignore
function authPermission(permission) {
  const all_permission = "*:*:*";
  const permissions = useUserStore().permissions
  if (permission && permission.length > 0) {
    return permissions.some(v => {
      return all_permission === v || v === permission
    })
  } else {
    return false
  }
}
// @ts-ignore
function authRole(role) {
  const super_admin = "admin";
  const roles = useUserStore().roles
  if (role && role.length > 0) {
    return roles.some(v => {
      return super_admin === v || v === role
    })
  } else {
    return false
  }
}

export default {
  // @ts-ignore 验证用户是否具备某权限
  hasPermi(permission) {
    return authPermission(permission);
  },
  // @ts-ignore 验证用户是否含有指定权限，只需包含其中一个
  hasPermiOr(permissions) {
    return permissions.some((item:any) => {
      return authPermission(item)
    })
  },
  // @ts-ignore 验证用户是否含有指定权限，必须全部拥有
  hasPermiAnd(permissions) {
    return permissions.every((item:any) => {
      return authPermission(item)
    })
  },
  // @ts-ignore 验证用户是否具备某角色
  hasRole(role) {
    return authRole(role);
  },
  // @ts-ignore 验证用户是否含有指定角色，只需包含其中一个
  hasRoleOr(roles) {
    return roles.some((item:any) => {
      return authRole(item)
    })
  },
  // @ts-ignore 验证用户是否含有指定角色，必须全部拥有
  hasRoleAnd(roles) {
    return roles.every((item:any) => {
      return authRole(item)
    })
  }
}
