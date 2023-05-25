function strapi(uri) {
    return `http://${process.env.STRAPI_HOST}:${process.env.PORT}${uri}`
}

module.exports = { strapi };