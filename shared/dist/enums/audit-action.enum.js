"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditAction = void 0;
// shared\src\enums\audit-action.enum.ts
var AuditAction;
(function (AuditAction) {
    // USERS
    AuditAction["CREATE_USER"] = "CREATE_USER";
    AuditAction["UPDATE_USER"] = "UPDATE_USER";
    AuditAction["UPDATE_OWN_PROFILE"] = "UPDATE_OWN_PROFILE";
    AuditAction["RESTORE_USER"] = "RESTORE_USER";
    // PROPERTIES
    AuditAction["CREATE_PROPERTY"] = "CREATE_PROPERTY";
    AuditAction["UPDATE_PROPERTY"] = "UPDATE_PROPERTY";
    AuditAction["DELETE_PROPERTY"] = "DELETE_PROPERTY";
    // PUBLICACIONES
    AuditAction["CREATE_PUBLICACION"] = "CREATE_PUBLICACION";
    AuditAction["UPDATE_PUBLICACION"] = "UPDATE_PUBLICACION";
    AuditAction["DELETE_PUBLICACION"] = "DELETE_PUBLICACION";
    AuditAction["PAUSE_PUBLICACION"] = "PAUSE_PUBLICACION";
    AuditAction["APPROVE_PUBLICACION"] = "APPROVE_PUBLICACION";
    AuditAction["REJECT_PUBLICACION"] = "REJECT_PUBLICACION";
    // FAVORITES
    AuditAction["CREATE_FAVORITE"] = "CREATE_FAVORITE";
    AuditAction["DELETE_FAVORITE"] = "DELETE_FAVORITE";
    // AUTH
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["REFRESH_TOKEN"] = "REFRESH_TOKEN";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
