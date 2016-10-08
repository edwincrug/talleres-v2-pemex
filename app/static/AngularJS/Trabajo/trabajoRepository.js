var trabajoUrl = global_settings.urlCORS + '/api/trabajo/';
var ordenUrl = global_settings.urlCORS + '/api/orden/';
var reporteDummyUrl = global_settings.urlCORS + '/api/reporte/';

registrationModule.factory('trabajoRepository', function ($http) {
    return {
        getTrabajo: function (idUsuario) {
            return $http({
                url: trabajoUrl + 'trabajo/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTrabajoTerminado: function (idUsuario) {
            return $http({
                url: trabajoUrl + 'trabajoterminado/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTrabajoAprobado: function (idUsuario) {
            return $http({
                url: trabajoUrl + 'trabajoaprobado/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        terminaTrabajo: function (idEstatus, idTrabajo, observacion) {
            return $http({
                url: trabajoUrl + 'updtrabajoterminado/',
                method: "POST",
                data: {
                    idEstatus: idEstatus,
                    idTrabajo: idTrabajo,
                    observacion: observacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        generaCerficadoConformidadTrabajo: function (idEstatus, idTrabajo) {
            return $http({
                url: trabajoUrl + 'updtrabajocertificadogenerado/',
                method: "POST",
                data: {
                    idEstatus: idEstatus,
                    idTrabajo: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        descargaCerficadoConformidadTrabajo: function (idEstatus, idTrabajo) {
            return $http({
                url: trabajoUrl + 'updtrabajocertificadodescargado/',
                method: "POST",
                data: {
                    idEstatus: idEstatus,
                    idTrabajo: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        uploadCertificadoCallCenterTrabajo: function (idEstatus, idTrabajo) {
            return $http({
                url: trabajoUrl + 'updtrabajocertificadocallcenter/',
                method: "POST",
                data: {
                    idEstatus: idEstatus,
                    idTrabajo: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        uploadCertificadoClienteTrabajo: function (idEstatus, idTrabajo) {
            return $http({
                url: trabajoUrl + 'updtrabajocertificadocliente/',
                method: "POST",
                data: {
                    idEstatus: idEstatus,
                    idTrabajo: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        transfResponsabilidadTrabajo: function (idEstatus, idTrabajo) {
            return $http({
                url: trabajoUrl + 'updtrabajotransfreponsabilidad/',
                method: "POST",
                data: {
                    idEstatus: idEstatus,
                    idTrabajo: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        facturaTrabajo: function (idEstatus, idTrabajo) {
            return $http({
                url: trabajoUrl + 'updtrabajofacturado/',
                method: "POST",
                data: {
                    idEstatus: idEstatus,
                    idTrabajo: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        },
        getTimeLine: function (idCita) {
            return $http({
                url: trabajoUrl + 'timeLine/',
                method: "GET",
                params: {
                    idCita: idCita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insertTrabajo: function (idCita, idUsuario, idUnidad) {
            return $http({
                url: trabajoUrl + 'insertTrabajo/',
                method: "POST",
                data: {
                    idCita: idCita,
                    idUsuario: idUsuario,
                    idUnidad: idUnidad
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        ordenServicioGarantia: function (idEstatus, idTrabajo, observacion) {
            return $http({
                url: trabajoUrl + 'updtrabajoordengarantia',
                method: "POST",
                data: {
                    idEstatus: idEstatus,
                    idTrabajo: idTrabajo,
                    observacion: observacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOrdenEmail: function (idTrabajo) {
            return $http({
                url: trabajoUrl + 'trabajorechazado/',
                method: "GET",
                params: {
                    idTrabajo: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        putFechaRealTrabajo: function (idTrabajo, fechaServicio) {
            var objTrabajo = {
                idTrabajo: idTrabajo,
                fechaServicio: fechaServicio
            };
            return $http({
                url: trabajoUrl + 'putFechaServicioReal',
                method: "POST",
                data: objTrabajo,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getFechaRealTrabajo: function (idTrabajo) {
            return $http({
                url: trabajoUrl + 'searchFechaTrabajoReal',
                method: "GET",
                params: {
                    idTrabajo: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getAdmonOrdenes: function () {
            return $http({
                url: trabajoUrl + 'getadmonordenes/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        updEstatusVerificado: function (idEstatus, idTrabajo) {
            return $http({
                url: trabajoUrl + 'updatestatusVerificado/',
                method: "POST",
                data: {
                    idEstatus: idEstatus,
                    idTrabajo: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getGuardaFactura: function (idTrabajo,idCotizacion,idUsuario, numeroCotizacion) { //LQMA add 19092016, se agrego idEstatus
            var objTrabajo = {
                idTrabajo: idTrabajo,
                idCotizacion: idCotizacion,
                idUsuario:idUsuario,
                numeroCotizacion:numeroCotizacion
                };
                //idEstatus:idEstatus  //LQMA add 19092016, para comparar si se lee el archivo temporal
            return $http({
                url: ordenUrl + 'generaFactura',
                method: "GET",
                params: objTrabajo,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        removeFactura: function (idTrabajo, idCotizacion, idOpcion) { //LQMA ADD 20092016 -- idOpcion 1:borra temporales, 2:borra originales para renombrar archivos
            var objTrabajo = {
                idTrabajo: idTrabajo,
                idCotizacion: idCotizacion,
                idOpcion: idOpcion //LQMA ADD 20092016 -- idOpcion 1:borra temporales, 2:borra originales para renombrar archivos
            };
            return $http({
                url: ordenUrl + 'removeFactura',
                method: "GET",
                params: objTrabajo,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insertaFactura: function (idCotizacion, numFactura, UUID, fechaFactura, total, subtotal, idUsuario, xmlFactura) {
            var objTrabajo = {
                idCotizacion: idCotizacion,
                numFactura: numFactura,
                UUID: UUID,
                fechaFactura: fechaFactura,
                total: total,
                subtotal: subtotal,
                idUsuario: idUsuario,
                xmlFactura: xmlFactura
            };
            return $http({
                url: trabajoUrl + 'insertaFactura',
                method: "POST",
                params: objTrabajo,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, //LQMA 13092016
        getCotizacionesOrdenAprobado: function (idTrabajo) {
            return $http({
                url: trabajoUrl + 'cotizacionesordenAprobados/',
                method: "GET",
                params: {
                    idTrabajo: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        encuentraFactura: function (idCotizacion, idTrabajo, numeroCotizacion) {
            var objArchivo = {
                idCotizacion: idCotizacion,
                idTrabajo: idTrabajo,
                numeroCotizacion: numeroCotizacion
            };
            return $http({
                url: ordenUrl + 'encuentraFactura',
                method: "POST",
                data: objArchivo,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, //LQMA ADD 20092016, renombra la factura temporal
        renombraFacturaTemporal(idTrabajo, idCotizacion) {
            var objArchivo = {
                idCotizacion: idCotizacion,
                idTrabajo: idTrabajo
            };
            return $http({
                url: ordenUrl + 'renombraFacturaTemporal',
                method: "POST",
                data: objArchivo,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        cotizacionespago: function (idTrabajo) {
            var objTrabajo = {
                idTrabajo: idTrabajo
            };
            return $http({
                url: trabajoUrl + 'insertBpro',
                method: "POST",
                params: objTrabajo,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getReporteDummy: function (idTrabajo, noReporte, gerencia, tad, solpe, ordenSurtimiento, montoOS, nombreProveedor, puestoProveedor) {
            return $http({
                url: reporteDummyUrl + 'conformidadpdf/',
                method: "GET",
                params: {
                    idTrabajo: idTrabajo,
                    noReporte: noReporte,
                    gerencia: gerencia,
                    tad: tad,
                    solpe: solpe,
                    ordenSurtimiento: ordenSurtimiento,
                    montoOS: montoOS,
                    nombreProveedor: nombreProveedor,
                    puestoProveedor: puestoProveedor
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});