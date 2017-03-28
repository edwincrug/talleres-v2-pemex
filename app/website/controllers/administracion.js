var AdministracionView = require('../views/ejemploVista'),
    AdministracionModel = require('../models/dataAccess2'),
    moment = require('moment');

//configuración para el objeto cita
var Administracion = function (conf) {
    this.conf = conf || {};

    this.view = new AdministracionView();
    this.model = new AdministracionModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

//obtiene el trabajo de la cita
Administracion.prototype.get_users = function (req, res, next) {

    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'idZona',
            value: req.query.idZona,
            type: self.model.types.INT
        },
        {
            name: 'idTar',
            value: req.query.idTar,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }];

    this.model.query('SEL_USUARIO_TAR_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

module.exports = Administracion;