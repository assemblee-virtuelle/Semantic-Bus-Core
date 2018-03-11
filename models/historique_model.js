'use strict';
////console.log(__filename);
var mongoose = require('../db/mongo_client');
var historiqueShema = require('../model_schemas/historique_shema');

module.exports = mongoose.model('historique', historiqueShema);
