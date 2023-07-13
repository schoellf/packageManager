'use strict';

/**
 * approved-package service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::approved-package.approved-package');
