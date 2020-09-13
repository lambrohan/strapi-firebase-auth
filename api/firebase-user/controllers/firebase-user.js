"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
module.exports = {
  async create(ctx) {
    // create user from firebase token
    ctx.request.body.uid = ctx.state.user.uid;

    //  uncomment the fields you have in content-type
    //  ctx.request.body.email = ctx.state.user.email;
    //  ctx.request.body.phoneNumber = ctx.state.user.phoneNumber;

    const entity = await strapi.services["firebase-user"].create(
      ctx.request.body
    );
    await strapi.firebase
      .auth()
      .setCustomUserClaims(ctx.state.user.uid, { strapi_uid: entity.id });
    return sanitizeEntity(entity, { model: strapi.models["firebase-user"] });
  },

  async update(ctx) {
    //update user while preventing the updates to user specific fields like uid, email
    const { id } = ctx.params;

    let entity;

    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (id !== user.id) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      let { data, files } = parseMultipartData(ctx);
      data.uid = user.uid; // a user must not update uid with req body (same goes for email also)
      //  uncomment the fields you have in content-type
      //  data.email = ctx.state.user.email;
      //  data.phoneNumber = ctx.state.user.phoneNumber;
      entity = await strapi.services["firebase-user"].update({ id }, data, {
        files,
      });
    } else {
      ctx.request.body.uid = user.uid; // a user must not update uid with req body (same goes for email also)
      //  uncomment the fields you have in content-type
      //  data.email = ctx.state.user.email;
      //  data.phoneNumber = ctx.state.user.phoneNumber;
      entity = await strapi.services["firebase-user"].update(
        { id },
        ctx.request.body
      );
    }
    return sanitizeEntity(entity, { model: strapi.models["firebase-user"] });
  },

  /**
   * Return logged in user for GET request at localhost:1337/firebase-users
   * @param {Context} ctx
   */
  async find(ctx) {
    const [entity] = await strapi.services["firebase-user"].find({
      uid: ctx.state.user.uid, // find user associated with firebase uid
    });
    return sanitizeEntity(entity, { model: strapi.models["firebase-user"] });
  },

  async findOne(ctx) {
    return ctx.badRequest("req not found");
  },

  /**
   *
   * NONE EXCEPT ADMIN CAN DELETE USER
   */

  async delete(ctx) {
    ctx.badRequest("Bad Request");
  },
};
