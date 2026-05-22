"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
// shared\src\enums\permission.enum.ts
var Permission;
(function (Permission) {
    // PUBLICACIONES
    Permission["PUBLICACION_READ"] = "PUBLICACION_READ";
    Permission["PUBLICACION_READ_ALL"] = "PUBLICACION_READ_ALL";
    Permission["PUBLICACION_APPROVE"] = "PUBLICACION_APPROVE";
    Permission["PUBLICACION_REJECT"] = "PUBLICACION_REJECT";
    Permission["PUBLICACION_OBSERVE"] = "PUBLICACION_OBSERVE";
    Permission["PUBLICACION_PAUSE"] = "PUBLICACION_PAUSE";
    // PROPERTIES
    Permission["PROPERTY_CREATE"] = "PROPERTY_CREATE";
    Permission["PROPERTY_UPDATE"] = "PROPERTY_UPDATE";
    Permission["PROPERTY_DELETE"] = "PROPERTY_DELETE";
    Permission["PROPERTY_READ_PRIVATE"] = "PROPERTY_READ_PRIVATE";
    // FAVORITOS
    Permission["FAVORITE_CREATE"] = "FAVORITE_CREATE";
    // USERS
    Permission["USER_MANAGE"] = "USER_MANAGE";
    Permission["USER_READ"] = "USER_READ";
    Permission["USER_CREATE"] = "USER_CREATE";
    Permission["USER_UPDATE"] = "USER_UPDATE";
    Permission["USER_RESTORE"] = "USER_RESTORE";
    // PROFILE
    Permission["PROFILE_UPDATE"] = "PROFILE_UPDATE";
    // UPLOADS
    Permission["UPLOAD_CREATE"] = "UPLOAD_CREATE";
    Permission["UPLOAD_DELETE"] = "UPLOAD_DELETE";
    Permission["UPLOAD_READ"] = "UPLOAD_READ";
    // DOCUMENTOS
    Permission["DOCUMENT_UPLOAD"] = "DOCUMENT_UPLOAD";
    Permission["DOCUMENT_REVIEW"] = "DOCUMENT_REVIEW";
    Permission["DOCUMENT_HISTORY"] = "DOCUMENT_HISTORY";
    // OPERACIONES
    Permission["OPERATION_CREATE"] = "OPERATION_CREATE";
    Permission["OPERATION_UPDATE"] = "OPERATION_UPDATE";
    Permission["OPERATION_DELETE"] = "OPERATION_DELETE";
    Permission["OPERATION_RESERVE"] = "OPERATION_RESERVE";
    Permission["OPERATION_PROCESS"] = "OPERATION_PROCESS";
    Permission["OPERATION_FINISH"] = "OPERATION_FINISH";
    Permission["OPERATION_CANCEL"] = "OPERATION_CANCEL";
})(Permission || (exports.Permission = Permission = {}));
