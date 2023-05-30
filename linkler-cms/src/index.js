'use strict';

/**
 * Enable find & findOne for all api content-types
 */
const boostrapPermissions = async (strapi) => {
  const roles = await strapi
    .service("plugin::users-permissions.role")
    .find();

  const _public = await strapi
    .service("plugin::users-permissions.role")
    .findOne(roles.filter((role) => role.type === "public")[0].id);

  // Iterate over all api content-types
  Object.keys(_public.permissions)
    .filter(permission => permission.startsWith('api'))
    .forEach(permission => {
      const controller = Object.keys(_public.permissions[permission].controllers)[0];

      // Enable find
      _public.permissions[permission].controllers[controller].find.enabled = true;

      // Enable findOne if exists
      if (_public.permissions[permission].controllers[controller].findOne) 
        _public.permissions[permission].controllers[controller].findOne.enabled = true;
      
    });

  await strapi
    .service("plugin::users-permissions.role")
    .updateRole(_public.id, _public);
};

const publishDefaultData = async (strapi) => {
  await strapi.entityService.create('api::meta.meta', {
    data: {
      publishedAt: new Date()  
    },
  });
}

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await boostrapPermissions(strapi);
    await publishDefaultData(strapi);
  },
};
