// -- =============================================
// -- Author:      Mario Mejía
// -- Create date: 23/03/2016
// -- Description: trabajo controller
// -- Modificó: Vladimir Juárez Juárez
// -- Fecha: 10/04/2016
// -- =============================================
registrationModule.controller('trabajoController', function ($scope, $rootScope, localStorageService, alertFactory, trabajoRepository, cotizacionRepository, uploadRepository) {
    //this is the first method executed in the view
    $scope.init = function () {
        //configuraciones de dropzone
        Dropzone.autoDiscover = false;
        $scope.dzOptionsFactura = uploadRepository.getDzOptions('text/xml,application/pdf',2);
        $scope.userData = localStorageService.get('userData');
        getTrabajo($scope.userData.idUsuario);
        getTrabajoTerminado($scope.userData.idUsuario);
        getTrabajoAprobado($scope.userData.idUsuario);
        $scope.habilitaBtnAprobar = true;

        $scope.certificadoParams = {
            noReporte: "",
            tad: "",
            gerencia: "",
            solpe: "",
            ordenSurtimiento: "",
            montoOS: "",
            nombreEmisor: "",
            nombreProveedor: "",
            puestoProveedor: ""
        }
    }

    var obtieneNombreArchivo = function (idTrabajo) {
        cotizacionRepository.obtieneNombreArchivo(idTrabajo).then(function (nombreArchivo) {
            if (nombreArchivo.data != null) {
                $scope.certificadoConformidad = nombreArchivo.data[0];
                trabajoRepository.descargaCerficadoConformidadTrabajo(20, idTrabajo).then(function (certificadoDescargado) {
                    if(certificadoDescargado.data[0].idHistorialProceso > 0){
                        alertFactory.success("Certificado de conformidad descargado");
                        getTrabajo($scope.userData.idUsuario);
                        getTrabajoTerminado($scope.userData.idUsuario);
                        getTrabajoAprobado($scope.userData.idUsuario);
                    }
                }, function (error) {
                    alertFactory.error("Error al cambiar la orden a estatus Certificado descargado");
                }) 
            }
        }, function (error) {
            alertFactory.error("Error al encontrar nombre de archivo");
        });

    }

    var getTrabajo = function (idUsuario) {
        trabajoRepository.getTrabajo(idUsuario).then(function (trabajo) {
            $('.dataTableTrabajo').DataTable().destroy();
            $scope.trabajos = trabajo.data;
            if (trabajo.data.length > 0) {
                waitDrawDocument("dataTableTrabajo");
                alertFactory.success("Trabajos cargados");
            } else {
                alertFactory.info("No se encontraron trabajos");
            }
        }, function (error) {
            alertFactory.error("Error al cargar trabajos");
        });
    }

    //obtiene los trabajos terminados
    var getTrabajoTerminado = function (idUsuario) {
        $('.dataTableTrabajoTerminado').DataTable().destroy();
        trabajoRepository.getTrabajoTerminado(idUsuario).then(function (trabajoTerminado) {
            $scope.trabajosTerminados = trabajoTerminado.data;

            if (trabajoTerminado.data.length > 0) {
                waitDrawDocument("dataTableTrabajoTerminado");
                alertFactory.success("Trabajos terminados cargados");
            } else {
                alertFactory.info("No se encontraron trabajos terminados");
            }
        }, function (error) {
            alertFactory.error("Error al cargar trabajos terminados");
        });
    }

    //obtiene los trabajos aprobados
    var getTrabajoAprobado = function (idUsuario) {
        $('.dataTableTrabajoAprobado').DataTable().destroy();
        trabajoRepository.getTrabajoAprobado(idUsuario).then(function (trabajoAprobado) {
            $scope.trabajosAprobados = trabajoAprobado.data;

            if (trabajoAprobado.data.length > 0) {
                waitDrawDocument("dataTableTrabajoAprobado");
                alertFactory.success("Trabajos aprobados cargados");
            } else {
                alertFactory.info("No se encontraron trabajos aprobados");
            }
        }, function (error) {
            alertFactory.error("Error al cargar trabajos aprobados");
        });
    }

    $scope.aprobarTrabajo = function (trabajo, valBotonera) {
        var objBotonera = {};
        objBotonera.accion = valBotonera;
        objBotonera.idCita = trabajo.idCita;
        localStorageService.set('objTrabajo', trabajo);
        localStorageService.set("botonera", objBotonera);
        location.href = '/ordenservicio';
    }

    //espera que el documento se pinte para llenar el dataTable
    var waitDrawDocument = function (dataTable) {
        setTimeout(function () {
            $('.' + dataTable).DataTable({
                dom: '<"html5buttons"B>lTfgitp',
                buttons: [
                    {
                        extend: 'copy'
                    },
                    {
                        extend: 'csv'
                    },
                    {
                        extend: 'excel',
                        title: 'ExampleFile'
                    },
                    {
                        extend: 'pdf',
                        title: 'ExampleFile'
                    },

                    {
                        extend: 'print',
                        customize: function (win) {
                            $(win.document.body).addClass('white-bg');
                            $(win.document.body).css('font-size', '10px');

                            $(win.document.body).find('table')
                                .addClass('compact')
                                .css('font-size', 'inherit');
                        }
                    }
                ]
            });
        }, 2500);
    }

    //actualiza el trabajo a estatus terminado
    $scope.updTerminaTrabajo = function (observacion) {
        trabajoRepository.terminaTrabajo(7, $scope.idTrabajo, observacion).then(function (trabajoTerminado) {
            if (trabajoTerminado.data[0].idHistorialProceso != 0) {
                getTrabajo($scope.userData.idUsuario);
                getTrabajoTerminado($scope.userData.idUsuario);
                $('#finalizarTrabajoModal').modal('hide');
            }
        });
    }

    //abre el modal para la finalización del trabajo
    $scope.openFinishingTrabajoModal = function (idTrabajo) {
        $('#finalizarTrabajoModal').appendTo("body").modal('show');
        $scope.idTrabajo = idTrabajo;
    }

    //confirm del trabajo para su terminación
    $('.btnTerminarTrabajo').click(function () {
        swal({
                title: "¿Está seguro de terminar el trabajo?",
                text: "Se cambiará el estatus del trabajo a TERMINADO",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    $scope.updTerminaTrabajo($scope.observacionTrabajo);
                    swal("Trabajo terminado!", "El trabajo se ha terminado", "success");
                    $scope.observacionTrabajo = null;
                } else {
                    swal("Cancelado", "", "error");
                    $('#finalizarTrabajoModal').modal('hide');
                    $scope.observacionTrabajo = null;
                }
            });
    });

    //muestra el modal para la carga de archivos
    $scope.adjuntar = function (idTrabajo, idNombreEspecial) {
        $scope.idTrabajo = idTrabajo;
        $scope.idCotizacion = 0;
        $scope.idCategoria = 2;
        $scope.idNombreEspecial = idNombreEspecial;
        $('#modalCargaArchivos').appendTo('body').modal('show');
    }

    //cambia el trabajo a estatus a facturado
    var upadateEstatusTrabajo = function (idTrabajo, idNombreEspecial) {
        if (idNombreEspecial == 2) {//Transferencia de custodia
            trabajoRepository.transfResponsabilidadTrabajo(14, idTrabajo).then(function (transferenciaCustodia) {
                if (transferenciaCustodia.data[0].idHistorialProceso > 0) {
                    alertFactory.success("Archivos cargados satisfactoriamente");
                    alertFactory.success("Transferencia de custodia cargada");
                    setTimeout(function () {
                        $scope.dzMethods.removeAllFiles();
                        $('#modalCargaArchivos').appendTo('body').modal('hide');
                    }, 1000);
                    getTrabajo($scope.userData.idUsuario);
                    getTrabajoTerminado($scope.userData.idUsuario);
                    getTrabajoAprobado($scope.userData.idUsuario);
                }
            }, function (error) {
                alertFactory.error("Error al cargar la Transferencia de custodia");
            });
        } else if (idNombreEspecial == 3) {//Facturado
            trabajoRepository.facturaTrabajo(12, idTrabajo).then(function (trabajoFacturado) {
                if (trabajoFacturado.data[0].idHistorialProceso > 0) {
                    alertFactory.success("Archivos cargados satisfactoriamente");
                    alertFactory.success("Factura cargada");
                    setTimeout(function () {
                        $scope.dzMethods.removeAllFiles();
                        $('#modalCargaArchivos').appendTo('body').modal('hide');
                    }, 1000);
                    getTrabajo($scope.userData.idUsuario);
                    getTrabajoTerminado($scope.userData.idUsuario);
                    getTrabajoAprobado($scope.userData.idUsuario);
                }
            }, function (error) {
                alertFactory.error("Error al cargar la factura");
            });
        } else if (idNombreEspecial == 5) {//certificado cliente
            trabajoRepository.uploadCertificadoCallCenterTrabajo(19, idTrabajo).then(function (certificadoTrabajo1) {
                if (certificadoTrabajo1.data[0].idHistorialProceso > 0) {
                    alertFactory.success("Archivos cargados satisfactoriamente");
                    alertFactory.success("Certificado de conformidad cargada");
                    setTimeout(function () {
                        $scope.dzMethods.removeAllFiles();
                        $('#modalCargaArchivos').appendTo('body').modal('hide');
                    }, 1000);
                    getTrabajo($scope.userData.idUsuario);
                    getTrabajoTerminado($scope.userData.idUsuario);
                    getTrabajoAprobado($scope.userData.idUsuario);
                }
            }, function (error) {
                alertFactory.error("Error al cargar el certificado de conformidad");
            });
        } else if (idNombreEspecial == 6) { //trabajo cerrado
            trabajoRepository.uploadCertificadoClienteTrabajo(11, idTrabajo).then(function (certificadoTrabajo2) {
                if (certificadoTrabajo2.data[0].idHistorialProceso > 0) {
                    alertFactory.success("Archivos cargados satisfactoriamente");
                    alertFactory.success("Certificado de conformidad cargada");
                    setTimeout(function () {
                        $scope.dzMethods.removeAllFiles();
                        $('#modalCargaArchivos').appendTo('body').modal('hide');
                    }, 1000);
                    getTrabajo($scope.userData.idUsuario);
                    getTrabajoTerminado($scope.userData.idUsuario);
                    getTrabajoAprobado($scope.userData.idUsuario);
                }
            }, function (error) {
                alertFactory.error("Error al cargar el certificado de conformidad");
            });
        }
    }

    //genera el formato para el certificado de conformidad
    $scope.generaCertificadoConformidadPDF = function () {
        if ($scope.certificadoParams.noReporte != '' && $scope.certificadoParams.tad != '' && $scope.certificadoParams.gerencia != '' && $scope.certificadoParams.solpe != '' && $scope.certificadoParams.ordenSurtimiento != '' && $scope.certificadoParams.montoOS != '' && $scope.certificadoParams.nombreProveedor != '' && $scope.certificadoParams.puestoProveedor != '') {

            trabajoRepository.generaCerficadoConformidadTrabajo(17, $scope.idTrabajo).then(function (certificadoGenerado) {
                //if(certificadoGenerado.data[0].idHistorialProceso > 0){
                alertFactory.success("Certificado de conformidad generado");
                getTrabajo($scope.userData.idUsuario);
                getTrabajoTerminado($scope.userData.idUsuario);
                getTrabajoAprobado($scope.userData.idUsuario);
                //}
            }, function (error) {
                alertFactory.error("Error al cambiar la orden a estatus Certificado generado");
            })

            setTimeout(function () {
                window.open($rootScope.vIpServer +
                    "/api/reporte/conformidadpdf/?noReporte=" + $scope.certificadoParams.noReporte +
                    "&gerencia=" + $scope.certificadoParams.gerencia +
                    "&tad=" + $scope.certificadoParams.tad +
                    "&solpe=" + $scope.certificadoParams.solpe +
                    "&ordenSurtimiento=" + $scope.certificadoParams.ordenSurtimiento +
                    "&montoOS=" + $scope.certificadoParams.montoOS +
                    "&nombreEmisor=" + $scope.certificadoParams.nombreEmisor +
                    "&nombreProveedor=" + $scope.certificadoParams.nombreProveedor +
                    "&puestoProveedor=" + $scope.certificadoParams.puestoProveedor +
                    "&fecha=" + new Date() +
                    "&idTrabajo=" + $scope.idTrabajo);

                $scope.certificadoParams = {
                    noReporte: "",
                    gerencia: "",
                    tad: "",
                    solpe: "",
                    ordenSurtimiento: "",
                    montoOS: "",
                    nombreEmisor: "",
                    nombreProveedor: "",
                    puestoProveedor: ""
                }
                $('#datosEntradaCertificadoModal').appendTo("body").modal('hide');
            }, 1000);
        } else {
            alertFactory.info("Llenar los campos vacíos");
        }
    }

    //realiza el cambio de estatus de la orden a certificado de conformidad descargada
    $scope.descargaCertificadoConformidadPDF = function (idTrabajo) {
        obtieneNombreArchivo(idTrabajo);
    }

    //abre la modal para los datos de entrada del certificado de conformidad
    $scope.datosEntradaCertificadoModal = function (idTrabajo) {
        $scope.idTrabajo = idTrabajo;
        $('#datosEntradaCertificadoModal').appendTo("body").modal('show');
    }

    $scope.ordenGarantia = function (idEstatus, idTrabajo, observacion) {
        trabajoRepository.ordenServicioGarantia(idEstatus, idTrabajo, observacion).then(function (orden) {
            $scope.ordens = orden.data;
            alertFactory.success("Se rachazo el trabajo");
        }, function (error) {
            alertFactory.error("Error al rechazar el trabajo");
        });
        trabajoRepository.getOrdenEmail(idTrabajo).then(function (email) {
            $scope.emails = email.data;
            alertFactory.success("Se envio email satisfactoriamente");
            location.href = '/trabajo';
        }, function (error) {
            alertFactory.error("Error al enviar el email");
        });

    }

    $scope.openOrdenTrabajoModal = function (idEstatus, idTrabajo) {
        $('#finalizarTrabajoModal2').appendTo("body").modal('show');
        $scope.idEstatus = idEstatus;
        $scope.idTrabajo = idTrabajo;
    }

    $('.btnTerminarTrabajo2').click(function () {
        swal({
                title: "¿Esta seguro que desea rechazar el trabajo?",
                text: "Se cambiará el estatus a 'Orden de Servicio en Garantia'",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#65BD10",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    $scope.ordenGarantia($scope.idEstatus, $scope.idTrabajo, $scope.observacionRechazo);
                    swal("Trabajo Rechazado!", "El trabajo se ha rechzado", "success");
                    $scope.observacionRechazo = null;
                } else {
                    swal("Rechazo Cancelado", "", "error");
                    $('#finalizarTrabajoModal').modal('hide');
                    $scope.observacionRechazo = null;
                }
            });
    });

    //call backs of drop zone
    $scope.dzCallbacks = {
        'addedfile': function (file) {
            $scope.newFile = file;
        },
        'sending': function(file, xhr, formData){
            formData.append('idTrabajo', $scope.idTrabajo);
            formData.append('idCotizacion', $scope.idCotizacion);
            formData.append('idCategoria', $scope.idCategoria);
            formData.append('idNombreEspecial', $scope.idNombreEspecial);
        }
        ,
        'completemultiple': function (file, xhr) {
            var checkErrorFile = file.some(checkExistsError);
            if(!checkErrorFile){
                var allSuccess = file.every(checkAllSuccess);
                if(allSuccess){
                    upadateEstatusTrabajo($scope.idTrabajo, $scope.idNombreEspecial);
                }
            }
        },
        'error': function (file, xhr) {
            if(!file.accepted){
                $scope.dzMethods.removeFile(file);
            }
            else{
                $scope.dzMethods.removeAllFiles(true);
                alertFactory.info("No se pudieron subir los archivos");   
            }
        },
    };

    //valida si todos son success
    function checkAllSuccess(file, index, array) {
        return file.status === 'success';
    }
    
    //valida si existe algún error
    function checkExistsError(file) {
        return file.status === 'error';
    }
});